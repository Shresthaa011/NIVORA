import React from 'react';
import { Link } from 'react-router-dom';

interface QuickExploreProps {
  onCardClick: (targetId: string) => void;
}

export const QuickExploreSection: React.FC<QuickExploreProps> = ({ onCardClick }) => {
  const cards = [
    {
      id: 'expeditions',
      title: 'Expeditions',
      desc: "Explore India's polar expeditions",
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
      path: '/repository/reports'
    },
    {
      id: 'datasets',
      title: 'Datasets',
      desc: 'Discover scientific datasets',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      path: '/repository/datasets'
    },
    {
      id: 'publications',
      title: 'Publications',
      desc: 'Find research and publications',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
      path: '/repository/publications'
    },
    {
      id: 'media',
      title: 'Media',
      desc: 'Explore photos and videos',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      path: '/repository/media'
    },
    {
      id: 'polar-map',
      title: 'Polar Map',
      desc: 'Explore polar research locations',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80',
      target: 'polar-world-map'
    },
    {
      id: 'learning',
      title: 'Learning',
      desc: 'Learn polar science',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
      target: 'science-stories'
    }
  ];

  return (
    <section id="quick-explore" className="section-container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="quick-explore-grid">
        {cards.map((card) => {
          if (card.path) {
            return (
              <Link key={card.id} to={card.path} className="quick-card" style={{ textDecoration: 'none' }}>
                <div className="quick-card-img-wrapper">
                  <img src={card.image} alt={card.title} className="quick-card-img" />
                </div>
                <div className="quick-card-content">
                  <h3 className="quick-card-title">{card.title}</h3>
                  <p className="quick-card-desc">{card.desc}</p>
                </div>
              </Link>
            );
          }
          return (
            <div
              key={card.id}
              className="quick-card"
              onClick={() => onCardClick(card.target!)}
              role="button"
              tabIndex={0}
            >
              <div className="quick-card-img-wrapper">
                <img src={card.image} alt={card.title} className="quick-card-img" />
              </div>
              <div className="quick-card-content">
                <h3 className="quick-card-title">{card.title}</h3>
                <p className="quick-card-desc">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

