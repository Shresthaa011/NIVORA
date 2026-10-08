import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, User, Menu, X } from 'lucide-react';


interface NavbarProps {
  onOpenSearch?: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', target: 'hero', path: '/' },
    { label: 'Repository', target: 'repository', path: '/repository' },
    { label: 'Expeditions', target: 'latest-knowledge', path: '/repository/reports' },
    { label: 'Datasets', target: 'datasets', path: '/repository/datasets' },
    { label: 'Publications', target: 'research', path: '/repository/publications' },
    { label: 'Media', target: 'media', path: '/repository/media' },
  ];

  const handleNavClick = (label: string, item: any) => {
    setActiveLink(label);
    setMobileMenuOpen(false);
    if (item.path) {
      navigate(item.path);
    } else {
      onScrollToSection(item.target);
    }
  };


  return (
    <nav className="navbar-sticky">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setActiveLink('Home')}>
          <div className="nav-logo-icon">
            <Compass size={22} strokeWidth={2.5} />
          </div>
          <div className="nav-title-box">
            <span className="nav-title">POLAR EXPLORER</span>
            <span className="nav-subtitle">India's Polar Knowledge Portal</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`nav-link ${activeLink === item.label ? 'active' : ''}`}
                onClick={() => handleNavClick(item.label, item)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>


        {/* Right Actions */}
        <div className="nav-actions">
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
