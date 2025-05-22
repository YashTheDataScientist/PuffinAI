import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import './KnowYourArea.css';
import tempIcon from '../assets/temperature.png';
import windIcon from '../assets/wind.png';
import humidityIcon from '../assets/humidity.png';
import plantIcon from '../assets/plants.png';
import lowRiskRadar from '../assets/lowrisk.png';
import mediumRiskRadar from '../assets/mediumrisk.png';
import highRiskRadar from '../assets/highrisk.png';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import lowIcon from '../assets/lowpre.png';
import medIcon from '../assets/medpre.png';
import highIcon from '../assets/highpre.png';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';


import Lottie from 'lottie-react';
import buildingAnim from '../assets/building.json';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const precautionTips = {
  1: { text: "Low risk. Enjoy your day outside!", icon: lowIcon },
  2: { text: "Moderate risk. A mask might be a good idea.", icon: medIcon },
  3: { text: "High risk. Best to stay indoors if you can.", icon: highIcon },
};

const plantImages = import.meta.glob('../assets/plants/*.jpg', { eager: true });

const plantImageMap = {
  "Bermuda Grass": "bermudagrass",
  "Cedar": "cedar",
  "Cocksfoot Grass": "cocksfootgrass",
  "Elm": "elm",
  "Mulberry": "mulberry",
  "Oak": "oak",
  "Olive Tree": "olivetree",
  "Paspalum Grass": "paspalumgrass",
  "Pigweed": "pigweed",
  "Plane Tree": "planetree",
  "Privet": "privet",
  "Ragweed": "ragweed",
  "Ryegrass": "ryegrass",
  "Silver Birch": "silverbirch",
  "Timothy Grass": "timothygrass"
};

const plantDetails = {
  "Oak": {
    description: "Oak trees release pollen in spring and can cause severe allergic reactions.",
    count: 0,
    riskLevel: "High"
  },
  "Pigweed": {
    description: "Pigweed pollen is highly allergenic and thrives in dry climates.",
    count: 0,
    riskLevel: "Moderate"
  },
  "Ryegrass": {
    description: "Ryegrass pollen is one of the most common triggers for hay fever.",
    count: 0,
    riskLevel: "High"
  },
  "Mulberry": {
    description: "Mulberry trees produce dense clouds of allergenic pollen in spring.",
    count: 0,
    riskLevel: "High"
  },
  "Cedar": {
    description: "Cedar pollen causes strong winter allergies, especially in dry areas.",
    count: 0,
    riskLevel: "Moderate"
  },
  "Plane Tree": {
    description: "Plane Trees release fine airborne pollen during springtime.",
    count: 0,
    riskLevel: "Moderate"
  },
  "Silver Birch": {
    description: "Silver Birch pollen is highly allergenic even in small doses.",
    count: 0,
    riskLevel: "High"
  },
  "Bermuda Grass": {
    description: "Bermuda Grass pollen can cause allergic symptoms in warmer months.",
    count: 0,
    riskLevel: "Moderate"
  },
  "Privet": {
    description: "Privet shrubs release summer pollen that worsens asthma and hay fever.",
    count: 0,
    riskLevel: "Moderate"
  },
  "Timothy Grass": {
    description: "Timothy Grass is highly allergenic and pollinates in late spring.",
    count: 0,
    riskLevel: "High"
  },
  "Elm": {
    description: "Elm trees produce pollen in early spring. Their pollen is a mild allergen.",
    count: 0,
    riskLevel: "Low"
  },
  "Olive Tree": {
    description: "Olive Tree pollen is a major allergen in Mediterranean climates.",
    count: 0,
    riskLevel: "High"
  },
  "Paspalum Grass": {
    description: "Paspalum releases pollen in warmer months, affecting many grass-allergy sufferers.",
    count: 0,
    riskLevel: "Moderate"
  },
  "Cocksfoot Grass": {
    description: "Cocksfoot Grass pollinates heavily during late spring and early summer.",
    count: 0,
    riskLevel: "Moderate"
  },
  "Ragweed": {
    description: "Ragweed pollen is extremely allergenic and widespread in late summer.",
    count: 0,
    riskLevel: "High"
  }
};



const getRiskLabel = (level) => {
  if (level === 0) return 'VERY LOW';
  if (level === 1) return 'LOW';
  if (level === 2) return 'MODERATE';
  if (level === 3) return 'HIGH';
  return '-';
};

