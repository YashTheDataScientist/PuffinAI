import React, { useState } from 'react';
import './AllergyGuide.css';

import AllergySymptomsBlock from '../components/AllergySymptomsBlock';
import AllergyPreventionBlock from '../components/AllergyPreventionBlock';
import AllergyAsthmaBlock from '../components/AllergyAsthmaBlock';

import pollenImg from '../assets/pollen.png';

const AllergyGuide = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'symptoms': return <AllergySymptomsBlock />;
      case 'prevention': return <AllergyPreventionBlock />;
      case 'asthma': return <AllergyAsthmaBlock />;
      default:
        return (
          <div className="intro-section">
            <h1>Your Complete Allergy Guide 🌿</h1>
            <p>
              Struggling with sneezing, wheezing, or itchy eyes? You're not alone.
              This guide helps you identify symptoms, discover prevention methods, and
              learn how asthma is connected to your allergies.
            </p>
            <p>
              Whether you're new to allergy season or managing it every year,
              click the pollen below to dive into helpful insights and take control of your health.
            </p>
          </div>
        );
    }
  };

  const handlePollenClick = () => {
    setShowOptions(prev => !prev);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <div className="allergy-guide-wrapper">
      <div className="guide-content">
        {renderSection()}
      </div>

      {showOptions && (
        <div className="pollen-options">
          <button onClick={() => setActiveSection('symptoms')}>Symptoms</button>
          <button onClick={() => setActiveSection('prevention')}>Prevention</button>
          <button onClick={() => setActiveSection('asthma')}>Asthma</button>
        </div>
      )}

      {!activeSection && !showOptions && (
        <div className="pollen-tooltip">💡 Click the pollen to explore chapters</div>
      )}

      <img
        src={pollenImg}
        alt="Pollen Icon"
        className={`pollen-icon ${isRotating ? 'rotate' : ''}`}
        onClick={handlePollenClick}
        
      />
    </div>
  );
};

export default AllergyGuide;
