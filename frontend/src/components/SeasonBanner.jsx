// components/SeasonBanner.jsx
import React from 'react';
import './SeasonBanner.css';

const SeasonBanner = ({ status = "off-season" }) => {
  const isOffSeason = status === "off-season";

  return (
    <div className={`season-banner ${isOffSeason ? 'off' : 'on'}`}>
      <span role="img" aria-label="leaf"></span>
      {isOffSeason
        ? "It's currently off-season for pollen — breathe easy!"
        : "High pollen season is active — take precautions "}
      <span role="img" aria-label="leaf"></span>
    </div>
  );
};

export default SeasonBanner;
