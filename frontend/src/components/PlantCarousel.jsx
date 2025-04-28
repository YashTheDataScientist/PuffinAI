import React, { useState, useEffect } from 'react';
import './PlantCarousel.css';
import Papa from 'papaparse';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

  const handlePrevious = () => {
    setCurrentIndex(current => (current === 0 ? carouselPlants.length - 1 : current - 1));
  };

  const handleNext = () => {
    setCurrentIndex(current => (current === carouselPlants.length - 1 ? 0 : current + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

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
    <div className="plant-carousel">
      <div className="carousel-container">
        <button 
          className="carousel-button" 
          onClick={handlePrevious}
          aria-label="Previous plant"
        >
          ←
        </button>
        <div className="plant-display">
          <div className="plant-desc-col">
            {currentPlant && (
              <div className="plant-description">
                {PLANT_META[currentPlant['Common Name']]?.desc
                  ? PLANT_META[currentPlant['Common Name']].desc.split('\n').map((line, idx) => {
                      const match = line.match(/^(Season|Region|Note):(.+)$/);
                      if (match) {
                        return (
                          <div key={idx} style={{marginBottom: 6}}>
                            <span style={{fontWeight: 'bold'}}>{match[1]}:</span>
                            <span>{match[2]}</span>
                          </div>
                        );
                      }
                      return <div key={idx}>{line}</div>;
                    })
                  : ''}
              </div>
            )}
          </div>
          <div className="plant-image-col">
            {currentPlant && PLANT_META[currentPlant['Common Name']]?.Image && (
              <img
                src={PLANT_META[currentPlant['Common Name']].Image.replace(/^\.\./, '')}
                alt={currentPlant['Common Name']}
                className="plant-carousel-image"
              />
            )}
            {currentPlant && (
              <>
                <h2 className="plant-name">{currentPlant['Common Name']}</h2>
                <div className={`risk-badge ${PLANT_META[currentPlant['Common Name']]?.risk?.toLowerCase()}`}>{PLANT_META[currentPlant['Common Name']]?.risk} Risk</div>
              </>
            )}
          </div>
          <div className="plant-btn-col">
            <button onClick={() => setShowMap(true)} disabled={!currentPlant}>
              Explore the location of the plant
            </button>
            <button onClick={() => setShowRecommend(true)} disabled={!currentPlant}>
              Recommend similar pollen safe plant
            </button>
          </div>
        </div>
        <button 
          className="carousel-button" 
          onClick={handleNext}
          aria-label="Next plant"
        >
          →
        </button>
      </div>
      <div className="carousel-dots">
        {carouselPlants.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
      {showMap && currentPlant && (
        <div className="map-popup">
          <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: 400, width: 600 }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {plantLocations
              .filter(p => p['Common Name'] === currentPlant['Common Name'])
              .map((loc, idx) => (
                <Marker
                  key={idx}
                  position={[
                    parseFloat(loc.decimalLatitude),
                    parseFloat(loc.decimalLongitude)
                  ]}
                >
                  <Popup>{loc.locality}</Popup>
                </Marker>
              ))}
          </MapContainer>
          <button onClick={() => setShowMap(false)}>Close</button>
        </div>
      )}
      {showRecommend && (
        <div className="map-popup" style={{textAlign: 'center', minWidth: 400}}>
          <h3>Recommended Similar Pollen Safe Plant</h3>
          {(() => {
            const info = getSimilarPlantInfo();
            if (!info) return <div>No recommendation found.</div>;
            let simName = info['Similar looking plant'] || '';
            let simImg = '';
            if (simName) {
              simImg = `/images/${simName.replace(/\s+/g, '').toLowerCase()}.jpg`;
            }
            return (
              <div className="similar-plant-card">
                {simName && (
                  <>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:12}}>
                      <img src={simImg} alt={simName} style={{width:180, height:180, objectFit:'contain', borderRadius:10, boxShadow:'0 2px 8px #0001', marginBottom:8}} onError={e => e.target.style.display='none'} />
                      <div className="sp-title">{simName}</div>
                    </div>
                  </>
                )}
                <div className="sp-section"><span className="sp-label">Scientific name:</span> {info['Scientific name'] || 'N/A'}</div>
                <div className="sp-section"><span className="sp-label">Difference:</span> {info['Difference'] || 'N/A'}</div>
                {info['Mainly found in'] && (
                  <div className="sp-section"><span className="sp-label">Mainly found in:</span> {info['Mainly found in']}</div>
                )}
              </div>
            );
          })()}
          <button onClick={() => setShowRecommend(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default PlantCarousel; 