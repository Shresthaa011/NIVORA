import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Download, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { fetchRepositoryStats, type RepositoryStats } from '../services/api';

import { CategoryTabs, type RepositoryCategory } from '../components/repository/CategoryTabs';
import { FilterPanel, type FilterState } from '../components/repository/FilterPanel';
import { FeaturedResourceCard, type FeaturedResource } from '../components/repository/FeaturedResourceCard';
import { ResourceCard, type ResourceItem } from '../components/repository/ResourceCard';
import { ResourceDetailModal } from '../components/repository/ResourceDetailModal';
import { AIDiscoverySection } from '../components/repository/AIDiscoverySection';
import { Pagination } from '../components/repository/Pagination';
import { EmptyState } from '../components/repository/EmptyState';

// Sample Featured Resources (4 large cards)
const FEATURED_KNOWLEDGE: FeaturedResource[] = [
  {
    id: 'feat-1',
    title: 'Indian Antarctic Expedition — Expedition Report 2025 (42nd ISEA)',
    type: 'Expedition Report',
    description: 'Comprehensive operational and scientific results of atmospheric, geological, and biological field observations carried out during ISEA-42 at Bharati & Maitri.',
    year: '2025',
    region: 'Antarctic',
    author: 'Dr. Rahul Mohan & NCPOR Team',
    format: 'PDF (45 MB)',
    badgeVariant: 'cyan',
  },
  {
    id: 'feat-2',
    title: 'Changing Antarctic Ice Sheets: Recent InSAR Satellite Observations',
    type: 'Research Paper',
    description: 'Decadal satellite interferometry combined with ground GPS surveys monitoring ice velocity variations across Dronning Maud Land glaciers.',
    year: '2024',
    region: 'Antarctic',
    author: 'Dr. A. K. Meloth, Glaciology Wing',
    format: 'PDF Paper',
    badgeVariant: 'sky',
  },
  {
    id: 'feat-3',
    title: 'Polar Ocean Climate Dataset — 2020–2025 Time Series',
    type: 'Dataset',
    description: 'Continuous CTD hydrographic ocean profile and mooring measurements recovered from Kongsfjorden underwater observatory (IndARC).',
    year: '2025',
    region: 'Arctic',
    author: 'NCPOR Oceanography Division',
    format: 'CSV / NetCDF',
    badgeVariant: 'teal',
  },
  {
    id: 'feat-4',
    title: 'Life in Extreme Polar Environments: Metagenomic Analysis',
    type: 'Scientific Article',
    description: 'Limnological investigation of micro-algae and microbial biodiversity isolated from permafrost soils around Schirmacher Oasis.',
    year: '2024',
    region: 'Antarctic',
    author: 'Dr. S. R. Sharma, Aquatic Ecology Group',
    format: 'Article PDF',
    badgeVariant: 'purple',
  },
];

