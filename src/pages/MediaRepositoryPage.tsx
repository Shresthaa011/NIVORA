import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Image, Video, Download, Eye, ArrowLeft, Search, MapPin, Camera } from 'lucide-react';
import { fetchMedia, type RepositoryMedia, getFileDownloadUrl, getFilePreviewUrl } from '../services/api';


export const MediaRepositoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [mediaItems, setMediaItems] = useState<RepositoryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [mediaTypeTab, setMediaTypeTab] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');

  const [activePreview, setActivePreview] = useState<{ item: RepositoryMedia; url: string } | null>(null);

  useEffect(() => {
    loadMedia();
  }, [mediaTypeTab]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { review_status: 'APPROVED' };
      if (query) params.query = query;
      if (mediaTypeTab !== 'ALL') params.media_type = mediaTypeTab;
      const data = await fetchMedia(params);
      setMediaItems(data);
    } catch (err) {
      console.error('Failed to load media', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMedia();
  };

  return (
    <div className="media-repository-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/repository" className="inline-flex items-center text-xs text-indigo-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Portal
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-serif flex items-center gap-3">
                <Image className="w-8 h-8 text-indigo-400" />
                Scientific Media Gallery
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                High-resolution polar imagery, drone surveys, aurora captures, and research vessel videos.
              </p>
            </div>
            <Link
              to="/admin/repository/upload"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded shadow"
            >
              Upload Media
            </Link>
          </div>

          {/* Filter & Type Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setMediaTypeTab('ALL')}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors ${mediaTypeTab === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All Media
              </button>
              <button
                onClick={() => setMediaTypeTab('IMAGE')}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${mediaTypeTab === 'IMAGE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Image className="w-3.5 h-3.5" /> Images
              </button>
              <button
                onClick={() => setMediaTypeTab('VIDEO')}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${mediaTypeTab === 'VIDEO' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Video className="w-3.5 h-3.5" /> Videos
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search title, station, location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded text-xs text-white pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading media gallery...</div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            No scientific media found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((item) => {
              const previewUrl = getFilePreviewUrl('media', item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                    {item.media_type === 'VIDEO' ? (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                        <Video className="w-12 h-12 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-indigo-200 font-mono font-semibold">Video Footage</span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                        <Camera className="w-10 h-10 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-cyan-200 font-mono">High-Res Image</span>
                      </div>
                    )}

                    <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-indigo-300 backdrop-blur border border-indigo-500/30">
                      {item.media_type}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/repository/detail/media/${item.id}`}
                        className="text-sm font-bold text-white hover:text-indigo-300 transition-colors line-clamp-1 mb-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-4">
                        {item.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-500" /> {item.location}
                          </span>
                        )}
                        {item.station_id && (
                          <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                            {item.station_id}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => setActivePreview({ item, url: previewUrl })}
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <a
                          href={getFileDownloadUrl('media', item.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-4xl rounded-xl border border-slate-700 p-4 flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white truncate">{activePreview.item.title}</h3>
              <button
                onClick={() => setActivePreview(null)}
                className="text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded text-xs"
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] flex items-center justify-center bg-black rounded overflow-hidden p-2">
              {activePreview.item.media_type === 'VIDEO' ? (
                <video src={activePreview.url} controls className="max-h-[60vh] w-auto" />
              ) : (
                <div className="text-center p-8 text-slate-300">
                  <p className="text-sm mb-4">{activePreview.item.description}</p>
                  <a
                    href={getFileDownloadUrl('media', activePreview.item.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                  >
                    <Download className="w-4 h-4" /> Download Original File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
