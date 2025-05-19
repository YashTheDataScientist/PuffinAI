
import './AllergyPreventionBlock.css';
import React, { useState, useEffect } from "react";
import seasonsbg from "../assets/seasonsbg.svg";

const seasonTips = {
  spring: {
    intro: `Spring is beautiful, but it's also a peak time for allergies. As trees, grasses, and weeds release pollen, many people experience sneezing, runny nose, and itchy eyes. Rain can help clear pollen, but spring cleaning and mold growth may also trigger symptoms.`,
    tips: [
      'Stay indoors when pollen counts are high, especially in the morning.',
      'Keep windows and doors closed to prevent pollen from entering.',
      'Use an air purifier and clean air filters regularly.',
      'Wash your hair and change clothes after being outside.',
      'Vacuum twice a week and wear a mask while cleaning.'
    ]
  },
  summer: {
    intro: `Summer allergies are mainly caused by grass and weed pollen, as well as increased air pollution and insect stings. Mold and dust mites also thrive in warm, humid conditions, making symptoms worse.`,
    tips: [
      'Monitor pollen and smog levels; stay indoors when they are high.',
      'Keep doors and windows closed; use air conditioning and air purifiers.',
      'Shower and change clothes after outdoor activities.',
      'Use antihistamines or nasal sprays as needed.',
      'Be cautious of insect stings and treat bites promptly.'
    ]
  },
  autumn: {
    intro: `Fall allergies are often triggered by ragweed pollen, which can travel great distances. Mold from fallen leaves and dust mites indoors can also cause symptoms. Turning on the heat can stir up allergens that have settled during summer.`,
    tips: [
      'Keep windows closed and use a HEPA filter in your heating system.',
      'Use a dehumidifier to keep indoor humidity between 35% and 50%.',
      'Wear a mask when raking leaves to avoid mold spores.',
      'Shower and change clothes after being outdoors.',
      'Clean and vacuum your home regularly.'
    ]
  },
  winter: {
    intro: `Winter allergies are usually caused by indoor allergens like dust mites, pet dander, and mold. Spending more time indoors increases exposure to these triggers, especially when heating systems are in use.`,
    tips: [
      'Keep your home clean and dust-free; wash bedding regularly.',
      'Use a HEPA filter and maintain good ventilation.',
      'Control indoor humidity to prevent mold growth.',
      'Keep pets out of bedrooms and off furniture.',
      'Consider using allergen-proof covers for pillows and mattresses.'
    ]
  }
};

const AllergyPreventionBlock  = () => {
  const [activeSeason, setActiveSeason] = useState(null);
  const [showMain, setShowMain] = useState(false);

  return (
    <div className="seasonal-tips-container">
      {!showMain ? (
 <div className="seasonal-tips-intro split-layout">
 <div className="intro-image-side">
   <img src={seasonsbg} alt="Seasons Illustration" />
 </div>
 <div className="intro-text-side">
   <h1 className="seasonal-tips-title">Seasonal Allergy Prevention Tips</h1>
   <p className="seasonal-tips-desc">Discover tips to help you stay allergy-free year-round.</p>
   <button className="learn-now-btn" onClick={() => setShowMain(true)}>Learn Now</button>
 </div>
</div>


      ) : (
        <>
          <div className="season-buttons">
            <button 
              className={`season-btn ${activeSeason === 'spring' ? 'active' : ''}`}
              onClick={() => setActiveSeason('spring')}
            >
              <img src="/icons/spring.png" alt="Spring" className="season-icon" />
              <span>Spring</span>
            </button>
            <button 
              className={`season-btn ${activeSeason === 'summer' ? 'active' : ''}`}
              onClick={() => setActiveSeason('summer')}
            >
              <img src="/icons/summer.png" alt="Summer" className="season-icon" />
              <span>Summer</span>
            </button>
            <button 
              className={`season-btn ${activeSeason === 'autumn' ? 'active' : ''}`}
              onClick={() => setActiveSeason('autumn')}
            >
              <img src="/icons/autumn.png" alt="Autumn" className="season-icon" />
              <span>Autumn</span>
            </button>
            <button 
              className={`season-btn ${activeSeason === 'winter' ? 'active' : ''}`}
              onClick={() => setActiveSeason('winter')}
            >
              <img src="/icons/winter.png" alt="Winter" className="season-icon" />
              <span>Winter</span>
            </button>
          </div>
          {!activeSeason && (
  <div className="tips-content tips-flex" >
    <h2>Click on one of the cards to view prevention tips for that season.</h2>
  </div>
)}

{activeSeason && (
  <div className="tips-content tips-flex">
    <div className="tips-intro">
      <h2>{activeSeason.charAt(0).toUpperCase() + activeSeason.slice(1)} Allergies</h2>
      <p>{seasonTips[activeSeason].intro}</p>
    </div>
    <div className="tips-list">
      <h3>Prevention Tips</h3>
      {seasonTips[activeSeason].tips.map((tip, index) => (
        <div key={index} className="tip-item">
          <p>{tip}</p>
        </div>
      ))}
    </div>
  </div>
)}

        </>
      )}


<div className="next-step-box">
 <strong>Next:</strong> Click on the pollen icon to explore prevention tips.
</div>

    </div>
  );
};


export default AllergyPreventionBlock;
