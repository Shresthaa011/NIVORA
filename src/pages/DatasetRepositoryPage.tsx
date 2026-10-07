import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Database, Download, ArrowLeft, Search } from 'lucide-react';
import { fetchDatasets, type RepositoryDataset, getFileDownloadUrl } from '../services/api';


export const DatasetRepositoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [datasets, setDatasets] = useState<RepositoryDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [formatFilter, setFormatFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');

  useEffect(() => {
    loadDatasets();
  }, [formatFilter, topicFilter]);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { review_status: 'APPROVED' };
      if (query) params.query = query;
      if (formatFilter) params.format = formatFilter;
      if (topicFilter) params.research_topic_id = topicFilter;
      const data = await fetchDatasets(params);
      setDatasets(data);
    } catch (err) {
      console.error('Failed to load datasets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDatasets();
  };

  return (
    <div className="dataset-repository-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/repository" className="inline-flex items-center text-xs text-teal-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Portal
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-serif flex items-center gap-3">
                <Database className="w-8 h-8 text-teal-400" />
                Scientific Datasets Catalogue
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Raw and processed polar observations: CTD profiles, meteorology logs, glacier mass balance, and genomics.
              </p>
            </div>
            <Link
              to="/admin/repository/upload"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-4 py-2.5 rounded shadow"
            >
              Upload Dataset
            </Link>
          </div>

          {/* Filter Toolbar */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search dataset title, ID (POLAR-DS...), or measurements..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded text-xs text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-teal-500"
              />
            </div>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 px-3 py-2.5 focus:outline-none"
            >
              <option value="">All Formats (CSV, JSON, ZIP)</option>
              <option value="CSV">CSV Data File</option>
              <option value="JSON">JSON Structure</option>
              <option value="XLSX">Excel Spreadsheet (XLSX)</option>
              <option value="ZIP">Compressed Package (ZIP)</option>
            </select>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 px-3 py-2.5 focus:outline-none"
            >
              <option value="">All Research Topics</option>
              <option value="oceanography">Oceanography</option>
              <option value="atmospheric">Atmospheric Science</option>
              <option value="glaciology">Glaciology</option>
              <option value="marine_biology">Marine Biology</option>
              <option value="cryosphere">Cryosphere</option>
            </select>
          </form>
        </div>
      </div>

      {/* Main List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading datasets...</div>
        ) : datasets.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            No scientific datasets found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      ID: {dataset.dataset_identifier}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {dataset.format || 'CSV'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        v{dataset.version || '1.0'}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/repository/detail/dataset/${dataset.id}`}
                    className="text-lg font-bold text-white hover:text-teal-300 transition-colors block mb-2"
                  >
                    {dataset.title}
                  </Link>
                  <p className="text-xs text-slate-300 mb-4 line-clamp-3 leading-relaxed">{dataset.description}</p>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 mb-4">
                    <div>
                      <span className="text-slate-500 block">Expedition</span>
                      <strong className="text-slate-200">{dataset.expedition_id || 'ISEA General'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Station</span>
                      <strong className="text-slate-200">{dataset.station_id || 'Bharati / Maitri'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Time Period</span>
                      <strong className="text-slate-200">{dataset.start_date ? `${dataset.start_date.substring(0,4)}–${dataset.end_date ? dataset.end_date.substring(0,4) : 'Present'}` : '2019–2023'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">License</span>
                      <strong className="text-slate-200">{dataset.license || 'CC BY 4.0'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-400">
                    Org: <strong className="text-slate-200">{dataset.organization || 'NCPOR'}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/repository/detail/dataset/${dataset.id}`}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={getFileDownloadUrl('dataset', dataset.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-colors shadow"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
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
