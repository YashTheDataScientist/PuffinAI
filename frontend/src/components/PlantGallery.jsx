// import React, { useState } from 'react';
// import './PlantGallery.css';

// import ryegrass from '../assets/plants/ryegrass.jpg';
// import planetree from '../assets/plants/planetree.jpg';
// import silverbirch from '../assets/plants/silverbirch.jpg';
// import bermudagrass from '../assets/plants/bermudagrass.jpg';
// import timothygrass from '../assets/plants/timothygrass.jpg';
// import mulberry from '../assets/plants/mulberry.jpg';
// import olivetree from '../assets/plants/olivetree.jpg';
// import cedar from '../assets/plants/cedar.jpg';
// import elm from '../assets/plants/elm.jpg';
// import oak from '../assets/plants/oak.jpg';
// import pigweed from '../assets/plants/pigweed.jpg';
// import ragweed from '../assets/plants/ragweed.jpg';
// import privet from '../assets/plants/privet.jpg';
// import cocksfootgrass from '../assets/plants/cocksfootgrass.jpg';
// import paspalumgrass from '../assets/plants/paspalumgrass.jpg';

// const PLANT_LIST = [
//   { name: 'Ryegrass', img: ryegrass },
//   { name: 'Plane Tree', img: planetree },
//   { name: 'Silver Birch', img: silverbirch },
//   { name: 'Bermuda Grass', img: bermudagrass },
//   { name: 'Timothy Grass', img: timothygrass },
//   { name: 'Mulberry', img: mulberry },
//   { name: 'Olive Tree', img: olivetree },
//   { name: 'Cedar', img: cedar },
//   { name: 'Elm', img: elm },
//   { name: 'Oak', img: oak },
//   { name: 'Pigweed', img: pigweed },
//   { name: 'Ragweed', img: ragweed },
//   { name: 'Privet', img: privet },
//   { name: 'Cocksfoot Grass', img: cocksfootgrass },
//   { name: 'Paspalum Grass', img: paspalumgrass },
// ];
  

// const PlantStackGallery = () => {
//   const [centerIndex, setCenterIndex] = useState(7); // center plant

//   const handleNext = () => {
//     setCenterIndex((prev) => (prev + 1) % PLANT_LIST.length);
//   };

//   const handlePrev = () => {
//     setCenterIndex((prev) => (prev - 1 + PLANT_LIST.length) % PLANT_LIST.length);
//   };

//   return (
//     <div className="plant-stack-wrapper">
//       <h2 className="stack-title">Explore Plants</h2>
//       <div className="stack-gallery">
//         <button onClick={handlePrev} className="stack-arrow left">{'<'}</button>

//         <div className="stack-container">
//           {PLANT_LIST.map((plant, index) => {
//             let offset = index - centerIndex;

//             if (offset > PLANT_LIST.length / 2) offset -= PLANT_LIST.length;
//             if (offset < -PLANT_LIST.length / 2) offset += PLANT_LIST.length;

//             const maxVisible = 3; // show 7 total (3 left, center, 3 right)
//             if (Math.abs(offset) > maxVisible) return null;

//             const zIndex = 100 - Math.abs(offset);
//             const scale = 1 - Math.abs(offset) * 0.05;
//             const translateX = offset * 75;
//             const opacity = 1;

//             return (
//               <div
//                 key={plant.name}
//                 className="plant-card"
//                 style={{
//                   transform: `translateX(${translateX}px) scale(${scale})`,
//                   zIndex,
//                   opacity,
//                 }}
//                 onClick={() => setCenterIndex(index)}
//               >
//                 <div className="plant-frame">
//                   <div className="frame-inner">
//                     <img src={plant.img} alt={plant.name} />
//                   </div>
//                   <div className="caption">{plant.name}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <button onClick={handleNext} className="stack-arrow right">{'>'}</button>
//       </div>
//     </div>
//   );
// };

// export default PlantStackGallery;


