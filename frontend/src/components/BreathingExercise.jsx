import React, { useRef, useState } from "react";
import Lottie from "lottie-react";
import breathingAnim from "../animations/breath.json";
import leftAnim from "../animations/why_breath_exercise.json"; // ✅ 引入左侧动画
import RightAnim from "../animations/yoga.json"; // ✅ 引入左侧动画
import './BreathingExercise.css';

export default function BreathingExercise() {
  const animationRef = useRef();
  const intervalRef = useRef(null);
  const [phase, setPhase] = useState("Ready");

  // 播放语音提示
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
  };

  // 启动节奏 + 动画
  const startBreathingCycle = () => {
    const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"];
    let index = 0;

    speak(phases[index]);
    setPhase(phases[index]);

    intervalRef.current = setInterval(() => {
      index = (index + 1) % phases.length;
      speak(phases[index]);
      setPhase(phases[index]);
    }, 3000);
  };

  const handleStart = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current.play();
    }
    clearInterval(intervalRef.current);
    startBreathingCycle();
  };

  const handleReset = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    clearInterval(intervalRef.current);
    window.speechSynthesis.cancel();
    setPhase("Ready");
  };

  return (
    <div className="breathing-section">
      <h2>Breathing Exercise</h2>

      <div className="breathing-layout">
        {/* 左侧说明：使用动画替换图片 */}
        <div className="breathing-info left">
          <h3>Why Practice Breathing Exercises?</h3>
          <Lottie
            animationData={leftAnim}
            loop
            autoplay
            style={{ width: 300, height: 300, marginBottom: "12px" }}
          />
          <p>
            Breathing exercises help reduce stress, improve lung function, and calm the nervous system.
          </p>
        </div>

        {/* 中间动画 */}
        <div className="breathing-center">
          <Lottie
            lottieRef={animationRef}
            animationData={breathingAnim}
            loop
            autoplay={false}
            style={{ width: 500, height: 500, margin: "0 auto" }}
          />
          <p className="breathing-text">{phase}</p>
          <div className="breathing-controls">
            <button onClick={handleStart}>Start</button>
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>

        {/* 右侧说明 */}
        <div className="breathing-info right">
                    <h3>How to Use This Exercise</h3>
          <Lottie
            animationData={RightAnim}
            loop
            autoplay
            style={{ width: 300, height: 300, marginBottom: "12px" }}
          />
          <p>
            Follow the circle’s rhythm. Inhale as it expands, exhale as it contracts. Repeat 3–5 times.
          </p>
        </div>
      </div>
    </div>
  );
}
