
import React, { useRef } from 'react';
import Lottie from 'lottie-react';
import PlantIdentifier from '../components/PlantIdentifier';
import PlantGallery from '../components/PlantGallery';

import downArrowAnim from '../assets/downanimate1.json';
import scanPhotoImg from '../assets/scanphotobg.svg';
import plantGalleryImg from '../assets/plantgallerybg.svg';



import './PlantIdentifyPage.css';

const PlantIdentifyPage = () => {
  const topBannerRef = useRef(null);
  const scanRef = useRef(null);
  const galleryRef = useRef(null);

  const sectionRefs = [topBannerRef, scanRef, galleryRef];

  const scrollToNextSection = () => {
    const currentIndex = sectionRefs.findIndex(ref => {
      const rect = ref.current?.getBoundingClientRect();
      return rect && rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    });

    const nextIndex = Math.min(currentIndex + 1, sectionRefs.length - 1);
    sectionRefs[nextIndex].current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    topBannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="plant-identify-page">
      {/* Section 1 */}
      <div ref={topBannerRef} className="top-banner">
        <div className="panel left-panel">
          <div className="content">
            <h2>Point, scan, and explore the plants in your Victorian surroundings.</h2>
            <button onClick={() => scanRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started
            </button>
          </div>
          <img src={scanPhotoImg} alt="Scan Plant" className="panel-img" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h2>Curious about plants that trigger allergies? Explore our Plant Gallery.</h2>
            <button onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started
            </button>
          </div>
          <img src={plantGalleryImg} alt="Plant Gallery" className="panel-img" />
        </div>
      </div>

      {/* Section 2 */}
      <div ref={scanRef}>
        <PlantIdentifier />
      </div>

      {/* Section 3 */}
      <div ref={galleryRef}>
        <PlantGallery />
      </div>

      {/*  Down arrow */}
      <Lottie
        animationData={downArrowAnim}
        loop
        className="identify-down-arrow"
        onClick={scrollToNextSection}
      />

      {/*  Always show up arrow */}
      <Lottie
        animationData={downArrowAnim}
        loop
        className="identify-up-arrow"
        onClick={scrollToTop}
      />


    
    <div className="explore-section">
    <h3>Next Steps</h3>

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
  );
};

export default PlantIdentifyPage;
