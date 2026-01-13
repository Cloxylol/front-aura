import React from 'react';
import { Home, User, Bell, Search, Sparkles } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = ({ activePage, onNavigate, auraEnabled, onToggleAura, score }) => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="flex items-center gap-md">
          <div className="logo text-gradient" onClick={() => onNavigate('home')}>
            AURA
          </div>
          {auraEnabled && (
            <div className="aura-score-badge">
              <Sparkles size={16} />
              <span>{score.toLocaleString()} Aura</span>
            </div>
          )}
        </div>

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Rechercher..." />
        </div>

        <div className="nav-links">
          <button
            className={`aura-toggle-btn ${auraEnabled ? 'active' : ''}`}
            onClick={onToggleAura}
            title="Activer/Désactiver le Score Aura"
          >
            {auraEnabled ? 'Aura ON' : 'Aura OFF'}
          </button>

          <button
            className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <Home size={24} />
          </button>
          <button className="nav-item">
            <Bell size={24} />
          </button>
          <button
            className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
            onClick={() => onNavigate('profile')}
          >
            <User size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
