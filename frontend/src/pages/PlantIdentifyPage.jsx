import React, { useRef } from 'react';
import PlantIdentifier from '../components/PlantIdentifier';
import PlantGallery from '../components/PlantGallery';
import PlantCarousel from '../components/PlantCarousel';
import './PlantIdentifyPage.css';

import scanPhotoImg from '../assets/scanphotobg.svg';
import plantGalleryImg from '../assets/plantgallerybg.svg';

const PlantIdentifyPage = () => {
  const scanRef = useRef(null);
  const galleryRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="plant-identify-page">
      <div className="top-banner">
        <div className="panel left-panel">
          <div className="content">
            <h2>Point, scan, and explore the plants in your surroundings.</h2>
            <button onClick={() => scrollToSection(scanRef)}>Get Started</button>
          </div>
          <img src={scanPhotoImg} alt="Scan Plant" className="panel-img" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h2>Curious about plants that trigger allergies? Explore our Plant Gallery.</h2>
            <button onClick={() => scrollToSection(galleryRef)}>Get Started</button>
          </div>
          <img src={plantGalleryImg} alt="Plant Gallery" className="panel-img" />
        </div>
      </div>

      <div ref={scanRef}><PlantIdentifier /></div>
      <div ref={galleryRef}><PlantGallery /></div>
      <PlantCarousel />
    </div>
  );
};

export default PlantIdentifyPage;
