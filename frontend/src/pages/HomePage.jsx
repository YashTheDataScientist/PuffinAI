
// HomePage.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';

import BlowingDandelion from '../assets/blowing-a-dandelion-animate.svg';
import Mapsvg from '../assets/navigation-animate.svg';
import AnalyticsSVG from '../assets/analytics-animate.svg';
import ForestSVG from '../assets/forest-animate.svg';
import ThesisSVG from '../assets/thesis-animate.svg';
import './HomePage.css';

export default function HomePage() {
  const parallaxRef = useRef();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(true);
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  return (
    <>
      <Parallax pages={5} ref={parallaxRef}>
        {/* SECTION 1 */}
        <ParallaxLayer offset={0} speed={0} factor={1} style={{ backgroundColor: '#f9f9f9' }} />
        <ParallaxLayer offset={0} speed={0.2}>
          <div className="image-layer right">
            <img src={BlowingDandelion} alt="Dandelion" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={0} speed={0.5}>
          <div className="text-layer left section1">
            <h1 className="section-title">New to Victoria?</h1>
            <p className="section-subtitle">
              Your quick guide to staying allergy-free in Victoria — track pollen, identify risky plants, and get smart tips to breathe easy all season.
            </p>
            <button onClick={() => parallaxRef.current.scrollTo(1)}>
              Why This Matters
            </button>
          </div>
        </ParallaxLayer>

        {/* SECTION 2 */}
        <ParallaxLayer offset={1} speed={0} factor={1} style={{ backgroundColor: '#eaf3ff' }} />
        <ParallaxLayer offset={1} speed={0.2}>
          <div className="section2-image">
            <img src={AnalyticsSVG} alt="Analytics Illustration" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={1} speed={0.4}>
          <div ref={ref} className="section2-content">
            <h1 className="section-title">Why This Matters</h1>
            <p className="section-subtitle">
              Allergies affect millions — and young people in Victoria are among the most at risk.
            </p>
            <div className="insight-cards">
              <div className="insight-card">
                <h2>1st</h2>
                <p>Victoria has the highest number of hayfever cases — followed by NSW and Queensland.</p>
              </div>
              <div className="insight-card">
                <h2>{inView && <CountUp end={26.1} decimals={1} suffix="%" duration={2.5} />}</h2>
                <p>of Victorians suffer from hay fever — that's more than 1 in 4 people.</p>
              </div>
              <div className="insight-card">
                <h2>{inView && <CountUp end={24} suffix=" yrs" duration={2.5} />}</h2>
                <p>Young adults aged 15–24 report the highest allergy rates in Australia.</p>
              </div>
            </div>
            <button onClick={() => parallaxRef.current.scrollTo(2)}>
              Explore Solutions
            </button>
          </div>
        </ParallaxLayer>

        {/* SECTION 3 */}
        <ParallaxLayer offset={2} speed={0} factor={1} style={{ backgroundColor: '#fff5f5' }} />
        <ParallaxLayer offset={2} speed={0.2}>
          <div className="image-layer left">
            <img src={Mapsvg} alt="Forest Illustration" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={2} speed={0.5}>
          <div className="text-layer right section3">
            <h1 className="section-title">Track Pollen Levels Near You</h1>
            <p className="section-subtitle">
              Explore live pollen maps, 5-day forecasts, and key insights on what drive allergy risks in your area.
            </p>
            <div className="button-group">
              <Link to="/pollen_watch">
                <button>View Pollen Forecast</button>
              </Link>
              <button onClick={() => parallaxRef.current.scrollTo(3)}>Next: Scan Your Plants</button>
            </div>
          </div>
        </ParallaxLayer>

        {/* SECTION 4 */}
        <ParallaxLayer offset={3} speed={0} factor={1} style={{ backgroundColor: '#e0fff6' }} />
        <ParallaxLayer offset={3} speed={0.2}>
          <div className="image-layer right">
            <img src={ForestSVG} alt="Thesis Illustration" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={3} speed={0.5}>
          <div className="text-layer left section4">
            <h1 className="section-title">Scan and Identify Allergy-Causing Plants</h1>
            <p className="section-subtitle">
              Learn about local plants in Victoria, discover which ones trigger allergies, and scan your own plants to find out if they're safe.
            </p>
            <div className="button-group">
              <Link to="/know_your_plants">
                <button>View Pollen Forecast</button>
              </Link>
              <button onClick={() => parallaxRef.current.scrollTo(4)}>Final Tip: Prevention</button>
            </div>
          </div>
        </ParallaxLayer>

        {/* SECTION 5 */}
        <ParallaxLayer offset={4} speed={0} factor={1} style={{ backgroundColor: '#fffde6' }} />
        <ParallaxLayer offset={4} speed={0.2}>
          <div className="image-layer left">
            <img src={ThesisSVG} alt="Allergy Prevention Illustration" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={4} speed={0.5}>
          <div className="text-layer right section5">
            <h1 className="section-title">Stay One Step Ahead of Allergies</h1>
            <p className="section-subtitle">
              Get practical, science-backed tips to avoid triggers and protect yourself year-round.
            </p>
            <button>Feature coming soon!</button>
          </div>
        </ParallaxLayer>
      </Parallax>

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() => {
            parallaxRef.current.scrollTo(0);
            setShowScrollTop(false);
          }}
        >
          ↑ Back to Top
        </button>
      )}
    </>
  );
}
