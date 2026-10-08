import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { STATIONS_DATA } from '../data/mockData';
import type { Station } from '../types/polar';
import { ArrowRight, Globe as GlobeIcon, RefreshCw } from 'lucide-react';

interface PolarMapProps {
  onSelectStation: (station: Station) => void;
}

export const PolarMapSection: React.FC<PolarMapProps> = ({ onSelectStation }) => {
  const [activeFilter, setActiveFilter] = useState<'Antarctica' | 'Arctic' | 'All'>('Antarctica');
  const [selectedStation, setSelectedStation] = useState<Station>(STATIONS_DATA[0]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 520 });

  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const autoRotateTimerRef = useRef<any>(null);

  // Resize handler for responsive globe canvas
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 800,
          height: containerRef.current.clientHeight || 520
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      observer.disconnect();
    };
  }, []);

  const filteredStations = useMemo(() => {
    return STATIONS_DATA.filter((st) => {
      if (activeFilter === 'All') return true;
      return st.region === activeFilter;
    });
  }, [activeFilter]);

  // Handle Tab Switch and view transition
  useEffect(() => {
    if (!globeRef.current) return;

    // Enable auto-rotation
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
    }

    if (activeFilter === 'Antarctica') {
      globeRef.current.pointOfView({ lat: -75, lng: 45, altitude: 2.1 }, 1200);
      const antStation = STATIONS_DATA.find(s => s.region === 'Antarctica');
      if (antStation) setSelectedStation(antStation);
    } else if (activeFilter === 'Arctic') {
      globeRef.current.pointOfView({ lat: 75, lng: 18, altitude: 2.1 }, 1200);
      const arcStation = STATIONS_DATA.find(s => s.region === 'Arctic');
      if (arcStation) setSelectedStation(arcStation);
    } else {
      globeRef.current.pointOfView({ lat: 20, lng: 45, altitude: 2.8 }, 1200);
    }
  }, [activeFilter]);

  // Pause auto-rotation on user interaction
  const handleGlobeInteraction = () => {
    if (globeRef.current && globeRef.current.controls()) {
      globeRef.current.controls().autoRotate = false;

      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
      autoRotateTimerRef.current = setTimeout(() => {
        if (globeRef.current && globeRef.current.controls()) {
          globeRef.current.controls().autoRotate = true;
        }
      }, 5000);
    }
  };

  const handlePointClick = (station: any) => {
    setSelectedStation(station);
    handleGlobeInteraction();
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: station.lat, lng: station.lng, altitude: 1.8 }, 1000);
    }
  };

  // Ring data for glowing pulse on markers
  const ringsData = useMemo(() => {
    return filteredStations.map(st => ({
      ...st,
      maxRadius: st.id === selectedStation?.id ? 4.5 : 2.5,
      propagationSpeed: st.id === selectedStation?.id ? 2.5 : 1.5,
      repeatPeriod: st.id === selectedStation?.id ? 1000 : 2000
    }));
  }, [filteredStations, selectedStation]);

  return (
    <section id="polar-world-map" className="map-section-bg">
      <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="map-header">
          <span className="section-tag" style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GlobeIcon size={14} /> 3D INTERACTIVE GEOSPATIAL ATLAS
          </span>
          <h2 className="section-title">Explore the Polar World</h2>
          <p className="section-subtitle">
            Interactive 3D Earth visualization of India's research stations, expeditions, and oceanographic observatories across Antarctica and the Arctic.
          </p>
        </div>

        {/* Map Filter Controls */}
        <div className="map-controls-row">
          <div className="map-tabs">
            <button
              className={`map-tab-btn ${activeFilter === 'Antarctica' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Antarctica')}
            >
              Antarctica
            </button>
            <button
              className={`map-tab-btn ${activeFilter === 'Arctic' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Arctic')}
            >
              Arctic
            </button>
            <button
              className={`map-tab-btn ${activeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setActiveFilter('All')}
            >
              Indian Polar Research (All)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#94A3B8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06B6D4' }}></span>
              Year-Round Station
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E2E8F0' }}></span>
              Heritage / Seasonal Base
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8' }}>
              <RefreshCw size={12} className="spin-slow" /> Interactive 3D Globe
            </span>
          </div>
        </div>

        {/* Map Viewport Container */}
        <div className="map-viewport" ref={containerRef}>
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            showAtmosphere={true}
            atmosphereColor="#06B6D4"
            atmosphereAltitude={0.18}
            
            /* Station Points Layer */
            pointsData={filteredStations}
            pointLat="lat"
            pointLng="lng"
            pointColor={(d: any) => d.id === selectedStation?.id ? '#38BDF8' : d.status.includes('Year-round') ? '#06B6D4' : '#E2E8F0'}
            pointRadius={(d: any) => d.id === selectedStation?.id ? 0.75 : 0.5}
            pointAltitude={(d: any) => d.id === selectedStation?.id ? 0.08 : 0.04}
            pointLabel={(d: any) => `
              <div style="background:#0A1E36; color:white; padding:8px 12px; border-radius:8px; font-family:Inter, sans-serif; border:1px solid #38BDF8; font-size:12px; box-shadow:0 6px 16px rgba(0,0,0,0.6)">
                <div style="font-weight:700; color:#38BDF8; font-size:13px">${d.name}</div>
                <div style="color:#94A3B8; font-size:10px; margin-top:2px">${d.location}</div>
                <div style="color:#CBD5E1; font-size:10px; margin-top:4px; font-family:monospace">${d.coordinates}</div>
              </div>
            `}
            onPointClick={handlePointClick}
            
            /* Pulsating Radar Rings Layer */
            ringsData={ringsData}
            ringLat="lat"
            ringLng="lng"
            ringColor={() => (t: number) => `rgba(56, 189, 248, ${1 - t})`}
            ringMaxRadius="maxRadius"
            ringPropagationSpeed="propagationSpeed"
            ringRepeatPeriod="repeatPeriod"
            
            /* HTML Station Label Markers */
            htmlElementsData={filteredStations}
            htmlLat="lat"
            htmlLng="lng"
            htmlElement={(d: any) => {
              const isSelected = d.id === selectedStation?.id;
              const el = document.createElement('div');
              el.className = `station-pin ${isSelected ? 'active' : ''}`;
              el.style.pointerEvents = 'auto';
              el.style.cursor = 'pointer';
              el.innerHTML = `
                <div class="pin-pulse"></div>
                <div class="pin-core"></div>
                <div class="pin-label">
                  <span style="color:${isSelected ? '#38BDF8' : 'white'}">${d.name}</span>
                </div>
              `;
              el.onclick = () => handlePointClick(d);
              return el;
            }}

            onZoom={handleGlobeInteraction}
          />

          {/* Interactive Info Card Popup Overlay */}
          {selectedStation && (
            <div className="map-popup-card">
              <div className="popup-badge">{selectedStation.region} • EST. {selectedStation.established}</div>
              <h3 className="popup-title">{selectedStation.name}</h3>
              <div className="popup-coords">{selectedStation.coordinates}</div>

              <p style={{ fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '12px', lineHeight: '1.4' }}>
                {selectedStation.description}
              </p>

              <div className="popup-stats-grid">
                <div>
                  <div className="popup-stat-val">{selectedStation.expeditionsCount}</div>
                  <div className="popup-stat-lbl">Expeditions</div>
                </div>
                <div>
                  <div className="popup-stat-val">{selectedStation.datasetsCount}</div>
                  <div className="popup-stat-lbl">Datasets</div>
                </div>
                <div>
                  <div className="popup-stat-val">{selectedStation.publicationsCount}</div>
                  <div className="popup-stat-lbl">Publications</div>
                </div>
              </div>

              <button
                className="popup-btn"
                onClick={() => onSelectStation(selectedStation)}
              >
                <span>Explore Station</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
