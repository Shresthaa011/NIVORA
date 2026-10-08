import React, { useState } from 'react';
import { Search, ArrowRight, Database, BookOpen, Compass, Lightbulb, Share2 } from 'lucide-react';


interface HeroSectionProps {
  onSearchSubmit: (query: string) => void;
  onOpenSearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchSubmit, onOpenSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const suggestedSearches = [
    'Antarctic Expeditions',
    'Bharati Station',
    'Climate Research',
    'Glacier Studies'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    } else {
      onOpenSearch();
    }
  };

  const handlePillClick = (term: string) => {
    setSearchQuery(term);
    onSearchSubmit(term);
  };

  return (
    <section id="hero" className="hero-section">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-bg-video"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero-grid-pattern"></div>

      <div className="hero-content">
        <h1 className="hero-title">
          Explore India's Polar Science
        </h1>

        <p className="hero-subtitle">
          Discover expeditions, research, datasets, publications and stories from India's journey across the polar regions.
        </p>

        {/* Prominent Search Bar */}
        <form onSubmit={handleFormSubmit} className="hero-search-container">
          <Search size={19} className="hero-search-icon" />
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search reports, datasets, research, expeditions, media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hero-search-btn">
            <span>Search</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Suggested Searches */}
        <div className="suggested-searches">
          <span className="suggested-label">Suggested:</span>
          {suggestedSearches.map((term) => (
            <button
              key={term}
              type="button"
              className="suggested-pill"
              onClick={() => handlePillClick(term)}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Scientific Workflow Pipeline Strip */}
        <div className="workflow-strip">
          <div className="workflow-step active">
            <Database size={12} />
            <span>Scientific Data</span>
          </div>
          <span className="workflow-arrow">→</span>
          <div className="workflow-step active">
            <BookOpen size={12} />
            <span>Knowledge</span>
          </div>
          <span className="workflow-arrow">→</span>
          <div className="workflow-step active">
            <Compass size={12} />
            <span>Discovery</span>
          </div>
          <span className="workflow-arrow">→</span>
          <div className="workflow-step active">
            <Lightbulb size={12} />
            <span>Understanding</span>
          </div>
          <span className="workflow-arrow">→</span>
          <div className="workflow-step active">
            <Share2 size={12} />
            <span>Outreach</span>
          </div>
        </div>
      </div>
    </section>
  );
};
