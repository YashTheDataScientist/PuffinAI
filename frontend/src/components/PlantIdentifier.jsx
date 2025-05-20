

import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Lottie from 'lottie-react';
import loadingLottie from '../assets/loading.json';
import './PlantIdentifier.css';
import { fetchQueryResult } from './Safequery';

import cameraPlantIcon from '../assets/cameraplant.png';
import picturePlantIcon from '../assets/pictureplant.png';
import curatedIcon from '../assets/curated.png';
import privacyIcon from '../assets/privacy.png';
import safeIcon from '../assets/safe.png';

const videoConstraints = {
  facingMode: 'environment',
};

const PlantIdentifier = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const handleSubmit = async (base64) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await fetchQueryResult('1', { image_base64: base64 });
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ message: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // ✅ Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (jpg, png, etc.)");
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setImagePreview(reader.result);
      handleSubmit(base64);
    };
    reader.readAsDataURL(file);
  };
  

  const captureFromWebcam = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const base64 = imageSrc.split(',')[1];
      setImagePreview(imageSrc);
      handleSubmit(base64);
      setShowCamera(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (result.message) return <p className="info-text">{result.message}</p>;

    const best = result.plantnet_result;
    if (!best) return <p className="info-text">No match found.</p>;

    const allergicInfoAvailable = result.allergic_info && Object.keys(result.allergic_info).length > 0;

    return (
      <div className="result-box">
        <h4>Best Match</h4>
        <p><strong>Name:</strong> {best.species?.scientificNameWithoutAuthor}</p>
        
        <p><strong>Description:</strong> {result.wikipedia_summary || "No description available."}</p>

        {allergicInfoAvailable ? (
          <>
            <p><strong>Allergic Level:</strong> {result.allergic_info.allergy_level}</p>
            <p><strong>Flowering Season:</strong> {result.allergic_info.flowering_season}</p>
          </>
        ) : (
          <p className="info-text">Not a common pollen plant in Victoria</p>
        )}
      </div>
    );
  };

  return (
    <div className="wrapper">
      <div className="plant-overlay">
        {!imagePreview ? (
          <>
            <h3 className="title">WANT TO KNOW IF THE PLANT NEAR YOU IS POLLEN SAFE?</h3>

            <div className="upload-options">
              <div className="option-card" onClick={() => setShowCamera(true)}>
                <img src={cameraPlantIcon} alt="camera" />
                <p>Take a Photo</p>
              </div>

              <label className="option-card">
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                <img src={picturePlantIcon} alt="upload" />
                <p>Upload from your device</p>
              </label>
            </div>

            {showCamera && (
              <div className="camera-overlay">
                <div className="camera-box">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="camera-frame"
                  />
                  <div className="camera-buttons">
                    <button className="capture-btn" onClick={captureFromWebcam}>Capture Photo</button>
                    <button className="reset-btn" onClick={() => setShowCamera(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}


            <div className="info-section">
              <div className="info-row">
                <div className="info-box">
                  <img src={curatedIcon} alt="curated" className="info-icon" />
                  Curated for common plants and allergies in <strong>Victoria</strong>.
                </div>
                <div className="info-box">
                  <img src={privacyIcon} alt="privacy" className="info-icon" />
                  Your images never leave your device — we don’t store them.
                </div>
                <div className="info-box">
                  <img src={safeIcon} alt="safe" className="info-icon" />
                  Stay safe with our AI — smart scanning, better awareness.
                </div>
              </div>
            </div>
          </>
        ) : (
            <div className="result-wrapper">
              <h3 className="result-title">Here’s what we found!</h3>

              <div className="result-view">
                <div className="upload-left-panel">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    className="reset-btn"
                    onClick={() => {
                      setImagePreview(null);
                      setResult(null);
                      setLoading(false);
                    }}
                  >
                    Take Again
                  </button>
                </div>

                <div className="upload-right-panel">
                  {loading ? (
                    <Lottie
                      animationData={loadingLottie}
                      loop={true}
                      style={{ width: 280, height: 280 }}
                    />
                  ) : (
                    <div className="result-content">
                      {renderResult()}
                      <div className="more-info-box">
                        Scroll down to look at the common allergenic plants in Victoria ⬇️
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


        )}
      </div>
    </div>
  );
};

export default PlantIdentifier;
