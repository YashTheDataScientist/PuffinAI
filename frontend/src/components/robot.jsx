// import React, { useState, useEffect } from 'react';
// import './robot.css';

// const RobotViewer = ({ onSymptomSelect }) => {
//   const [hoveredPart, setHoveredPart] = useState(null);
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [showSpeechBubble, setShowSpeechBubble] = useState(true);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => document.body.removeChild(script);
//   }, []);

  // const bodyParts = {
  //   eyes: {
  //     centerX: 72, centerY: 15, x1: 68, y1: 11, x2: 76, y2: 19,
  //     title: "Eye Symptoms",
  //     description: "Common allergic reactions affecting the eyes",
  //     symptoms: ["Itchy Eyes", "Watery Eyes", "Red Eyes", "Swelling", "Burning sensation"]
  //   },
  //   nose: {
  //     centerX: 66, centerY: 17, x1: 63, y1: 14, x2: 69, y2: 20,
  //     title: "Nasal Symptoms",
  //     description: "Common allergic reactions affecting the nasal passages",
  //     symptoms: ["Sneezing", "Itchy Nose", "Nasal Congestion", "Runny Nose", "Postnasal drip"]
  //   },
  //   throat: {
  //     centerX: 66, centerY: 23, x1: 63, y1: 20, x2: 69, y2: 26,
  //     title: "Throat/Mouth Symptoms",
  //     description: "Irritation and discomfort in the throat area",
  //     symptoms: ["Itchy throat or roof of mouth", "Sore throat", "Mild voice hoarseness", "Cough"]
  //   },
  //   lungs: {
  //     centerX: 66, centerY: 30, x1: 63, y1: 27, x2: 69, y2: 33,
  //     title: "Lung/Chest Symptoms",
  //     description: "Respiratory reactions affecting breathing",
  //     symptoms: ["Coughing", "Wheezing", "Chest tightness", "Shortness of Breath", "Asthma symptoms"]
  //   },
  //   head: {
  //     centerX: 66, centerY: 10, x1: 63, y1: 7, x2: 69, y2: 13,
  //     title: "Head Symptoms",
  //     description: "General and neurological symptoms",
  //     symptoms: ["Headache", "Brain fog or lack of focus", "Fatigue"]
  //   }
  // };

  // const handleMouseMove = (e) => {
  //   const container = e.currentTarget;
  //   const rect = container.getBoundingClientRect();
  //   const x = ((e.clientX - rect.left) / rect.width) * 100;
  //   const y = ((e.clientY - rect.top) / rect.height) * 100;

  //   let hovered = null;
  //   for (const [part, coords] of Object.entries(bodyParts)) {
  //     if (x >= coords.x1 && x <= coords.x2 && y >= coords.y1 && y <= coords.y2) {
  //       hovered = part;
  //       break;
  //     }
  //   }

  //   if (hovered && showSpeechBubble) setShowSpeechBubble(false);
  //   setHoveredPart(hovered);
  // };

//   const handlePartClick = (part) => {
//     setSelectedPart(prev => prev === part ? null : part);
//   };

//   const handleSymptomClick = (symptom) => {
//     if (onSymptomSelect) onSymptomSelect(symptom);
//     setSelectedPart(null);
//   };

//   return (
//     <div className="robot-container">
//       <h1 className="symptoms-title">Explore Pollen-Triggered Symptoms</h1>
//       <div className="lottie-frame" onMouseMove={handleMouseMove}>
//         <div className="lottie-container">
//           <lottie-player
//             src="/icons/body.json"
//             background="transparent"
//             speed="0.5"
//             loop
//             autoplay
//           ></lottie-player>
//         </div>

//         {/* Speech bubble */}
//         {showSpeechBubble && (
//           <div className="speech-bubble">
//             <button className="close-bubble" onClick={() => setShowSpeechBubble(false)}>×</button>
//             <p>
//               👋 Hi there!<br />
//               Hover near the red dots or click them<br />
//               to see what symptoms pollen can trigger.
//             </p>
//           </div>
//         )}

