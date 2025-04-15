// components/PollenInfoCards.jsx
import React from 'react';
import './PollenInfoCards.css';

const PollenInfoCards = ({ status = "off-season" }) => {
  const isOffSeason = status === "off-season";

  return (
    <div className="pollen-info-wrapper">
      {/* CARD 1: Season Status */}
      <div className={`info-card ${isOffSeason ? 'off' : 'on'}`}>
        <h3>Currently Off Season</h3>
      </div>

      {/* CARD 2: What is Pollen UPI? */}
      <div className="info-card neutral">
        <h3>What is Pollen Risk Index?</h3>
        <p>
        Pollen Risk Index shows how severe pollen levels are, from 0 (Very Low) to 5 (Extreme). Higher values mean more allergy risk.
        </p>
      </div>

      {/* CARD 3: Types of Pollen */}
      <div className="info-card forecast">
  <p>
    Check the 5-day allergy forecast for your current location based on Tree and Grass pollen levels.
  </p>
  <button className="forecast-btn" onClick={() => {
    const el = document.getElementById('forecast-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }}>
    View Forecast
  </button>
</div>

    </div>
  );
};

export default PollenInfoCards;
