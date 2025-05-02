import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";


mapboxgl.accessToken = 'pk.eyJ1IjoibnlhbjAwMjUiLCJhIjoiY204dHBvdjdjMGRxajJyb2NhbTRuYnVzOCJ9.002RhpjH1--fp6uxHi1viA';

const districtRisk = {
  "Central": "high",
  "North Central": "high",
  "Northern Country": "high",
  "South West": "low",
  "East Gippsland": "moderate",
  "Mallee": "moderate",
  "North East": "moderate",
  "West and South Gippsland": "moderate",
  "Wimmera": "moderate"
};

const SectionPollenMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [144.408, -36.650],
      zoom: 5
    });

    map.current.on("load", () => {
      fetch("/data/vic_forecast_districts.geojson")
        .then(res => res.json())
        .then((geojson) => {
          geojson.features = geojson.features.map((f) => {
            const name = f.properties.DISTRICT.toUpperCase();
            const match = Object.keys(districtRisk).find(key => name.includes(key.toUpperCase()));
            f.properties.riskLevel = match ? districtRisk[match] : "low";
            return f;
          });

          map.current.addSource("districts", {
            type: "geojson",
            data: geojson,
          });

          map.current.addLayer({
            id: "district-fills",
            type: "fill",
            source: "districts",
            paint: {
              "fill-color": [
                "match",
                ["get", "riskLevel"],
                "high", "#c62828",
                "moderate", "#f9a825",
                "#66bb6a"
              ],
              "fill-opacity": 0.7,
            },
          });

          map.current.addLayer({
            id: "district-labels",
            type: "symbol",
            source: "districts",
            layout: {
              "text-field": ["get", "DISTRICT"],
              "text-font": ["Open Sans Bold"],
              "text-size": 12,
            },
            paint: {
              "text-color": "#fff",
              "text-halo-color": "#000",
              "text-halo-width": 1,
            },
          });
        });
    });
  }, []);

  return (
    <div className="section-pollen-map">
      <h2 className="map-title">Allergy Risk Map of Victoria</h2>
      <p className="map-description">
        This map shows the general allergy risk levels in each Victorian district during peak pollen season.
        Red zones indicate high-risk areas, yellow shows moderate risk, and green indicates low pollen exposure.
      </p>
      <div className="mapbox-wrapper">
        <div ref={mapContainer} className="mapbox" />
        <div className="legend">
          <strong>District Risk Levels</strong>
          <div><span className="low"></span> Low</div>
          <div><span className="moderate"></span> Moderate</div>
          <div><span className="high"></span> High</div>
        </div>
      </div>
    </div>
  );
};

export default SectionPollenMap;
