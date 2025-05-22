import React, { useRef, useState } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';

import BlowingDandelion from '../assets/blowing-a-dandelion-animate.svg';
import Mapsvg from '../assets/navigation-animate.svg';
import AnalyticsSVG from '../assets/analytics-animate.svg';
import ForestSVG from '../assets/forest-animate.svg';
import ThesisSVG from '../assets/thesis-animate.svg';
import downArrowAnim from '../assets/downanimate1.json';

import './HomePage.css';

export default function HomePage() {
  const parallaxRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });

  const handleScroll = (e) => {
    const page = Math.round(e.target.scrollTop / window.innerHeight);
    setCurrentPage(page);
  };

  return (
    <>
      <Parallax pages={5} ref={parallaxRef} onScrollCapture={handleScroll}>
        {/* SECTION 1 */}
        <ParallaxLayer offset={0} speed={0} factor={1} style={{ backgroundColor: '#f9f9f9' }} />
        <ParallaxLayer offset={0} speed={0.2}>
          <div className="image-layer right mobile-bg">
            <img src={BlowingDandelion} alt="Dandelion" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={0} speed={0.5}>
          <div className="text-layer left section1 mobile-section">
            <h1 className="section-title">New to Victoria?</h1>
            <p className="section-subtitle">
              Your quick guide to staying allergy-free in Victoria — track pollen, identify risky plants, and get smart tips to breathe easy all season.
            </p>
            
 
            {/* <p className="section-subtitle">
            Our smart system uses your local plants and historical data to predict pollen risk using machine learning — helping you stay ahead of allergies.
            </p> */}
            <Link to="/know_your_area">
              <button>Know about pollen in your area</button>
            </Link>
            <p> - Powered by Our Machine Learning Models - </p>
          </div>
        </ParallaxLayer>

        {/* SECTION 2 */}
        <ParallaxLayer offset={1} speed={0} factor={1} style={{ backgroundColor: '#eaf3ff' }} />
        <ParallaxLayer offset={1} speed={0.2}>
          <div className="section2-image mobile-bg">
            <img src={AnalyticsSVG} alt="Analytics Illustration" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={1} speed={0.4}>
          <div ref={ref} className="section2-content mobile-section section2">
            <h1 className="section-title">Why This Matters</h1>
            <p className="section-subtitle">
              Allergies affect millions — and young people in Victoria are among the most at risk.
            </p>
            <div className="insight-cards">
              <div className="insight-card">
                <h2>1st</h2>
                <p>Victoria has the highest number of hay fever cases — followed by NSW and Queensland.</p>
              </div>
              <div className="insight-card">
                <h2>{inView && <CountUp end={26.1} decimals={1} suffix="%" duration={2.5} />}</h2>
                <p>of Victorians suffer from hay fever — that's more than 1 in 4 people.</p>
              </div>
              <div className="insight-card">
                <h2>{inView && <CountUp end={24} suffix=" years" duration={2.5} />}</h2>
                <p>Young adults aged 15–24 report the highest allergy rates in Australia.</p>
              </div>
            </div>
            <button onClick={() => parallaxRef.current.scrollTo(2)}>Explore Solutions</button>
          </div>
        </ParallaxLayer>

        {/* SECTION 3 */}
        <ParallaxLayer offset={2} speed={0} factor={1} style={{ backgroundColor: '#fff5f5' }} />
        <ParallaxLayer offset={2} speed={0.2}>
          <div className="image-layer left mobile-bg">
            <img src={Mapsvg} alt="Map Illustration" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={2} speed={0.5}>
          <div className="text-layer right section3 mobile-section">
            <h1 className="section-title">Track Pollen Levels Near You</h1>
            <p className="section-subtitle">
              Check pollen risk levels across all Victorian districts and see which areas have low, moderate, or high exposure.
            </p>
            <div className="button-group">
              <Link to="/pollen_watch"><button>Visit Pollen Watch</button></Link>
            </div>
          </div>
        </ParallaxLayer>

        {/* SECTION 4 */}
        <ParallaxLayer offset={3} speed={0} factor={1} style={{ backgroundColor: '#e0fff6' }} />
        <ParallaxLayer offset={3} speed={0.2}>
          <div className="image-layer right mobile-bg">
            <img src={ForestSVG} alt="Forest Illustration" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={3} speed={0.5}>
          <div className="text-layer left section4 mobile-section">
            <h1 className="section-title">Scan and Identify Allergy-Causing Plants</h1>
            <p className="section-subtitle">
              Learn about local plants in Victoria, discover which ones trigger allergies, and scan your own plants to find out if they're safe.
            </p>
            <div className="button-group">
              <Link to="/know_your_plants"><button>Scan Plant</button></Link>
            </div>
          </div>
        </ParallaxLayer>

        {/* SECTION 5 */}
        <ParallaxLayer offset={4} speed={0} factor={1} style={{ backgroundColor: '#fffde6' }} />
        <ParallaxLayer offset={4} speed={0.2}>
          <div className="image-layer left mobile-bg">
            <img src={ThesisSVG} alt="Allergy Prevention Illustration" />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={4} speed={0.5}>
          <div className="text-layer right section5 mobile-section">
            <h1 className="section-title">Stay One Step Ahead of Allergies</h1>
            <p className="section-subtitle">
              Get practical, science-backed tips to avoid triggers and protect yourself year-round.
            </p>
            <div className="button-group">
              <Link to="/allergy-guide"><button>Understand Pollen Symptoms</button></Link>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>

      {/* Scroll-to-top button — only show after Section 1 */}
      {currentPage !== 0 && (
      <Lottie
          animationData={downArrowAnim}
          loop
          className="fixed-up-lottie"
          onClick={() => parallaxRef.current.scrollTo(0)}
        />
      )}


      {/* Lottie scroll-down animation — only on Section 1 */}
      {currentPage != 4 && (
        <Lottie
          animationData={downArrowAnim}
          loop
          className="fixed-down-lottie"
          onClick={() => parallaxRef.current.scrollTo(currentPage + 1)}
        />
      )}
    </>
  );
}