// .plant-layout-wrapper {
//     display: flex;
//     gap: 40px;
//     padding: 40px;
//     align-items: flex-start;
//     background-color: #f9fdf5;
//   }
  
//   .carousel-column {
//     flex: 2;
//   }
  
//   .details-column {
//     flex: 1.3;
//     background: #fafff8;
//     padding: 24px;
//     border-radius: 12px;
//     box-shadow: 0 4px 20px rgba(0,0,0,0.06);
//   }
  
//   .stack-title {
//     font-size: 2.4rem;
//     color: #2d5a27;
//     margin-bottom: 30px;
//     font-weight: bold;
//   }
  
//   .stack-gallery {
//     position: relative;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
  
//   .stack-container {
//     position: relative;
//     width: 100%;
//     max-width: 800px;
//     height: 420px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     overflow: visible;
//   }
  
//   .plant-card {
//     position: absolute;
//     top: 0;
//     width: 300px;
//     height: 420px;
//     background: transparent;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     transition: all 0.4s ease;
//     z-index: 1;
//   }
  
//   .plant-frame {
//     width: 100%;
//     height: 100%;
//     background: #e6f3e7;
//     padding: 16px;
//     border: 1px solid #cfded1;
//     border-radius: 10px;
//     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.06), 0 12px 40px rgba(0, 0, 0, 0.12);
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: flex-start;
//   }
  
//   .frame-inner {
//     width: 100%;
//     height: 320px;
//     background: #ffffff;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 6px;
//   }
  
//   .frame-inner img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     pointer-events: none;
//     border-radius: 4px;
//   }
  
//   .caption {
//     font-size: 1.1rem;
//     font-weight: 600;
//     color: #2d372e;
//     margin-top: 12px;
//     text-align: center;
//   }
  
//   .plant-card.hidden {
//     opacity: 0;
//     pointer-events: none;
//   }
  
//   .plant-card.active {
//     transform: scale(1);
//     z-index: 3;
//   }
  
//   .plant-card.prev {
//     transform: translateX(-80%) scale(0.85);
//     z-index: 2;
//     opacity: 0.7;
//   }
  
//   .plant-card.next {
//     transform: translateX(80%) scale(0.85);
//     z-index: 2;
//     opacity: 0.7;
//   }
  
//   .stack-arrow {
//     position: relative;
//     font-size: 2.2rem;
//     background: white;
//     border-radius: 12px;
//     border: none;
//     cursor: pointer;
//     color: #1e3f1b;
//     margin: 0 16px;
//     padding: 10px;
//     box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
//     transition: all 0.3s ease;
//   }
  
//   .stack-arrow:hover {
//     background-color: #f0f6ed;
//   }
  
//   .details-column h3 {
//     margin-bottom: 10px;
//     color: #1a3e24;
//   }
  
//   .desc-lines {
//     border-top: 2px solid #134e4a;
//     border-bottom: 2px solid #134e4a;
//     margin-bottom: 20px;
//     padding: 12px 0;
//   }
  
//   .desc-line {
//     font-size: 0.95rem;
//     margin: 4px 0;
//     color: #1f3d29;
//   }
  
//   .metrics-row {
//     display: flex;
//     justify-content: space-between;
//     gap: 16px;
//     margin: 24px 0;
//   }
  
//   .metric {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//   }
  
//   .metric img {
//     width: 32px;
//     height: 32px;
//     margin-bottom: 6px;
//   }
  
//   .metric-label {
//     font-weight: 600;
//     font-size: 0.9rem;
//     color: #1f3f2a;
//   }
  
//   .metric-value {
//     font-size: 0.95rem;
//     color: #3d3d3d;
//   }
  
//   .actions-box {
//     background: #effaf0;
//     padding: 16px;
//     border-radius: 8px;
//     margin-top: 20px;
//     display: flex;
//     flex-direction: column;
//     gap: 16px;
//   }
  
//   .action-info {
//     font-size: 0.9rem;
//     color: #1d3c2e;
//     margin: 0;
//   }
  
