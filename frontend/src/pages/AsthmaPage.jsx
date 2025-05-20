import React from 'react';
import Lottie from 'lottie-react';
import asthmaBg from '../animations/Asthma_bg.json'; // 请确认文件名大小写正确
import './AsthmaPage.css';

import TriggerBar from '../components/TriggerBar';
import BreathingExercise from '../components/BreathingExercise';

export default function AsthmaPage() {
  return (
    <div className="asthma-container">
      {/* ✅ 背景动画组件（加边框方便调试） */}
      <Lottie
        animationData={asthmaBg}
        className="asthma-bg-animation"
        style={{ border: "2px solid red" }} // 🧪 调试用，后续可以删除
      />

      {/* 顶部介绍区域 */}
      <section className="asthma-intro">
        <h1>What is Asthma?</h1>
        <p>
          Asthma is a long-term condition that affects the airways in your lungs.
          It can make it hard to breathe, especially when you are exposed to triggers like pollen, cold air, or stress.
        </p>
      </section>

      {/* 关键信息卡片区域 */}
      <section className="asthma-cards">
        <h2>Key Facts about Asthma</h2>
        <div className="card-grid">
          <div className="info-card">
            <h3>What is Asthma?</h3>
            <p>
              Asthma is a chronic condition that affects the airways. It can cause coughing, wheezing, and shortness of breath.
            </p>
          </div>

          <div className="info-card">
            <h3>Why does asthma make breathing hard?</h3>
            <p>
              During an asthma attack, the airways narrow, swell, and produce extra mucus, making it difficult to breathe.
            </p>
          </div>

          <div className="info-card">
            <h3>Common Triggers</h3>
            <p>
              Triggers include pollen, smoke, cold air, pet dander, exercise, and stress.
            </p>
          </div>

          <div className="info-card">
            <h3>Can asthma be cured?</h3>
            <p>
              Asthma cannot be cured, but it can be controlled with medication and by avoiding triggers.
            </p>
          </div>
        </div>
      </section>

      {/* 诱因图标栏 */}
      <TriggerBar />

      {/* 呼吸训练模块 */}
      <BreathingExercise />
    </div>
  );
}
