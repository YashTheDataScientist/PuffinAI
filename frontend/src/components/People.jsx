import React, { useState } from 'react';
import './People.css';

const People = () => {
  const [hoveredPart, setHoveredPart] = useState(null);

  const bodyParts = {
    nose: {
      x1: 46,
      y1: 19,
      x2: 54,
      y2: 22,
      centerX: 50,
      centerY: 22.5,
      title: "Nasal Symptoms",
      description: "Common allergic reactions affecting the nasal passages, often accompanied by sneezing and congestion. These symptoms may worsen during specific seasons or exposure to allergens.",
      images: ['/images/nose1.png', '/images/nose2.png']
    },
    throat: {
      x1: 46,
      y1: 29,
      x2: 54,
      y2: 33,
      centerX: 50,
      centerY: 30.5,
      title: "Throat Symptoms",
      description: "Irritation and discomfort in the throat area, which may include itching, soreness, and difficulty swallowing. These symptoms often accompany other allergic reactions.",
      images: ['/images/throat1.png', '/images/throat2.png']
    },
    eye: {
      x1: 39,
      y1: 17,
      x2: 44,
      y2: 20,
      centerX: 41,
      centerY: 18.5,
      title: "Eye Symptoms",
      description: "Tears and pain or itching around the eyes or forehead.",
      images: ['/images/eye1.png', '/images/eye2.png']
    },
    lungs: {
      x1: 40,
      y1: 40,
      x2: 60,
      y2: 49,
      centerX: 50,
      centerY: 44,
      title: "Lung Symptoms",
      description: "Respiratory reactions that affect breathing and chest comfort. May include difficulty breathing, wheezing, and chest tightness. ",
      images: ['/images/lungs1.png', '/images/lungs2.png']
    },
    skin: {
        x1: 20,
        y1: 40,
        x2: 30,
        y2: 49,
        centerX: 25,
        centerY: 44,
        title: "Skin Symptoms",
        description: "Skin reactions that affect the skin, often accompanied by itching, redness, and swelling.",
        images: ['/images/skin1.png', '/images/skin2.png']
      }
  };

  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    let hovered = null;
    for (const [part, coords] of Object.entries(bodyParts)) {
      if (x >= coords.x1 && x <= coords.x2 && y >= coords.y1 && y <= coords.y2) {
        hovered = part;
        break;
      }
    }
    
    setHoveredPart(hovered);
  };

  return (
    <div className="body-container">
      <div className="body-wrapper" onMouseMove={handleMouseMove}>
        <img 
          src="/images/body.png" 
          alt="Human body diagram" 
          className="body-image"
        />
        
        {/* Magnifier indicators */}
        {Object.entries(bodyParts).map(([part, data]) => (
          <div
            key={`indicator-${part}`}
            className="magnifier-indicator"
            style={{
              left: `${data.centerX}%`,
              top: `${data.centerY}%`,
            }}
          >
            🔍
          </div>
        ))}

        {/* Symptom tooltip */}
        {hoveredPart && (
          <div className="body-symptom-tooltip">
            <div className="symptom-title">
              {bodyParts[hoveredPart].title}
            </div>
            <div className="symptom-description">
              {bodyParts[hoveredPart].description}
            </div>
            {bodyParts[hoveredPart].images && (
              <div className="symptom-images">
                {bodyParts[hoveredPart].images.map((image, index) => (
                  <img 
                    key={index}
                    src={image}
                    alt={`${bodyParts[hoveredPart].title} example ${index + 1}`}
                    className="symptom-image"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default People; 