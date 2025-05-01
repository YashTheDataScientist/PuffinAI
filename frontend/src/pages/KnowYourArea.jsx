import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './KnowYourArea.css';
import tempIcon from '../assets/temperature.png';
import windIcon from '../assets/wind.png';
import humidityIcon from '../assets/humidity.png';
import plantIcon from '../assets/plants.png';
import lowRiskRadar from '../assets/radar/lowrisk.png';
import mediumRiskRadar from '../assets/radar/mediumrisk.png';
import highRiskRadar from '../assets/radar/highrisk.png';
import symptomsImg from '../assets/symptoms.svg';



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

const getRiskLabel = (level) => {
  if (level === 0) return 'VERY LOW';
  if (level === 1) return 'LOW';
  if (level === 2) return 'MODERATE';
  if (level === 3) return 'HIGH';
  return 'UNKNOWN';
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

  useEffect(() => {
    Papa.parse('/src/assets/suburb_plant_density.csv', {
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
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.warn('Geolocation error:', err)
    );
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
      Papa.parse('/src/assets/All_Plants_Victoria_With_suburbs.csv', {
        download: true,
        header: true,
        complete: (results) => {
          const matchedKey = Object.keys(results.data[0] || {}).find(k =>
            k.replace(/[\r\n\t\u200B\u00A0]/g, '').trim().toLowerCase() === 'matched_postcode'
          );

          const rows = results.data.filter(row => row[matchedKey]);
          const targetPostcode = String(matchedSuburb.postcode).replace(/\s/g, '');
          let count = 0;
          const plants = new Set();

          rows.forEach((row) => {
            if (String(row[matchedKey]).replace(/\s/g, '') === targetPostcode) {
              count++;
              const plant = row['Common Name'];
              if (plant && plantImageMap[plant]) plants.add(plant);
            }
          });

          setPlantPercent(rows.length > 0 ? ((count / rows.length) * 100).toFixed(1) : '0.0');
          setUniquePlants([...plants].slice(0, 3));
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

  const currentLocation = matchedSuburb ? `${matchedSuburb.suburb}, ${matchedSuburb.postcode}` : 'Detecting...';
  const pollenRisk = getRiskLabel(apiData?.predicted_pollen_risk);
  let radarImage = null;
    if (apiData?.predicted_pollen_risk === 1) radarImage = lowRiskRadar;
    if (apiData?.predicted_pollen_risk === 2) radarImage = mediumRiskRadar;
    if (apiData?.predicted_pollen_risk === 3) radarImage = highRiskRadar;


    const plants = uniquePlants.map(name => {
        const cleanName = name?.replace(/[\r\n\t\u200B\u00A0]/g, '').trim();
        const path = `../assets/plants/${plantImageMap[cleanName]}.jpg`;
        return { name: cleanName, img: plantImages[path]?.default };
      });
      

  return (
    <div className="know-area-wrapper">
      <div className="know-card">
        <div className="card-layout">
  
          {/* LEFT COLUMN */}
          <div className="left-column">
            {/* Search + Location */}
            <div className="card-box">
              <input
                type="text"
                placeholder="Search another location"
                className="search-box"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filteredSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {filteredSuggestions.map((item, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(item)}>
                      {item.suburb} ({item.postcode})
                    </li>
                  ))}
                </ul>
              )}
              <p className="location-label">Current Location</p>
              <h3 className="location-value">{currentLocation}</h3>
            </div>
  
            {/* Radar Chart */}
            <div className="card-box">
              <p style={{ color: '#111', fontWeight: '600', fontSize: '1rem' }}>Pollen Risk in your Area</p>
              {apiData?.predicted_pollen_risk && (
                <img
                  src={{
                    1: lowRiskRadar,
                    2: mediumRiskRadar,
                    3: highRiskRadar,
                  }[apiData.predicted_pollen_risk]}
                  alt="Radar Risk"
                  className="radar-image"
                />
              )}
            </div>
  
            {/* Button */}
            <div className="card-box">
            <p style={{ color: '#111', fontWeight: '600', fontSize: '1rem' }}>To see pollen risk from a bigger picture</p>
              <button className="risk-btn">Click Here</button>
            </div>
          </div>
  
          {/* CENTER COLUMN */}
          <div className="center-column card-box">
            <div className="icon-card"><img src={tempIcon} /><p>Temp:</p><span>{apiData?.features_used?.temperature ?? '--'}°C</span></div>
            <div className="icon-card"><img src={windIcon} /><p>Wind:</p><span>{apiData?.features_used?.wind_speed ?? '--'} km/h</span></div>
            <div className="icon-card"><img src={humidityIcon} /><p>Humidity:</p><span>{apiData?.features_used?.relative_humidity ?? '--'}%</span></div>
            <div className="icon-card"><img src={plantIcon} /><p>Pollen Plant<br />Density:</p><span>{plantPercent ?? '--'}%</span></div>
          </div>
  
          {/* RIGHT COLUMN */}
          <div className="right-column">
            {/* Plant Gallery */}
            <div className="right-top card-box">
            <p style={{ color: '#111', fontWeight: '600', fontSize: '1rem' }}>Common pollen plants in your area</p>
              <div className="plant-gallery">
        {plants.map((p, i) => (
            <div className="plant-box" key={i}>
            <img src={p.img} alt={p.name.trim()} />
            <p className="plant-name">{p.name}</p>

            </div>
        ))}
        </div>



        <p style={{ color: '#111', fontWeight: '600', fontSize: '1rem' }}>Find out more info about these plants</p>
              <button className="risk-btn">Click Here</button>
            </div>
  
            {/* Floor Input */}
            <div className="right-top card-box">
            <p style={{ color: '#111', fontWeight: '600', fontSize: '1rem' }}>Want to understand how does pollen effect height wise,<br />please enter your floor number below</p>
              <input type="number" placeholder="Enter floor number" className="floor-input" />
              <button className="coming-soon-btn">Coming Soon</button>

            </div>
  
            {/* Allergic Symptoms */}
            <div className="right-bottom card-box">
            <img src={symptomsImg} alt="Allergy symptoms" className="illustration" />

            <p style={{ color: '#111', fontWeight: '600', fontSize: '1rem' }}>To understand<br />common Allergic symptoms</p>
              <button className="risk-btn">Click Here</button>
            </div>
  
            {/* Precautions */}
            <div className="right-bottom card-box">
            <p style={{ color: '#111', fontWeight: '600', fontSize: '1rem' }}>To Learn more<br />about the precautions</p>
              <button className="risk-btn">Click Here</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default KnowYourArea;


