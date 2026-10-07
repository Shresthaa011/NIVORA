import React from 'react';
import { ArrowRight, Calendar, MapPin, User, Bookmark } from 'lucide-react';
import { MetadataBadge } from './MetadataBadge';


export interface FeaturedResource {
  id: string;
  title: string;
  type: string;
  description: string;
  year: string | number;
  region: string;
  author: string;
  imageUrl?: string;
  badgeVariant?: 'cyan' | 'teal' | 'sky' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate';
  detailUrl?: string;
  format?: string;
}

interface FeaturedResourceCardProps {
  resource: FeaturedResource;
  onSelect: (resource: FeaturedResource) => void;
  onBookmarkToggle?: (id: string) => void;
  isBookmarked?: boolean;
}

export const FeaturedResourceCard: React.FC<FeaturedResourceCardProps> = ({
  resource,
  onSelect,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
  return (
    <div className="group relative rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Top Banner / Image Header */}
      <div className="relative h-44 bg-slate-950 overflow-hidden flex items-center justify-center">
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#061826] via-[#0A2540] to-[#051321] p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <MetadataBadge label={resource.type} variant={resource.badgeVariant || 'cyan'} />
              {onBookmarkToggle && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmarkToggle(resource.id);
                  }}
                  className={`p-1.5 rounded-full border transition-colors ${
                    isBookmarked
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-black/40 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isBookmarked ? 'Bookmarked' : 'Bookmark resource'}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
            </div>
            <div className="text-[10px] font-mono text-cyan-300/80">FEATURED SCIENTIFIC RECORD</div>
          </div>
        )}

        {resource.imageUrl && (
          <div className="absolute top-3 left-3">
            <MetadataBadge label={resource.type} variant={resource.badgeVariant || 'cyan'} />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mb-2 font-serif">
            {resource.title}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {resource.description}
          </p>
        </div>

        <div>
          {/* Metadata attributes */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 mb-4">
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{resource.author}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
              <span className="truncate">{resource.region}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3 h-3 text-sky-400 shrink-0" />
              <span>{resource.year}</span>
            </div>
            {resource.format && (
              <div className="text-right font-mono font-semibold text-slate-300">
                {resource.format}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelect(resource)}
            className="w-full py-2 px-4 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 group-hover:border-cyan-600"
          >
            <span>View Resource</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
