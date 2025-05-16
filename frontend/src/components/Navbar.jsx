import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../assets/logo2.png';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo-link">
          <img src={logo} alt="PuffinAI Logo" className="logo" />
          <span className="brand">
            Puffin<span className="highlight">AI</span>
          </span>
        </Link>
      </div>

      <div className={`nav-right ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <Link to="/know_your_area" className={isActive('/know_your_area') ? 'active' : ''}>Know Your Area</Link>
        <Link to="/pollen_watch" className={isActive('/pollen_watch') ? 'active' : ''}>Pollen Watch</Link>
        <Link to="/know_your_plants" className={isActive('/know_your_plants') ? 'active' : ''}>Know Your Plants</Link>
        <Link to="/symptoms" className={isActive('/symptoms') ? 'active' : ''}>Symptoms</Link>
        <Link to="/learn" className={isActive('/learn') ? 'active' : ''}>Learn</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu} ref={hamburgerRef}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
