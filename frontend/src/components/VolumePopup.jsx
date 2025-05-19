import React, { useEffect } from 'react';
import './VolumePopup.css';

const VolumePopup = ({ visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="volume-popup">
      🔊 Please increase your volume for better experience
    </div>
  );
};

export default VolumePopup;
