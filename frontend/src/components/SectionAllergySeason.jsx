import React, { useState, useEffect } from "react";

const pollenData = [
  { month: "January", risk: "Low" },
  { month: "February", risk: "Very Low" },
  { month: "March", risk: "Very Low" },
  { month: "April", risk: "Very Low" },
  { month: "May", risk: "Very Low" },
  { month: "June", risk: "Very Low" },
  { month: "July", risk: "Very Low" },
  { month: "August", risk: "Moderate" },
  { month: "September", risk: "Moderate" },
  { month: "October", risk: "High" },
  { month: "November", risk: "Extreme" },
  { month: "December", risk: "Moderate" },
];

const riskColors = {
  "Very Low": "#2e7d32",
  "Low": "#558b2f",
  "Moderate": "#f9a825",
  "High": "#ef6c00",
  "Extreme": "#c62828",
};

const season = (month) => {
  if (["December", "January", "February"].includes(month)) return "summer";
  if (["March", "April", "May"].includes(month)) return "autumn";
  if (["June", "July", "August"].includes(month)) return "winter";
  return "spring";
};

export default function SectionAllergySeason() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % pollenData.length);
  const prev = () => setIndex((index - 1 + pollenData.length) % pollenData.length);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 3000);
    return () => clearInterval(interval);
  }, [index]);

  const getMonth = (offset) => {
    const i = (index + offset + pollenData.length) % pollenData.length;
    return pollenData[i];
  };

  const currentMonth = pollenData[index].month;
  const seasonClass = `${season(currentMonth)}-bg`;

  return (
    <div className="allergy-season-carousel">
      <div className={`left-calendar-column ${seasonClass}`}>
        <h2 className="carousel-heading">Victoria’s Allergy Season</h2>
        <div className="carousel-wrapper">
          <button onClick={prev} className="nav-btn">◀</button>
          <div className="carousel-track">
            {[getMonth(-1), getMonth(0), getMonth(1)].map((item, i) => (
              <div
                key={i}
                className={`calendar-card ${i === 1 ? "active" : "adjacent"}`}
              >
                <div className="calendar-top-tab">
                  <div className="calendar-hooks">
                    <div className="hook" />
                    <div className="hook" />
                    <div className="hook" />
                  </div>
                  <span>{item.month.slice(0, 3).toUpperCase()}</span>
                </div>
                <div
                  className="calendar-risk-label"
                  style={{ color: riskColors[item.risk] }}
                >
                  {item.risk.split(" ").map((word, i) => (
                    <div key={i}>{word}</div>
                  ))}
                  <div>Risk</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={next} className="nav-btn">▶</button>
        </div>
        <p className="allergy-description">
          Pollen levels in Victoria rise significantly during spring and summer. High pollen can trigger allergies like hay fever and asthma, especially for sensitive individuals.
        </p>
      </div>
    </div>
  );
}
