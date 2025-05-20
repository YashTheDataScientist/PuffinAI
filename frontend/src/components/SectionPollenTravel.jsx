import React, { useState } from "react";
import "./SectionPollenTravel.css";
import grassImg from "../assets/grass.png";
import pineImg from "../assets/tree.png";
import plantImg from "../assets/plant.png";
import sectionBg from "../assets/section1bg.png";
import Lottie from "lottie-react";
import pollenAnimation from "../assets/plantanimate.json";
import CountUp from 'react-countup';


const descriptions = {
    plant: {
      desc: "Some flowering weeds and garden plants might look harmless, but their pollen can still pack a punch. These plants tend to release heavier pollen that stays closer to the ground, yet can still cause allergy symptoms — especially during spring and summer.",
      speciesList: ["Ragweed", "Pigweed", "Amaranth", "Plantain"],
    },
    pine: {
      desc: "Trees are quiet but powerful pollen producers. They release large amounts of fine, lightweight pollen that can travel long distances on windy days. Common urban trees like birch, plane, and oak are major contributors to seasonal allergies in many regions.",
      speciesList: ["Pine", "Birch", "Plane Tree", "Oak"],
    },
    grass: {
      desc: "Grasses are the leading cause of hay fever in Victoria. Their pollen is light, abundant, and easily becomes airborne — especially during late spring and early summer. Even short exposure can trigger symptoms for people sensitive to grass pollen.",
      speciesList: ["Ryegrass", "Timothy", "Bermuda", "Cocksfoot"],
    },
  };
  

const SectionPollenTravel = () => {
  const [selected, setSelected] = useState("plant");

  return (
    <section
      className="pollen-travel-section"
      style={{ backgroundImage: `url(${sectionBg})` }}
    >
      {/* LEFT (info) */}
      <div className="left-side">
        <div className="section-heading">
          <h4>Pollen usually comes from three main types of plants</h4>
          <p>Click on each one to learn more.</p>
        </div>

        <div className="icon-row centered">
            <div className={`icon-tile ${selected === "plant" ? "active" : ""}`} onClick={() => setSelected("plant")}>
                <img src={plantImg} alt="Plant" className="icon big" />
                <span className="icon-label">Plants</span>
            </div>
            <div className={`icon-tile ${selected === "pine" ? "active" : ""}`} onClick={() => setSelected("pine")}>
                <img src={pineImg} alt="Tree" className="icon big" />
                <span className="icon-label">Trees</span>
            </div>
            <div className={`icon-tile ${selected === "grass" ? "active" : ""}`} onClick={() => setSelected("grass")}>
                <img src={grassImg} alt="Grass" className="icon big" />
                <span className="icon-label">Grasses</span>
            </div>
        </div>




<div className="frosted-panel">
  {/* Top: Description */}
  <div className="description-block">
    <h4>Description</h4>
    <p>{descriptions[selected].desc}</p>
  </div>

  {/* Bottom: Two-column layout */}
  <div className="bottom-grid">
    {/* Left: Chips */}
    <div className="species-column">
      <h4>High-Risk Species</h4>
      <div className="chip-wrap">
        {descriptions[selected].speciesList.map((item, idx) => (
          <span className="chip" key={idx}>{item}</span>
        ))}
      </div>
    </div>

    {/* Right: Percentage */}
    <div className="percentage-column">
      <h4>Estimated Contribution</h4>
      <div className="percent-box">
        <CountUp
          end={
            selected === "plant" ? 10 :
            selected === "pine" ? 25 :
            65
          }
          duration={1.5}
          suffix="%"
          className="big-count"
        />
        <p className="percent-caption">of airborne pollen in Victoria</p>
      </div>
    </div>
  </div>
</div>


      </div>

{/* RIGHT (animation + caption + bottom text) */}
<div className="right-side">
  {/* Boxed section for animation + caption */}
  <div className="animation-box">
    <Lottie animationData={pollenAnimation} loop autoplay className="plant-lottie" />
    <p className="travel-caption">
      Pollen travels through the air, riding the wind to reach other plants. On windy
      days, pollen levels in the air can rise sharply, making allergy symptoms worse.
    </p>
  </div>

  {/* Unboxed section for bottom message */}
  <div className="gallery-info-inline">
    <p>
      Curious to explore actual species and their impact?
      Visit our pollen gallery to see what grows around you and when it’s active.
    </p>
    <button className="find-out-button" onClick={() => window.location.href = "/know_your_plants"}>Find Out</button>
  </div>
</div>
<div className="down-arrow">
          <span>↓</span>
        </div>
    </section>
  );
};

export default SectionPollenTravel;
