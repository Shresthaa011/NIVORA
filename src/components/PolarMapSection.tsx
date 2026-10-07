import React, { useState } from 'react';
import { STATIONS_DATA } from '../data/mockData';
import type { Station } from '../types/polar';
import { MapPin, ArrowRight, Layers } from 'lucide-react';

interface PolarMapProps {
  onSelectStation: (station: Station) => void;
}

export const PolarMapSection: React.FC<PolarMapProps> = ({ onSelectStation }) => {
  const [activeFilter, setActiveFilter] = useState<'Antarctica' | 'Arctic' | 'All'>('Antarctica');
  const [selectedStation, setSelectedStation] = useState<Station>(STATIONS_DATA[0]);

  const filteredStations = STATIONS_DATA.filter((st) => {
    if (activeFilter === 'All') return true;
    return st.region === activeFilter;
  });

  // Relative visual pin positions for map container (Antarctica & Arctic representation)
  const pinCoordinates: Record<string, { top: string; left: string }> = {
    'st-bharati': { top: '58%', left: '74%' },
    'st-maitri': { top: '38%', left: '46%' },
    'st-dakshin-gangotri': { top: '34%', left: '48%' },
    'st-himadri': { top: '25%', left: '52%' },
    'st-indarc': { top: '30%', left: '50%' }
  };

  return (
    <section id="polar-world-map" className="map-section-bg">
      <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="map-header">
          <span className="section-tag" style={{ color: '#38BDF8' }}>INTERACTIVE GEOSPATIAL ATLAS</span>
          <h2 className="section-title">Explore the Polar World</h2>
          <p className="section-subtitle">
            Discover research stations, expeditions and scientific activity across the polar regions.
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#94A3B8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06B6D4' }}></span>
              Year-Round Station
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E2E8F0' }}></span>
              Heritage Base
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={14} /> MapLibre / Leaflet Ready
            </span>
          </div>
        </div>

        {/* Map Viewport Container */}
        <div className="map-viewport">
          <div className="map-vector-canvas">
            <div className="map-grid-lines"></div>

            {/* Realistic Antarctica / Polar Continent Graphic Silhouette */}
            <svg className="antarctica-svg-wrap" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M400,120 Q520,100 620,190 T680,340 Q710,480 560,510 T320,530 Q180,480 140,360 T220,180 Z"
                fill="url(#iceGradient)"
                stroke="rgba(6, 182, 212, 0.3)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M380,240 Q440,220 500,280 T480,380 T350,420 T280,320 Z"
                fill="rgba(255, 255, 255, 0.05)"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
              />
              {/* Latitude Rings */}
              <circle cx="400" cy="330" r="220" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
              <circle cx="400" cy="330" r="140" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
              <text x="410" y="125" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace">70°S</text>
              <text x="410" y="205" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace">80°S</text>
              <defs>
                <linearGradient id="iceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(2, 132, 199, 0.25)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0.08)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Render Station Pin Markers */}
            {filteredStations.map((station) => {
              const pos = pinCoordinates[station.id] || { top: '50%', left: '50%' };
              const isSelected = selectedStation?.id === station.id;

              return (
                <div
                  key={station.id}
                  className={`station-pin ${isSelected ? 'active' : ''}`}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setSelectedStation(station)}
                  onMouseEnter={() => setSelectedStation(station)}
                  title={`${station.name} (${station.coordinates})`}
                >
                  <div className="pin-pulse"></div>
                  <div className="pin-core"></div>
                  <div className="pin-label">
                    <MapPin size={10} style={{ display: 'inline', marginRight: '3px' }} />
                    {station.name}
                  </div>
                </div>
              );
            })}

            {/* Interactive Info Card Popup Overlay */}
            {selectedStation && (
              <div className="map-popup-card">
                <div className="popup-badge">{selectedStation.region} • EST. {selectedStation.established}</div>
                <h3 className="popup-title">{selectedStation.name}</h3>
                <div className="popup-coords">{selectedStation.coordinates}</div>

                <p style={{ fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '12px', lineHeight: '1.4' }}>
                  {selectedStation.description.substring(0, 95)}...
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
      </div>
    </section>
  );
};
