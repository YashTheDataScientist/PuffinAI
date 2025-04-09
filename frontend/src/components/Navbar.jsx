import React from 'react';
import './Navbar.css';
import logo from '../assets/logo2.png';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="PuffinAI Logo" className="logo" />
        <span className="brand">
          Puffin<span className="highlight">AI</span>
        </span>
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/pollen_watch">Pollen Watch</Link>
        <Link to="/know_your_plants">Know Your Plants </Link>
        <Link to="/pollen">Pollen 101</Link>
        <Link to="/scan">Allergy Shield</Link>
        <Link to="/scan">Health Impact </Link>
      </div>
    </nav>
  );
};

export default Navbar;
