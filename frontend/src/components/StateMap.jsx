// src/components/StateMap.jsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useParams, useNavigate } from 'react-router-dom';

export default function StateMap() {
  const mapRef = useRef(null);
  const { stateName } = useParams();
  const navigate = useNavigate();
  useEffect(() => {

    if (!stateName) return;

    // 清除旧地图
    // if (mapRef.current) {
    //   console.log("current到底是什么",mapRef.current);
    //   mapRef.current.remove();
    // }

    // 初始化地图
    const map = L.map('state-map').setView([-25.2744, 133.7751], 5);
    mapRef.current = map;

    // const cityIcon = L.icon({
    //   iconUrl: '/images/city.png',
    //   iconSize: [32, 32],
    //   iconAnchor: [16, 32],
    //   popupAnchor: [0, -32],
    // });

    // 加载 state geojson
    fetch('/data/states.geojson')
      .then((res) => res.json())
      .then((data) => {
        const stateData = data.features.find(
          (feature) => feature.properties.STATE_NAME.trim() === stateName
        );
        console.log("看下州的数据：", data);

        if (stateData) {
          const geojsonLayer = L.geoJSON(stateData, {
            style: {
              color: '#FF0000',
              weight: 2,
              fillOpacity: 0.4,
            },
          }).addTo(mapRef.current);
          mapRef.current.addLayer(geojsonLayer);
          // 加载城市数据
          fetch(`/data/${stateName.toLowerCase()}.geojson`)
            .then((res) => res.json())
            .then((cityData) => {
              L.geoJSON(cityData, {
                pointToLayer: (feature, latlng) => {
                  const cityName = feature.properties.name;
                  const isMelbourne = cityName === 'Melbourne';
                  window.cityClickHandler = (stateName, cityName) => {
                    navigate(`/country/${stateName}/${cityName}`);
                  };
                  const cityLabel = L.divIcon({
                    className: 'city-label',
                    html: `
                      <div style="position: relative; cursor: ${isMelbourne ? 'pointer' : 'default'};">
                        <img src="/icons/city.png"
                            style="position: absolute; top: 0; left: 0; width: 32px; height: 32px;
                            ${!isMelbourne ? 'filter: grayscale(100%) opacity(0.4);' : ''}" />
                        <div class="city-label-text"
                            style="position: absolute; top: 35px; left: -16px; font-size: 12px; font-weight: bold;
                            color: ${isMelbourne ? '#000' : '#999'};">
                          ${cityName}
                        </div>
                      </div>
                    `,
                    iconSize: [50, 50],
                    iconAnchor: [16, 50],
                  });

                  return L.marker(latlng, { icon: cityLabel });
                },
                onEachFeature: (feature, layer) => {
                  const cityName = feature.properties.name;
                  if (cityName === 'Melbourne') {
                  layer.on('click', () => {
                    navigate(`/country/${stateName}/${cityName}`);
                  });
                } else {
                  // 禁用点击事件
                  layer.off('click');
                  layer.options.interactive = false;
                }
                },
              }).addTo(map);
            });
        }
      });

    return () => {
      map.remove();
    };
  }, [stateName]);

  return <div id="state-map" style={{ height: '100vh' }} />;
}