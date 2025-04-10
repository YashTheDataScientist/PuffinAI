// components/PollenInfoCards.jsx
import React from 'react';
import './PollenInfoCards.css';

const PollenInfoCards = ({ status = "off-season" }) => {
  const isOffSeason = status === "off-season";

  return (
    <div className="pollen-info-wrapper">
      {/* CARD 1: Season Status */}
      <div className={`info-card ${isOffSeason ? 'off' : 'on'}`}>
        <h3>Seasonal Status</h3>
        <p>
          {isOffSeason
            ? "It's currently off-season for pollen — breathe easy!"
            : "High pollen season is active — take precautions."}
        </p>
      </div>

      {/* CARD 2: What is Pollen UPI? */}
      <div className="info-card neutral">
        <h3>What is Pollen UPI?</h3>
        <p>
          UPI stands for Universal Pollen Index. It's a number from 0 to 5
          that reflects the severity of pollen in the air — higher values mean
          higher risk for allergies and asthma.
        </p>
      </div>

      {/* CARD 3: Types of Pollen */}
      <div className="info-card neutral">
        <h3>Types of Pollen</h3>
        <p>
          We primarily monitor Tree 🌳 and Grass 🌾 pollen. Each can trigger
          different allergy symptoms, and their levels change with the seasons.
        </p>
      </div>
    </div>
  );
};

export default PollenInfoCards;
