import React from "react";
import Lottie from "lottie-react";

import catAnim from "../animations/cat.json";
import flowerAnim from "../animations/flower.json";
import runAnim from "../animations/run.json";
import smokeAnim from "../animations/smoke.json";
import snowAnim from "../animations/snow.json";

const triggers = [
  { label: "Pets", animation: catAnim },
  { label: "Pollen", animation: flowerAnim },
  { label: "Exercise", animation: runAnim },
  { label: "Smoke", animation: smokeAnim },
  { label: "Cold air", animation: snowAnim },
];

export default function TriggerBar() {
  return (
    <div className="trigger-bar-container">
      <h2 className="trigger-title">Asthma Triggers</h2>
      <div className="trigger-bar">
        {triggers.map((t, index) => (
          <div className="trigger-item" key={index}>
            <Lottie
              animationData={t.animation}
              loop
              style={{ width: 120, height: 120 }} // ✅ 控制动画尺寸
            />
            <p>{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