//   .main-button {
//     padding: 10px 16px;
//     background-color: #1f472e;
//     color: white;
//     font-weight: 600;
//     border: none;
//     border-radius: 8px;
//     cursor: pointer;
//   }
  
//   .main-button:hover {
//     background-color: #193b25;
//   }
  


import React, { useState, useEffect } from 'react';
import './PlantGallery.css';
import Papa from 'papaparse';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dotIconImg from '../assets/doticon.png';
import leftArrowIcon from '../assets/left-arrowicon.png';
import rightArrowIcon from '../assets/right-arrowicon.png';



import ryegrassImg from '../assets/plants/ryegrass.jpg';
import planetreeImg from '../assets/plants/planetree.jpg';
import silverbirchImg from '../assets/plants/silverbirch.jpg';
import bermudagrassImg from '../assets/plants/bermudagrass.jpg';
import timothygrassImg from '../assets/plants/timothygrass.jpg';
import mulberryImg from '../assets/plants/mulberry.jpg';
import olivetreeImg from '../assets/plants/olivetree.jpg';
import cedarImg from '../assets/plants/cedar.jpg';
import elmImg from '../assets/plants/elm.jpg';
import oakImg from '../assets/plants/oak.jpg';
import pigweedImg from '../assets/plants/pigweed.jpg';
import ragweedImg from '../assets/plants/ragweed.jpg';
import privetImg from '../assets/plants/privet.jpg';
import cocksfootgrassImg from '../assets/plants/cocksfootgrass.jpg';
import paspalumgrassImg from '../assets/plants/paspalumgrass.jpg';
import seasonIcon from '../assets/seasonicon.png';
import forestIcon from '../assets/foresticon.png';
import alertIcon from '../assets/alerticon.png';




