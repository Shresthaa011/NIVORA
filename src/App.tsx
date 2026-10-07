import { useState, useEffect } from 'react';
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

import type { Station, ResearchItem, ScienceStory } from './types/polar';

export function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [activeRecordModal, setActiveRecordModal] = useState<{ type: string; data: any } | null>(null);

  // Keyboard shortcut for Ctrl+K / Cmd+K search
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
    <div className="app-main-wrapper">
      {/* 1. Government Institutional Top Bar */}
      <HeaderBanner />

      {/* 2. Sticky Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* 3. Hero Section */}
      <HeroSection
        onSearchSubmit={handleHeroSearchSubmit}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 4. Quick Explore Feature Cards Section */}
      <QuickExploreSection onCardClick={handleScrollToSection} />

      {/* 5. Interactive Polar World Map Section */}
      <PolarMapSection onSelectStation={(st) => setSelectedStation(st)} />

      {/* 6. Featured Research Section */}
      <FeaturedResearchSection
        onSelectResearch={(res: ResearchItem) => setActiveRecordModal({ type: 'Publication / Research', data: res })}
      />

      {/* 7. Ask Polar AI Section (Grounded RAG Placeholder) */}
      <AskPolarAISection />

      {/* 8. Science Stories Dissemination Section */}
      <ScienceStoriesSection
        onSelectStory={(story: ScienceStory) => setActiveRecordModal({ type: story.type, data: story })}
      />

      {/* 9. Latest Knowledge Repository Tabs */}
      <LatestKnowledgeSection
        onViewRecord={(type, record) => setActiveRecordModal({ type, data: record })}
      />

      {/* 10. Institutional Footer */}
      <Footer />

      {/* Overlays and Modals */}
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
  );
}

export default App;