// Curated Master Repository Resource Items
const SAMPLE_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: '16th Indian Antarctic Expedition Scientific Report',
    type: 'Expedition Report',
    description: 'Comprehensive summary of upper atmospheric, biological, and geological observations conducted at Maitri station.',
    year: '1997',
    region: 'Antarctic',
    domain: 'Expedition Log',
    author: 'NCPOR Research Team',
    badgeVariant: 'cyan',
    format: 'PDF',
  },
  {
    id: 'res-2',
    title: 'Maitri Station Hourly Meteorology & Surface Wind Observations',
    type: 'Dataset',
    description: 'Continuous hourly weather observations including wind speed, direction, temperature, and pressure logged at Maitri.',
    year: '2023',
    region: 'Antarctic',
    domain: 'Atmospheric Science',
    author: 'IMD Polar Meteorological Cell',
    badgeVariant: 'teal',
    format: 'CSV',
  },
  {
    id: 'res-3',
    title: 'Impact of Southern Ocean Warming on Antarctic Sea Ice Retreat',
    type: 'Research Paper',
    description: 'Peer-reviewed study analyzing satellite altimetry and ocean model projections over sub-Antarctic waters.',
    year: '2023',
    region: 'Southern Ocean',
    domain: 'Climate Change',
    author: 'Dr. N. Anilkumar et al.',
    badgeVariant: 'purple',
    format: 'PDF',
  },
  {
    id: 'res-4',
    title: 'Himadri Arctic Station Annual Meteorology & Environmental Study',
    type: 'Expedition Report',
    description: 'Micro-climate analysis and atmospheric trace gas measurements conducted at Ny-Ålesund, Svalbard.',
    year: '2022',
    region: 'Arctic',
    domain: 'Atmospheric Science',
    author: 'Dr. K. S. Rajan',
    badgeVariant: 'cyan',
    format: 'PDF',
  },
  {
    id: 'res-5',
    title: 'Chhota Shigri Glacier Mass Balance & Ablation Monitoring Log',
    type: 'Dataset',
    description: 'Direct stake measurements of ice ablation and hydrological mass balance for Western Himalayas.',
    year: '2024',
    region: 'Himalaya',
    domain: 'Glaciology',
    author: 'Himansh Observatory Team',
    badgeVariant: 'teal',
    format: 'XLSX',
  },
  {
    id: 'res-6',
    title: 'Bacterial Metagenomics in Antarctic Lakes around Schirmacher Oasis',
    type: 'Scientific Article',
    description: '16S rRNA gene sequencing dataset of cold-adapted microbial communities in freshwater lakes.',
    year: '2023',
    region: 'Antarctic',
    domain: 'Marine Biology',
    author: 'Dr. V. K. Tiwari',
    badgeVariant: 'emerald',
    format: 'Article PDF',
  },
  {
    id: 'res-7',
    title: 'First 40 Years of India’s Antarctic Endeavours: Historical Photo Archive',
    type: 'Historical Archives',
    description: 'Archival photographic documentation of India’s historical expeditions from 1981 onwards.',
    year: 'Earlier',
    region: 'Antarctic',
    domain: 'Historical Archives',
    author: 'NCPOR Media Wing',
    badgeVariant: 'amber',
    format: 'ZIP Media',
  },
  {
    id: 'res-8',
    title: 'Polar Science Educational Kit for High Schools',
    type: 'Educational Resources',
    description: 'Outreach curriculum material explaining polar ice sheet dynamics and climate change for students.',
    year: '2024',
    region: 'Antarctic',
    domain: 'Educational Material',
    author: 'NCPOR Outreach Cell',
    badgeVariant: 'sky',
    format: 'PDF Package',
  },
  {
    id: 'res-9',
    title: 'High-Definition Drone Footage of Himansh Himalayan Observatory',
    type: 'Multimedia',
    description: '4K aerial drone survey footage capturing remote Himansh research station surrounded by glaciers.',
    year: '2023',
    region: 'Himalaya',
    domain: 'Glaciology',
    author: 'Cryosphere Media Group',
    badgeVariant: 'indigo',
    format: 'MP4 Video',
  },
];

