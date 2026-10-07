import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Database, BookOpen, Film, ArrowRight, Download, ExternalLink, Play } from 'lucide-react';
import {
  fetchReports, fetchDatasets, fetchPublications, fetchMedia,
  type RepositoryReport, type RepositoryDataset, type RepositoryPublication, type RepositoryMedia,
  getFileDownloadUrl
} from '../services/api';
import { EXPEDITIONS_DATA } from '../data/mockData';

interface LatestKnowledgeProps {
  onViewRecord: (type: string, record: any) => void;
}

export const LatestKnowledgeSection: React.FC<LatestKnowledgeProps> = ({ onViewRecord }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Expeditions' | 'Datasets' | 'Publications' | 'Media'>('Expeditions');

  const [reports, setReports] = useState<RepositoryReport[]>([]);
  const [datasets, setDatasets] = useState<RepositoryDataset[]>([]);
  const [publications, setPublications] = useState<RepositoryPublication[]>([]);
  const [media, setMedia] = useState<RepositoryMedia[]>([]);

  useEffect(() => {
    fetchReports({ review_status: 'APPROVED' }).then((d) => setReports(d.slice(0, 6))).catch(console.warn);
    fetchDatasets({ review_status: 'APPROVED' }).then((d) => setDatasets(d.slice(0, 6))).catch(console.warn);
    fetchPublications({ review_status: 'APPROVED' }).then((d) => setPublications(d.slice(0, 6))).catch(console.warn);
    fetchMedia({ review_status: 'APPROVED' }).then((d) => setMedia(d.slice(0, 6))).catch(console.warn);
  }, []);

  return (
    <section id="latest-knowledge" className="section-container" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div className="section-header center">
        <span className="section-tag">KNOWLEDGE REPOSITORY ARCHIVE</span>
        <h2 className="section-title">Latest Repository Records</h2>
        <p className="section-subtitle">
          Access newly indexed scientific records, open data repositories, and multimedia archives directly connected to the backend.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="knowledge-tabs-wrapper">
        <button
          className={`tab-btn ${activeTab === 'Expeditions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Expeditions')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={16} /> Latest Reports ({reports.length || EXPEDITIONS_DATA.length})
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'Datasets' ? 'active' : ''}`}
          onClick={() => setActiveTab('Datasets')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Database size={16} /> Latest Datasets ({datasets.length || 15})
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'Publications' ? 'active' : ''}`}
          onClick={() => setActiveTab('Publications')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} /> Latest Publications ({publications.length || 15})
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'Media' ? 'active' : ''}`}
          onClick={() => setActiveTab('Media')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Film size={16} /> Latest Media ({media.length || 25})
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-content-grid">
        {activeTab === 'Expeditions' && (
          reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="knowledge-card">
                <div className="knowledge-header">
                  <span className="knowledge-tag" style={{ background: '#E0F2FE', color: '#0369A1' }}>
                    {report.document_type || 'Expedition Report'}
                  </span>
                  <span className="knowledge-year">{report.expedition_id || 'ISEA'}</span>
                </div>
                <h3 className="knowledge-title">{report.title}</h3>
                <p className="knowledge-desc">{report.description}</p>

                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '16px' }}>
                  <strong>Authors:</strong> {report.authors || 'NCPOR Team'} • <strong>Station:</strong> {report.station_id || 'Maitri'}
                </div>

                <Link
                  to={`/repository/detail/report/${report.id}`}
                  className="link-explore"
                  style={{ textDecoration: 'none', marginTop: 'auto' }}
                >
                  <span>View Report Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))
          ) : (
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
                <button onClick={() => onViewRecord('Expeditions', exp)} className="link-explore" style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 'auto' }}>
                  <span>View Expedition Log</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))
          )
        )}

        {activeTab === 'Datasets' && (
          datasets.length > 0 ? (
            datasets.map((ds) => (
              <div key={ds.id} className="knowledge-card">
                <div className="knowledge-header">
                  <span className="knowledge-tag" style={{ background: '#DCFCE7', color: '#15803D' }}>
                    {ds.format || 'CSV'} • {ds.dataset_identifier}
                  </span>
                  <span className="knowledge-year">v{ds.version || '1.0'}</span>
                </div>
                <h3 className="knowledge-title">{ds.title}</h3>
                <p className="knowledge-desc">{ds.description}</p>

                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '16px', fontFamily: 'monospace' }}>
                  {ds.expedition_id} | {ds.station_id || 'NCPOR'}
                </div>

                <Link
                  to={`/repository/detail/dataset/${ds.id}`}
                  className="link-explore"
                  style={{ textDecoration: 'none', marginTop: 'auto' }}
                >
                  <Download size={14} />
                  <span>Access Dataset</span>
                </Link>
              </div>
            ))
          ) : null
        )}

        {activeTab === 'Publications' && (
          publications.length > 0 ? (
            publications.map((pub) => (
              <div key={pub.id} className="knowledge-card">
                <div className="knowledge-header">
                  <span className="knowledge-tag" style={{ background: '#F3E8FF', color: '#7E22CE' }}>
                    {pub.journal || 'Journal Article'}
                  </span>
                  <span className="knowledge-year">{pub.publication_date ? pub.publication_date.substring(0, 4) : '2023'}</span>
                </div>
                <h3 className="knowledge-title">{pub.title}</h3>
                <p className="knowledge-desc">{pub.abstract}</p>

                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '16px' }}>
                  DOI: {pub.doi || 'Registered'}
                </div>

                <Link
                  to={`/repository/detail/publication/${pub.id}`}
                  className="link-explore"
                  style={{ textDecoration: 'none', marginTop: 'auto' }}
                >
                  <ExternalLink size={14} />
                  <span>View Publication Details</span>
                </Link>
              </div>
            ))
          ) : null
        )}

        {activeTab === 'Media' && (
          media.length > 0 ? (
            media.map((med) => (
              <div key={med.id} className="knowledge-card">
                <div className="knowledge-header">
                  <span className="knowledge-tag" style={{ background: '#FEF3C7', color: '#B45309' }}>
                    {med.media_type || 'IMAGE'}
                  </span>
                  <span className="knowledge-year">{med.station_id || 'NCPOR'}</span>
                </div>
                <h3 className="knowledge-title">{med.title}</h3>
                <p className="knowledge-desc">{med.description}</p>

                <Link
                  to={`/repository/detail/media/${med.id}`}
                  className="link-explore"
                  style={{ textDecoration: 'none', marginTop: 'auto' }}
                >
                  <Play size={14} />
                  <span>View Media Details</span>
                </Link>
              </div>
            ))
          ) : null
        )}
      </div>

      <div style={{ textCenter: 'center', marginTop: '32px', textAlign: 'center' }}>
        <Link
          to={`/repository/${activeTab.toLowerCase()}`}
          className="btn-primary-polar"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>Explore All {activeTab} in Knowledge Portal</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};
