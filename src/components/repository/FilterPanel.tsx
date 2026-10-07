import React, { useState } from 'react';
import { Filter, RotateCcw, Check, ChevronDown, Sparkles } from 'lucide-react';

export interface FilterState {
  keyword: string;
  region: string;
  contentType: string;
  year: string;
  domain: string;
  expedition: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectChange = (field: keyof FilterState, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const defaultState: FilterState = {
      keyword: '',
      region: 'All',
      contentType: 'All',
      year: 'All',
      domain: 'All',
      expedition: 'All',
    };
    setLocalFilters(defaultState);
    onResetFilters();
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Advanced Knowledge Filters</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-xs text-cyan-400 flex items-center gap-1"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <form onSubmit={handleApply} className={`space-y-4 ${isOpen ? 'block' : 'hidden sm:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Region */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Region / Geographic Area</label>
            <select
              value={localFilters.region}
              onChange={(e) => handleSelectChange('region', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Regions</option>
              <option value="Antarctic">Antarctic Region</option>
              <option value="Arctic">Arctic Region (Svalbard)</option>
              <option value="Himalaya">Himalaya / Cryosphere</option>
              <option value="Southern Ocean">Southern Ocean</option>
            </select>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Content Type</label>
            <select
              value={localFilters.contentType}
              onChange={(e) => handleSelectChange('contentType', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Content Types</option>
              <option value="Report">Expedition Report</option>
              <option value="Research Paper">Research Paper</option>
              <option value="Dataset">Scientific Dataset</option>
              <option value="Article">Scientific Article</option>
              <option value="Video">Video & Media</option>
              <option value="Educational Material">Educational Material</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Publication / Mission Year</label>
            <select
              value={localFilters.year}
              onChange={(e) => handleSelectChange('year', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="Earlier">Earlier Years (1981-2022)</option>
            </select>
          </div>

          {/* Research Domain */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Research Domain</label>
            <select
              value={localFilters.domain}
              onChange={(e) => handleSelectChange('domain', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Research Domains</option>
              <option value="Climate Change">Climate Change & Warming</option>
              <option value="Glaciology">Glaciology & Ice Sheet</option>
              <option value="Oceanography">Physical Oceanography</option>
              <option value="Atmospheric Science">Atmospheric Science</option>
              <option value="Marine Biology">Marine Biology & Ecology</option>
              <option value="Geology">Geology & Geophysics</option>
              <option value="Polar Ecology">Polar Ecology & Limnology</option>
            </select>
          </div>

          {/* Expedition */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Indian Scientific Expedition</label>
            <select
              value={localFilters.expedition}
              onChange={(e) => handleSelectChange('expedition', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Expeditions</option>
              <option value="ISEA-42">42nd ISEA (2023)</option>
              <option value="ISEA-41">41st ISEA (2022)</option>
              <option value="ISEA-40">40th ISEA (2021)</option>
              <option value="Arctic-2022">Arctic Expedition 2022</option>
              <option value="Himalaya-2023">Himansh Mission 2023</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" /> Apply Filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 border border-slate-700"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
