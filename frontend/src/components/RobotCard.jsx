import React from 'react';
import './RobotCard.css'; // ✅ 引入自定义样式

export default function RobotCard() {
  return (
    <div className="robot-card">
      <h2>How to Interact</h2>
      <p>
        Hover over the <span>red dots</span> on the robot to explore allergy symptoms for that body part.
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
