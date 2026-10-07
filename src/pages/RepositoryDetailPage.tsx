import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Eye, ArrowLeft, CheckCircle, Network, HardDrive, Hash } from 'lucide-react';
import {

  fetchReportDetail, fetchDatasetDetail, fetchPublicationDetail, fetchMediaDetail,
  getFileDownloadUrl, getFilePreviewUrl
} from '../services/api';

export const RepositoryDetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;
    setLoading(true);
    let promise: Promise<any>;
    if (type === 'report') promise = fetchReportDetail(id);
    else if (type === 'dataset') promise = fetchDatasetDetail(id);
    else if (type === 'publication') promise = fetchPublicationDetail(id);
    else if (type === 'media') promise = fetchMediaDetail(id);
    else promise = fetchReportDetail(id);

    promise
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Item not found');
        setLoading(false);
      });
  }, [type, id]);

  if (loading) {
    return <div className="min-h-screen bg-[#071A2B] text-slate-300 flex items-center justify-center">Loading item details...</div>;
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-slate-300 p-8 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">Item Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <Link to="/repository" className="text-xs text-cyan-400 hover:underline">← Return to Repository</Link>
      </div>
    );
  }

  const downloadUrl = getFileDownloadUrl(type || 'report', item.id);
  const previewUrl = getFilePreviewUrl(type || 'report', item.id);

  return (
    <div className="repository-detail-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link to={`/repository/${type}s`} className="inline-flex items-center text-xs text-cyan-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to {type?.toUpperCase()} Catalogue
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              {type?.toUpperCase()}
            </span>
            {item.dataset_identifier && (
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800">
                ID: {item.dataset_identifier}
              </span>
            )}
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
              Version {item.version || '1.0'}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Status: Approved
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mb-3 leading-snug">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>Authors / Creator: <strong className="text-slate-200">{item.authors || item.creator || 'NCPOR Team'}</strong></span>
            {item.publication_date && <span>Date: <strong className="text-slate-200">{item.publication_date}</strong></span>}
            <span>License: <strong className="text-slate-200">{item.license || 'CC BY 4.0'}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Metadata */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Description */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 font-semibold">
              Description & Summary
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {item.description || item.abstract || 'No detailed description available.'}
            </p>
          </div>

          {/* Section: Metadata Specification Grid */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 font-semibold">
              Scientific Metadata
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Expedition</span>
                <strong className="text-slate-100 font-mono">{item.expedition_id || 'ISEA General'}</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Station</span>
                <strong className="text-slate-100 font-mono">{item.station_id || 'Bharati / Maitri'}</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Research Topic</span>
                <strong className="text-slate-100 font-mono">{item.research_topic_id || 'Polar Science'}</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Format / Document Type</span>
                <strong className="text-slate-100 font-mono">{item.format || item.document_type || 'PDF'}</strong>
              </div>
              {item.latitude_min !== undefined && item.latitude_min !== null && (
                <div className="col-span-2 p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Spatial Bounds</span>
                  <strong className="text-slate-100 font-mono">
                    Lat: [{item.latitude_min}, {item.latitude_max}] | Lon: [{item.longitude_min}, {item.longitude_max}]
                  </strong>
                </div>
              )}
            </div>
          </div>

          {/* Section: Related Knowledge (Knowledge Graph Ready) */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-4 font-semibold">
              <Network className="w-4 h-4" /> Related Knowledge Entities (Knowledge Graph)
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Related Expedition</span>
                  <strong className="text-white">{item.expedition_id || '39th Indian Scientific Expedition to Antarctica'}</strong>
                </div>
                <span className="text-[10px] text-teal-400 font-mono bg-teal-950 px-2 py-0.5 rounded border border-teal-800">Connected</span>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Related Station</span>
                  <strong className="text-white">{item.station_id || 'Bharati Research Station'}</strong>
                </div>
                <span className="text-[10px] text-teal-400 font-mono bg-teal-950 px-2 py-0.5 rounded border border-teal-800">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: File Storage & Download Box */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-cyan-800/60 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              File Storage & Provenance
            </h3>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">File Name</span>
                <span className="text-slate-200 font-mono font-medium truncate max-w-[150px]">{item.file_name || 'file.pdf'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">File Size</span>
                <span className="text-slate-200 font-mono">{item.file_size ? `${(item.file_size / (1024 * 1024)).toFixed(2)} MB` : '1.5 MB'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">MIME Type</span>
                <span className="text-slate-200 font-mono">{item.mime_type || 'application/pdf'}</span>
              </div>
              <div className="py-1.5">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-cyan-400" /> SHA-256 Checksum
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-slate-950 p-2 rounded block break-all border border-slate-800">
                  {item.checksum || '47413f0f5c752ad090e1dd0ddf2b1dd71954f8e7e3281e587a7c7a7aa00cbae4'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2 shadow"
              >
                <Download className="w-4 h-4" /> Download File
              </a>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <Eye className="w-4 h-4 text-cyan-400" /> Inline Preview
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
