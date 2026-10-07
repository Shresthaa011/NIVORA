import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { FEATURED_RESEARCH, DATASETS_DATA, PUBLICATIONS_DATA, EXPEDITIONS_DATA, STATIONS_DATA } from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onSelectResult: (type: string, item: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, initialQuery = '', onSelectResult }) => {
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<string>('All');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  if (!isOpen) return null;

  const rawResults: any[] = [
    ...STATIONS_DATA.map((s) => ({ ...s, itemType: 'Station' })),
    ...FEATURED_RESEARCH.map((r) => ({ ...r, itemType: 'Research' })),
    ...DATASETS_DATA.map((d) => ({ ...d, itemType: 'Dataset' })),
    ...PUBLICATIONS_DATA.map((p) => ({ ...p, itemType: 'Publication' })),
    ...EXPEDITIONS_DATA.map((e) => ({ ...e, itemType: 'Expedition' }))
  ];

  const searchResults = rawResults.filter((item: any) => {
    if (filterType !== 'All' && item.itemType !== filterType) return false;
    if (!query.trim()) return true;

    const title = (item.title || item.name || '').toLowerCase();
    const desc = (item.shortDescription || item.description || item.abstract || item.summary || '').toLowerCase();
    const q = query.toLowerCase();

    return title.includes(q) || desc.includes(q);
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Search Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
          <Search size={22} style={{ color: '#0284C7' }} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all polar datasets, papers, stations, expeditions..."
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1.2rem', fontFamily: 'var(--font-main)' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['All', 'Station', 'Research', 'Dataset', 'Publication', 'Expedition'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                background: filterType === t ? '#0A1E36' : '#F1F5F9',
                color: filterType === t ? 'white' : '#475569',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {searchResults.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
              No records match your query "{query}". Try searching for "Bharati", "Glacier", "Atmosphere", or "Dataset".
            </div>
          ) : (
            searchResults.map((item: any, idx: number) => (
              <div
                key={idx}
                onClick={() => {
                  onClose();
                  onSelectResult(item.itemType, item);
                }}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: 'white'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0284C7')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#E0F2FE', color: '#0369A1' }}>
                    {item.itemType}
                  </span>
                  <ArrowRight size={14} style={{ color: '#94A3B8' }} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F2238' }}>{item.title || item.name}</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.shortDescription || item.description || item.abstract || item.summary}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
