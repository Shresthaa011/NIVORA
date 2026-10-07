import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Download, ExternalLink, ArrowLeft, Search } from 'lucide-react';
import { fetchPublications, type RepositoryPublication, getFileDownloadUrl } from '../services/api';


export const PublicationRepositoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [publications, setPublications] = useState<RepositoryPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [topicFilter, setTopicFilter] = useState('');

  useEffect(() => {
    loadPublications();
  }, [topicFilter]);

  const loadPublications = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { review_status: 'APPROVED' };
      if (query) params.query = query;
      if (topicFilter) params.research_topic_id = topicFilter;
      const data = await fetchPublications(params);
      setPublications(data);
    } catch (err) {
      console.error('Failed to load publications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPublications();
  };

  return (
    <div className="publication-repository-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/repository" className="inline-flex items-center text-xs text-sky-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Portal
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-serif flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-sky-400" />
                Research Publications
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Peer-reviewed journal articles, conference proceedings, and scientific papers with registered DOIs.
              </p>
            </div>
            <Link
              to="/admin/repository/upload"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-4 py-2.5 rounded shadow"
            >
              Upload Publication
            </Link>
          </div>

          {/* Filter Toolbar */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search publication title, journal name, author, or DOI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded text-xs text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 px-3 py-2.5 focus:outline-none"
            >
              <option value="">All Research Topics</option>
              <option value="climate_change">Climate Change & Warming</option>
              <option value="oceanography">Oceanography</option>
              <option value="glaciology">Glaciology & InSAR</option>
              <option value="marine_biology">Marine Biology</option>
              <option value="atmospheric">Atmospheric Aerosols</option>
              <option value="geology">Geology & Petrology</option>
            </select>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading research publications...</div>
        ) : publications.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            No publications found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/50 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-sky-400 bg-sky-950 px-2.5 py-0.5 rounded border border-sky-800">
                    {pub.journal || 'Journal Article'}
                  </span>
                  {pub.publication_date && (
                    <span className="text-xs text-slate-400 font-mono">
                      Published: {pub.publication_date}
                    </span>
                  )}
                </div>

                <Link
                  to={`/repository/detail/publication/${pub.id}`}
                  className="text-lg font-bold text-white hover:text-sky-300 transition-colors block mb-2"
                >
                  {pub.title}
                </Link>

                <p className="text-xs text-slate-300 mb-3 line-clamp-2 leading-relaxed">{pub.abstract}</p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-400">
                    <span>Authors: <strong className="text-slate-200">{pub.authors || 'NCPOR Researchers'}</strong></span>
                    {pub.doi && (
                      <span className="flex items-center gap-1 font-mono text-cyan-400">
                        DOI:
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center"
                        >
                          {pub.doi} <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/repository/detail/publication/${pub.id}`}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={getFileDownloadUrl('publication', pub.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shadow"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
