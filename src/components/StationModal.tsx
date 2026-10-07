import React from 'react';
import type { Station } from '../types/polar';
import { X, MapPin, Calendar, CheckCircle } from 'lucide-react';

interface StationModalProps {
  station: Station | null;
  onClose: () => void;
}

export const StationModal: React.FC<StationModalProps> = ({ station, onClose }) => {
  if (!station) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
          <img src={station.image} alt={station.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(10,30,54,0.85)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, display: 'block' }}>{station.region}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{station.name}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748B', marginBottom: '16px', fontFamily: 'monospace' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} /> {station.coordinates}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> Est. {station.established}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284C7', fontWeight: 600 }}>
            <CheckCircle size={14} /> {station.status}
          </span>
        </div>

        <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: '24px' }}>
          {station.description}
        </p>

        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F2238', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Key Research Thrust Areas:
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {station.keyResearchAreas.map((area) => (
            <span key={area} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#1E293B', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 500 }}>
              {area}
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#F8FAFC', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284C7' }}>{station.expeditionsCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Expeditions</div>
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284C7' }}>{station.datasetsCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Datasets</div>
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284C7' }}>{station.publicationsCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Publications</div>
          </div>
        </div>
      </div>
    </div>
  );
};
