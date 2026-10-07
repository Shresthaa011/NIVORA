import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HeaderBanner } from './components/HeaderBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QuickExploreSection } from './components/QuickExploreSection';
import { PolarMapSection } from './components/PolarMapSection';
import { FeaturedResearchSection } from './components/FeaturedResearchSection';
import { AskPolarAISection } from './components/AskPolarAISection';
import { ScienceStoriesSection } from './components/ScienceStoriesSection';
import { LatestKnowledgeSection } from './components/LatestKnowledgeSection';
import { Footer } from './components/Footer';

import { SearchModal } from './components/SearchModal';
import { StationModal } from './components/StationModal';
import { RecordModal } from './components/RecordModal';

import { RepositoryLandingPage } from './pages/RepositoryLandingPage';
import { ReportRepositoryPage } from './pages/ReportRepositoryPage';
import { DatasetRepositoryPage } from './pages/DatasetRepositoryPage';
import { PublicationRepositoryPage } from './pages/PublicationRepositoryPage';
import { MediaRepositoryPage } from './pages/MediaRepositoryPage';
import { ActivityRepositoryPage } from './pages/ActivityRepositoryPage';
import { RepositoryDetailPage } from './pages/RepositoryDetailPage';
import { UploadDashboardPage } from './pages/UploadDashboardPage';
import { ReviewDashboardPage } from './pages/ReviewDashboardPage';

import type { Station, ResearchItem, ScienceStory } from './types/polar';

function HomePage({
  onHeroSearchSubmit,
  onOpenSearch,
  onScrollToSection,
  setSelectedStation,
  setActiveRecordModal,
}: {
  onHeroSearchSubmit: (q: string) => void;
  onOpenSearch: () => void;
  onScrollToSection: (id: string) => void;
  setSelectedStation: (st: Station | null) => void;
  setActiveRecordModal: (val: { type: string; data: any } | null) => void;
}) {
  return (
    <>
      <HeroSection
        onSearchSubmit={onHeroSearchSubmit}
        onOpenSearch={onOpenSearch}
      />
      <QuickExploreSection onCardClick={onScrollToSection} />
      <PolarMapSection onSelectStation={(st) => setSelectedStation(st)} />
      <FeaturedResearchSection
        onSelectResearch={(res: ResearchItem) => setActiveRecordModal({ type: 'Publication / Research', data: res })}
      />
      <AskPolarAISection />
      <ScienceStoriesSection
        onSelectStory={(story: ScienceStory) => setActiveRecordModal({ type: story.type, data: story })}
      />
      <LatestKnowledgeSection
        onViewRecord={(type, record) => setActiveRecordModal({ type, data: record })}
      />
    </>
  );
}

export function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [activeRecordModal, setActiveRecordModal] = useState<{ type: string; data: any } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearchSubmit = (query: string) => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
  };

  const handleSelectSearchResult = (type: string, item: any) => {
    if (type === 'Station') {
      setSelectedStation(item);
    } else {
      setActiveRecordModal({ type, data: item });
    }
  };

  return (
    <BrowserRouter>
      <div className="app-main-wrapper flex flex-col min-h-screen">
        <HeaderBanner />
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onScrollToSection={handleScrollToSection}
        />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onHeroSearchSubmit={handleHeroSearchSubmit}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onScrollToSection={handleScrollToSection}
                  setSelectedStation={setSelectedStation}
                  setActiveRecordModal={setActiveRecordModal}
                />
              }
            />

            {/* Scientific Knowledge Repository Routes */}
            <Route path="/repository" element={<RepositoryLandingPage />} />
            <Route path="/repository/reports" element={<ReportRepositoryPage />} />
            <Route path="/repository/datasets" element={<DatasetRepositoryPage />} />
            <Route path="/repository/publications" element={<PublicationRepositoryPage />} />
            <Route path="/repository/media" element={<MediaRepositoryPage />} />
            <Route path="/repository/activities" element={<ActivityRepositoryPage />} />
            <Route path="/repository/detail/:type/:id" element={<RepositoryDetailPage />} />

            {/* Admin / Upload & Review Routes */}
            <Route path="/admin/repository/upload" element={<UploadDashboardPage />} />
            <Route path="/admin/repository/review" element={<ReviewDashboardPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Modals */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          initialQuery={searchInitialQuery}
          onSelectResult={handleSelectSearchResult}
        />

        <StationModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />

        <RecordModal
          type={activeRecordModal?.type || null}
          record={activeRecordModal?.data || null}
          onClose={() => setActiveRecordModal(null)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