export const RepositoryLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<RepositoryStats>({
    reports_count: 15,
    datasets_count: 15,
    publications_count: 15,
    media_count: 25,
    expeditions_count: 44,
  });

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<RepositoryCategory>('All');
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    region: 'All',
    contentType: 'All',
    year: 'All',
    domain: 'All',
    expedition: 'All',
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedDetailResource, setSelectedDetailResource] = useState<ResourceItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchRepositoryStats().then(setStats).catch(console.warn);
  }, []);

  // Filtered Results Logic
  const filteredResources = useMemo(() => {
    return SAMPLE_RESOURCES.filter((item) => {
      // Query filter
      const q = (searchQuery || filters.keyword).toLowerCase().trim();
      if (q) {
        const textToSearch = `${item.title} ${item.description} ${item.author || ''} ${item.domain} ${item.region}`.toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      // Category tab filter
      if (activeCategory !== 'All') {
        if (activeCategory === 'Expedition Reports' && item.type !== 'Expedition Report') return false;
        if (activeCategory === 'Research Papers' && item.type !== 'Research Paper') return false;
        if (activeCategory === 'Datasets' && item.type !== 'Dataset') return false;
        if (activeCategory === 'Scientific Articles' && item.type !== 'Scientific Article') return false;
        if (activeCategory === 'Educational Resources' && item.type !== 'Educational Resources') return false;
        if (activeCategory === 'Historical Archives' && item.type !== 'Historical Archives') return false;
        if (activeCategory === 'Multimedia' && item.type !== 'Multimedia') return false;
      }

      // Region filter
      if (filters.region !== 'All' && !item.region.toLowerCase().includes(filters.region.toLowerCase())) {
        return false;
      }

      // Content Type filter
      if (filters.contentType !== 'All' && !item.type.toLowerCase().includes(filters.contentType.toLowerCase())) {
        return false;
      }

      // Year filter
      if (filters.year !== 'All') {
        if (filters.year === 'Earlier' && String(item.year) > '2022') return false;
        if (filters.year !== 'Earlier' && String(item.year) !== filters.year) return false;
      }

      // Domain filter
      if (filters.domain !== 'All' && item.domain !== filters.domain) {
        return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResources.slice(start, start + itemsPerPage);
  }, [filteredResources, currentPage]);

  const handleBookmarkToggle = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      keyword: '',
      region: 'All',
      contentType: 'All',
      year: 'All',
      domain: 'All',
      expedition: 'All',
    });
    setActiveCategory('All');
    setCurrentPage(1);
  };

  const suggestedKeywords = ['Antarctic Ice', 'Bharati CTD', 'Kongsfjorden', 'Himansh Glacier', 'Microbiology'];

  return (
    <div className="repository-landing-page bg-[#071A2B] text-slate-100 min-h-screen pb-16 font-sans">
      {/* 1. PAGE HEADER / HERO */}
      <div className="relative border-b border-cyan-900/40 bg-gradient-to-b from-[#051321] via-[#071A2B] to-[#0A2540] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono tracking-wider uppercase mb-4">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            NCPOR / MoES Official Knowledge Repository
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-serif mb-3">
            Polar Knowledge Repository
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Explore expedition reports, research publications, datasets, scientific articles and educational resources from India's polar research ecosystem.
          </p>

          {/* Prominent Global Search Bar */}
          <div className="max-w-3xl mx-auto mt-8">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center bg-slate-900/90 rounded-xl border border-cyan-700/50 shadow-2xl p-2"
            >
              <Search className="w-5 h-5 text-cyan-400 absolute left-4" />
              <input
                type="text"
                placeholder="Search reports, research, datasets, articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent pl-12 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Suggested Search Pills */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-500">Suggested:</span>
              {suggestedKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setSearchQuery(kw)}
                  className="px-2.5 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Repository Statistics bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto mt-10 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="p-2.5 text-center border-r border-slate-800 last:border-0">
              <span className="block text-2xl font-extrabold text-cyan-400 font-mono">{stats.reports_count}</span>
              <span className="text-[11px] text-slate-400 font-medium">Expedition Reports</span>
            </div>
            <div className="p-2.5 text-center border-r border-slate-800 last:border-0">
              <span className="block text-2xl font-extrabold text-teal-400 font-mono">{stats.datasets_count}</span>
              <span className="text-[11px] text-slate-400 font-medium">Datasets</span>
            </div>
            <div className="p-2.5 text-center border-r border-slate-800 last:border-0">
              <span className="block text-2xl font-extrabold text-sky-400 font-mono">{stats.publications_count}</span>
              <span className="text-[11px] text-slate-400 font-medium">Publications</span>
            </div>
            <div className="p-2.5 text-center border-r border-slate-800 last:border-0">
              <span className="block text-2xl font-extrabold text-indigo-400 font-mono">{stats.media_count}</span>
              <span className="text-[11px] text-slate-400 font-medium">Media Records</span>
            </div>
            <div className="p-2.5 text-center col-span-2 md:col-span-1">
              <span className="block text-2xl font-extrabold text-emerald-400 font-mono">{stats.expeditions_count}</span>
              <span className="text-[11px] text-slate-400 font-medium">Expeditions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* 2. CATEGORY NAVIGATION TABS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-serif">Category Archives</h2>
            <Link
              to="/admin/repository/upload"
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5 rotate-180" />
              Upload New Record
            </Link>
          </div>
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* 3. ADVANCED FILTER PANEL */}
        <FilterPanel
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        {/* 4. FEATURED KNOWLEDGE SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-serif">Featured Knowledge</h2>
              <p className="text-xs text-slate-400 mt-0.5">Key benchmark publications and priority expedition reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_KNOWLEDGE.map((res) => (
              <FeaturedResourceCard
                key={res.id}
                resource={res}
                onSelect={(item) =>
                  setSelectedDetailResource({
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    description: item.description,
                    year: item.year,
                    region: item.region,
                    domain: 'Featured Science',
                    author: item.author,
                    badgeVariant: item.badgeVariant,
                    format: item.format,
                  })
                }
                onBookmarkToggle={handleBookmarkToggle}
                isBookmarked={bookmarkedIds.has(res.id)}
              />
            ))}
          </div>
        </div>

        {/* 5. RESOURCE GRID & SEARCH RESULTS */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-white font-serif flex items-center gap-3">
                Knowledge Resources
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                  {filteredResources.length} Results
                </span>
              </h2>
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <EmptyState query={searchQuery} onReset={handleResetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedResources.map((res) => (
                  <ResourceCard
                    key={res.id}
                    resource={res}
                    onReadMore={(item) => setSelectedDetailResource(item)}
                    onBookmarkToggle={handleBookmarkToggle}
                    isBookmarked={bookmarkedIds.has(res.id)}
                  />
                ))}
              </div>

              {/* 10. PAGINATION */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </>
          )}
        </div>

        {/* 8. AI-POWERED DISCOVERY SECTION */}
        <AIDiscoverySection />
      </div>

      {/* 6 & 9. RESOURCE DETAIL MODAL WITH RELATED KNOWLEDGE */}
      <ResourceDetailModal
        resource={selectedDetailResource}
        onClose={() => setSelectedDetailResource(null)}
        relatedResources={SAMPLE_RESOURCES.filter((r) => r.id !== selectedDetailResource?.id)}
        onSelectRelated={(rel) => setSelectedDetailResource(rel)}
        onBookmarkToggle={handleBookmarkToggle}
        isBookmarked={selectedDetailResource ? bookmarkedIds.has(selectedDetailResource.id) : false}
      />
    </div>
  );
};
