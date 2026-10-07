import React, { useState } from 'react';
import { X, Download, Share2, Bookmark, Eye, MapPin, Calendar, User, Tag, FileText, Check, Network, ExternalLink } from 'lucide-react';
import { MetadataBadge } from './MetadataBadge';
import type { ResourceItem } from './ResourceCard';

interface ResourceDetailModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
  relatedResources?: ResourceItem[];
  onSelectRelated?: (resource: ResourceItem) => void;
  onBookmarkToggle?: (id: string) => void;
  isBookmarked?: boolean;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  onClose,
  relatedResources = [],
  onSelectRelated,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [activeTab, setActiveTab] = useState<'overview' | 'preview'>('overview');

  if (!resource) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmarkToggle) onBookmarkToggle(resource.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden my-auto"
      >
        {/* Modal Top Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <MetadataBadge label={resource.type} variant={resource.badgeVariant || 'cyan'} size="md" />
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Year: {resource.year}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                {resource.region}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif leading-snug">
              {resource.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Action Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              Overview & Abstract
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Document Preview
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                bookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Share'}
            </button>

            <a
              href={resource.downloadUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download Resource
            </a>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' ? (
            <>
              {/* Metadata Attribute Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Author / Lead</span>
                  <strong className="text-slate-100 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> {resource.author || 'NCPOR Polar Wing'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Region</span>
                  <strong className="text-slate-100 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" /> {resource.region}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Research Domain</span>
                  <strong className="text-slate-100 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-sky-400" /> {resource.domain}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Publication Year</span>
                  <strong className="text-slate-100 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {resource.year}
                  </strong>
                </div>
              </div>

              {/* Abstract / Summary */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 font-semibold">
                  Abstract & Executive Summary
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  {resource.description}
                </p>
              </div>

              {/* Keywords Tag Cloud */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 font-semibold">
                  Keywords & Subject Headings
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Antarctica', 'Cryosphere', 'Climate Observations', 'NCPOR', 'Field Data', 'Polar Ecosystem'].map((kw) => (
                    <span key={kw} className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section 9: Related Knowledge */}
              {relatedResources.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-3 font-semibold">
                    <Network className="w-4 h-4" /> Related Knowledge Entities
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {relatedResources.slice(0, 3).map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => onSelectRelated && onSelectRelated(rel)}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-colors"
                      >
                        <span className="text-[10px] font-mono text-teal-300 block mb-1">{rel.type}</span>
                        <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">{rel.title}</h4>
                        <span className="text-[10px] text-slate-400">{rel.year} • {rel.region}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* PDF / Document Preview Layout */
            <div className="h-[55vh] bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center text-center">
              <FileText className="w-16 h-16 text-cyan-400 mb-3" />
              <h4 className="text-base font-bold text-white mb-2">{resource.title}</h4>
              <p className="text-xs text-slate-400 max-w-md mb-6">
                Official document stream layout ready. Click below to stream full PDF preview or access original file.
              </p>
              <a
                href={resource.downloadUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow transition-colors inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Original Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
