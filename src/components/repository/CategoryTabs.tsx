import React from 'react';
import { Compass, BookOpen, Database, FileText, GraduationCap, Archive, Film, Layers } from 'lucide-react';

export type RepositoryCategory = 
  | 'All' 
  | 'Expedition Reports' 
  | 'Research Papers' 
  | 'Datasets' 
  | 'Scientific Articles' 
  | 'Educational Resources' 
  | 'Historical Archives' 
  | 'Multimedia';

interface CategoryTabsProps {
  activeCategory: RepositoryCategory;
  onSelectCategory: (category: RepositoryCategory) => void;
  counts?: Record<string, number>;
}

export const CATEGORIES: { id: RepositoryCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'All', label: 'All Resources', icon: <Layers className="w-4 h-4" /> },
  { id: 'Expedition Reports', label: 'Expedition Reports', icon: <Compass className="w-4 h-4" /> },
  { id: 'Research Papers', label: 'Research Papers', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'Datasets', label: 'Datasets', icon: <Database className="w-4 h-4" /> },
  { id: 'Scientific Articles', label: 'Scientific Articles', icon: <FileText className="w-4 h-4" /> },
  { id: 'Educational Resources', label: 'Educational Resources', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'Historical Archives', label: 'Historical Archives', icon: <Archive className="w-4 h-4" /> },
  { id: 'Multimedia', label: 'Multimedia', icon: <Film className="w-4 h-4" /> },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  counts
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts ? counts[cat.id] : null;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-xs transition-all duration-200 border ${
                isActive
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-900/30 font-semibold'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-cyan-400'}>{cat.icon}</span>
              <span>{cat.label}</span>
              {count !== null && count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-cyan-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
