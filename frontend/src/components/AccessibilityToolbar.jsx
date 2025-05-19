import React, { useState, useEffect } from 'react';
import './AccessibilityToolbar.css';
import speakerIcon from '../assets/speaker.png'; // orange speaker icon

const AccessibilityToolbar = () => {
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleRead = () => {
    const selection = window.getSelection().toString();
    const text = selection || document.body.innerText.slice(0, 500);
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-AU';
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      setReading(true);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setReading(false);
  };

  const toggleToolbar = () => {
    setOpen(prev => !prev);
    setShowPopup(true);
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <>
      {/* Floating Circular Speaker Icon */}
      <div
        className="speaker-float-btn"
        onClick={toggleToolbar}
        title="Read Out Loud"
      >
        <img src={speakerIcon} alt="Read aloud icon" />
        <span className="tooltip-text">Read Out Loud</span>
      </div>

      {/* Volume Popup */}
      {showPopup && (
        <div className="volume-popup">
          🔊 Please increase your volume for better experience
        </div>
      )}

      {/* Floating Toolbar */}
      {open && (
        <div className="accessibility-toolbar">
          <button onClick={handleRead}>🔊 Read Page</button>
          <button onClick={handleStop} disabled={!reading}>⏹ Stop</button>
        </div>
      )}
    </>
  );
};

export default AccessibilityToolbar;
