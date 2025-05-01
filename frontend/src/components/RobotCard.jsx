import React from 'react';
import './RobotCard.css'; // ✅ 引入自定义样式

export default function RobotCard() {
  return (
    <div className="robot-card">
      <h2>How to Interact</h2>
      <p>
        Click the <span>red dots</span> on the different body part and choose a symptom to see more details.
      </p>
      <img
        src="/illustrations/hover-guide.svg"
        alt="Interaction Guide"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
}
