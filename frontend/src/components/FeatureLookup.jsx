import React, { useState, useEffect, useRef } from 'react';
import './FeatureLookup.css';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import featureIcon from '../assets/feature.png'; // ✅ Your icon here

const features = [
  { title: "Know Your Area", desc: "Get pollen risk and weather info for your suburb.", route: "/know_your_area" },
  { title: "Pollen Watch", desc: "View pollen levels across all Victorian districts.", route: "/pollen_watch" },
  { title: "Subscribe", desc: "Get email alerts on pollen and weather updates.", route: "/subscribe" },
  { title: "Alexa", desc: "Just ask: 'Alexa, what's the pollen index today?'", route: "/alexa" },
  { title: "Scan Plant", desc: "Identify any plant using your photo.", route: "/plant_identify" },
  { title: "View Common Plants", desc: "See local allergenic plants in your area.", route: "/know_your_plants" },
  { title: "Common Symptoms", desc: "Learn typical allergy symptoms by severity.", route: "/symptoms" },
  { title: "Preventive Tips", desc: "Explore tips to reduce pollen exposure.", route: "/allergy-guide" },
  { title: "Asthma Tips", desc: "Stay safe with pollen-smart tips for asthma.", route: "/asthma_info" },
  { title: "Learn", desc: "Understand pollen, how it spreads, and who it affects.", route: "/learn" }
];

const FeatureLookup = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Handle navigation and close
  const handleClick = (route) => {
    setOpen(false);
    navigate(route);
  };

  return (
    <>
      <div
        className="feature-lookup-btn"
        ref={buttonRef}
        onClick={() => setOpen(prev => !prev)}
      >
        <img src={featureIcon} alt="Feature Icon" className="feature-icon-img" />
      </div>

      {open && (
        <div className="feature-lookup-panel" ref={panelRef}>
          <div className="feature-lookup-header">
            <h3>Explore Features</h3>
            <FaTimes className="close-icon" onClick={() => setOpen(false)} />
          </div>
          <ul className="feature-lookup-list">
            {features.map((item, idx) => (
              <li key={idx} onClick={() => handleClick(item.route)}>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FeatureLookup;
