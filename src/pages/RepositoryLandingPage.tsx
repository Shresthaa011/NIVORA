import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileText, Database, BookOpen, Image, Calendar, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { fetchRepositoryStats, type RepositoryStats } from '../services/api';

export const RepositoryLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<RepositoryStats>({
    reports_count: 15,
    datasets_count: 15,
    publications_count: 15,
    media_count: 25,
    expeditions_count: 44,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchRepositoryStats().then(setStats).catch(console.error);
  }, []);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType === 'reports') navigate(`/repository/reports?q=${encodeURIComponent(searchQuery)}`);
    else if (selectedType === 'datasets') navigate(`/repository/datasets?q=${encodeURIComponent(searchQuery)}`);
    else if (selectedType === 'publications') navigate(`/repository/publications?q=${encodeURIComponent(searchQuery)}`);
    else if (selectedType === 'media') navigate(`/repository/media?q=${encodeURIComponent(searchQuery)}`);
    else navigate(`/repository/reports?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="repository-landing-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      {/* Hero Header Banner */}
      <div className="relative border-b border-cyan-900/40 bg-gradient-to-b from-[#051321] via-[#071A2B] to-[#0A2540] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono tracking-wider uppercase mb-4">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            NCPOR / MoES Official Scientific Repository
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-serif mb-4">
            Polar Knowledge Repository
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-300">
            Discover expedition reports, scientific datasets, research publications and media from India’s polar research ecosystem across Antarctica, Arctic & Himalayas.
          </p>

          {/* Repository Statistics bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mt-10 p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-2xl">
            <div className="p-3 text-center border-r border-slate-800/80 last:border-0">
              <span className="block text-3xl font-extrabold text-cyan-400">{stats.reports_count}</span>
              <span className="text-xs text-slate-400 font-medium">Expedition Reports</span>
            </div>
            <div className="p-3 text-center border-r border-slate-800/80 last:border-0">
              <span className="block text-3xl font-extrabold text-teal-400">{stats.datasets_count}</span>
              <span className="text-xs text-slate-400 font-medium">Datasets</span>
            </div>
            <div className="p-3 text-center border-r border-slate-800/80 last:border-0">
              <span className="block text-3xl font-extrabold text-sky-400">{stats.publications_count}</span>
              <span className="text-xs text-slate-400 font-medium">Publications</span>
            </div>
            <div className="p-3 text-center border-r border-slate-800/80 last:border-0">
              <span className="block text-3xl font-extrabold text-indigo-400">{stats.media_count}</span>
              <span className="text-xs text-slate-400 font-medium">Media Items</span>
            </div>
            <div className="p-3 text-center col-span-2 md:col-span-1">
              <span className="block text-3xl font-extrabold text-emerald-400">{stats.expeditions_count}</span>
              <span className="text-xs text-slate-400 font-medium">Expeditions</span>
            </div>
          </div>

          {/* Repository Unified Search */}
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row gap-2 p-2 bg-slate-900/90 rounded-lg border border-cyan-800/50 shadow-lg">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search by title, author, keyword, DOI, dataset ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded border border-slate-700 focus:outline-none"
            >
              <option value="all">All Repository Types</option>
              <option value="reports">Reports</option>
              <option value="datasets">Datasets</option>
              <option value="publications">Publications</option>
              <option value="media">Media</option>
            </select>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white font-serif">Repository Categories</h2>
            <p className="text-xs text-slate-400">Browse curated scientific knowledge by resource type</p>
          </div>
          <Link to="/admin/repository/upload" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-2 rounded shadow transition-colors">
            <Download className="w-4 h-4 rotate-180" />
            Upload New Record
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Reports */}
          <Link
            to="/repository/reports"
            className="group p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                <FileText className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                {stats.reports_count} Files
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              📄 Expedition & Scientific Reports
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Official Indian Scientific Expedition Reports (ISEA), station annual progress reports, and mission technical logs from Maitri, Bharati & Himadri.
            </p>
            <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              Browse Reports <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 2: Datasets */}
          <Link
            to="/repository/datasets"
            className="group p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-800/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/50">
                <Database className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                {stats.datasets_count} Datasets
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
              🧪 Scientific Datasets
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Raw and processed observations: meteorology logs, hydrographic ocean profiles (CTD), ice velocity grids, limnology data, and metagenomic sequences.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform">
              Browse Datasets <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 3: Publications */}
          <Link
            to="/repository/publications"
            className="group p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-800/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/50">
                <BookOpen className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                {stats.publications_count} Articles
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
              📚 Research Publications
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Peer-reviewed journal articles, conference papers, books and technical publications produced by Indian polar scientists with registered DOIs.
            </p>
            <div className="flex items-center text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
              Browse Publications <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 4: Media */}
          <Link
            to="/repository/media"
            className="group p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                <Image className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                {stats.media_count} Files
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
              📷 Scientific Media (Images & Videos)
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              High-resolution polar photography, auroral phenomena capture, ice-breaker vessel footage, and drone surveys across Antarctic stations.
            </p>
            <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
              Explore Media <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 5: Activities */}
          <Link
            to="/repository/activities"
            className="group p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                <Calendar className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                10 Records
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
              🏛️ Institutional Activities
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Documentation for workshops, scientific conferences, school outreach, public lectures, pre-expedition survival training, and announcements.
            </p>
            <div className="flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              View Activities <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 6: Review Dashboard */}
          <Link
            to="/admin/repository/review"
            className="group p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/50">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Reviewer Portal
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
              ⚖️ Review & Quality Workflow
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Scientific review gate: approve pending submissions, request revisions, and verify SHA-256 integrity before publishing to public portal.
            </p>
            <div className="flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              Review Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
