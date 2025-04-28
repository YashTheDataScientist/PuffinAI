import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Allergyplantpage.css';
import L from 'leaflet';
import Stack from '../components/Stack';
import { useMap } from 'react-leaflet';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Masonry from '../components/Masonry';
import CircularGallery from '../components/CircularGallery';
import PlantCarousel from '../components/PlantCarousel';
import SplineRobotViewer from '../components/robot';
import People from '../components/People';

const gradientAnimationStyle = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// 添加样式到文档
const styleSheet = document.createElement("style");
styleSheet.innerText = gradientAnimationStyle;
document.head.appendChild(styleSheet);

function FlyToCenter({ center }) {
    const map = useMap();
  
    useEffect(() => {
      if (center) {
        map.flyTo(center, map.getZoom(), { duration: 1 });
      }
    }, [center, map]);
  
    return null;
  }
  
// Icon configurations
const iconMap = {
    'Platanus': new L.Icon({
      iconUrl: '/icons/Platanus.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    }),
    'Betulaceae': new L.Icon({
      iconUrl: '/icons/Betulaceae.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    }),
    'Perennial Rye-grass': new L.Icon({
      iconUrl: '/icons/Perennial Rye-grass.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    }),
    'Allocasuarina littoralis': new L.Icon({
      iconUrl: '/icons/Allocasuarina littoralis.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    })
  };
  
  const userLocationIcon = new L.Icon({
    iconUrl: '/icons/locationmarker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
const speciesImages = {
    'Platanus': [
      '/images/platanus1.jpg',
      '/images/platanus2.jpg',
      '/images/platanus3.jpg'
    ],
    'Betulaceae': [
      '/images/betulaceae1.jpg',
      '/images/betulaceae2.jpg',
      '/images/betulaceae3.jpg'
    ],
    'Perennial Rye-grass': [
      '/images/grass1.jpg',
      '/images/grass2.jpg',
      '/images/grass3.jpg'
    ],
    'Allocasuarina littoralis': [
      '/images/littoralis1.jpg',
      '/images/littoralis2.jpg',
      '/images/littoralis3.jpg'
    ]
  };
  
// Plant information data
const plantInfo = [
  {
    species: 'Bermuda Grass',
    image: '/images/platanus.jpg',
    pollenLevel: 'High',
  },
  {
    species: 'Betulaceae',
    image: '/images/betulaceae.jpg',
    pollenLevel: 'Medium',

  },
  {
    species: 'Perennial Rye-grass',
    image: '/images/grass.jpg',
    pollenLevel: 'Very High',

  },
  {
    species: 'Allocasuarina littoralis',
    image: '/images/littoralis.jpg',
    pollenLevel: 'Medium',

  }
];

const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (contact@yourdomain.com)'
          }
        }
      );
      const data = await response.json();
      return data.address?.suburb || data.address?.city_district || 'Unknown';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };


  function StatsSection({ markers }) {
    const highRiskLevels = ['High', 'Very High'];
    const highRiskMarkers = markers.filter(m => highRiskLevels.includes(getPollenLevel(m.species)));
    const MidRiskLevels = ['Medium'];
    const MidRiskMarkers = markers.filter(m => MidRiskLevels.includes(getPollenLevel(m.species)));
    
    const [selectedRiskLevel, setSelectedRiskLevel] = useState('auto'); // 'auto', 'high', 'medium', 'low'
    

    const highRiskPercentage = markers.length > 0 
      ? Math.round((highRiskMarkers.length / markers.length) * 100) 
      : 0;
    

    const getCurrentRiskLevel = () => {
      if (highRiskPercentage > 70) return 'high';
      if (highRiskPercentage > 40) return 'medium';
      return 'low';
    };


    const displayRiskLevel = selectedRiskLevel === 'auto' ? getCurrentRiskLevel() : selectedRiskLevel;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', padding: '50px', background: '#f4f7f2', borderRadius: '10px' }}>
          <StatCard label="🚫Number of High Risk Plants" value={highRiskMarkers.length} />
          <StatCard label="⚠️Number of Medium Risk Plants" value={MidRiskMarkers.length} />
          <StatCard label="🌱Total Number of Allergenic Plants" value={markers.length} />
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginTop: '30px', 
          padding: '20px', 
          background: '#fff', 
          borderRadius: '10px',
        }}>
<div style={{ display: 'flex', gap: '30px', padding: '60px' }}>

<div
    style={{
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      backgroundColor: '#4caf50',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '1rem',
    }}
  >
    <div style={{ fontSize: '1.2rem' }}>Current Risk</div>
    <div style={{ fontSize: '1.6rem' }}>Low</div>
    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 'normal' }}>
      Off-season, pollen levels<br />are typically low
    </div>
  </div>
  {/* Historical High-Risk Percentage */}
  <div style={{ width: '200px', textAlign: 'center' }}>
    <CircularProgressbar
      value={highRiskPercentage}
      text={`${highRiskPercentage}%`}
      styles={buildStyles({
        pathColor:
          highRiskPercentage > 70
            ? '#ff4d4d'
            : highRiskPercentage > 40
            ? '#ffa64d'
            : '#4caf50',
        textColor: '#333',
        trailColor: '#d6d6d6',
        textSize: '16px',
        marginRight: '30px',
      })}
    />
    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px' }}>
      Historical high-risk level
    </p>
  </div>

  {/* Current Risk: Low Circular Badge */}

</div>

          
          <div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>
              The proportion of high-risk pollen in Victoria
            </h3>
            <p style={{ color: '#666', maxWidth: '300px' }}>
              {highRiskPercentage > 70
                ? "⚠️ This area has a high concentration of allergenic plants during peak season (Sep–Dec). However, since it's currently off-season, pollen levels are likely low. No immediate concern, but it's good to stay aware."
                : highRiskPercentage > 40
                  ? "⚠️ This area usually sees a moderate amount of allergenic plants during spring (Sep–Dec). Right now, it's off-season—so you're unlikely to experience symptoms, but keep it in mind for later months."
                  : "✅ This area generally has low pollen activity, especially outside spring (Sep–Dec). You can safely enjoy the outdoors right now."}
            </p>
          </div>

          

        </div>

        <div style={{
          marginTop: '30px',
          padding: '25px',
          background: 'linear-gradient(135deg,rgb(161, 215, 201) 0%,rgb(174, 207, 240) 100%)',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: '#2c3e50',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              What Should I Do?
            </h3>
            <div style={{
              display: 'flex',
              gap: '10px',
              background: '#ffffff40',
              padding: '5px',
              borderRadius: '8px'
            }}>
              <button
                onClick={() => setSelectedRiskLevel('auto')}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: selectedRiskLevel === 'auto' ? '#ffffff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: selectedRiskLevel === 'auto' ? '#2c3e50' : '#4a5568',
                  fontWeight: selectedRiskLevel === 'auto' ? '600' : '400'
                }}
              >
                Auto
              </button>
              <button
                onClick={() => setSelectedRiskLevel('high')}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: selectedRiskLevel === 'high' ? '#ffffff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: selectedRiskLevel === 'high' ? '#2c3e50' : '#4a5568',
                  fontWeight: selectedRiskLevel === 'high' ? '600' : '400'
                }}
              >
                High Risk
              </button>
              <button
                onClick={() => setSelectedRiskLevel('medium')}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: selectedRiskLevel === 'medium' ? '#ffffff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: selectedRiskLevel === 'medium' ? '#2c3e50' : '#4a5568',
                  fontWeight: selectedRiskLevel === 'medium' ? '600' : '400'
                }}
              >
                Medium Risk
              </button>
              <button
                onClick={() => setSelectedRiskLevel('low')}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: selectedRiskLevel === 'low' ? '#ffffff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: selectedRiskLevel === 'low' ? '#2c3e50' : '#4a5568',
                  fontWeight: selectedRiskLevel === 'low' ? '600' : '400'
                }}
              >
                Low Risk
              </button>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {displayRiskLevel === 'high' && (
              <div style={{
                flex: '1',
                minWidth: '250px',
                maxWidth: '1000px',
                padding: '20px',
                background: 'rgba(255, 245, 245, 0.9)',
                borderRadius: '12px',
                border: '1px solid #ffe3e3',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h4 style={{ color: '#e53e3e', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>🚫</span> High Risk Precautions
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  margin: 0,
                  color: '#4a5568'
                }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#e53e3e' }}>•</span>
                    Wear a N95 mask when outdoors
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#e53e3e' }}>•</span>
                    Avoid outdoor activities between 5am-10am
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#e53e3e' }}>•</span>
                    Use HEPA air purifiers indoors
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#e53e3e' }}>•</span>
                    Keep windows closed during peak pollen times
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#e53e3e' }}>•</span>
                    Take prescribed allergy medication
                  </li>
                </ul>
              </div>
            )}

            {displayRiskLevel === 'medium' && (
              <div style={{
                flex: '1',
                minWidth: '250px',
                padding: '20px',
                background: 'rgba(255, 250, 240, 0.9)',
                borderRadius: '12px',
                border: '1px solid #fbd38d',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h4 style={{ color: '#d97706', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>⚠️</span> Medium Risk Precautions
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  margin: 0,
                  color: '#4a5568'
                }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#d97706' }}>•</span>
                    Monitor your allergy symptoms
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#d97706' }}>•</span>
                    Carry allergy medication with you
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#d97706' }}>•</span>
                    Change clothes after outdoor activities
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#d97706' }}>•</span>
                    Wear sunglasses when outdoors
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#d97706' }}>•</span>
                    Check daily pollen forecast
                  </li>
                </ul>
              </div>
            )}

            {displayRiskLevel === 'low' && (
              <div style={{
                flex: '1',
                minWidth: '250px',
                padding: '20px',
                background: 'rgba(240, 255, 244, 0.9)',
                borderRadius: '12px',
                border: '1px solid #c6f6d5',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h4 style={{ color: '#38a169', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>✅</span> Low Risk Guidelines
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  margin: 0,
                  color: '#4a5568'
                }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#38a169' }}>•</span>
                    Enjoy outdoor activities as usual
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#38a169' }}>•</span>
                    Keep monitoring pollen forecasts
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#38a169' }}>•</span>
                    Have basic allergy medication ready
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#38a169' }}>•</span>
                    Maintain good ventilation
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#38a169' }}>•</span>
                    Stay informed about local pollen levels
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  function StatCard({ label, value }) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '36px', color: '#4caf50', fontWeight: 'bold' }}>
          <CountUp end={value} duration={1.5} />
        </div>
        <div style={{ fontSize: '16px', marginTop: '5px', color: '#333333' }}>{label}</div>
      </div>
    );
  }
  
  function getPollenLevel(species) {
    const match = plantInfo.find(p => 
      p.species.toLowerCase() === species.toLowerCase() || 
      species.toLowerCase().includes(p.species.toLowerCase())
    );
    return match?.pollenLevel || 'Unknown';
  }

export default function AllergyPlantPage() {
    const [allPlants, setAllPlants] = useState([]);
    const [selectedSuburb, setSelectedSuburb] = useState('');
    const [suburbList, setSuburbList] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([-37.8136, 144.9631]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredSuburbs, setFilteredSuburbs] = useState([]);
    const [highlightedPlant, setHighlightedPlant] = useState(null);

  
    const handleClickOutside = (e) => {
      if (e.target.closest('[data-popup]') === null) {
        setSelectedPlant(null);
      }
    };

    useEffect(() => {
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handlePlantClick = (plant) => {
      setSelectedPlant(plant);
      // 找到该植物在当前suburb的第一个位置
      const plantLocation = allPlants.find(p => 
        p.species === plant.species && p.suburb === selectedSuburb
      );
      if (plantLocation) {
        setHighlightedPlant(plantLocation);
        setMapCenter([plantLocation.lat, plantLocation.lng]);
      }
    };


    const getCurrentSuburbPlants = () => {
        if (!selectedSuburb) return [];
        const suburbPlants = allPlants.filter(p => p.suburb === selectedSuburb);
        const uniqueSpecies = [...new Set(suburbPlants.map(p => p.species))];
        return plantInfo.filter(plant => uniqueSpecies.includes(plant.species));
    };

    useEffect(() => {
        fetch('/data/plant.json')
          .then(res => res.json())
          .then(data => {
            const cleaned = data.map(item => ({
              species: item.scientificName,
              lat: item.latitude,
              lng: item.longitude,
              suburb: item.suburb
            }));
            setAllPlants(cleaned);
            setSuburbList([...new Set(cleaned.map(p => p.suburb))].sort());
          });
      }, []);

      useEffect(() => {
        if (!selectedSuburb || allPlants.length === 0) return;
      
        const markersInSuburb = allPlants.filter(p => p.suburb === selectedSuburb);
        if (markersInSuburb.length === 0) return;
      
        const avgLat = markersInSuburb.reduce((sum, m) => sum + m.lat, 0) / markersInSuburb.length;
        const avgLng = markersInSuburb.reduce((sum, m) => sum + m.lng, 0) / markersInSuburb.length;
      
        setMapCenter([avgLat, avgLng]);
      }, [selectedSuburb, allPlants]);

      useEffect(() => {
        if (suburbList.length === 0) return;
      
        if (!navigator.geolocation) {
          console.log('Geolocation not supported');
          return;
        }
      
        const handleSuccess = async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setUserLocation({ lat: latitude, lng: longitude });
      
          const suburb = await reverseGeocode(latitude, longitude);
          console.log('Detected suburb:', suburb);
          const matchedSuburb = suburbList.find(s => s.toLowerCase().includes(suburb.toLowerCase()));
            if (matchedSuburb) {
            setSelectedSuburb(matchedSuburb);
            } else {
            console.log('Suburb not found in list:', suburb);
            }

        };
      
        const handleError = (err) => {
          console.log('Location error:', err);
        };
      
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      }, [suburbList]);
      
    const filteredMarkers = selectedSuburb
    ? allPlants.filter(p => p.suburb === selectedSuburb)
    : [];

    useEffect(() => {
        if (searchInput.trim() === '') {
            setFilteredSuburbs(suburbList);
            return;
        }
        const searchTerm = searchInput.toLowerCase().replace(/\s+/g, '');
        const filtered = suburbList.filter(suburb => 
            suburb.toLowerCase().replace(/\s+/g, '').includes(searchTerm)
        );
        setFilteredSuburbs(filtered);
    }, [searchInput, suburbList]);

    return (
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          padding: '10px',
          boxSizing: 'border-box',
          marginTop: '30px'
        }}>
          <div style={{
            background: 'linear-gradient(-45deg,rgb(72, 170, 72),rgb(163, 209, 99),rgb(16, 175, 149))',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 10s ease infinite',
            color: 'white',
            
            padding: '30px',
            borderRadius: '10px',
            
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              marginBottom: '15px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              Victoria Pollen Allergy Map
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              maxWidth: '800px', 
              margin: '0 auto',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              Explore and monitor allergenic plants across Victoria. This interactive map helps you identify high-risk pollen areas, 
              track medium-risk zones, and understand the distribution of allergenic plants in your neighborhood. 
              Stay informed about potential allergy triggers and take necessary precautions.
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            flex: 1, 
            width: '100%', 
            marginBottom: '20px',
            minHeight: '500px'
          }}>
            <div style={{ 
              flex: 2, 
              marginRight: '10px', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '500px'
            }}>
              <div style={{ marginBottom: '10px', color: '#000' }}>

                <label><strong>Search suburb: </strong></label>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter the suburb name..."
                    style={{ 
                      padding: '5px 10px',
                      width: '200px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                  {searchInput && filteredSuburbs.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1000
                    }}>
                      {filteredSuburbs.map((suburb, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedSuburb(suburb);
                            setSearchInput('');
                          }}
                          style={{
                            padding: '8px 10px',
                            cursor: 'pointer',
                            color: '#333333',
                            hover: { backgroundColor: '#f0f0f0' }
                          }}
                        >
                          {suburb}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ 
                  flex: 1, 
                  width: '100%',
                  minHeight: '450px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <FlyToCenter center={mapCenter} />
                <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                    <Popup>You Are Here</Popup>
                  </Marker>
                )}

                {filteredMarkers.map((item, index) => (
                  <Marker 
                    key={index} 
                    position={[item.lat, item.lng]} 
                    icon={iconMap[item.species] || iconMap['Platanus']}
                    opacity={highlightedPlant && highlightedPlant.species === item.species ? 1 : 0.6}
                  >
                    <Popup minWidth={250}>
                      <div>
                        <strong>Species:</strong> {item.species} <br />
                        <strong>Suburb:</strong> {item.suburb} <br />
                        <Stack direction="horizontal" gap="8px" wrap>
                          {(speciesImages[item.species] || []).map((src, i) => (
                            <img key={i} src={src} alt={`${item.species}-${i}`} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                          ))}
                        </Stack>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
    
            <div style={{ 
              flex: 1, 
              padding: '15px', 
              backgroundColor: '#f3faf0', 
              borderRadius: '8px', 
              overflowY: 'auto', 
              height: '100%',
              minHeight: '500px'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#213622' }}>
                {selectedSuburb ? `Major Allergy Plants in ${selectedSuburb}` : 'Select a suburb to view plants'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                {getCurrentSuburbPlants().map((plant, index) => (
                  <div key={index} style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '10px', 
                    cursor: 'pointer', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                    transition: 'transform 0.2s',
                    opacity: selectedSuburb ? 1 : 0.5
                  }} onClick={() => handlePlantClick(plant)}>
                    <img src={plant.image} alt={plant.species} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                      <img src={plant.icon} alt="icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                      <span style={{ fontWeight: '500', color: '#333333' }}>{plant.species}</span>
                    </div>
                  </div>
                ))}
                {!selectedSuburb && (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#666'
                  }}>
                    Please select a suburb to view the allergenic plants in that area
                  </div>
                )}
                {selectedSuburb && getCurrentSuburbPlants().length === 0 && (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#666'
                  }}>
                    No allergenic plants found in this suburb
                  </div>
                )}
              </div>
    
              {selectedPlant && (
                <div className="plant-info-popup" data-popup="true">
                  <button className="popup-close-button" onClick={() => setSelectedPlant(null)}>&times;</button>
                  <h3 className="popup-title">{selectedPlant.species}</h3>
                  <div className="popup-content">
                    <p><strong>Pollen Level:</strong> {selectedPlant.pollenLevel}</p>
                    <p><strong>Description:</strong> {selectedPlant.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
    
          <div className="stats-section">
            <StatsSection markers={filteredMarkers} />
          </div>

          <div className="gallery-sections">
            {/* <div className="masonry-section">
              <h2 className="section-title">Plant Masonry Gallery</h2>
              <Masonry data={[
                {
                  id: 1,
                  image: '/images/grass.jpg',
                  title: 'Perennial Rye-grass',
                  description: 'Common allergen, pollen season: Sep-Dec',
                  height: 300
                },
                {
                  id: 2,
                  image: '/images/grass1.jpg',
                  title: 'Olive Tree',
                  description: 'Strong allergen, pollen season: Oct-Dec',
                  height: 350
                },
                {
                  id: 3,
                  image: '/images/grass3.jpg',
                  title: 'Cypress',
                  description: 'Moderate allergen, pollen season: Aug-Oct',
                  height: 280
                },
                {
                  id: 4,
                  image: '/images/littoralis.jpg',
                  title: 'Plane Tree',
                  description: 'Strong allergen, pollen season: Sep-Nov',
                  height: 320
                },
                {
                  id: 5,
                  image: '/images/littoralis1.jpg',
                  title: 'Plane Tree',
                  description: 'Strong allergen, pollen season: Sep-Nov',
                  height: 320
                },
                {
                  id: 6,
                  image: '/images/littoralis2.jpg',
                  title: 'Plane Tree',
                  description: 'Strong allergen, pollen season: Sep-Nov',
                  height: 320
                },
                {
                  id: 7,
                  image: '/images/littoralis3.jpg',
                  title: 'Plane Tree',
                  description: 'Strong allergen, pollen season: Sep-Nov',
                  height: 320
                },
                {
                  id: 8,
                  image: '/images/betulaceae.jpg',
                  title: 'Birch',
                  description: 'Moderate allergen, pollen season: Aug-Oct',
                  height: 280
                }
              ]} />
            </div> */}

            {/* <div className="circular-section">
              <h2 className="section-title">Plant Circular Gallery</h2>
              <div className="circular-section-container">
                <CircularGallery 
                  bend={3} 
                  textColor="#333333" 
                  borderRadius={0.05}
                  font="bold 24px sans-serif"
                />
              </div>
            </div> */}



          </div>

          <div className="carousel-section">
              <h2 className="section-title">Common pollen Plant library</h2>
              <PlantCarousel />
            </div>

        </div>
      );
    }