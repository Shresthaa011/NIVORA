import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-institutional">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ background: '#0284C7', padding: '6px', borderRadius: '6px', color: 'white' }}>
                <Compass size={22} />
              </div>
              <span className="footer-brand-title">POLAR EXPLORER</span>
            </div>
            <p className="footer-subtitle">
              Integrated Polar Science Outreach, Knowledge Repository & Media Dissemination Portal.
              Developed for National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Govt. of India.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} style={{ color: '#38BDF8' }} />
              <span>Smart India Hackathon (SIH) Solution</span>
            </div>
          </div>

          {/* Repository Links */}
          <div>
            <h4 className="footer-col-title">Repository</h4>
            <ul className="footer-links">
              <li><a href="#quick-explore">Expeditions</a></li>
              <li><a href="#quick-explore">Datasets</a></li>
              <li><a href="#featured-research">Publications</a></li>
              <li><a href="#latest-knowledge">Media Archive</a></li>
              <li><a href="#polar-world-map">Polar Stations</a></li>
            </ul>
          </div>

          {/* Outreach & Science */}
          <div>
            <h4 className="footer-col-title">Outreach & AI</h4>
            <ul className="footer-links">
              <li><a href="#science-stories">Science Stories</a></li>
              <li><a href="#science-stories">Science Briefs</a></li>
              <li><a href="#ask-polar-ai">Ask Polar AI</a></li>
              <li><a href="#quick-explore">Learning Portal</a></li>
              <li><a href="#hero">Social Dissemination</a></li>
            </ul>
          </div>

          {/* Institutional Policies */}
          <div>
            <h4 className="footer-col-title">Government Policy</h4>
            <ul className="footer-links">
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); alert('National Open Data Licensing policy applies to all public NCPOR datasets.'); }}>Open Data License</a></li>
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); alert('Compliant with GIGW (Guidelines for Indian Government Websites) accessibility standards.'); }}>Accessibility Statement</a></li>
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); alert('Privacy Policy compliant with DPDP Act, Government of India.'); }}>Privacy Policy</a></li>
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); alert('Terms of Service for Institutional Research Access.'); }}>Terms of Service</a></li>
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); alert('NCPOR Head Office: Headland Sada, Vasco da Gama, Goa - 403804, India.'); }}>Contact NCPOR</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Govt. of India. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#hero" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy</a>
            <span>•</span>
            <a href="#hero" style={{ color: '#94A3B8', textDecoration: 'none' }}>Accessibility</a>
            <span>•</span>
            <a href="#hero" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
