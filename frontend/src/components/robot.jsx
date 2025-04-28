import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import './robot.css';

const SplineRobotViewer = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // ✅ 去掉 isDebugMode 相关

  // 定义身体部位的坐标范围和症状
  const bodyParts = {
    nose: {
      x1: 30,
      y1: 22,
      x2: 40,
      y2: 30,
      centerX: 50,
      centerY: 26,
      title: "Nasal Symptoms",
      description: "Common allergic reactions affecting the nasal passages, often accompanied by sneezing and congestion. These symptoms may worsen during specific seasons or exposure to allergens.",
      color: "rgba(255, 0, 0, 0.2)",
      images: ['/images/nose1.png']
    },
    throat: {
      x1: 30,
      y1: 29,
      x2: 38,
      y2: 35,
      centerX: 50,
      centerY: 32,
      title: "Throat Symptoms",
      description: "Irritation and discomfort in the throat area, which may include itching, soreness, and difficulty swallowing. These symptoms often accompany other allergic reactions.",
      color: "rgba(0, 0, 255, 0.2)",
      images: ['/images/throat1.png']
    },
    lungs: {
      x1: 30,
      y1: 42,
      x2: 42,
      y2: 50,
      centerX: 50,
      centerY: 46,
      title: "Lung Symptoms",
      description: "Respiratory reactions that affect breathing and chest comfort. May include difficulty breathing, wheezing, and chest tightness. These symptoms can be particularly concerning and may require immediate attention.",
      color: "rgba(126, 64, 218, 0.2)",
      images: ['/images/lungs1.png']
    },
    skin: {
      x1: 20,
      y1: 40,
      x2: 30,
      y2: 49,
      centerX: 37,
      centerY: 44,
      title: "Skin Symptoms",
      description: "Skin reactions that affect the skin, often accompanied by itching, redness, and swelling.",
      images: ['/images/skin1.png']
    }
  };

  useEffect(() => {
    const app = new Application(canvasRef.current);
    app.load('https://my.spline.design/nexbotrobotcharacterconcept-acbgm9rlbxIQaWRzUPfRYtJC/')
      .then(() => {
        console.log('Spline scene loaded successfully');
      })
      .catch(error => {
        console.error('Error loading Spline scene:', error);
        app.load('https://prod.spline.design/q1lAQlec7rzWqdZH/scene.splinecode')
          .then(() => {
            console.log('Fallback Spline scene loaded successfully');
          })
          .catch(fallbackError => {
            console.error('Error loading fallback Spline scene:', fallbackError);
          });
      });

    return () => {
      if (app) {
        app.dispose();
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePos({ x, y });
    
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
    <div className="spline-container" ref={containerRef}>
      <div className="model-wrapper" onMouseMove={handleMouseMove}>
        <canvas ref={canvasRef} className="spline-canvas" />
        
        {/* Indicator dots */}
        {Object.entries(bodyParts).map(([part, data]) => (
          <div
            key={`dot-${part}`}
            className="indicator-dot"
            style={{
              left: `${data.centerX}%`,
              top: `${data.centerY}%`,
            }}
          />
        ))}

        {/* Symptom tooltip */}
        {hoveredPart && (
          <div className="symptom-tooltip">
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

export default SplineRobotViewer;
