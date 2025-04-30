import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
// import * as THREE from 'three';
// import { Threebox } from 'threebox-map';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useParams, useNavigate } from 'react-router-dom';
import Worker from "@/workers/randomPointWorker.js?worker";
import 'mapbox-gl/dist/mapbox-gl.css';
// import 'threebox-plugin/dist/threebox.css';
import 'mapbox-gl/dist/mapbox-gl.js';
import "./ThreeDmap.css";
import ThreeDMapInfoPanel from './ThreeDMapInfoPanel';
import { generatePollenPointsBySuburbs } from './generatePollenPoints';
import { fetchForecast, fetchPollen, samplefetchPollen, createPopupContent, createRectangleBox, updateRectangleBox } from './weatherQuery';
import * as turf from "@turf/turf";


// function getRandomColor() {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   return `rgb(${r},${g},${b})`;
// }

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

const MapContainer = () => {
  const [loading, setLoading] = useState(true);
  const [pollenData, setPollenData] = useState({});
  const pollenDataRef = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const preloadData = async () => {
      setLoading(true); // 显示等待框
      const initSuburbs = async () => {
        const suburbList = await getSuburbsData(selectedCity, false);
        const result = await generatePollenPointsBySuburbs(suburbList);
        // console.log("结果呢？",result);
        setPollenData(result);

        setLoading(false);
      }
      initSuburbs();

    };

    preloadData();
    // console.log("看看pollen数据",pollenData);
  }, []);
  useEffect(() => {
    pollenDataRef.current = pollenData;
  }, [pollenData]);


  const { cityName } = useParams();

  const selectedCity = cityName.toLowerCase();
  const mapContainerRef = useRef(null);
  // const map = useRef(null);
  const popup = useRef(null);
  const [hoveredSuburb, setHoveredSuburb] = useState({
    name: '',
    weather: '',
    pollen: '',
    floor: '',
    WindLevel: "",
    WindDirect: ""
  });

  // const [suburbList, setSuburbList] = useState([]);

  const add3DBuildings = (submap) => {
    const map = submap;
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (layer) => layer.type === "symbol" && layer.layout["text-field"]
    )?.id;

    map.addLayer(
      {
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#FFFFE0",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "height"]
          ],
          "fill-extrusion-opacity": 0.6
        }
      },
      labelLayerId
    );
    map.addLayer({
      id: 'highlight-buildings',
      type: 'fill-extrusion',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'], // 先只过滤可拉伸建筑
      paint: {
        'fill-extrusion-color': '#ffffff',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15, 0,
          15.05, ['get', 'height']
        ],
        'fill-extrusion-opacity': 0.8
      }
    }, '3d-buildings');
  };


  useEffect(() => {
    let map = null;
    const loadSuburbs = async () => {

      const suburbList = await getSuburbsData(selectedCity, false);
      console.log("被调用一次");


      mapboxgl.accessToken =
        "pk.eyJ1IjoibnlhbjAwMjUiLCJhIjoiY204dHBvdjdjMGRxajJyb2NhbTRuYnVzOCJ9.002RhpjH1--fp6uxHi1viA";

      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [144.9631, -37.8136], // Melbourne
        zoom: 10,
      });


      let transitionInterval = null; // 记录定时器，避免重复开多个
      let currentRed = 0;
      let currentGreen = 0;
      let currentBlue = 0;

      function startColorTransition() {
        if (transitionInterval) {
          clearInterval(transitionInterval); // 如果已有定时器，清除掉
        }

        const targetRed = 255;
        const targetGreen = 255;
        const targetBlue = 224;

        transitionInterval = setInterval(() => {
          let changed = false;

          if (currentRed < targetRed) {
            currentRed++;
            changed = true;
          } else if (currentRed > targetRed) {
            currentRed--;
            changed = true;
          }

          if (currentGreen < targetGreen) {
            currentGreen++;
            changed = true;
          } else if (currentGreen > targetGreen) {
            currentGreen--;
            changed = true;
          }

          if (currentBlue < targetBlue) {
            currentBlue++;
            changed = true;
          } else if (currentBlue > targetBlue) {
            currentBlue--;
            changed = true;
          }

          const color = `rgb(${currentRed}, ${currentGreen}, ${currentBlue})`;
          map.setPaintProperty('highlight-buildings', 'fill-extrusion-color', color);

          if (!changed) {
            clearInterval(transitionInterval); // 如果已经到达目标颜色，就停止渐变
            transitionInterval = null;
          }
        }, 20); // 每30毫秒更新一次
      }
      map.on("load", () => {
        const points = [
          { lng: 144.9631, lat: -37.8116 },
          { lng: 144.9633, lat: -37.8136 },
          { lng: 144.9635, lat: -37.8126 }
        ];
        const geojson = {
          type: 'FeatureCollection',
          features: points.map((p) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [p.lng, p.lat],
            },
            properties: {
              size: Math.random() * 5 + 5,
            }
          }))
        };
        // console.log("打印成功的", geojson);
        map.addSource('particles', {
          type: 'geojson',
          data: geojson,
        });

        map.addLayer({
          id: 'particles-layer',
          type: 'circle',
          source: 'particles',
          paint: {
            'circle-radius': ['get', 'size'],
            'circle-color': '#ff4d4d',
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
            'circle-translate': [0, 0],
            'circle-translate-anchor': 'viewport'
          }
        });

        let t = 0;
        const animateParticles = () => {
          t += 0.05;
          const floatOffset = Math.sin(t) * 2;
          const opacity = 0.6 + 0.3 * Math.sin(t);

          map.setPaintProperty('particles-layer', 'circle-translate', [0, floatOffset]);
          map.setPaintProperty('particles-layer', 'circle-opacity', opacity);

          requestAnimationFrame(animateParticles);
        };
        animateParticles();

        // const tb = new Threebox(map, map.getCanvas().getContext('webgl'), {
        //   defaultLights: true,
        // });

        // const three_points = [
        //   [144.9631, -37.8136],
        //   [144.9731, -37.8136],
        //   [144.9631, -37.8236],
        //   [144.9531, -37.8036]
        // ];

        // three_points.forEach((coord) => {
        //   const geometry = new THREE.SphereGeometry(10, 16, 16);
        //   const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        //   const sphere = new THREE.Mesh(geometry, material);
        //   tb.add(sphere, {
        //     lon: coord[0],
        //     lat: coord[1],
        //     altitude: 10000,
        //   });
        // });
        const size = 20;
        const pulsingDot = {
          width: size,
          height: size,
          data: new Uint8Array(size * size * 4),

          onAdd: function (map) {
            this.map = map;
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
          },

          render: function () {
            const duration = 50;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
            context.fill();

            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            this.data = context.getImageData(0, 0, this.width, this.height).data;

            this.map && this.map.triggerRepaint();
            return true;
          }
        };

        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
        map.addSource('dot-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [144.9631, -37.8136]
                }
              }
            ]
          }
        });

        map.addLayer({
          id: 'layer-with-pulsing-dot',
          type: 'symbol',
          source: 'dot-point',
          layout: {
            'icon-image': 'pulsing-dot'
          }
        });

        add3DBuildings(map);
        const paticleLayer = addParticlesWithThreeJS(map, [144.9631, -37.8136]);
        map.addLayer(paticleLayer);

        let lastSuburb = null;

        map.on('mousemove', (e) => {
          const lng = e.lngLat.lng;
          const lat = e.lngLat.lat;
          if (!popup.current) {
            popup.current = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
            });
          }

          const currentPollenData = pollenDataRef.current;
          const nearestSuburb = getNearestSuburb(lng, lat, suburbList);

          let popupContent = createPopupContent(nearestSuburb.suburbName, currentPollenData[nearestSuburb.suburbName].pollen);
          popup.current
            .setLngLat([lng, lat])
            .setHTML(popupContent)
            .addTo(map);



          let zoomLevel = map.getZoom();
          if (zoomLevel >= 15.05) {
            const box = document.getElementById('pollen-info-box');
            if (box) {
              box.style.display = 'block';
            }
          } else {
            const box = document.getElementById('pollen-info-box');
            if (box) {
              box.style.display = 'none';
            }
          }
          if (!nearestSuburb || (lastSuburb && lastSuburb === nearestSuburb)) return;

          lastSuburb = nearestSuburb;




          popupContent = createPopupContent(lastSuburb.suburbName, currentPollenData[lastSuburb.suburbName].pollen);

          popup.current
            .setLngLat([lng, lat])
            .setHTML(popupContent)
            .addTo(map);
          // console.log("查下最近suburb天气",lastSuburb.forecast);
          if (lastSuburb) {
            setHoveredSuburb({
              name: lastSuburb.suburbName,
              weather: "🌤️ Sunny and cloudy",
              pollen: "🌲 High",
              floor: "No. 3",
              WindLevel: "3 km/h",
              WindDirect: "Southeast"
            });
          } else {
            // 不在 mock 里的 suburb，就清空
            setHoveredSuburb({
              name: '',
              weather: '',
              pollen: '',
              floor: '',
              WindLevel: "",
              WindDirect: ""
            });
          }



          const points = currentPollenData[nearestSuburb.suburbName].pollengeojson;


          // const colorExpression = ['case'];
          // const heightExpression = ['case'];
          // const suburbFeature = currentPollenData[nearestSuburb.suburbName]?.feature;
          // const buildings = map.querySourceFeatures('composite', {
          //   sourceLayer: 'building',
          //   filter: ['all', ['==', 'extrude', 'true']]
          // });
          // // .filter(feature => turf.booleanPointInPolygon(turf.point(feature.geometry.coordinates[0]), suburbFeature));
          // // console.log("看下建筑范围", buildings);
          // if (map.getLayer('highlight-buildings')) {
          //   console.log('highlight-buildings layer exists!');
          // } else {
          //   console.log('highlight-buildings layer does not exist.');
          // }
          // buildings.forEach(building => {
          //   const id = building.id;
          //   if (id !== undefined) {
          //     colorExpression.push(['==', ['id'], id], getRandomColor());
          //     heightExpression.push(['==', ['id'], id], 8);
          //   }
          // });
          // colorExpression.push('#aaaaaa');
          // console.log("看下颜色到底有没有", colorExpression);
          // heightExpression.push(8);
          const modifiedHeight = (Math.random() * (8 - 6) + 6).toFixed(1);
          const totalPollenLevel = (Object.values(currentPollenData[lastSuburb.suburbName].pollen).reduce((sum, value) => sum + value, 0)).toFixed(6);
          const fixedStartColor = '#00FF00';
          if (fixedStartColor) {
            const [r, g, b] = hexToRgb(fixedStartColor);
            currentRed = r;
            currentGreen = g;
            currentBlue = b;

            startColorTransition();
          }
          // map.setPaintProperty('highlight-buildings', 'fill-extrusion-color', '#00FF00');
          map.setPaintProperty('highlight-buildings', 'fill-extrusion-height', [
            'case',
            ['>=', ['get', 'height'], parseFloat(modifiedHeight)],  // 如果建筑的高度 >= modifiedHeight
            parseFloat(modifiedHeight),  // 使用修改后的高度
            ['get', 'height']  // 否则使用原始的高度
          ]);

          if (!document.getElementById('pollen-info-box')) {
            createRectangleBox(totalPollenLevel, modifiedHeight);
          } else {
            const box = document.getElementById('pollen-info-box');
            updateRectangleBox(totalPollenLevel, modifiedHeight, box);
          }

          // map.setPaintProperty('highlight-buildings', 'fill-extrusion-color', colorExpression);
          // map.setPaintProperty('highlight-buildings', 'fill-extrusion-height', heightExpression);
          if (!currentPollenData || !currentPollenData[nearestSuburb.suburbName]) return;

          // 设置过滤器，只显示当前 suburb 区域内的建筑物
          // map.setFilter('highlight-buildings', [
          //   'all',
          //   ['==', 'extrude', 'true'],
          //   ['within', suburbFeature.geometry]
          // ]);




          if (map.getSource('random-points')) {
            map.getSource('random-points').setData(JSON.parse(JSON.stringify(points)));
          } else {
            map.addSource('random-points', {
              type: 'geojson',
              data: points
            });

            map.addLayer({
              id: 'random-points-layer',
              type: 'circle',
              source: 'random-points',
              paint: {
                'circle-radius': ['interpolate', ['linear'], ['zoom'],
                  0, 12,
                  4, 10,
                  6, 7,
                  8, 5,
                  10, 5,
                  15, 5,
                  15.05, 5],
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.8
              }
            });

            // map.addLayer({
            //   id: 'random-points-layer',
            //   type: 'circle',
            //   source: 'random-points',
            //   paint: {
            //     'circle-radius': ['+', 4, ['*', ['random'], 2]],
            //     'circle-color': ['get', 'color'],
            //     'circle-opacity': 0.6,
            //     'circle-blur': 0.4,
            //     'circle-stroke-width': 1,
            //     'circle-stroke-color': '#ffffff',
            //     'circle-stroke-opacity': 0.3
            //   }
            // });

            let t_pollen = 0;
            let speedFactor = 10; // 控制粒子漂移的基础速度
            const zoomLevel = map.getZoom();
            const t_pollenSpeed = speedFactor / Math.pow(2, zoomLevel) * 2;
            let lifetime = 8; // 粒子生命周期
            let distanceMultiplier = 1.5; // 用于增加飘动的距离
            const windDirection = 180; // 东风
            const windRad = windDirection * Math.PI / 180;
            const generateNewParticle = (startX, startY) => {
              // 每个粒子独立的生命周期
              const randomFloatX = Math.sin(t_pollen * 2) * 0.2;
              const randomFloatY = Math.sin(t_pollen * 1.5) * 0.2;

              const moveX = Math.cos(windRad) * speedFactor * t_pollen * distanceMultiplier + randomFloatX;
              const moveY = Math.sin(windRad) * speedFactor * t_pollen * distanceMultiplier + randomFloatY;

              // 计算粒子透明度随时间变化（随着t_pollen增加，透明度减少）
              const opacity = Math.max(0, 0.6 - (t_pollen / lifetime));

              // 返回一个新的粒子的位置和透明度
              return {
                position: [startX + moveX, startY + moveY],
                opacity: opacity
              };
            };

            const animatePollen = () => {
              t_pollen += t_pollenSpeed;

              // 获取当前粒子的位置
              const { position, opacity } = generateNewParticle(0, 0); // 假设起始位置是(0, 0)

              // 更新地图上的粒子
              map.setPaintProperty('random-points-layer', 'circle-translate', position);
              map.setPaintProperty('random-points-layer', 'circle-opacity', opacity);

              // 如果粒子完全消失（透明度为0），重新生成新的粒子
              if (opacity <= 0) {
                t_pollen = 0; // 重新开始生命周期
              }

              requestAnimationFrame(animatePollen);
            };

            animatePollen();

            map.setLayoutProperty('random-points-layer', 'visibility', 'visible');
          }

        });

        map.on('mouseleave', () => {
          if (popup.current) {
            popup.current.remove();
          }
        });
      });

      return () => {
        map.remove();
        const box = document.getElementById('pollen-info-box');
        if (box) {
          box.style.display = 'none';
        }
      } // 清理数据
    };

    loadSuburbs();
    return () => {
      if (map) {
        map.remove(); // 销毁 map 实例
      }
      const box = document.getElementById('pollen-info-box');
      if (box) {
        box.style.display = 'none';
      }
    };
  }, [selectedCity]);






  const createParticleProgram = (gl) => {
    const vertexSource = `
      uniform mat4 u_matrix;
      attribute vec3 a_position;
          void main() {
            gl_Position = u_matrix * vec4(a_position, 1.0);
            gl_PointSize = 8.0;
          } `;

    const fragmentSource = `
          void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 0.8);
          } `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
  };

  const createParticleBuffer = (gl, lngLatOrigin) => {
    const positions = [];
    let PARTICLE_COUNT = 10;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const lngOffset = (Math.random() - 0.5) * 0.001;
      const latOffset = (Math.random() - 0.5) * 0.001;
      const alt = Math.random() * 50;

      const coord = mapboxgl.MercatorCoordinate.fromLngLat(
        [lngLatOrigin[0] + lngOffset, lngLatOrigin[1] + latOffset],
        alt
      );

      positions.push(coord.x, coord.y, coord.z);
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return buffer;
  };

  const addParticlesWithThreeJS = (map, input_lgns) => {
    return {
      id: "particle-layer",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, gl) {
        this.map = map;
        this.program = createParticleProgram(gl);
        this.buffer = createParticleBuffer(gl, input_lgns);
        this.aPosition = gl.getAttribLocation(this.program, "a_position");
        this.uMatrix = gl.getUniformLocation(this.program, "u_matrix");
      },
      render: function (gl, matrix) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.uMatrix, false, matrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.enableVertexAttribArray(this.aPosition);
        gl.vertexAttribPointer(this.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, 100);
        this.map && this.map.triggerRepaint();
      }
    };
  };


  function getNearestSuburb(mouseLng, mouseLat, suburbList) {
    let nearest = null;
    let minDistance = Infinity;

    suburbList.forEach((suburb) => {
      const dx = suburb.longitude - mouseLng;
      const dy = suburb.latitude - mouseLat;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = suburb;
      }
    });

    return nearest;
  }


  // async function getSuburbsData(cityName) {
  //   const geojsonPath = `/ data / suburb_${ cityName }.geojson`;

  //   const suburbList = [];

  //   try {
  //     const response = await fetch(geojsonPath);

  //     // const contentType = response.headers.get("content-type");
  //     if (!response.ok ) {
  //       throw new Error("Invalid GeoJSON file or path");
  //     }
  //     const geoJSONData = await response.json();

  //     geoJSONData.features.forEach((feature) => {
  //       const suburbName = feature.properties.name || "Unnamed Suburb";
  //       const coordinates = feature.geometry.coordinates;


  //       let longitude, latitude;
  //       if (feature.geometry.type === 'Point') {
  //         longitude = coordinates[0];
  //         latitude = coordinates[1];
  //       } else if (feature.geometry.type === 'MultiPoint') {
  //         longitude = coordinates[0][0];
  //         latitude = coordinates[0][1];
  //       } else {
  //         console.warn("Unsupported geometry type:", feature.geometry.type);
  //         return;
  //       }

  //       suburbList.push({
  //         suburbName: suburbName,
  //         latitude: latitude,
  //         longitude: longitude,
  //       });
  //     });

  //     return suburbList;
  //   } catch (error) {
  //     console.error("Error loading GeoJSON:", error);
  //     return [];
  //   }
  // }

  async function getSuburbsData(cityName, includeForecastAndPollen = false) {
    const geojsonPath = `/data/suburb_${cityName}.geojson`;
    const suburbList = [];
    console.log(geojsonPath);
    try {
      const response = await fetch(geojsonPath);

      if (!response.ok) {
        throw new Error("Invalid GeoJSON file or path");
      }

      const geoJSONData = await response.json();
      console.log("GeoJSON features count:", geoJSONData.features.length);
      for (const feature of geoJSONData.features) {
        const suburbName = feature.properties.name || "Unnamed Suburb";
        const coordinates = feature.geometry.coordinates;

        let longitude, latitude;
        if (feature.geometry.type === 'Point') {
          longitude = coordinates[0];
          latitude = coordinates[1];
        } else if (feature.geometry.type === 'MultiPoint') {
          longitude = coordinates[0][0];
          latitude = coordinates[0][1];
        } else {
          console.warn("Unsupported geometry type:", feature.geometry.type);
          continue;
        }

        let forecast = null;
        let pollen = null;

        if (includeForecastAndPollen) {
          // 只有在需要的时候才去拉取
          forecast = await fetchForecast(latitude, longitude);
          // console.log(forecast);
          // pollen = await fetchPollen(latitude, longitude);
        }
        pollen = await samplefetchPollen();

        suburbList.push({
          suburbName,
          latitude,
          longitude,
          forecast,
          pollen
        });
      }

      return suburbList;
    } catch (error) {
      console.error("Error loading GeoJSON:", error);
      return [];
    }
  }




  return (
    // <div className="relative">
    //   <div
    //     className="absolute top-0 left-0 w-1/10 h-full bg-gray-800 bg-opacity-60 text-white p-4 z-50"
    //   >
    //     <ThreeDMapInfoPanel suburb={hoveredSuburb} />
    //   </div>
    //   <div id="map-container">
    //     <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}></div>
    //   </div>
    // </div>
    <div className="relative w-full h-screen">

      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '20px 40px',
              borderRadius: '10px',
              fontSize: '20px',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            Loading...
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '10%',
          height: '100vh',
          backgroundColor: 'rgba(75, 85, 99, 0.6)',
          color: 'white',
          padding: '1rem',
          zIndex: 1000,
        }}
      >
        <ThreeDMapInfoPanel suburb={hoveredSuburb} />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 1000, // 与ThreeDMapInfoPanel同级，确保显示
        }}
      >
        <button
          onClick={() => navigate(-1)} // 返回上一页
          style={{
            backgroundColor: 'rgba(75, 85, 99, 0.6)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Back
        </button>
      </div>


      {/* <div id="map-container">
        <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}></div>
      </div> */}

      <div
        id="map-container"
        style={{
          pointerEvents: loading ? 'none' : 'auto', // 禁用地图交互
        }}
      >
        <div
          id="map"
          ref={mapContainerRef}
          style={{ width: '100%', height: '100vh' }}
        ></div>
      </div>

    </div>
  );
};

export default MapContainer;