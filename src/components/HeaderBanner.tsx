import React from 'react';

export const HeaderBanner: React.FC = () => {
  return (
    <div className="gov-top-bar">
      <div className="gov-container">
        <div className="gov-left">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E2E8F0', fontWeight: 600 }}>
            <span style={{ fontSize: '0.9rem' }}>🇮🇳</span>
            GOVERNMENT OF INDIA
          </span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span className="gov-badge">MINISTRY OF EARTH SCIENCES (MoES)</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ color: '#94A3B8' }}>NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR)</span>
        </div>
        <div className="gov-right">
          <span style={{ cursor: 'pointer', color: '#E2E8F0' }}>English</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ cursor: 'pointer', color: '#94A3B8' }}>हिन्दी</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px', fontSize: '0.7rem' }}>
            SIH 2024 INSTITUTIONAL PORTAL
          </span>
        </div>
      </div>
    </div>
  );
};
