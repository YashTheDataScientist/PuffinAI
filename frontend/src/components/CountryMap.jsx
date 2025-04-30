// src/components/LeafletMap.jsx
import { useEffect, React } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';


export default function LeafletMap() {
  const navigate = useNavigate();
  //test
  useEffect(() => {
    const map = L.map('map').setView([-25.2744, 133.7751], 4);

    fetch('/data/states.geojson')
      .then(res => res.json())
      .then(data => {
        const geojsonLayer = L.geoJSON(data, {
          style: (feature) => {
            const isVictoria = feature.properties.STATE_NAME === 'Victoria';
            return {
              color: isVictoria ? '#0078A8' : '#888888', 
              weight: 2,
              fillColor: isVictoria ? '#66c2ff' : '#cccccc',
              fillOpacity: 0.5,
            };
          },
          onEachFeature: (feature, layer) => {
            const stateName = feature.properties.STATE_NAME;
            const isVictoria = stateName === 'Victoria';
            layer.bindTooltip(stateName, {
              permanent: false,
              direction: "center",
            });
            if(isVictoria){
            layer.on('click', () => {
              // map.remove();
              navigate(`/country/${stateName}`);
            });
          }
          }
        });

        geojsonLayer.addTo(map);
      })
      .catch(error => {
        console.error("加载 GeoJSON 失败:", error);
      });
      
    return () => {
      map.remove();
    };
  }, [navigate]);

  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
}