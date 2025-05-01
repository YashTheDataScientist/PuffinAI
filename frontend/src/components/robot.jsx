import React, { useState, useEffect } from 'react';
import './robot.css';

const RobotViewer = ({ onSymptomSelect }) => {
  const [hoveredPart, setHoveredPart] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    // 动态加载lottie-player组件
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const bodyParts = {
    eyes: {
      x1: 57,
      y1: 20,
      x2: 61,
      y2: 25,
      centerX: 60,
      centerY: 22,
      title: "Eye Symptoms",
      description: "Common allergic reactions affecting the eyes",
      symptoms: [
        "Itchy Eyes",
        "Watery Eyes",
        "Red Eyes",
        "Swelling",
        "Burning sensation"
      ]
    },
    nose: {
      x1: 60,
      y1: 20,
      x2: 65,
      y2: 25,
      centerX: 63,
      centerY: 23,
      title: "Nasal Symptoms",
      description: "Common allergic reactions affecting the nasal passages",
      symptoms: [
        "Sneezing",
        "Itchy Nose",
        "Nasal Congestion",
        "Runny Nose",
        "Postnasal drip"
      ]
    },
    lungs: {
      x1: 60,
      y1: 35,
      x2: 65,
      y2: 38,
      centerX: 63,
      centerY: 35,
      title: "Lung/Chest Symptoms",
      description: "Respiratory reactions affecting breathing",
      symptoms: [
        "Coughing",
        "Wheezing",
        "Chest tightness",
        "Shortness of Breath",
        "Asthma symptoms"
      ]
    },
    throat: {
      x1: 60,
      y1: 25,
      x2: 64,
      y2: 30,
      centerX: 63,
      centerY: 28,
      title: "Throat/Mouth Symptoms",
      description: "Irritation and discomfort in the throat area",
      symptoms: [
        "Itchy throat or roof of mouth",
        "Sore throat",
        "Mild voice hoarseness",
        "Cough"
      ]
    },
    head: {
      x1: 60,
      y1: 15,
      x2: 65,
      y2: 20,
      centerX: 63,
      centerY: 17,
      title: "Head Symptoms",
      description: "General and neurological symptoms",
      symptoms: [
        "Headache",
        "Brain fog or lack of focus",
        "Fatigue"
      ]
    }
  };

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
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

  const handlePartClick = (part) => {
    setSelectedPart(part === selectedPart ? null : part);
  };

  const handleSymptomClick = (symptom) => {
    if (onSymptomSelect) {
      onSymptomSelect(symptom);
    }
  };

  return (
    <div className="robot-container">
      <div className="model-wrapper" onMouseMove={handleMouseMove}>
        <div className="lottie-container">
          <lottie-player
            src="/icons/body.json"
            background="transparent"
            speed="0.5"
            style={{ width: "80%", height: "80%" }}
            loop
            autoplay
          ></lottie-player>
        </div>
        
        {/* Indicator dots */}
        {Object.entries(bodyParts).map(([part, data]) => (
          <div
            key={`dot-${part}`}
            className={`indicator-dot ${part === selectedPart ? 'selected' : ''}`}
            style={{
              left: `${data.centerX}%`,
              top: `${data.centerY}%`,
            }}
            onClick={() => handlePartClick(part)}
          />
        ))}

        {/* Symptom tooltip */}
        {(hoveredPart || selectedPart) && (
          <div className="symptom-tooltip">
            <div className="symptom-title">
              {bodyParts[selectedPart || hoveredPart].title}
            </div>
            <div className="symptom-description">
              {bodyParts[selectedPart || hoveredPart].description}
            </div>
            <div className="symptoms-list">
              {bodyParts[selectedPart || hoveredPart].symptoms.map((symptom, index) => (
                <div 
                  key={index} 
                  className="symptom-item"
                  onClick={() => handleSymptomClick(symptom)}
                >
                  {symptom}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RobotViewer;
