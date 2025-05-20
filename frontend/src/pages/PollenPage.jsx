import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import SubscribeForm from '../components/SubscribeForm';
import MailSVG from '../assets/email-campaign-animate.svg';
import './PollenPage.css';
import PollenMap from '../components/PollenMap';
import SeasonBanner from '../components/PollenInfoCards';
import alexaImage from '../assets/alexabg.jpeg';
import Lottie from 'lottie-react';
import downArrowAnim from '../assets/downanimate1.json';

export default function PollenPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#alexa') {
      const el = document.getElementById('alexa');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  // ✅ Scroll to Top
  useEffect(() => {
    const upBtn = document.getElementById('scroll-up-btn');
    if (upBtn) {
      upBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    return () => {
      if (upBtn) upBtn.removeEventListener('click', () => {});
    };
  }, []);

  return (
    <>
    <div>

           {/* SECTION 1: LIVE POLLEN MAP */}
           <div className="live-map-wrapper">
        <div className="map-column">
          <h1 className="section-heading">Live Pollen Map of Victoria</h1>
          <PollenMap />
        </div>
        <SeasonBanner status="off-season" />
      </div>

      <hr className="section-divider" />

      {/* Alexa Section */}
      <div id="alexa" className="alexa-test-wrapper">
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
                <div className="step-number">Step 1</div>
                <p className="step-text">Say: <strong>“Alexa, connect to Pollen Checker.”</strong></p>
              </div>
              <div className="alexa-step-card">
                <div className="step-number">Step 2</div>
                <p className="step-text">Say: <strong>“Tell me the pollen index in my area.”</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="subscribe-content">
        <div className="subscribe-text">
          <h2>Want pollen forecasts at your fingertips?</h2>
          <p>
            Stay informed with daily updates tailored for Melbourne. Just drop your email
            below and we’ll keep you one step ahead of allergies — every day, no spam.
          </p>
          <SubscribeForm />
        </div>
        <div className="subscribe-image">
          <img src={MailSVG} alt="Subscribe illustration" />
        </div>
      </div>

      {/* Floating Decorative Down Arrow */}
      <div className="floating-down-arrow">
        <Lottie animationData={downArrowAnim} loop />
      </div>

      <Lottie
  animationData={downArrowAnim}
  loop
  className="floating-up-arrow"
  onClick={() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
/>


  <div className="explore-section">
    <h3>Next Steps!</h3>
 
      <div className="explore-card">
        <h3>Understand your body’s reaction</h3>
        <p>Learn about allergy symptoms and get tips to stay safe and prepared.</p>
        <button onClick={() => window.location.href = '/allergy-guide'}>
          Explore Symptoms
        </button>
      </div>
      <div className="explore-card">
        <h3>Learn how pollen spreads</h3>
        <p>Discover the different sources of pollen and how it travels through the air.</p>
        <button onClick={() => window.location.href = '/learn'}>
          Learn About Pollen
        </button>
      </div>
    </div>
    </div>


    </>

    
  );
}