const KnowYourArea = () => {
  const [userCoords, setUserCoords] = useState(null);
  const [suburbList, setSuburbList] = useState([]);
  const [matchedSuburb, setMatchedSuburb] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [plantPercent, setPlantPercent] = useState(null);
  const [uniquePlants, setUniquePlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const wrapperRef = useRef(null);
  const [floorInput, setFloorInput] = useState('');
  const [showResultCard, setShowResultCard] = useState(false);
  const [floorMessage, setFloorMessage] = useState('');

  useEffect(() => {
    Papa.parse('/data/suburb_plant_density.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const valid = results.data.filter(row => row.latitude && row.longitude);
        setSuburbList(valid);
      },
    });
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      const filtered = suburbList.filter((item) =>
        item.suburb?.toLowerCase().startsWith(search.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
    } else {
      setFilteredSuggestions([]);
    }
  }, [search, suburbList]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn('Geolocation error:', err);
          alert('We couldn’t access your location. Please enable it in browser settings or search manually.');
        },
        { timeout: 10000 }
      );
    } else {
      alert('Geolocation not supported by your device or browser.');
    }
  }, []);
  

  useEffect(() => {
    if (userCoords && suburbList.length && !matchedSuburb) {
      const nearest = findNearestSuburb(userCoords.lat, userCoords.lng, suburbList);
      setMatchedSuburb(nearest);
    }
  }, [userCoords, suburbList]);

  useEffect(() => {
    if (matchedSuburb) {
      fetch('https://pollen-predictor.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suburb: matchedSuburb.suburb,
          latitude: parseFloat(matchedSuburb.latitude),
          longitude: parseFloat(matchedSuburb.longitude),
        }),
      })
        .then((res) => res.json())
        .then((data) => setApiData(data))
        .catch(() => setApiData(null));
    }
  }, [matchedSuburb]);

  useEffect(() => {
    if (matchedSuburb) {
      Papa.parse('/data/All_Plants_Victoria_With_Suburbs.csv', {
        download: true,
        header: true,
        complete: (results) => {
          const matchedKey = Object.keys(results.data[0] || {}).find(k =>
            k.replace(/\r|\n|\t|\u200B|\u00A0/g, '').trim().toLowerCase() === 'matched_postcode'
          );

          const targetPostcode = String(matchedSuburb.postcode).replace(/\s/g, '');
          const plantCounts = {};

          const filtered = results.data.filter(row =>
            String(row[matchedKey]).replace(/\s/g, '') === targetPostcode
          );

          filtered.forEach(row => {
            const plant = row['Common Name'];
            if (plant && plantImageMap[plant]) {
              plantCounts[plant] = (plantCounts[plant] || 0) + 1;
            }
          });

          const sortedPlants = Object.entries(plantCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, count]) => ({
              name,
              count,
              img: plantImages[`../assets/plants/${plantImageMap[name]}.jpg`]?.default
            }));

          sortedPlants.forEach(p => {
            if (plantDetails[p.name]) {
              plantDetails[p.name].count = p.count;
            }
          });

          setUniquePlants(sortedPlants);
          setPlantPercent(results.data.length > 0 ? ((filtered.length / results.data.length) * 100).toFixed(1) : '0.0');
        }
      });
    }
  }, [matchedSuburb]);

  const findNearestSuburb = (lat1, lon1, list) => {
    let minDist = Infinity;
    let nearest = null;
    list.forEach((row) => {
      const d = getDistance(lat1, lon1, parseFloat(row.latitude), parseFloat(row.longitude));
      if (d < minDist) {
        minDist = d;
        nearest = row;
      }
    });
    return nearest;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSuggestionClick = (item) => {
    setMatchedSuburb(item);
    setSearch('');
    setFilteredSuggestions([]);
  };
  
  const estimatePollenHeight = (windSpeed) => {
    if (windSpeed < 1.5) return 3;
    if (windSpeed < 3) return 7;
    if (windSpeed < 5) return 15;
    if (windSpeed < 8) return 30;
    return 60;
  };
  
  
  const handleFloorCheck = () => {
    const floor = parseInt(floorInput);
    if (isNaN(floor) || floor < 1 || floor > 10) {
      setFloorMessage("Please enter a valid floor number between 1 and 10.");
      setShowResultCard(true);
      return;
    }
  
    if (apiData?.features_used?.off_season) {
      setFloorMessage("It's currently off-season for pollen. Risk is minimal regardless of floor.");
    } else {
      const height = floor * 3;
      const windSpeed = parseFloat(apiData?.features_used?.wind_speed || 0);
      const pollenReach = estimatePollenHeight(windSpeed);
      const riskLevel = apiData?.predicted_pollen_risk;
  
      if (riskLevel === 0 || riskLevel === 1) {
        setFloorMessage(`Pollen risk is currently low. Enjoy fresh air at any height. Keep an eye on updates if you're sensitive.`);
      } else if (height <= pollenReach) {
        setFloorMessage(`You live around ${height}m high. Pollen may reach your floor. Keep windows shut during windy hours.`);
      } else {
        setFloorMessage(`At ${height}m high, you're likely above pollen reach. Enjoy fresh air, but stay cautious during storms.`);
      }
    }
  
    setShowResultCard(true);
  };
  
  

  const pollenRisk = getRiskLabel(apiData?.predicted_pollen_risk);
  const radarImage =
    apiData?.predicted_pollen_risk === 1 ? lowRiskRadar :
    apiData?.predicted_pollen_risk === 2 ? mediumRiskRadar :
    apiData?.predicted_pollen_risk === 3 ? highRiskRadar : null;

  

    return (
      <div className="know-area-wrapper" ref={wrapperRef}>
        <div className="know-card">
    
          {/*  Mobile Search Bar (top of page) */}
          <div className="search-wrapper mobile-search">
            <input
              type="text"
              placeholder="Enter Suburb Name"
              className="search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {filteredSuggestions.length > 0 && (
              <ul className="suggestions-list absolute-suggestions">
                {filteredSuggestions.map((item, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(item)}>
                    {item.suburb} ({item.postcode})
                  </li>
                ))}
              </ul>
            )}
          </div>
    
          <div className="dashboard-grid">
    
            {/* LEFT COLUMN */}
            <div className="left-column">
              <div className="card-box">
                <h1 className="pollen-risk-label">{pollenRisk}</h1>
                <p className="card-subtitle">Pollen Risk in your Area</p>
              </div>
              <div className="card-box metrics-box">
                <div className="icon-card"><img src={tempIcon} /><p>Temp</p><span>{apiData?.features_used?.temperature ?? '--'}°C</span></div>
                <div className="icon-card"><img src={windIcon} /><p>Wind</p><span>{apiData?.features_used?.wind_speed ?? '--'} km/h</span></div>
                <div className="icon-card"><img src={humidityIcon} /><p>Humidity</p><span>{apiData?.features_used?.relative_humidity ?? '--'}%</span></div>
                <div className="icon-card"><img src={plantIcon} /><p>Pollen Density</p><span>{plantPercent ?? '--'}%</span></div>
              </div>
              <div className="card-stack">
                <div className="card-box">
                  <p className="suburb-name">{matchedSuburb?.suburb ?? '-'}</p>
                  <p className="current-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </p>
                  <p className="current-date">{new Date().toDateString()}</p>
                </div>
                <div className="card-box">
                  <p className="season-value"><strong>{apiData?.features_used?.off_season ? 'ON' : 'OFF'}</strong></p>
                  <p className="card-subtitle"><strong>Season</strong></p>
                </div>
              </div>
            </div>
    
            {/* MIDDLE COLUMN */}
            <div className="middle-column">
              
              {/*  Desktop Search Bar (in middle column) */}
              <div className="search-wrapper desktop-search">
                <input
                  type="text"
                  placeholder="Enter Suburb Name"
                  className="search-box"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {filteredSuggestions.length > 0 && (
                  <ul className="suggestions-list absolute-suggestions">
                    {filteredSuggestions.map((item, index) => (
                      <li key={index} onClick={() => handleSuggestionClick(item)}>
                        {item.suburb} ({item.postcode})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
    
              <div className="card-box2" style={{ maxHeight: '300px' }}>
                <h3 className="centered-title">5-Day Pollen Risk Forecast</h3>
                <Line
                  data={{
                    labels: ['Today', 'Tue', 'Wed', 'Thu', 'Fri'],
                    datasets: [{
                      data: [1, 1, 2, 1, 0],
                      borderColor: 'rgb(183, 180, 180)',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      tension: 0.3,
                      fill: true,
                      pointRadius: 5,
                    }],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false }},
                    scales: {
                      y: {
                        min: 0,
                        max: 3,
                        ticks: {
                          stepSize: 1,
                          callback: (val) => ['Low', 'Moderate', 'High'][val],
                          color: '#fff',
                        },
                        grid: { color: '#444' },
                        border: { color: '#fff', display: true },
                      },
                      x: {
                        offset: true,
                        ticks: { color: '#fff', padding: 12 },
                        grid: { color: '#444' },
                        border: { color: '#fff', display: true },
                      },
                    }
                  }}
                />
              </div>
    
              <div className="card-box1">
                <h3>Common pollen plants in your area</h3>
                <div className="plant-gallery">
                  {uniquePlants.map((p, i) => (
                    <div
                      className="local-plant-box"
                      key={i}
                      onClick={() => setSelectedPlant(p.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={p.img} alt={p.name} />
                      <p className="plant-name">{p.name}</p>
                    </div>
                  ))}
                </div>
                <p className="plant-gallery-note">Click on each image to know more</p>
    
                {selectedPlant && plantDetails[selectedPlant] && (
                  <div className="plant-modal-overlay">
                    <div className="plant-modal-card">
                      <button className="plant-close-btn" onClick={() => setSelectedPlant(null)}>✖</button>
                      <img src={uniquePlants.find(p => p.name === selectedPlant)?.img} alt={selectedPlant} className="plant-modal-img" />
                      <h2>{selectedPlant}</h2>
                      <p className="plant-modal-desc">{plantDetails[selectedPlant].description}</p>
                      <div className="plant-modal-info">
                        <p><strong>Nearby Count:</strong> {plantDetails[selectedPlant].count}</p>
                        <p><strong>Pollen Risk:</strong> <span className={`risk-tag ${plantDetails[selectedPlant].riskLevel.toLowerCase()}`}>{plantDetails[selectedPlant].riskLevel}</span></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
    
            {/* RIGHT COLUMN */}
            <div className="right-column">
              <div className="horizontal-row">
                <div className="card-box small-card">
                  <div className="precaution-wrapper">
                    <img
                      src={precautionTips[apiData?.predicted_pollen_risk]?.icon}
                      alt="risk icon"
                      className="precaution-icon"
                    />
                    <p className="precaution-text">
                      {precautionTips[apiData?.predicted_pollen_risk]?.text || "Checking pollen levels..."}
                    </p>
                  </div>
                </div>
    
                <div className="card-box small-card">
                  <h4 className="symptom-header">Explore common allergy symptoms and learn how to manage them</h4>
                  <Link to="/symptoms"><button className="risk-btn">Click Here</button></Link>
                </div>
              </div>
    
              
              <div className={`card-box floor-flip-card ${showResultCard ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flip-face front-face">
                <h3 className="floor-title">Will pollen reach your floor?</h3>
<p className="floor-hint">
  Enter your floor number (1–10) and we’ll check how far pollen can travel today based on wind conditions.<br />
  <strong>Note:</strong> Pollen usually doesn’t reach above the 10th floor.
</p>


                  <div className="floor-check-inline">
                    <input
                      type="number"
                      value={floorInput}
                      onChange={(e) => setFloorInput(e.target.value)}
                      className="floor-input"
                      placeholder="Enter floor number"
                      max={10}
                    />
                    <button className="go-btn" onClick={handleFloorCheck}>Check</button>
                  </div>

                </div>


                {/* Back */}
                <div className="flip-face back-face split-back">
                  <div className="back-left">
                    <Lottie animationData={buildingAnim} loop className="illustration-large" />
                  </div>
                  <div className="back-right">
                    <p className="floor-message">{floorMessage}</p>
                    <button className="go-btn" onClick={() => setShowResultCard(false)}>Back</button>
                  </div>
                </div>


              </div>
              
              <div className="card-box">
                <p className="alexa-text">
                Stay ahead of allergies — just say, <strong>“Alexa, what’s the pollen index today?”</strong>
                </p>
                <button className="risk-btn1" onClick={() => window.location.href = "/pollen_watch"}>
                  Set Up with Alexa
                </button>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    );
    };

export default KnowYourArea;
