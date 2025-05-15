// src/components/Footer.jsx
import React from 'react';
import './Footer.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h2 className="brand-name">Puffin AI</h2>
        <p className="tagline">Making your move to Australia safer—free from pollen worries.</p>
      </div>

      <div className="footer-center">
        <a href="/">Home</a>
        <a href="/pollen_watch">Pollen Watch</a>
        <a href="/symptoms">Symptoms</a>
        <a href="/asthma_info">Asthma</a>
      </div>

      <div className="footer-right">
        <a href="https://github.com/" target="_blank" rel="noreferrer"><FaGithub /></a>
        <a href="https://linkedin.com/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
        <a href="mailto:contact@puffinai.org"><FaEnvelope /></a>
      </div>
    </footer>
  );
}
