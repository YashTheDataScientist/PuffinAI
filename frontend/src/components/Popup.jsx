import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!closed) {
        setShow(true);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [closed]);

  if (!show || closed) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Alexa Integration Now Available!</h2>
        <p>You can now ask: <strong>“Hey Alexa, what's the pollen index today?”</strong></p>
        <p>To set this up, simply click below.</p>
        <button
          className="setup-btn"
          onClick={() => window.location.href = "/alexa-setup"} // Replace with actual link
        >
          Set Up Now
        </button>
        <button className="close-btn" onClick={() => setClosed(true)}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
