import React, { useRef, useState } from "react";
import Lottie from "lottie-react";
import breathingAnim from "../animations/breath.json";

export default function BreathingExercise() {
  const animationRef = useRef();
  const intervalRef = useRef(null); // 用于控制 setInterval
  const [phase, setPhase] = useState("Ready"); // 当前呼吸阶段显示

  // 使用 Web Speech API 播放语音提示
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US"; // 可改成 "zh-CN" 使用中文
    utter.rate = 1; // 语速（可调节 0.8 ~ 1.2）
    window.speechSynthesis.speak(utter);
  };

  // 启动语音节奏 + 动画
  const startBreathingCycle = () => {
    const phases = ["Breath In", "Hold", "Breath Out", "Hold"];
    let index = 0;

    // 立即播放第一次
    speak(phases[index]);
    setPhase(phases[index]);

    // 每 3 秒切换一次阶段（动画总共 12 秒一轮）
    intervalRef.current = setInterval(() => {
      index = (index + 1) % phases.length;
      speak(phases[index]);
      setPhase(phases[index]);
    }, 3000);
  };

  // 点击“开始”按钮
  const handleStart = () => {
    if (animationRef.current) {
      animationRef.current.stop(); // 保证动画从头播放
      animationRef.current.play();
    }

    // 清除旧 interval（避免多次点击 Start 导致重复播报）
    clearInterval(intervalRef.current);
    startBreathingCycle();
  };

  // 点击“重置”按钮
  const handleReset = () => {
    if (animationRef.current) {
      animationRef.current.stop(); // 停止动画
    }

    // 停止语音与循环
    clearInterval(intervalRef.current);
    window.speechSynthesis.cancel(); // 停止当前语音播放
    setPhase("Ready");
  };

  return (
    <div className="breathing-section">
      <h2>Breathing Exercise</h2>

      <Lottie
        lottieRef={animationRef}
        animationData={breathingAnim}
        loop
        autoplay={false}
        style={{ width: 500, height: 500, margin: "0 auto" }}
      />

      {/* 显示当前阶段 */}
      <p className="breathing-text" style={{ fontSize: "1.5rem", textAlign: "center" }}>
        {phase}
      </p>

      {/* 控制按钮 */}
      <div className="breathing-controls" style={{ textAlign: "center", marginTop: "1rem" }}>
        <button className="breathing-button" onClick={handleStart} style={{ marginRight: "10px" }}>
          Start
        </button>
        <button className="breathing-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
