import React from 'react';
import { X, FileText, Download } from 'lucide-react';

interface RecordModalProps {
  type: string | null;
  record: any;
  onClose: () => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({ type, record, onClose }) => {
  if (!record) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px' }}>
          <FileText size={14} />
          {type || 'Repository Record'}
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F2238', marginBottom: '12px', lineHeight: 1.3 }}>
          {record.title || record.name}
        </h2>

        {record.doi && (
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'monospace', marginBottom: '16px' }}>
            DOI: {record.doi}
          </div>
        )}

        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
            ABSTRACT / SUMMARY:
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
            {record.abstract || record.summary || record.fullDescription || record.shortDescription || record.caption}
          </p>
        </div>

        {record.keyMilestones && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F2238', marginBottom: '8px' }}>Key Expedition Milestones:</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: '#475569' }}>
              {record.keyMilestones.map((m: string, i: number) => (
                <li key={i} style={{ marginBottom: '4px' }}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={() => alert(`API Integration Notice: Downloading/fetching full record data for ${record.id || 'resource'}`)}
            style={{
              background: '#0284C7',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={16} />
            Access Record / File
          </button>
        </div>
      </div>
    </div>
  );
};
