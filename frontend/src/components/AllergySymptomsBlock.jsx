
import React, { useEffect, useRef, useState } from 'react';
import SymptomCard from '../components/SymptomCard';
import SplineRobotViewer from '../components/robot';
import TestSymptoms from '../pages/TestSymptoms';
import HouseTips from '../components/HouseTips'; 
import downArrowAnim from '../assets/downanimate1.json';

import '../components/AllergySymptomsBlock.css';
import Lottie from 'lottie-react';

export default function AllergySymptomsBlock() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const symptomRefs = useRef({});
  const sectionSymptomRef = useRef(null);

  useEffect(() => {
    fetch('/data/allergy_symptoms_detailed_info.json')
      .then((res) => res.json())
      .then((data) => setSymptoms(data))
      .catch((err) => console.error('Failed to load symptoms:', err));
  }, []);

  const scrollToRef = (ref) => {
    const headerOffset = 40;
    const elementPosition = ref.current?.getBoundingClientRect().top;
    const offsetPosition = window.scrollY + elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const normalizeSeverity = (s) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    if (lower.includes('severe')) return 'Severe';
    if (lower.includes('moderate')) return 'Moderate';
    return 'Mild';
  };

  const severityOrder = {
    Mild: 1,
    Moderate: 2,
    Severe: 3,
  };

  const normalizedSymptoms = symptoms
    .map((s) => ({
      symptom: s.Symptom,
      description: s.Description_EN,
      severity: normalizeSeverity(s.Severity),
      triggers: s.Triggers_EN || [],
      remedies: s.Remedies_EN || [],
      seeDoctor: s.SeeDoctor_EN || [],
      duration: s.Duration || '',
    }))
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const handleSymptomSelect = (symptom) => {
    setSelectedSymptom(symptom);
  };

  return (
    <div className="full-page-wrapper">
    

    <div className="robot-viewer-section">
      <div className="robot-viewer-layout with-fullside">
        <SplineRobotViewer onSymptomSelect={handleSymptomSelect} />
      </div>
    </div>

      {/* <TestSymptoms /> */}


      {/* === Popup Modal for Symptom === */}
      {selectedSymptom && (
        <div className="symptom-popup-overlay" onClick={() => setSelectedSymptom(null)}>
          <div className="symptom-popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={() => setSelectedSymptom(null)}>×</button>
            {normalizedSymptoms
              .filter((s) => s.symptom === selectedSymptom)
              .map((sym, idx) => (
                <SymptomCard key={idx} {...sym} />
              ))}
          </div>
        </div>
      )}

<HouseTips />

<div className="floating-down-arrow">
        <Lottie animationData={downArrowAnim} loop />
      </div>

      <div className="next-step-box">
 <strong>Next:</strong> Click on the pollen icon to explore prevention tips.
</div>

    </div>



  );
}

