import React, { useEffect, useState } from 'react';
import './AllSymptoms.css';

const severityColors = {
    Mild: '#1e3a2f',       // deep green
    Moderate: '#5c4404',   // dark amber-brown
    Severe: '#7f1d1d',     // strong dark red
  };

const severityOrder = {
  Mild: 1,
  Moderate: 2,
  Severe: 3,
};

const TestSymptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [search, setSearch] = useState('');
  const [activeSeverity, setActiveSeverity] = useState('Severe');

  useEffect(() => {
    fetch('/data/allergy_symptoms_detailed_info.json')
      .then((res) => res.json())
      .then((data) => setSymptoms(data))
      .catch((err) => console.error('Failed to load symptoms:', err));
  }, []);

  const normalizeSeverity = (s) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    if (lower.includes('severe')) return 'Severe';
    if (lower.includes('moderate')) return 'Moderate';
    return 'Mild';
  };

  const filteredSymptoms = symptoms
    .map((s) => ({
      ...s,
      severity: normalizeSeverity(s.Severity),
    }))
    .filter(
      (s) =>
        s.severity === activeSeverity &&
        s.Title_EN.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flip-wrapper">
      <h1 className="flip-title">Explore Symptoms by Severity</h1>

      <div className="filter-bar">


        <div className="severity-toggle">
          {['Mild', 'Moderate', 'Severe'].map((level) => (
            <button
              key={level}
              className={activeSeverity === level ? 'active' : ''}
              onClick={() => setActiveSeverity(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="flip-grid">
        {filteredSymptoms.map((symptom, index) => (
          <div
            className="flip-card"
            key={index}
            style={{ '--card-bg': severityColors[symptom.severity] }}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h2>{symptom.Title_EN}</h2>
                <span className={`badge badge-${symptom.severity.toLowerCase()}`}>
                  {symptom.severity}
                </span>
              </div>
              <div className="flip-card-back">
                <p><strong>Description:</strong> {symptom.Description_EN}</p>
                <p><strong>Duration:</strong> {symptom.Duration}</p>
                <p><strong>Triggers:</strong> {symptom.Triggers_EN?.join(', ')}</p>
                <p><strong>Remedies:</strong> {symptom.Remedies_EN?.join(', ')}</p>
                <p><strong>See Doctor If:</strong> {symptom.SeeDoctor_EN?.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSymptoms;
