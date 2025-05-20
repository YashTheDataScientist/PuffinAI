import { useEffect, useState } from 'react';
import './AlexaPopup.css';
import alexaImage from '../assets/alexabg.jpeg';

export default function AlexaPopup() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!closed) {
        setShow(true);
      }
    }, 12000);
  
    return () => clearTimeout(timer);
  }, []); // empty dependency array = run only once
  

  if (!show || closed) return null;

  return (
    <div className="alexa-modal-overlay" onClick={() => setClosed(true)}>
      <div className="alexa-modal" onClick={(e) => e.stopPropagation()}>
        <button className="alexa-close-btn" onClick={() => setClosed(true)} aria-label="Close popup">×</button>

        <div className="alexa-popup-wrapper">
          <div className="alexa-image-box">
            <img src={alexaImage} alt="Alexa Devices" />
          </div>

          <div className="alexa-info-box">
            <div className="alexa-left-column">
              <h3>Why it's exciting</h3>
              <p>
                Puffin AI is now voice-enabled! Soon, anyone can ask Alexa for real-time pollen risk updates hands-free.
              </p>

              <h3>Current status</h3>
              <p>
                Our Alexa skill is currently being published. You’ll soon find it on all Alexa-enabled devices.
              </p>
            </div>

            <div className="alexa-divider"></div>

            <div className="alexa-right-column">
              <h3>Try it on a test device</h3>
              <div className="alexa-steps-grid">
                <div className="alexa-step-card">
                  <div className="step-number">STEP 1</div>
                  <p className="step-text">Say: <strong>“Alexa, Open Pollen Checker.”</strong></p>
                </div>
                <div className="alexa-step-card">
                  <div className="step-number">STEP 2</div>
                  <p className="step-text">Say: <strong>“what is the pollen risk in (suburb name)”</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
