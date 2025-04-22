import { useState } from 'react';
import styles from './PlantIdentifier.module.css';
const API_URL = 'https://eqysflxgv2.execute-api.ap-southeast-2.amazonaws.com/prod/plant_identify'; 

const PlantIdentifier = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setImagePreview(reader.result);
      handleSubmit(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (base64) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64 }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ message: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (result.message) return <p className={styles.infoText}>{result.message}</p>;
    const best = result.results?.[0];
    if (!best) return <p className={styles.infoText}>No match found.</p>;
    return (
      <div className={styles.resultBox}>
        <h4>Best Match:</h4>
        <p><strong>Name:</strong> {best.species.scientificNameWithoutAuthor}</p>
        <p><strong>Score:</strong> {(best.score * 100).toFixed(2)}%</p>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
        <h3 className={styles.title}>Plant Identifier</h3>
        <input
            type="file"
            accept="image/*"
            id="fileUpload"
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
        <label htmlFor="fileUpload" className={styles.uploadBtn}>Upload Plant Image</label>
        {imagePreview && (
        <img src={imagePreview} alt="preview" className={styles.preview} />
        )}
        {loading && <div className={styles.spinner}></div>}
        {renderResult()}
    </div>
  );
};

export default PlantIdentifier;
