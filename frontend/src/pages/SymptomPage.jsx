import React, { useEffect, useRef, useState } from 'react';
import SymptomCard from '../components/SymptomCard';
import SplineRobotViewer from '../components/robot';
import TestSymptoms from './AllSymptoms';

import './SymptomPage.css';

export default function SymptomPage() {
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
      {/* === Robot Viewer Section === */}
      <div className="robot-viewer-section">
        <div className="robot-viewer-layout with-fullside">
          <div className="left-info-panel">
            <p>
              Understand<br />
              how pollen<br />
              can interact<br />
              with different<br />
              parts of<br />
              body and<br />
              cause<br />
              allergic<br />
              reactions.
            </p>
          </div>

          <SplineRobotViewer onSymptomSelect={handleSymptomSelect} />
        </div>
      </div>

      <TestSymptoms />


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
    </div>
  );
}
