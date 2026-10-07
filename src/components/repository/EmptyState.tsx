import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ query, onReset }) => {
  return (
    <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 my-8">
      <div className="p-4 rounded-full bg-slate-950 border border-slate-800 w-fit mx-auto mb-4">
        <SearchX className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-serif">No Scientific Records Found</h3>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        {query
          ? `We couldn't find any resources matching "${query}". Try adjusting your keywords, expanding date ranges, or resetting active filters.`
          : 'No items currently match the selected combination of geographic and domain filters.'}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
        </button>
      )}
    </div>
  );
};
