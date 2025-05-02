import React, { useEffect, useState } from "react";
import "./LearnAboutPollen.css";
import SectionPollenIntro from "../components/SectionPollenIntro";
import SectionPollenTravel from "../components/SectionPollenTravel";
import SectionAgeGroups from "../components/SectionAgeGroups";
import SectionSeasonAndMap from "../components/SectionSeasonAndMap";
import SectionSurvivePollen from "../components/SectionSurvivePollen";
import knowledgeSVG from "../assets/knowledge-animate.svg";


import pollenImg from "../assets/pollen.png";
import { motion } from "framer-motion";

const LearnAboutPollen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const introSection = document.getElementById("home");
      if (introSection) {
        const rect = introSection.getBoundingClientRect();
        setShowTooltip(rect.bottom > window.innerHeight / 2);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="learn-page">
      {/* 🌼 Fixed Clickable Pollen Button */}
      <div
        className="pollen-fixed-wrapper"
        onClick={() => {
          setMenuOpen(!menuOpen);
          setShowTooltip(false);
        }}
      >
        <motion.img
          src={pollenImg}
          alt="Pollen Button"
          className="pollen-click"
          animate={{ rotate: menuOpen ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* 💬 Tooltip */}
      {showTooltip && (
        <div className="pollen-tooltip">
          💡 Click on the pollen to quickly navigate through chapters
        </div>
      )}

      {/* 🧭 Dropdown Menu */}
      {menuOpen && (
        <div className="pollen-menu">
          <button onClick={() => scrollTo("home")}>Back To Top</button>
          <button onClick={() => scrollTo("intro")}>What is pollen</button>
          <button onClick={() => scrollTo("travel")}>How Pollen Travels</button>
          <button onClick={() => scrollTo("age")}>Age Groups</button>
          <button onClick={() => scrollTo("season")}>Season & Map</button>
          <button onClick={() => scrollTo("survive")}>Survival Tips</button>
        </div>
      )}

      {/* 📘 Section Blocks */}
      <div id="home">
      <div className="intro-box purple-bg">
  <div className="intro-left">
    <h2>Let's Learn About Pollen</h2>
    <p>
      Scroll down to explore how pollen travels and impacts us during allergy season.
    </p>
  </div>
</div>

</div>



      <div id="intro"><SectionPollenIntro /></div>
      <div id="travel"><SectionPollenTravel /></div>
      <div id="age"><SectionAgeGroups /></div>
      <div id="season"><SectionSeasonAndMap /></div>
      <div id="survive"><SectionSurvivePollen /></div>
    </div>
  );
};

export default LearnAboutPollen;
