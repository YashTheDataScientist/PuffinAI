import React, { useState, useEffect } from "react";
import "./SectionAgeGroups.css";

import sneezing from "../assets/sneezing.png";
import runnynose from "../assets/runnynose.png";
import itchyeye from "../assets/itchyeye.png";

import baby from "../assets/baby.svg";
import babyAnimate from "../assets/baby-animate.svg";
import teen from "../assets/teen.svg";
import teenAnimate from "../assets/teen-animate.svg";
import elderly from "../assets/elderly.svg";
import elderlyAnimate from "../assets/elderly-animate.svg";

const ageContent = {
  none: {
    text: "Understand how pollen affects each age group",
    percentage: null,
  },
  baby: {
    text: "Children often have higher sensitivity to pollen, leading to stronger allergic reactions.",
    percentage: 30,
  },
  teen: {
    text: "Adults may experience moderate symptoms like mild congestion or itchy eyes during peak seasons.",
    percentage: 40,
  },
  elderly: {
    text: "Older adults, especially those with existing health issues, can suffer more severe effects and breathing difficulties.",
    percentage: 25,
  },
};

export default function SectionAgeGroups() {
  const [selected, setSelected] = useState("none");
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    let interval;
    if (selected !== "none" && ageContent[selected].percentage) {
      const target = ageContent[selected].percentage;
      let current = 0;
      interval = setInterval(() => {
        current += 1;
        setDisplayPercent(current);
        if (current >= target) clearInterval(interval);
      }, 20);
    } else {
      setDisplayPercent(0);
    }
    return () => clearInterval(interval);
  }, [selected]);

  const getImage = (type) => {
    return selected === type
      ? type === "baby"
        ? babyAnimate
        : type === "teen"
        ? teenAnimate
        : elderlyAnimate
      : type === "baby"
      ? baby
      : type === "teen"
      ? teen
      : elderly;
  };

  return (
    <div className="section3-container">
      {/* Left */}
      <div className="section3-left">
        <h2>Common Reactions to Pollen</h2>
        <p>
          Pollen can easily irritate the nose, eyes, and lungs, especially for those with allergies.
        </p>
        <div className="symptom-item">
          <img src={sneezing} alt="sneezing" />
          <span>Sneezing</span>
        </div>
        <div className="symptom-item">
          <img src={runnynose} alt="runny nose" />
          <span>Runny Nose</span>
        </div>
        <div className="symptom-item">
          <img src={itchyeye} alt="itchy eyes" />
          <span>Itchy Eyes</span>
        </div>
      </div>

      {/* Right */}
      <div className="section3-right">
        <h1 className="section3-heading">{ageContent[selected].text}</h1>

        {selected !== "none" && (
          <div className="percentage-wrapper">
            <div className="percentage-counter">{displayPercent}%</div>
            <div className="percentage-label">of people affected in this group</div>
          </div>
        )}

        <div className="section3-images">
          {["baby", "teen", "elderly"].map((group) => (
            <img
              key={group}
              src={getImage(group)}
              alt={group}
              className={`age-img ${selected === group ? "active" : ""}`}
              onClick={() => setSelected(group)}
            />
          ))}
        </div>

        <p className="section3-note">Click on each image to view info</p>
      </div>
    </div>
  );
}
