import React from 'react';
import { FEATURED_RESEARCH } from '../data/mockData';
import type { ResearchItem } from '../types/polar';
import { ArrowRight, Calendar, Building, FileText } from 'lucide-react';

interface FeaturedResearchProps {
  onSelectResearch: (research: ResearchItem) => void;
}

export const FeaturedResearchSection: React.FC<FeaturedResearchProps> = ({ onSelectResearch }) => {
  return (
    <section id="featured-research" className="section-container">
      <div className="section-header">
        <span className="section-tag">SCIENTIFIC PUBLICATIONS & FINDINGS</span>
        <h2 className="section-title">Featured Polar Research</h2>
        <p className="section-subtitle">
          Peer-reviewed studies and key scientific breakthroughs led by Indian polar researchers.
        </p>
      </div>

      <div className="featured-grid">
        {FEATURED_RESEARCH.map((item) => (
          <div key={item.id} className="research-card">
            <div className="research-img-box">
              <img src={item.image} alt={item.title} className="research-img" />
              <span className="research-cat-tag">{item.category}</span>
            </div>

            <div className="research-body">
              <div className="research-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {item.year}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={14} /> {item.datasetsAssociatedCount} Datasets Linked
                </span>
              </div>

              <h3 className="research-title">{item.title}</h3>
              <p className="research-desc">{item.shortDescription}</p>

              <div className="research-footer">
                <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={12} /> {item.leadInstitution.split('(')[0].trim()}
                </span>

                <button
                  onClick={() => onSelectResearch(item)}
                  className="link-explore"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span>Explore Research</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
