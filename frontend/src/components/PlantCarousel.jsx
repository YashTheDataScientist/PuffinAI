import React, { useState, useEffect } from 'react';
import './PlantCarousel.css';
import Papa from 'papaparse';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dotIcon from '../assets/dot.png';

const customIcon = new L.Icon({
  iconUrl: dotIcon,
  iconSize: [35, 35],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const PLANT_LIST = [
  'Ryegrass',
  'Plane Tree',
  'Silver Birch',
  'Bermuda Grass',
  'Timothy Grass',
  'Mulberry',
  'Olive Tree',
  'Cedar',
  'Elm',
  'Oak',
  'Pigweed',
  'Ragweed',
  'Privet',
  'Cocksfoot Grass',
  'Paspalum Grass'
];

const PLANT_META = {
  'Ryegrass': {
    desc: 'Season: Spring to Summer\nRegion: Widespread in pastures and lawns across Victoria\nNote: Major cause of hay fever and asthma during peak pollen season.',
    Image: '/images/Ryegrass.png',
    risk: 'High'
  },
  'Plane Tree': {
    desc: 'Season: Late Spring\nRegion: Common in urban streets and parks\nNote: Pollen can trigger allergies, especially in city environments.',
    Image: '/images/Plane.png',
    risk: 'Medium'
  },
  'Silver Birch': {
    desc: 'Season: Spring\nRegion: Gardens and urban landscapes\nNote: Pollen is highly allergenic, especially for sensitive individuals.',
    Image: '/images/Silver.png',
    risk: 'Medium'
  },
  'Bermuda Grass': {
    desc: 'Season: Late Spring to Autumn\nRegion: Lawns, sports fields, and roadsides\nNote: Strong allergen, especially in dry, warm weather.',
    Image: '/images/Bermuda_Grass.png',
    risk: 'High'
  },
  'Timothy Grass': {
    desc: 'Season: Spring to Summer\nRegion: Meadows and pastures\nNote: Major source of grass pollen allergy.',
    Image: '/images/Timothy.png',
    risk: 'High'
  },
  'Mulberry': {
    desc: 'Season: Spring\nRegion: Urban and rural gardens\nNote: Pollen can cause respiratory issues, especially in dry conditions.',
    Image: '/images/Mulberry.png',
    risk: 'Medium'
  },
  'Olive Tree': {
    desc: 'Season: Late Spring to Early Summer\nRegion: Gardens and parks\nNote: Pollen is a potent allergen, especially in Mediterranean climates.',
    Image: '/images/Olive.png',
    risk: 'High'
  },
  'Cedar': {
    desc: 'Season: Winter to Early Spring\nRegion: Parks and gardens\nNote: Pollen can cause hay fever and asthma.',
    Image: '/images/cedar.png',
    risk: 'Medium'
  },
  'Elm': {
    desc: 'Season: Late Winter to Spring\nRegion: Urban streets and parks\nNote: Moderate pollen allergen, can affect sensitive individuals.',
    Image: '/images/elm.png',
    risk: 'Medium'
  },
  'Oak': {
    desc: 'Season: Spring\nRegion: Forests, parks, and gardens\nNote: Pollen can trigger allergies, especially in windy weather.',
    Image: '/images/oak.png',
    risk: 'Medium'
  },
  'Pigweed': {
    desc: 'Season: Late Summer to Autumn\nRegion: Roadsides, gardens, and disturbed soils\nNote: Pollen is highly allergenic and persistent.',
    Image: '/images/pig.png',
    risk: 'High'
  },
  'Ragweed': {
    desc: 'Season: Late Summer to Autumn\nRegion: Fields, roadsides, and open areas\nNote: Notorious for causing hay fever and severe allergies.',
    Image: '/images/Ragweed.png',
    risk: 'High'
  },
  'Privet': {
    desc: 'Season: Spring to Early Summer\nRegion: Hedges and gardens\nNote: Pollen can cause allergies, especially in urban areas.',
    Image: '/images/Privet.png',
    risk: 'Medium'
  },
  'Cocksfoot Grass': {
    desc: 'Season: Spring to Summer\nRegion: Pastures, meadows, and roadsides\nNote: Strong pollen allergen, common in rural areas.',
    Image: '/images/cock.png',
    risk: 'High'
  },
  'Paspalum Grass': {
    desc: 'Season: Summer to Autumn\nRegion: Lawns, sports fields, and wetlands\nNote: Moderate pollen allergen, especially after rain.',
    Image: '/images/Paspalum.png',
    risk: 'Medium'
  }
};

const PlantCarousel = () => {
  const [plantLocations, setPlantLocations] = useState([]);
  const [carouselPlants, setCarouselPlants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [similarPlantsData, setSimilarPlantsData] = useState([]);

  useEffect(() => {
    fetch('/data/All_Plants_Victoria_With_Suburbs.csv')
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const filtered = results.data.filter(row => PLANT_LIST.includes(row['Common Name']));
            setPlantLocations(filtered);
            const uniquePlants = [];
            const seen = new Set();
            for (const row of filtered) {
              if (!seen.has(row['Common Name'])) {
                uniquePlants.push(row);
                seen.add(row['Common Name']);
              }
            }
            setCarouselPlants(uniquePlants);
          }
        });
      });

    fetch('/data/similar_looking_plants.csv')
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            setSimilarPlantsData(results.data);
          }
        });
      });
  }, []);

  const currentPlant = carouselPlants[currentIndex];

  const getSimilarPlantInfo = () => {
    if (!currentPlant) return null;
    const currentName = currentPlant['Common Name'].replace(/\s+/g, '').toLowerCase();
    return similarPlantsData.find(row => {
      if (!row['Allergy Plant']) return false;
      const allergyName = row['Allergy Plant'].replace(/\s+/g, '').toLowerCase();
      return allergyName.includes(currentName) || currentName.includes(allergyName);
    });
  };

  return (
    <>
      <div className="plant-main-section">
        <h1 className="plant-main-title">
          Explore our plant gallery to discover common allergenic plants found across Victoria.
        </h1>

        <div className="plant-content-col">
          {currentPlant && (
            <>
              <div className="plant-main-image-col">
                <div className="plant-main-desc-box">
                  {PLANT_META[currentPlant['Common Name']]?.desc
                    ? PLANT_META[currentPlant['Common Name']].desc.split('\n').map((line, idx) => {
                        const match = line.match(/^(Season|Region|Note):(.+)$/);
                        return match ? (
                          <div key={idx} className="plant-main-desc-row">
                            <span className="plant-main-desc-label">{match[1]}:</span>
                            <span>{match[2]}</span>
                          </div>
                        ) : <div key={idx}>{line}</div>;
                      })
                    : ''}
                </div>
                <img
                  src={PLANT_META[currentPlant['Common Name']]?.Image.replace(/^\.{2}/, '')}
                  alt={currentPlant['Common Name']}
                  className="plant-main-image"
                />
              </div>
              <div className="plant-main-info-col">
                <h2 className="plant-main-name">{currentPlant['Common Name']}</h2>
              </div>

              <div className="plant-indicators">
                <div className="indicator-card">
                  <div className="indicator-label">Risk Level</div>
                  <div className={`indicator-value risk-${PLANT_META[currentPlant['Common Name']]?.risk?.toLowerCase()}`}>
                    {PLANT_META[currentPlant['Common Name']]?.risk}
                  </div>
                </div>
                <div className="indicator-card">
                  <div className="indicator-label">Population</div>
                  <div className="indicator-value">
                    {plantLocations.filter(p => p['Common Name'] === currentPlant['Common Name']).length} Areas
                  </div>
                </div>
              </div>

              
            </>
          )}
        </div>

        <div className="plant-actions-col">
          <div className="action-group">
            <p className="action-description">
              Want to know which areas in Victoria have this plant
            </p>
            <button onClick={() => setShowMap(true)} disabled={!currentPlant}>
              View on Map
            </button>
          </div>
          <div className="action-group">
            <p className="action-description">
              Some plants look familiar but are pollen safe. Don't get confused!
            </p>
            <button onClick={() => setShowRecommend(true)} disabled={!currentPlant}>
              View Similar plants
            </button>
          </div>
        </div>
      </div>

      <div className="plant-thumbnails-bar">
        {carouselPlants.map((plant, idx) => (
          <div
            key={plant['Common Name']}
            className={`plant-thumbnail-item${idx === currentIndex ? ' selected' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          >
            <img
              src={PLANT_META[plant['Common Name']]?.Image.replace(/^\.{2}/, '')}
              alt={plant['Common Name']}
              className="plant-thumbnail-image"
            />
          </div>
        ))}
      </div>

      {(showMap || showRecommend) && <div className="modal-backdrop"></div>}

      {showMap && currentPlant && (
        <div className="map-popup">
          <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: 400, width: 600 }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {plantLocations
              .filter(p => p['Common Name'] === currentPlant['Common Name'])
              .map((loc, idx) => (
                <Marker
                  key={idx}
                  position={[parseFloat(loc.decimalLatitude), parseFloat(loc.decimalLongitude)]}
                  icon={customIcon}
                >
                  <Popup>{loc.locality}</Popup>
                </Marker>
              ))}
          </MapContainer>
          <button onClick={() => setShowMap(false)}>Close</button>
        </div>
      )}

      {showRecommend && (
        <div className="map-popup recommendation-popup">
          <h3>Recommended Similar Pollen Safe Plant</h3>
          {(() => {
            const info = getSimilarPlantInfo();
            if (!info) return <div>No recommendation found.</div>;
            const simName = info['Similar looking plant'] || '';
            const simImg = simName ? `/images/${simName.replace(/\s+/g, '').toLowerCase()}.jpg` : '';
            const [firstDesc, secondDesc] = (info['Difference'] || 'N/A').split('.').map(s => s.trim());

            return (
              <div className="similar-plant-card">
                <div className="plants-comparison">
                  <div className="plant-comparison-item">
                    <img
                      src={PLANT_META[currentPlant['Common Name']]?.Image}
                      alt={currentPlant['Common Name']}
                      className="plant-comparison-image"
                    />
                    <h4 className="plant-comparison-name">{currentPlant['Common Name']}</h4>
                    <p className="plant-comparison-desc">{firstDesc}.</p>
                  </div>
                  <div className="vs-icon-container">
                    <img src="/icons/vs.png" alt="versus" className="vs-icon" />
                  </div>
                  <div className="plant-comparison-item">
                    <img
                      src={simImg}
                      alt={simName}
                      className="plant-comparison-image"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <h4 className="plant-comparison-name">{simName}</h4>
                    <p className="plant-comparison-desc">{secondDesc}.</p>
                  </div>
                </div>
              </div>
            );
          })()}
          <button onClick={() => setShowRecommend(false)}>Close</button>
        </div>
      )}
    </>
  );
};

export default PlantCarousel;

