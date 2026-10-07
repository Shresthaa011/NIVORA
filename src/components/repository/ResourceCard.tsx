import React from 'react';
import { Download, BookOpen, Bookmark, MapPin, Tag } from 'lucide-react';
import { MetadataBadge } from './MetadataBadge';


export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  description: string;
  year: string | number;
  region: string;
  domain: string;
  author?: string;
  badgeVariant?: 'cyan' | 'teal' | 'sky' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate';
  fileUrl?: string;
  downloadUrl?: string;
  format?: string;
}

interface ResourceCardProps {
  resource: ResourceItem;
  onReadMore: (resource: ResourceItem) => void;
  onDownload?: (resource: ResourceItem) => void;
  onBookmarkToggle?: (id: string) => void;
  isBookmarked?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onReadMore,
  onDownload,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
  return (
    <div className="group rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 p-5 transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <MetadataBadge label={resource.type} variant={resource.badgeVariant || 'cyan'} />
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {resource.year}
            </span>
            {onBookmarkToggle && (
              <button
                type="button"
                onClick={() => onBookmarkToggle(resource.id)}
                className={`p-1 rounded transition-colors ${
                  isBookmarked
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Bookmark resource'}
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onReadMore(resource)}
          className="text-base font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer mb-2 line-clamp-2 leading-snug font-serif"
        >
          {resource.title}
        </h3>

        {/* 2-line Description */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {resource.description}
        </p>
      </div>

      <div>
        {/* Metadata Grid */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" /> {resource.region}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 truncate">
            <Tag className="w-3 h-3 text-teal-400" /> {resource.domain}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => onReadMore(resource)}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" /> Read More
          </button>

          <button
            type="button"
            onClick={() => onDownload ? onDownload(resource) : onReadMore(resource)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};
