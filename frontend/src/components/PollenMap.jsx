import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import axios from 'axios';
import './PollenMap.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibnlhbjAwMjUiLCJhIjoiY204dHBvdjdjMGRxajJyb2NhbTRuYnVzOCJ9.002RhpjH1--fp6uxHi1viA';

const PollenMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popup = useRef(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }));
  const hoveredFeatureId = useRef(null);
  const userMarker = useRef(null); // ✅ NEW: For user location pin
  const [windArrowVisible, setWindArrowVisible] = useState(false); // 新增风向开关

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [144.408, -36.650],
      zoom: 1.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // ✅ NEW: Get user's location and add pin
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        userMarker.current = new mapboxgl.Marker({ color: '#00BFFF' }) // blue pin
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ closeButton: false }) // ✅ disables that "x" button
              .setHTML("<strong>You are here</strong>")
          )
          
          .addTo(map.current)
          .togglePopup();

        // Optionally center on user location
        // map.current.flyTo({ center: [longitude, latitude], zoom: 10 });
      },
      (error) => {
        console.warn("Geolocation failed:", error);
      },
      { enableHighAccuracy: true }
    );

    map.current.on('load', () => {
      map.current.flyTo({
        center: [144.408, -36.650],
        zoom: 6,
        speed: 0.8,
        curve: 1.42,
        easing: (t) => t,
      });

      fetch('/data/vic_forecast_districts.geojson')
        .then((res) => res.json())
        .then(async (geojson) => {
          const updatedFeatures = await Promise.all(
            geojson.features.map(async (feature, index) => {
              const center = turf.centroid(feature);
              const [lon, lat] = center.geometry.coordinates;

              let treeUPI = 0;
              let grassUPI = 0;
              let windDirection = null; // 新增风向

              try {
                const response = await axios.get('https://pollen.googleapis.com/v1/forecast:lookup', {
                  params: {
                    key: 'AIzaSyBk5Jp0Hurs4ACTPBjGX94uL7ZZv85k8aA',
                    'location.latitude': lat,
                    'location.longitude': lon,
                    days: 1,
                  },
                });

                const pollenInfo = response.data?.dailyInfo?.[0]?.pollenTypeInfo || [];
                const getUPI = (type) =>
                  pollenInfo.find(p => p.code === type && p.indexInfo?.value != null)?.indexInfo.value || 0;

                treeUPI = getUPI('TREE');
                grassUPI = getUPI('GRASS');
              } catch (err) {
                console.warn(`API failed for ${lat}, ${lon}`, err);
              }

              // 新增：请求风向
              try {
                const windRes = await axios.get('https://api.open-meteo.com/v1/forecast', {
                  params: {
                    latitude: lat,
                    longitude: lon,
                    hourly: 'wind_direction_120m',
                    timezone: 'auto',
                  },
                });
                // 取最近一小时的风向
                windDirection = windRes.data.hourly?.wind_direction_120m?.[0] ?? null;
              } catch (err) {
                console.warn(`风向API失败: ${lat}, ${lon}`, err);
              }

              feature.properties.treeUPI = treeUPI;
              feature.properties.grassUPI = grassUPI;
              feature.properties.generalUPI = Math.max(treeUPI, grassUPI);
              feature.properties.windDirection = windDirection; // 存储风向
              feature.id = index;
              return feature;
            })
          );

          map.current.addSource('forecast-districts', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: updatedFeatures,
            },
          });

          // 加载箭头图片
          map.current.loadImage('/images/arrow.png', (error, image) => {
            if (error) throw error;
            if (!map.current.hasImage('arrow-icon')) {
              map.current.addImage('arrow-icon', image);
            }
            // 初始不添加风向图层，由开关控制
          });

          map.current.addLayer({
            id: 'district-fill',
            type: 'fill',
            source: 'forecast-districts',
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'generalUPI'],
                0, '#a5d6a7',
                1, '#dce775',
                2, '#fff176',
                3, '#ffb74d',
                4, '#ef5350',
                5, '#b71c1c'
              ],
              'fill-opacity': 0.75,
            },
          });

          map.current.addLayer({
            id: 'district-outline',
            type: 'line',
            source: 'forecast-districts',
            paint: {
              'line-color': '#000',
              'line-width': 1,
            },
          });

          map.current.addLayer({
            id: 'district-hover',
            type: 'line',
            source: 'forecast-districts',
            paint: {
              'line-color': '#ffffff',
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                0,
              ],
            },
          });

          map.current.addLayer({
            id: 'district-labels',
            type: 'symbol',
            source: 'forecast-districts',
            layout: {
              'text-field': ['get', 'DISTRICT'],
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-size': 12,
              'text-offset': [0, 0.6],
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1,
            },
          });

          map.current.on('mousemove', 'district-fill', (e) => {
            const feature = e.features[0];
            const id = feature.id;

            if (hoveredFeatureId.current !== null) {
              map.current.setFeatureState(
                { source: 'forecast-districts', id: hoveredFeatureId.current },
                { hover: false }
              );
            }

            hoveredFeatureId.current = id;

            map.current.setFeatureState(
              { source: 'forecast-districts', id },
              { hover: true }
            );

            const tree = feature.properties.treeUPI || 0;
            const grass = feature.properties.grassUPI || 0;

            popup.current
              .setLngLat(e.lngLat)
              .setHTML(`
                <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px;">Pollen Risk Index</div>
                <div style="font-size: 13px;">Tree 🌳: <strong style="color:#4caf50;">${tree}</strong></div>
                <div style="font-size: 13px;">Grass 🌾: <strong style="color:#4caf50;">${grass}</strong></div>

              `)
              
              .addTo(map.current);
          });

          map.current.on('mouseleave', 'district-fill', () => {
            if (hoveredFeatureId.current !== null) {
              map.current.setFeatureState(
                { source: 'forecast-districts', id: hoveredFeatureId.current },
                { hover: false }
              );
            }
            hoveredFeatureId.current = null;
            popup.current.remove();
          });
        });
    });
  }, []);

  // 监听windArrowVisible变化，动态添加/移除风向图层
  useEffect(() => {
    if (!map.current) return;
    if (!map.current.getSource('forecast-districts')) return;
    if (!map.current.hasImage('arrow-icon')) return;
    const layerId = 'wind-arrow';
    if (windArrowVisible) {
      if (!map.current.getLayer(layerId)) {
        map.current.addLayer({
          id: layerId,
          type: 'symbol',
          source: 'forecast-districts',
          layout: {
            'icon-image': 'arrow-icon',
            'icon-size': 0.5,
            'icon-rotate': ['get', 'windDirection'],
            'icon-allow-overlap': true,
          },
          filter: ['!=', ['get', 'windDirection'], null],
        });
      }
    } else {
      if (map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
    }
  }, [windArrowVisible]);

  return (
    <div className="map-container">
      {/* Wind开关按钮 */}
      <div className="wind-switch-container">
        <label className="wind-switch">
          <input
            type="checkbox"
            checked={windArrowVisible}
            onChange={() => setWindArrowVisible(v => !v)}
          />
          <span className="slider"></span>
        </label>
        <span className="wind-switch-label">Wind</span>
      </div>
      {/* 地图主体 */}
      <div ref={mapContainer} className="map" />
      {/* 图例 */}
      <div className="map-legend">
        <strong>Allergy Risk Index</strong>
        <div><span style={{ background: '#a5d6a7' }}></span> 0 – Very Low</div>
        <div><span style={{ background: '#dce775' }}></span> 1 – Low</div>
        <div><span style={{ background: '#fff176' }}></span> 2 – Moderate</div>
        <div><span style={{ background: '#ffb74d' }}></span> 3 – High</div>
        <div><span style={{ background: '#ef5350' }}></span> 4 – Very High</div>
        <div><span style={{ background: '#b71c1c' }}></span> 5 – Extreme</div>
      </div>
    </div>
  );
};

export default PollenMap;
