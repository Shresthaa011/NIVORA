import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Download, Eye, CheckCircle, ArrowLeft, Search } from 'lucide-react';
import { fetchReports, type RepositoryReport, getFileDownloadUrl, getFilePreviewUrl } from '../services/api';


export const ReportRepositoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [reports, setReports] = useState<RepositoryReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [expeditionFilter, setExpeditionFilter] = useState('');
  const [stationFilter, setStationFilter] = useState('');

  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    loadReports();
  }, [expeditionFilter, stationFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { review_status: 'APPROVED' };
      if (query) params.query = query;
      if (expeditionFilter) params.expedition_id = expeditionFilter;
      if (stationFilter) params.station_id = stationFilter;
      const data = await fetchReports(params);
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadReports();
  };

  return (
    <div className="report-repository-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/repository" className="inline-flex items-center text-xs text-cyan-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Portal
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-serif flex items-center gap-3">
                <FileText className="w-8 h-8 text-cyan-400" />
                Expedition & Scientific Reports
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Official Indian Scientific Expedition Reports (ISEA), Annual Station Progress & Mission Technical Logs
              </p>
            </div>
            <Link
              to="/admin/repository/upload"
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-4 py-2.5 rounded shadow"
            >
              Upload Report
            </Link>
          </div>

          {/* Filter Toolbar */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter by report title, authors, or topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded text-xs text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={expeditionFilter}
              onChange={(e) => setExpeditionFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 px-3 py-2.5 focus:outline-none"
            >
              <option value="">All Expeditions</option>
              <option value="IAE-16">16th IAE (1997)</option>
              <option value="ISEA-37">ISEA-37 (2018)</option>
              <option value="ISEA-39">ISEA-39 (2020)</option>
              <option value="ISEA-41">ISEA-41 (2022)</option>
              <option value="ISEA-42">ISEA-42 (2023)</option>
              <option value="Arctic-2021">Arctic Expedition (2021)</option>
            </select>
            <select
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 px-3 py-2.5 focus:outline-none"
            >
              <option value="">All Stations</option>
              <option value="Maitri">Maitri (Antarctica)</option>
              <option value="Bharati">Bharati (Antarctica)</option>
              <option value="Himadri">Himadri (Arctic)</option>
              <option value="Himansh">Himansh (Himalayas)</option>
            </select>
          </form>
        </div>
      </div>

      {/* Main List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading expedition reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            No reports found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {report.document_type || 'Expedition Report'}
                    </span>
                    {report.expedition_id && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Expedition: {report.expedition_id}
                      </span>
                    )}
                    {report.station_id && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Station: {report.station_id}
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Approved (v{report.version || '1.0'})
                    </span>
                  </div>
                  <Link
                    to={`/repository/detail/report/${report.id}`}
                    className="text-lg font-bold text-white hover:text-cyan-300 transition-colors block mb-1"
                  >
                    {report.title}
                  </Link>
                  <p className="text-xs text-slate-300 mb-2 line-clamp-2">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>Authors: <strong className="text-slate-200">{report.authors || 'NCPOR Team'}</strong></span>
                    <span>Date: <strong className="text-slate-200">{report.publication_date || 'N/A'}</strong></span>
                    {report.file_size && (
                      <span>Size: <strong className="text-slate-200">{(report.file_size / (1024 * 1024)).toFixed(2)} MB</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                  <Link
                    to={`/repository/detail/report/${report.id}`}
                    className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => {
                      setPreviewTitle(report.title);
                      setPreviewModalUrl(getFilePreviewUrl('report', report.id));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <a
                    href={getFileDownloadUrl('report', report.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Browser Preview Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-5xl h-[85vh] rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white truncate pr-4">{previewTitle}</h3>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded text-xs"
              >
                Close Preview
              </button>
            </div>
            <div className="flex-1 bg-slate-950">
              <iframe
                src={previewModalUrl}
                className="w-full h-full border-0"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
