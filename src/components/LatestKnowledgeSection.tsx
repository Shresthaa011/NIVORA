import React, { useState } from 'react';
import { EXPEDITIONS_DATA, DATASETS_DATA, PUBLICATIONS_DATA, MEDIA_DATA } from '../data/mockData';
import { Compass, Database, BookOpen, Film, ArrowRight, Download, ExternalLink, Play } from 'lucide-react';

interface LatestKnowledgeProps {
  onViewRecord: (type: string, record: any) => void;
}

export const LatestKnowledgeSection: React.FC<LatestKnowledgeProps> = ({ onViewRecord }) => {
  const [activeTab, setActiveTab] = useState<'Expeditions' | 'Datasets' | 'Publications' | 'Media'>('Expeditions');

  return (
    <section id="latest-knowledge" className="section-container" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div className="section-header center">
        <span className="section-tag">KNOWLEDGE REPOSITORY ARCHIVE</span>
        <h2 className="section-title">Latest Repository Records</h2>
        <p className="section-subtitle">
          Access newly indexed scientific records, open data repositories, and multimedia archives.
        </p>
      </div>

      {/* Repository Category Tabs */}
      <div className="knowledge-tabs-wrapper">
        <button
          className={`tab-btn ${activeTab === 'Expeditions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Expeditions')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={16} /> Latest Expeditions ({EXPEDITIONS_DATA.length})
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'Datasets' ? 'active' : ''}`}
          onClick={() => setActiveTab('Datasets')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Database size={16} /> Latest Datasets ({DATASETS_DATA.length})
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'Publications' ? 'active' : ''}`}
          onClick={() => setActiveTab('Publications')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} /> Latest Publications ({PUBLICATIONS_DATA.length})
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'Media' ? 'active' : ''}`}
          onClick={() => setActiveTab('Media')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Film size={16} /> Latest Media ({MEDIA_DATA.length})
          </span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="tab-content-grid">
        {activeTab === 'Expeditions' &&
          EXPEDITIONS_DATA.map((exp) => (
            <div key={exp.id} className="knowledge-card">
              <div className="knowledge-header">
                <span className="knowledge-tag" style={{ background: '#E0F2FE', color: '#0369A1' }}>
                  {exp.code}
                </span>
                <span className="knowledge-year">{exp.year}</span>
              </div>
              <h3 className="knowledge-title">{exp.title}</h3>
              <p className="knowledge-desc">{exp.summary}</p>

              <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '16px' }}>
                <strong>Leader:</strong> {exp.leader} • <strong>Generated Datasets:</strong> {exp.datasetsGenerated}
              </div>

              <button
                onClick={() => onViewRecord('Expeditions', exp)}
                className="link-explore"
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 'auto' }}
              >
                <span>View Expedition Log</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}

        {activeTab === 'Datasets' &&
          DATASETS_DATA.map((ds) => (
            <div key={ds.id} className="knowledge-card">
              <div className="knowledge-header">
                <span className="knowledge-tag" style={{ background: '#DCFCE7', color: '#15803D' }}>
                  {ds.format} • {ds.fileSize}
                </span>
                <span className="knowledge-year">{ds.year}</span>
              </div>
              <h3 className="knowledge-title">{ds.title}</h3>
              <p className="knowledge-desc">{ds.abstract}</p>

              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '16px', fontFamily: 'monospace' }}>
                DOI: {ds.doi} | {ds.station}
              </div>

              <button
                onClick={() => onViewRecord('Datasets', ds)}
                className="link-explore"
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 'auto' }}
              >
                <Download size={14} />
                <span>Download / Access Dataset</span>
              </button>
            </div>
          ))}

        {activeTab === 'Publications' &&
          PUBLICATIONS_DATA.map((pub) => (
            <div key={pub.id} className="knowledge-card">
              <div className="knowledge-header">
                <span className="knowledge-tag" style={{ background: '#F3E8FF', color: '#7E22CE' }}>
                  {pub.category}
                </span>
                <span className="knowledge-year">{pub.year}</span>
              </div>
              <h3 className="knowledge-title">{pub.title}</h3>
              <p className="knowledge-desc">{pub.abstract}</p>

              <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '16px' }}>
                <em>{pub.journal}</em> • Citations: {pub.citations}
              </div>

              <button
                onClick={() => onViewRecord('Publications', pub)}
                className="link-explore"
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 'auto' }}
              >
                <ExternalLink size={14} />
                <span>View Paper & Citation</span>
              </button>
            </div>
          ))}

        {activeTab === 'Media' &&
          MEDIA_DATA.map((med) => (
            <div key={med.id} className="knowledge-card">
              <div className="knowledge-header">
                <span className="knowledge-tag" style={{ background: '#FEF3C7', color: '#B45309' }}>
                  {med.type} • {med.durationOrResolution}
                </span>
                <span className="knowledge-year">{med.year}</span>
              </div>
              <h3 className="knowledge-title">{med.title}</h3>
              <p className="knowledge-desc">{med.caption}</p>

              <button
                onClick={() => onViewRecord('Media', med)}
                className="link-explore"
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 'auto' }}
              >
                <Play size={14} />
                <span>Stream Media</span>
              </button>
            </div>
          ))}
      </div>
    </section>
  );
};
