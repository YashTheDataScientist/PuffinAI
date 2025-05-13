import React from 'react';
import './AsthmaPage.css';

export default function AsthmaPage() {
  return (
    <div className="asthma-container">
      {/* 顶部介绍区 */}
      <section className="asthma-intro">
        <h1>What is Asthma? / 什么是哮喘？</h1>
        <p>
          Asthma is a long-term condition that affects the airways in your lungs.
          It can make it hard to breathe, especially when you are exposed to triggers like pollen, cold air, or stress.
        </p>
        <p>
          哮喘是一种长期影响肺部气道的疾病。在接触花粉、冷空气或压力时，呼吸会变得困难甚至喘不过气。
        </p>
        <img
          src="https://via.placeholder.com/600x300?text=Asthma+Illustration"
          alt="Asthma Illustration"
          className="asthma-image"
        />
      </section>

      {/* 卡片区域 */}
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
    </div>
  );
}
