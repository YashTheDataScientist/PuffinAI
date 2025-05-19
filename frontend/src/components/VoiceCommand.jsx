


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceCommand.css';
import micIcon from '../assets/microphone.png';
import VolumePopup from './VolumePopup';

const VoiceCommand = () => {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const speakInstructionsAndListen = () => {
    setShowPopup(true); // Show volume suggestion

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-AU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const utterance = new SpeechSynthesisUtterance(
      "Say a command like: Open Pollen Dashboard, Open Pollen Plants, Open Allergy Guide, Open Learn Pollen, or Open Pollen Watch."
    );
    utterance.lang = 'en-AU';

    utterance.onend = () => {
      recognition.start();
      setListening(true);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setListening(false);

      if (transcript.includes("open pollen dashboard")) {
        navigate('/know_your_area');
      } else if (transcript.includes("open pollen plants")) {
        navigate('/know_your_plants');
      } else if (transcript.includes("open allergy guide")) {
        navigate('/allergy-guide');
      } else if (transcript.includes("open learn pollen")) {
        navigate('/learn');
      } else if (transcript.includes("open pollen watch")) {
        navigate('/pollen_watch');
      } else {
        speechSynthesis.speak(new SpeechSynthesisUtterance("Sorry, I didn't catch that."));
        alert("Sorry, I didn't understand. Try saying 'Open Pollen Dashboard'.");
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return (
    <>
      <div className="voice-btn" onClick={speakInstructionsAndListen} title="Voice Command">
        <img src={micIcon} alt="Mic icon" />
        {listening && <span className="voice-tooltip">Listening...</span>}
      </div>
      <VolumePopup visible={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
};

export default VoiceCommand;