//         {/* Dots */}
//         {Object.entries(bodyParts).map(([part, data]) => (
//           <div
//             key={`dot-${part}`}
//             className={`indicator-dot ${part === selectedPart ? 'selected' : ''}`}
//             style={{ left: `${data.centerX}%`, top: `${data.centerY}%` }}
//             onClick={() => handlePartClick(part)}
//           />
//         ))}

//         {/* Tooltip */}
//         {(selectedPart || hoveredPart) && (
//           <div className="symptom-tooltip">
//             <div className="symptom-title">
//               {bodyParts[selectedPart || hoveredPart].title}
//             </div>
//             <div className="symptom-description">
//               {bodyParts[selectedPart || hoveredPart].description}
//             </div>
//             <div className="symptoms-list">
//               {bodyParts[selectedPart || hoveredPart].symptoms.map((symptom, index) => (
//                 <div
//                   key={index}
//                   className="symptom-item"
//                   onClick={() => handleSymptomClick(symptom)}
//                 >
//                   {symptom}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RobotViewer;


import React, { useState, useEffect } from 'react';
import './robot.css';

const RobotViewer = ({ onSymptomSelect }) => {
  const [hoveredPart, setHoveredPart] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    if (!window.customElements.get('lottie-player')) {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        // Optional: don't remove to avoid re-defining
      };
    }
  }, []);
  

  const bodyParts = {
    eyes: {
      centerX: 72, centerY: 15, x1: 68, y1: 11, x2: 76, y2: 19,
      title: "Eye Symptoms",
      description: "Common allergic reactions affecting the eyes",
      symptoms: ["Itchy Eyes", "Watery Eyes", "Red Eyes", "Swelling", "Burning sensation"]
    },
    nose: {
      centerX: 66, centerY: 17, x1: 63, y1: 14, x2: 69, y2: 20,
      title: "Nasal Symptoms",
      description: "Common allergic reactions affecting the nasal passages",
      symptoms: ["Sneezing", "Itchy Nose", "Nasal Congestion", "Runny Nose", "Postnasal drip"]
    },
    throat: {
      centerX: 66, centerY: 23, x1: 63, y1: 20, x2: 69, y2: 26,
      title: "Throat/Mouth Symptoms",
      description: "Irritation and discomfort in the throat area",
      symptoms: ["Itchy throat or roof of mouth", "Sore throat", "Mild voice hoarseness", "Cough"]
    },
    lungs: {
      centerX: 66, centerY: 30, x1: 63, y1: 27, x2: 69, y2: 33,
      title: "Lung/Chest Symptoms",
      description: "Respiratory reactions affecting breathing",
      symptoms: ["Coughing", "Wheezing", "Chest tightness", "Shortness of Breath", "Asthma symptoms"]
    },
    head: {
      centerX: 66, centerY: 10, x1: 63, y1: 7, x2: 69, y2: 13,
      title: "Head Symptoms",
      description: "General and neurological symptoms",
      symptoms: ["Headache", "Brain fog or lack of focus", "Fatigue"]
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
    setSelectedPart(prev => prev === part ? null : part);
  };

  const handleSymptomClick = (symptom) => {
    if (onSymptomSelect) onSymptomSelect(symptom);
    setSelectedPart(null);
  };

  return (
    <div className="robot-wrapper">
      <h1 className="robot-page-title">Explore Pollen-Triggered Symptoms</h1>

      <div className="robot-container">
        <div className="lottie-frame" onMouseMove={handleMouseMove}>
          <div className="lottie-container">
            <lottie-player
              src="/icons/body.json"
              background="transparent"
              speed="0.5"
              loop
              autoplay
            ></lottie-player>
          </div>

          {/* Always show speech bubble */}
          <div className="speech-bubble">
            <p>
              👋 Hi there!<br />
              Hover near the red dots or click them<br />
              to see what symptoms pollen can trigger.
            </p>
          </div>

          {/* Red dots */}
          {Object.entries(bodyParts).map(([part, data]) => (
            <div
              key={`dot-${part}`}
              className={`indicator-dot ${part === selectedPart ? 'selected' : ''}`}
              style={{ left: `${data.centerX}%`, top: `${data.centerY}%` }}
              onClick={() => handlePartClick(part)}
            />
          ))}

          {/* Tooltip */}
          {(selectedPart || hoveredPart) && (
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
    </div>
  );
};

export default RobotViewer;
