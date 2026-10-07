import React from 'react';
import { SCIENCE_STORIES } from '../data/mockData';
import type { ScienceStory } from '../types/polar';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';

interface ScienceStoriesProps {
  onSelectStory: (story: ScienceStory) => void;
}

export const ScienceStoriesSection: React.FC<ScienceStoriesProps> = ({ onSelectStory }) => {
  return (
    <section id="science-stories" className="section-container">
      <div className="section-header">
        <span className="section-tag">PUBLIC OUTREACH & MEDIA DISSEMINATION</span>
        <h2 className="section-title">From Research to Stories</h2>
        <p className="section-subtitle">
          Making India's polar science accessible to everyone.
        </p>
      </div>

      <div className="stories-grid">
        {SCIENCE_STORIES.map((story) => (
          <div key={story.id} className="story-card">
            <div className="story-img-box">
              <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span className="story-type-badge">{story.type}</span>
            </div>

            <div className="story-body">
              <div className="story-meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {story.readTime}
                </span>
                <span style={{ margin: '0 6px' }}>•</span>
                <span>{story.date}</span>
              </div>

              <h3 className="story-title">{story.title}</h3>
              <p className="story-summary">{story.summary}</p>

              <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Grounded In Peer-Reviewed Research:
                </span>
                <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={12} /> {story.originalResearchTitle}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} /> {story.author}
                </span>

                <button
                  onClick={() => onSelectStory(story)}
                  className="link-explore"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span>Read Story</span>
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
