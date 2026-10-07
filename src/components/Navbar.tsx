import React, { useState } from 'react';
import { Compass, Search, Sparkles, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onScrollToSection }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', target: 'hero' },
    { label: 'Explore', target: 'quick-explore' },
    { label: 'Expeditions', target: 'latest-knowledge' },
    { label: 'Research', target: 'featured-research' },
    { label: 'Media', target: 'latest-knowledge' },
    { label: 'Learn', target: 'science-stories' },
  ];

  const handleNavClick = (label: string, target: string) => {
    setActiveLink(label);
    setMobileMenuOpen(false);
    onScrollToSection(target);
  };

  return (
    <nav className="navbar-sticky">
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#hero" className="nav-brand" onClick={(e) => { e.preventDefault(); handleNavClick('Home', 'hero'); }}>
          <div className="nav-logo-icon">
            <Compass size={22} strokeWidth={2.5} />
          </div>
          <div className="nav-title-box">
            <span className="nav-title">POLAR EXPLORER</span>
            <span className="nav-subtitle">India's Polar Knowledge Portal</span>
          </div>
        </a>

        {/* Center Navigation Links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={`#${item.target}`}
                className={`nav-link ${activeLink === item.label ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.label, item.target);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          <button
            className="btn-nav-search"
            onClick={onOpenSearch}
            title="Search Platform (Ctrl + K)"
          >
            <Search size={16} />
            <span className="kbd-shortcut" style={{ fontSize: '0.7rem' }}>⌘K</span>
          </button>

          <button
            className="btn-ask-ai"
            onClick={() => onScrollToSection('ask-polar-ai')}
          >
            <Sparkles size={16} />
            <span>Ask Polar AI</span>
          </button>

          <button
            className="btn-nav-search"
            style={{ padding: '8px', borderRadius: '50%' }}
            title="User Profile / Sign In"
            onClick={() => alert('Researcher & Institutional Portal Access: Sign-in modal backend integration ready.')}
          >
            <User size={18} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="btn-nav-search"
            style={{ display: 'none', padding: '8px' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
