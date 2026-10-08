import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Database, BookOpen, Compass, Lightbulb, Share2 } from 'lucide-react';
import { fetchRepositoryStats, type RepositoryStats } from '../services/api';


interface HeroSectionProps {
  onSearchSubmit: (query: string) => void;
  onOpenSearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchSubmit, onOpenSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<RepositoryStats | null>(null);

  useEffect(() => {
    fetchRepositoryStats().then(setStats).catch(console.warn);
  }, []);

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
      <div className="hero-bg-overlay"></div>
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
          <Search size={22} className="hero-search-icon" />
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search reports, datasets, research, expeditions, media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="kbd-shortcut">Ctrl K</span>
          <button type="submit" className="hero-search-btn">
            <span>Search</span>
            <ArrowRight size={18} />
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

        {/* Dynamic Backend Stats Strip */}
        {stats && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'flex-start', flexWrap: 'wrap', fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'monospace' }}>
            <span><strong style={{ color: '#38BDF8' }}>{stats.expeditions_count}</strong> Expeditions</span>
            <span>•</span>
            <span><strong style={{ color: '#2DD4BF' }}>{stats.reports_count}</strong> Scientific Reports</span>
            <span>•</span>
            <span><strong style={{ color: '#38BDF8' }}>{stats.datasets_count}</strong> Open Datasets</span>
            <span>•</span>
            <span><strong style={{ color: '#C084FC' }}>{stats.publications_count}</strong> Publications</span>
            <span>•</span>
            <span><strong style={{ color: '#FBBF24' }}>{stats.media_count}</strong> Media Records</span>
          </div>
        )}

        {/* Scientific Workflow Pipeline Strip */}
        <div className="workflow-strip">
          <div className="workflow-step active">
            <Database size={14} />
            <span>Scientific Data</span>
          </div>
          <span className="workflow-arrow">→</span>
          <div className="workflow-step active">
            <BookOpen size={14} />
            <span>Knowledge</span>
          </div>
          <span className="workflow-arrow">→</span>
          <div className="workflow-step active">
            <Compass size={14} />
            <span>Discovery</span>
          </div>
          <span className="workflow-arrow">→</span>
          <div className="workflow-step active">
            <Lightbulb size={14} />
            <span>Understanding</span>
          </div>
          <span className="workflow-arrow">→</span>
          <div className="workflow-step active">
            <Share2 size={14} />
            <span>Outreach</span>
          </div>
        </div>
      </div>
    </section>
  );
};
