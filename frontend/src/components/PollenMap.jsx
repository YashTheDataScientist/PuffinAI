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
  const userMarker = useRef(null);
  const [windArrowVisible, setWindArrowVisible] = useState(false);
  const windMarkers = useRef([]); 

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [144.408, -36.650],
      zoom: 1.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        userMarker.current = new mapboxgl.Marker({ color: '#00BFFF' })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ closeButton: false })
              .setHTML("<strong>You are here</strong>")
          )
          .addTo(map.current)
          .togglePopup();
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
              let windDirection = null;
              let windSpeed = null; 
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

              try {
                const windRes = await axios.get('https://api.open-meteo.com/v1/forecast', {
                  params: {
                    latitude: lat,
                    longitude: lon,
                    hourly: 'wind_direction_120m,wind_speed_120m', 
                    timezone: 'auto',
                  },
                });
                windDirection = windRes.data.hourly?.wind_direction_120m?.[0] ?? null;
                windSpeed = windRes.data.hourly?.wind_speed_120m?.[0] ?? null;
              } catch (err) {
                console.warn(`风向API失败: ${lat}, ${lon}`, err);
              }

              const offsetDistance = 30;
              let windOffset = [0, 0];
              if (typeof windDirection === 'number') {
                const rad = (windDirection - 90) * Math.PI / 180;
                windOffset = [Math.cos(rad) * offsetDistance, Math.sin(rad) * offsetDistance];
              }
              feature.properties.windOffset = windOffset;

              feature.properties.treeUPI = treeUPI;
              feature.properties.grassUPI = grassUPI;
              feature.properties.generalUPI = Math.max(treeUPI, grassUPI);
              feature.properties.windDirection = windDirection;
              feature.properties.windSpeed = windSpeed;
              feature.properties.center = [lon, lat]; 
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
            const combined = tree + grass;

            popup.current
              .setLngLat(e.lngLat)
              .setHTML(`
                <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px;">Pollen Risk Index</div>
                <div style="font-size: 13px;"><strong style="color:#4caf50;">${combined}</strong></div>
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

          window.districtFeatures = updatedFeatures;
        });
    });
  }, []);

  // useEffect(() => {
  //   if (!map.current || !map.current.isStyleLoaded()) return;
    
  //   windMarkers.current.forEach(marker => marker.remove());
  //   windMarkers.current = [];
    
  //   if (windArrowVisible && window.districtFeatures) {
  //     window.districtFeatures.forEach(feature => {
  //       const { windDirection, windSpeed, center } = feature.properties;
  //       if (windDirection !== null && center) {
  //         const el = document.createElement('div');
  //         el.className = 'wind-arrow-marker';

  //         const animationDuration = windSpeed ? Math.max(3, 8 - windSpeed/2) : 5;
  //         el.innerHTML = `
  //           <div class="arrow-container" style="transform: rotate(${windDirection}deg)">
  //             <div class="arrow-body" style="background: none; width: 0; height: 0;">
  //               <div class="animated-particle" style="animation-duration: ${animationDuration}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px;"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 1.2}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/4}s"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 0.8}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/2}s"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 1.5}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/1.5}s"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 1.0}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/4}s"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 1.5}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/1.5}s"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 1.3}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/3}s"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 0.9}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/2.5}s"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 1.4}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/1.8}s"></div>
  //               <div class="animated-particle" style="animation-duration: ${animationDuration * 1.1}s; left: ${Math.random() * 60}px; top: ${Math.random() * 20 - 10}px; animation-delay: ${animationDuration/3.5}s"></div>
  //             </div>
  //           </div>
  //         `;

  //         const marker = new mapboxgl.Marker({
  //           element: el,
  //           anchor: 'center',
  //         })
  //           .setLngLat(center)
  //           .addTo(map.current);

  //         windMarkers.current.push(marker);
  //       }
  //     });
  //   }
  // }, [windArrowVisible]);


  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
  
    windMarkers.current.forEach(marker => marker.remove());
    windMarkers.current = [];
  
    if (windArrowVisible && window.districtFeatures) {
      window.districtFeatures.forEach(feature => {
        const { windDirection, windSpeed, center } = feature.properties;
        if (windDirection !== null && center) {
          const el = document.createElement('div');
          el.className = 'wind-arrow-marker';
  
          const animationDuration = windSpeed ? Math.max(3, 8 - windSpeed / 2) : 5;
const arrowLength = Math.min(80, 20 + (windSpeed || 0) * 5);
el.title = `Wind: ${windSpeed?.toFixed(1) ?? '--'} m/s`;

el.innerHTML = `
  <div class="arrow-container" style="transform: rotate(${windDirection}deg);">
    <div class="arrow-body-wrapper" style="width: ${arrowLength}px;">
      <div class="arrow-body"></div>
      <div class="arrow-head"></div>
      ${Array.from({ length: 6 }).map(() => {
        const dur = animationDuration * (0.8 + Math.random() * 0.7);
        const delay = (animationDuration / 4) + Math.random() * (animationDuration / 2);
        const left = Math.random() * arrowLength;
        return `<div class="animated-particle" style="animation-duration: ${dur}s; animation-delay: ${delay}s; left: ${left}px;"></div>`;
      }).join('')}
    </div>
  </div>
  <div class="wind-speed-label">${windSpeed?.toFixed(1) ?? '--'} m/s</div>
`;


  
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'center',
          })
            .setLngLat(center)
            .addTo(map.current);
  
          windMarkers.current.push(marker);
        }
      });
    }
  }, [windArrowVisible]);
  

  return (
    <div className="map-container">
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
      <div ref={mapContainer} className="map" />
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