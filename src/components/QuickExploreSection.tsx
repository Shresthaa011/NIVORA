import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Database, BookOpen, Image, MapPin, GraduationCap } from 'lucide-react';

interface QuickExploreProps {
  onCardClick: (targetId: string) => void;
}

export const QuickExploreSection: React.FC<QuickExploreProps> = ({ onCardClick }) => {
  const cards = [
    {
      id: 'expeditions',
      title: 'Expeditions',
      desc: "Explore India's polar expeditions",
      icon: <Compass size={24} />,
      path: '/repository/reports'
    },
    {
      id: 'datasets',
      title: 'Datasets',
      desc: 'Discover scientific datasets',
      icon: <Database size={24} />,
      path: '/repository/datasets'
    },
    {
      id: 'publications',
      title: 'Publications',
      desc: 'Find research and publications',
      icon: <BookOpen size={24} />,
      path: '/repository/publications'
    },
    {
      id: 'media',
      title: 'Media',
      desc: 'Explore photos and videos',
      icon: <Image size={24} />,
      path: '/repository/media'
    },
    {
      id: 'polar-map',
      title: 'Polar Map',
      desc: 'Explore polar research locations',
      icon: <MapPin size={24} />,
      target: 'polar-world-map'
    },
    {
      id: 'learning',
      title: 'Learning',
      desc: 'Learn polar science',
      icon: <GraduationCap size={24} />,
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
                <div className="quick-card-icon">{card.icon}</div>
                <div>
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
              <div className="quick-card-icon">{card.icon}</div>
              <div>
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
