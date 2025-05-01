import React from 'react';
import './SectionSurvivePollen.css';
import maskIcon from '../assets/mask.png';
import windowIcon from '../assets/window.png';
import forecastIcon from '../assets/forecast.png';
import medsIcon from '../assets/drugs.png';

export default function SectionSurvivePollen() {
  return (
    <div className="section-survive">
      <div className="tips-column">
        <h3>How to Survive Pollen Season</h3>
        <p>Pollen season can be challenging, but a few smart habits can make a big difference:</p>
        <div className="tip-row">
          <div className="tip-item">
            <img src={windowIcon} alt="Keep Windows Closed" />
            <span>Keep Windows Closed</span>
          </div>
          <div className="tip-item">
            <img src={maskIcon} alt="Wear a Mask Outdoors" />
            <span>Wear a Mask Outdoors</span>
          </div>
          <div className="tip-item">
            <img src={forecastIcon} alt="Check Weather Forecasts" />
            <span>Check Weather Forecasts</span>
          </div>
          <div className="tip-item">
            <img src={medsIcon} alt="Take Antihistamines Early" />
            <span>Take Antihistamines Early</span>
          </div>
        </div>
      </div>

      <div className="video-column">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/8WQlZi1Hsco"
          title="Pollen Allergy Prevention Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
