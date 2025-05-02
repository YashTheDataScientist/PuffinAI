import React from "react";
import SectionAllergySeason from "./SectionAllergySeason";
import SectionPollenMap from "./SectionPollenMap";
import "./SectionSeasonAndMap.css";

const SectionSeasonAndMap = () => {
  return (
    <div className="season-map-row">
      <SectionAllergySeason />
      <SectionPollenMap />
    </div>
  );
};

export default SectionSeasonAndMap;