const PLANT_LIST = [
    {
      name: 'Ryegrass',
      img: ryegrassImg,
      risk: 'High',
      season: 'Spring to Summer',
      desc: 'A fast-growing pasture grass seen in lawns and fields. Known for high pollen production. Major trigger for hay fever in spring.'
    },
    {
      name: 'Plane Tree',
      img: planetreeImg,
      risk: 'Medium',
      season: 'Late Spring',
      desc: 'A common tree along city streets and parks. Its fluffy pollen spreads easily in dry weather. Can irritate eyes and nose.'
    },
    {
      name: 'Silver Birch',
      img: silverbirchImg,
      risk: 'Medium',
      season: 'Spring',
      desc: 'A popular ornamental tree with white bark. Produces fine, airborne pollen in spring. Often affects asthma and allergy sufferers.'
    },
    {
      name: 'Bermuda Grass',
      img: bermudagrassImg,
      risk: 'High',
      season: 'Late Spring to Autumn',
      desc: 'A warm-season grass found in lawns and sports fields. Thrives in hot, dry climates. A potent allergen in summer.'
    },
    {
      name: 'Timothy Grass',
      img: timothygrassImg,
      risk: 'High',
      season: 'Spring to Summer',
      desc: 'Common in meadows and used for hay. Releases pollen in large amounts. A top cause of grass pollen allergies.'
    },
    {
      name: 'Mulberry',
      img: mulberryImg,
      risk: 'Medium',
      season: 'Spring',
      desc: 'Fruit-bearing tree found in gardens and parks. Male trees release large quantities of pollen. Can cause respiratory discomfort.'
    },
    {
      name: 'Olive Tree',
      img: olivetreeImg,
      risk: 'High',
      season: 'Late Spring to Early Summer',
      desc: 'Known for its fruit, but also its heavy pollen. Found in gardens and Mediterranean climates. Triggers strong seasonal allergies.'
    },
    {
      name: 'Cedar',
      img: cedarImg,
      risk: 'Medium',
      season: 'Winter to Early Spring',
      desc: 'An evergreen tree with a fragrant scent. Its pollen is carried long distances. Can affect allergy sufferers even in winter.'
    },
    {
      name: 'Elm',
      img: elmImg,
      risk: 'Medium',
      season: 'Late Winter to Spring',
      desc: 'Tall and shady, elms line many streets. Their pollen peaks before spring. Can cause sneezing and nasal irritation.'
    },
    {
      name: 'Oak',
      img: oakImg,
      risk: 'Medium',
      season: 'Spring',
      desc: 'A grand tree found in forests and parks. Pollen is heavy but travels with wind. Known for causing mild to moderate allergies.'
    },
    {
      name: 'Pigweed',
      img: pigweedImg,
      risk: 'High',
      season: 'Late Summer to Autumn',
      desc: 'A resilient weed found on roadsides and disturbed soil. Produces small but intense pollen grains. Causes itchy eyes and sneezing.'
    },
    {
      name: 'Ragweed',
      img: ragweedImg,
      risk: 'High',
      season: 'Late Summer to Autumn',
      desc: 'The king of fall allergies. A single plant releases millions of grains. Known for causing severe hay fever symptoms.'
    },
    {
      name: 'Privet',
      img: privetImg,
      risk: 'Medium',
      season: 'Spring to Early Summer',
      desc: 'Used in hedges and landscaping. Emits pollen during flowering. Can be troublesome for urban allergy sufferers.'
    },
    {
      name: 'Cocksfoot Grass',
      img: cocksfootgrassImg,
      risk: 'High',
      season: 'Spring to Summer',
      desc: 'Found in rural fields and roadsides. Releases large amounts of pollen. A common cause of seasonal allergies.'
    },
    {
      name: 'Paspalum Grass',
      img: paspalumgrassImg,
      risk: 'Medium',
      season: 'Summer to Autumn',
      desc: 'Loves damp areas like wetlands and lawns. Grows fast after rain. Moderate but persistent pollen source.'
    }
  ];
  
  const customIcon = new L.Icon({
    iconUrl: dotIconImg,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
  
  const PlantGallery = () => {
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
              const filtered = results.data.filter(row => PLANT_LIST.map(p => p.name).includes(row['Common Name']));
              setPlantLocations(filtered);
              const unique = [];
              const seen = new Set();
              for (const row of filtered) {
                if (!seen.has(row['Common Name'])) {
                  unique.push(row);
                  seen.add(row['Common Name']);
                }
              }
              setCarouselPlants(unique);
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
    const getPlantMeta = (name) => PLANT_LIST.find(p => p.name === name);
  
    const getSimilarPlantInfo = () => {
      if (!currentPlant) return null;
      const currentName = currentPlant['Common Name'].replace(/\s+/g, '').toLowerCase();
      return similarPlantsData.find(row => {
        if (!row['Allergy Plant']) return false;
        const allergyName = row['Allergy Plant'].replace(/\s+/g, '').toLowerCase();
        return allergyName.includes(currentName) || currentName.includes(allergyName);
      });
    };
  
    const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 + carouselPlants.length) % carouselPlants.length);
    };
  
    const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % carouselPlants.length);
    };
  
    return (
      <>
        <div className="plant-layout-wrapper">
          {/* LEFT SECTION */}
          <div className="carousel-column">
            <h2 className="stack-title">Explore Plants</h2>
            <div className="stack-gallery">
            <div className="stack-container">
                {carouselPlants.map((plant, index) => {
                    const total = carouselPlants.length;
                    let offset = index - currentIndex;

                    if (offset > total / 2) offset -= total;
                    if (offset < -total / 2) offset += total;

                    const maxVisible = 3;
                    if (Math.abs(offset) > maxVisible) return null;

                    const zIndex = 100 - Math.abs(offset);
                    const scale = 1 - Math.abs(offset) * 0.05;
                    const translateX = offset * 60 / 2; // Matches your CSS `translateX`

                    return (
                    <div
                        key={plant['Common Name']}
                        className="plant-card"
                        style={{
                        transform: `translateX(${translateX}%) scale(${scale})`,
                        zIndex,
                        opacity: offset === 0 ? 1 : 0.8,
                        }}
                    >
                        <div className="plant-frame">
                        <div className="frame-inner">
                            <img
                            src={getPlantMeta(plant['Common Name'])?.img}
                            alt={plant['Common Name']}
                            />
                        </div>
                        <div className="caption">{plant['Common Name']}</div>
                        </div>
                    </div>
                    );
                })}
                </div>



  <div className="stack-arrows">
    <button onClick={handlePrev} className="stack-arrow">
      <img src={leftArrowIcon} alt="Left" />
    </button>
    <button onClick={handleNext} className="stack-arrow">
      <img src={rightArrowIcon} alt="Right" />
    </button>
  </div>
</div>

          </div>
  
          {/* RIGHT SECTION */}
          <div className="details-column">
            {currentPlant && (
              <>
                <h3>Description:</h3>
                <div className="desc-lines">
                  <p className="desc-line">{getPlantMeta(currentPlant['Common Name'])?.desc}</p>
                </div>
  
                <div className="metrics-row">
                  <div className="metric">
                    <img src={alertIcon} alt="Risk" />
                    <div className="metric-label">Risk</div>
                    <div className="metric-value">{getPlantMeta(currentPlant['Common Name'])?.risk}</div>
                  </div>
                  <div className="metric">
                    <img src={seasonIcon} alt="Season" />
                    <div className="metric-label">Season</div>
                    <div className="metric-value">{getPlantMeta(currentPlant['Common Name'])?.season}</div>
                  </div>
                  <div className="metric">
                    <img src={forestIcon} alt="Population" />
                    <div className="metric-label">Population</div>
                    <div className="metric-value">
                      {plantLocations.filter(p => p['Common Name'] === currentPlant['Common Name']).length}
                    </div>
                  </div>
                </div>
  
                <div className="actions-box">
                    <div className="action-item">
                        <p className="action-info">Want to know which areas in Victoria have this plant</p>
                        <button className="main-button" onClick={() => setShowMap(true)}>Locate Plants!</button>
                    </div>

                    <div className="action-item">
                        <p className="action-info">Some plants look familiar but are pollen safe.</p>
                        <button className="main-button" onClick={() => setShowRecommend(true)}>View Similar!</button>
                    </div>
                    </div>

              </>
            )}
          </div>
        </div>
  
        {/* MODALS */}
        {showMap && currentPlant && (
            <>
                <div className="map-overlay" onClick={() => setShowMap(false)} />
                <div className="map-popup">
                <MapContainer center={[-37.8136, 144.9631]} zoom={11} className="leaflet-map">
                    <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // 🌙 Dark theme
                    attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
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
            </>
            )}

  
{showRecommend && currentPlant && (
  <div className="map-overlay">
    <div className="recommend-popup">
      <h3>Recommended Pollen Safe Alternative</h3>
      <div className="plant-comparison">
        <div className="plant-box">
          <img src={getPlantMeta(currentPlant['Common Name'])?.img} alt="Selected Plant" />
          <h4>{currentPlant['Common Name']}</h4>
          <p className="tag unsafe">Pollen Plant ❌</p>
        </div>

        <div className="plant-box">
          {(() => {
            const info = getSimilarPlantInfo();
            if (!info) return <p>No similar plant found.</p>;
            const safeName = info['Similar looking plant'];
            const imgPath = `/images/${safeName.replace(/\s+/g, '').toLowerCase()}.jpg`;
            return (
              <>
                <img src={imgPath} alt="Recommended Plant" />
                <h4>{safeName}</h4>
                <p className="tag safe">Pollen Safe ✅</p>
              </>
            );
          })()}
        </div>
      </div>

      <p className="recommend-desc">
        {getSimilarPlantInfo()?.Difference}
      </p>

      <button onClick={() => setShowRecommend(false)}>Close</button>
    </div>
  </div>
)}


      </>
    );
  };
  
  export default PlantGallery;