import React, { useRef } from "react";
import Lottie from "lottie-react";
import breathingAnim from "../animations/breath.json";

export default function BreathingExercise() {
  const animationRef = useRef();

  const handleStart = () => {
    if (animationRef.current) {
      animationRef.current.stop(); // 保证从头开始
      animationRef.current.play(); // 播放动画
    }
  };

  const handleReset = () => {
    if (animationRef.current) {
      animationRef.current.stop(); // 停止动画并回到起点
    }
  };

  return (
    <div className="breathing-section">
      <h2>Breathing Exercise</h2>
      <Lottie
        lottieRef={animationRef}
        animationData={breathingAnim}
        loop
        autoplay={false} // 默认不自动播放
        style={{ width: 300, height: 300, margin: "0 auto" }}
      />
      <p className="breathing-text">Follow the rhythm: Inhale... Exhale...</p>
      <div className="breathing-controls">
        <button className="breathing-button" onClick={handleStart}>
          Start
        </button>
        <button className="breathing-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
