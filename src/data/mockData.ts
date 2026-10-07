import type { Station, ResearchItem, Expedition, Dataset, Publication, MediaItem, ScienceStory, AIQueryResponse } from '../types/polar';

export const STATIONS_DATA: Station[] = [
  {
    id: 'st-bharati',
    name: 'Bharati Station',
    region: 'Antarctica',
    location: 'Larsemann Hills, East Antarctica',
    coordinates: '69°24\'28" S, 76°11\'14" E',
    established: 2012,
    status: 'Active (Year-round)',
    expeditionsCount: 18,
    datasetsCount: 43,
    publicationsCount: 71,
    description: 'India\'s third polar research station and second operational year-round facility in Antarctica. Built using 134 prefabricated shipping containers wrapped in a specialized aerodynamic energy-efficient shell.',
    keyResearchAreas: ['Atmospheric Physics', 'Upper Mantle Geophysics', 'Glaciology', 'Oceanography', 'Solar Terrestrial Physics'],
    lat: -69.4077,
    lng: 76.1872,
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'st-maitri',
    name: 'Maitri Station',
    region: 'Antarctica',
    location: 'Schirmacher Oasis, Dronning Maud Land',
    coordinates: '70°45\'57" S, 11°44\'09" E',
    established: 1989,
    status: 'Active (Year-round)',
    expeditionsCount: 36,
    datasetsCount: 89,
    publicationsCount: 142,
    description: 'India\'s second research station in Antarctica, located on the ice-free rocky terrain of Schirmacher Oasis. Features Lake Priyadarshini, a fresh-water lake that supplies potable water to the station.',
    keyResearchAreas: ['Environmental Science', 'Biological Diversity', 'Geomagnetism', 'Meteorology', 'Human Physiology'],
    lat: -70.7658,
    lng: 11.7358,
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'st-dakshin-gangotri',
    name: 'Dakshin Gangotri',
    region: 'Antarctica',
    location: 'Dakshin Gangotri Glacier, Queen Maud Land',
    coordinates: '70°05\'37" S, 12°00\'00" E',
    established: 1983,
    status: 'Decommissioned / Heritage',
    expeditionsCount: 8,
    datasetsCount: 19,
    publicationsCount: 28,
    description: 'India\'s historic first research station established during the 3rd Indian Antarctic Expedition. Decommissioned in 1990 after being buried in ice, now preserved as a historic supply depot.',
    keyResearchAreas: ['Historical Baseline Meteorology', 'Glacial Dynamics', 'First Generation Polar Logistics'],
    lat: -70.0936,
    lng: 12.0000,
    image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'st-himadri',
    name: 'Himadri Station',
    region: 'Arctic',
    location: 'Ny-Ålesund, Svalbard, Norway',
    coordinates: '78°55\'00" N, 11°56\'00" E',
    established: 2008,
    status: 'Active (Seasonal)',
    expeditionsCount: 15,
    datasetsCount: 38,
    publicationsCount: 54,
    description: 'India\'s Arctic research station located at the International Arctic Research Base in Svalbard. Focuses on aerosol radiative forcing, microbial ecology, and Arctic fjord dynamics.',
    keyResearchAreas: ['Arctic Aerosols', 'Fjord Biogeochemistry', 'Glacier Mass Balance', 'Microbial Adaptation'],
    lat: 78.9167,
    lng: 11.9333,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'st-indarc',
    name: 'IndARC Observatory',
    region: 'Arctic',
    location: 'Kongsfjorden, Svalbard',
    coordinates: '78°54\'00" N, 11°53\'00" E',
    established: 2014,
    status: 'Active (Year-round)',
    expeditionsCount: 10,
    datasetsCount: 27,
    publicationsCount: 31,
    description: 'India\'s first underwater moored observatory deployed in the Arctic waters to collect real-time oceanographic data on seasonal climate teleconnections.',
    keyResearchAreas: ['Sub-surface Temperature Profiles', 'Salinity Dynamics', 'Arctic Ocean Currents'],
    lat: 78.9000,
    lng: 11.8833,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
  }
];

export const FEATURED_RESEARCH: ResearchItem[] = [
  {
    id: 'res-01',
    title: 'Understanding Antarctic Ice Sheet Dynamics & Mass Loss',
    category: 'Glaciology',
    shortDescription: 'High-resolution radar profiling and ice core strain gauge analysis examining velocity changes in East Antarctic coastal ice flow.',
    fullDescription: 'This long-term investigation by NCPOR glaciologists combines satellite altimetry with ground-penetrating radar deployed during the 41st and 42nd Indian Antarctic Expeditions. The research quantifies basal melt rates and bedrock elevation profiles around Prydz Bay.',
    year: 2025,
    leadInstitution: 'National Centre for Polar and Ocean Research (NCPOR)',
    stationId: 'st-bharati',
    doi: '10.1016/j.polar.2025.100982',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    datasetsAssociatedCount: 6,
    tags: ['Glaciology', 'Ice Dynamics', 'Basal Melt', 'East Antarctica', 'Radar Profiling']
  },
  {
    id: 'res-02',
    title: 'Atmospheric Aerosol & Radiation Balance at Bharati Station',
    category: 'Atmospheric Science',
    shortDescription: 'Continuous monitoring of black carbon, ozone transport, and cosmic ray variations in the pristine polar atmosphere.',
    fullDescription: 'Using high-altitude micro-lidar systems and sky radiometers at Bharati Station, researchers measure optical depth and boundary layer turbulence. The studies reveal how long-range transported aerosol plumes interact with polar clouds.',
    year: 2025,
    leadInstitution: 'Indian Institute of Geomagnetism & NCPOR',
    stationId: 'st-bharati',
    doi: '10.1007/s00376-024-3310-8',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    datasetsAssociatedCount: 12,
    tags: ['Atmospheric Science', 'Aerosol Plumes', 'Ozone Layer', 'Radiative Forcing']
  },
  {
    id: 'res-03',
    title: 'Polar Extremophile Genomics & Marine Ecosystem Response',
    category: 'Polar Biology',
    shortDescription: 'Metagenomic analysis of psychrophilic bacteria and micro-algae adapted to sub-zero Antarctic lake ecosystems.',
    fullDescription: 'Biological samples harvested from Lake Priyadarshini near Maitri Station reveal novel cold-adapted enzymes (cold-active lipases and cellulases) with promising applications in biotechnology and industrial biochemistry.',
    year: 2024,
    leadInstitution: 'School of Environmental Sciences, JNU & NCPOR',
    stationId: 'st-maitri',
    doi: '10.1128/aem.00412-24',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000&auto=format&fit=crop',
    datasetsAssociatedCount: 4,
    tags: ['Polar Biology', 'Genomics', 'Psychrophiles', 'Extremophiles', 'Microbiology']
  }
];

export const EXPEDITIONS_DATA: Expedition[] = [
  {
    id: 'exp-43',
    code: 'IAE-43',
    title: '43rd Indian Scientific Expedition to Antarctica',
    region: 'Antarctica',
    year: '2023 - 2024',
    leader: 'Dr. Yogesh Ray (NCPOR)',
    participantCount: 56,
    summary: 'Focused on deep ice core drilling down to 250 meters in Central Dronning Maud Land, deployment of automated meteorological stations, and ecological monitoring of Antarctic sea birds.',
    keyMilestones: ['250m Ice Core Recovered', 'New Solar Micro-Grid Deployed at Maitri', 'Seafloor Bathymetry Survey in Prydz Bay'],
    datasetsGenerated: 14,
    status: 'Completed'
  },
  {
    id: 'exp-44',
    code: 'IAE-44',
    title: '44th Indian Scientific Expedition to Antarctica',
    region: 'Antarctica',
    year: '2024 - 2025',
    leader: 'Dr. Rahul Mohan (NCPOR)',
    participantCount: 62,
    summary: 'Initiated foundation surveys for the new Maitri-II replacement station, conducted multi-beam bathymetric mapping, and executed long-traverse glaciology towards South Pole coordinates.',
    keyMilestones: ['Maitri-II Geotechnical Drilling', 'Southern Ocean Acidification Sampling', 'Autonomous Hydro-Drone Trial'],
    datasetsGenerated: 18,
    status: 'Completed'
  },
  {
    id: 'exp-arc-16',
    code: 'IN-ARC-16',
    title: '16th Indian Arctic Scientific Expedition',
    region: 'Arctic',
    year: '2025',
    leader: 'Dr. K. P. Krishnan (NCPOR)',
    participantCount: 14,
    summary: 'Summer campaign in Svalbard investigating atmospheric trace gases, snow pack chemistry, and microbial diversity in melting Arctic glaciers.',
    keyMilestones: ['IndARC Mooring Retrieval & Re-deployment', 'Fjord Sediment Core Extraction'],
    datasetsGenerated: 8,
    status: 'Ongoing'
  },
  {
    id: 'exp-so-12',
    code: 'SOE-12',
    title: '12th Southern Ocean Expedition',
    region: 'Southern Ocean',
    year: '2024',
    leader: 'Dr. Anilkumar N. (NCPOR)',
    participantCount: 32,
    summary: 'Research vessel cruise from Cape Town to 67°S studying oceanic fronts, carbon sequestration efficiency, and krill biomass distribution.',
    keyMilestones: ['Sub-surface CTD Casts across 50 Stations', 'Carbon Flux Quantification'],
    datasetsGenerated: 11,
    status: 'Completed'
  }
];

export const DATASETS_DATA: Dataset[] = [
  {
    id: 'ds-01',
    title: 'High-Resolution Surface Mass Balance Dataset for Larsemann Hills (2015-2025)',
    category: 'Glaciology',
    year: 2025,
    format: 'NetCDF4 / CSV',
    fileSize: '4.2 GB',
    station: 'Bharati Station',
    doi: '10.5281/zenodo.8920192',
    abstract: 'Contains daily surface ablation and accumulation measurements, ice stake network velocities, and thermal radar soundings recorded over a 10-year span around Bharati Station.',
    accessType: 'Open Access'
  },
  {
    id: 'ds-02',
    title: 'Continuous Surface Ozone & Greenhouse Gas Observations at Maitri',
    category: 'Atmospheric Science',
    year: 2024,
    format: 'HDF5 / ASCII',
    fileSize: '1.8 GB',
    station: 'Maitri Station',
    doi: '10.5281/zenodo.7410293',
    abstract: 'Minute-by-minute baseline concentrations of O3, CO2, CH4, and aerosol optical thickness (AOT) recorded at Schirmacher Oasis.',
    accessType: 'Open Access'
  },
  {
    id: 'ds-03',
    title: 'IndARC Arctic Oceanographic Time-Series Data (Kongsfjorden Mooring)',
    category: 'Oceanography',
    year: 2024,
    format: 'NetCDF / JSON',
    fileSize: '890 MB',
    station: 'IndARC Observatory',
    doi: '10.5281/zenodo.6201948',
    abstract: 'Year-round water temperature, salinity, turbidity, and current velocity parameters collected at sub-surface depths between 40m and 190m in Svalbard.',
    accessType: 'Open Access'
  },
  {
    id: 'ds-04',
    title: 'Prydz Bay Seafloor Sediment Grain Size & Micro-fossil Abundance',
    category: 'Geology & Geophysics',
    year: 2023,
    format: 'CSV / GeoTIFF',
    fileSize: '650 MB',
    station: 'Bharati Station',
    doi: '10.5281/zenodo.5109312',
    abstract: 'Sedimentological and diatom preservation indices derived from 28 marine sediment cores retrieved during Southern Ocean research cruises.',
    accessType: 'Restricted / Request Access'
  }
];

export const PUBLICATIONS_DATA: Publication[] = [
  {
    id: 'pub-01',
    title: 'Decadal Trends in East Antarctic Sea Ice Extent and Coastal Polynya Dynamics',
    journal: 'Journal of Geophysical Research: Oceans',
    authors: ['Rahul Mohan', 'Yogesh Ray', 'Prashant Pandit', 'S. Rajan'],
    year: 2025,
    category: 'Ocean & Sea Ice',
    doi: '10.1029/2024JC020911',
    abstract: 'We present a 20-year multi-satellite passive microwave analysis of sea ice concentration surrounding Prydz Bay, revealing local trends driven by Katabatic wind forcing.',
    citations: 14
  },
  {
    id: 'pub-02',
    title: 'Microbial Diversity and Enzymatic Adaptation in Antarctic Permafrost Soils',
    journal: 'Polar Biology',
    authors: ['P. V. Bhaskar', 'K. P. Krishnan', 'Archana Singh'],
    year: 2024,
    category: 'Polar Biology',
    doi: '10.1007/s00300-024-03219-9',
    abstract: 'Characterizes psychrophilic bacterial communities isolated from Schirmacher Oasis permafrost, highlighting high metabolic flexibility under extreme freeze-thaw cycles.',
    citations: 28
  },
  {
    id: 'pub-03',
    title: 'Aerosol Radiative Forcing and Black Carbon Transport over Svalbard Arctic Atmosphere',
    journal: 'Atmospheric Chemistry and Physics',
    authors: ['N. V. P. Kiran', 'M. M. Gogoi', 'S. Suresh Babu'],
    year: 2024,
    category: 'Atmospheric Science',
    doi: '10.5194/acp-24-1849-2024',
    abstract: 'Quantifies light-absorbing carbonaceous aerosols measured at Himadri Station during Arctic spring melt seasons.',
    citations: 39
  }
];

export const MEDIA_DATA: MediaItem[] = [
  {
    id: 'med-01',
    title: 'Aerial Ultra-HD Survey of Bharati Station & Larsemann Hills Ice Sheet',
    type: 'Video',
    category: 'Expedition Media',
    year: 2024,
    thumbnail: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800&auto=format&fit=crop',
    durationOrResolution: '4K Ultra HD • 08:45',
    caption: 'Cinematic drone footage depicting the aerodynamic structure of Bharati station surrounded by iceberg-laden waters.'
  },
  {
    id: 'med-02',
    title: 'Deep Ice Core Drilling Operations at 70° South',
    type: 'Photo',
    category: 'Field Research',
    year: 2024,
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    durationOrResolution: 'High-Res Photo Gallery (18 Shots)',
    caption: 'NCPOR glaciologists extracting a 200m ice core sample during the 43rd Indian Antarctic Expedition.'
  },
  {
    id: 'med-03',
    title: 'Deployment of IndARC Moored Observatory in Kongsfjorden',
    type: 'Video',
    category: 'Arctic Science',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    durationOrResolution: 'Full HD • 05:20',
    caption: 'Step-by-step documentation of lowering the multi-sensor oceanographic mooring into sub-zero Arctic fjord waters.'
  }
];

export const SCIENCE_STORIES: ScienceStory[] = [
  {
    id: 'story-01',
    type: 'Science Brief',
    title: 'Decoding 800,000 Years of Climate History from Antarctic Ice Cores',
    subtitle: 'How tiny trapped air bubbles inside ancient polar ice layers provide an atmospheric time machine for Indian scientists.',
    readTime: '4 min read',
    date: 'March 2026',
    author: 'NCPOR Science Communication Cell',
    summary: 'Deep inside the Antarctic ice sheet lie continuous layers of snow deposited over hundreds of millennia. By drilling down hundreds of meters, Indian glaciologists extract atmospheric snapshots that reveal greenhouse gas levels before human industrialization.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    originalResearchTitle: 'Understanding Antarctic Ice Sheet Dynamics & Mass Loss (DOI: 10.1016/j.polar.2025.100982)'
  },
  {
    id: 'story-02',
    type: 'Expedition Story',
    title: 'Life at 70° South: 365 Days Inside India\'s Bharati Station',
    subtitle: 'From months of polar night darkness to howling Katabatic winds, step inside India\'s futuristic research station.',
    readTime: '7 min read',
    date: 'February 2026',
    author: 'Commander V. K. Sharma (Winter Team Member)',
    summary: 'Surviving an Antarctic winter requires technical discipline, camaraderie, and cutting-edge engineering. Experience a day in the life of Indian researchers maintaining zero-emission microgrids and atmospheric sensors in sub-zero isolation.',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800&auto=format&fit=crop',
    originalResearchTitle: 'Bharati Station Operational Log & Atmospheric Radiative Baseline'
  },
  {
    id: 'story-03',
    type: 'Research Explained',
    title: 'Why Southern Ocean Acidification Matters for Indian Monsoons',
    subtitle: 'Uncovering the teleconnections between polar ocean currents and South Asian climate systems.',
    readTime: '5 min read',
    date: 'January 2026',
    author: 'Dr. Archana Singh & Media Team',
    summary: 'The Southern Ocean absorbs over 40% of human-induced oceanic carbon dioxide. New data from India\'s oceanographic cruises show how changes in polar upwelling currents directly influence global climate patterns and monsoon predictability.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    originalResearchTitle: 'Decadal Trends in East Antarctic Sea Ice Extent (DOI: 10.1029/2024JC020911)'
  }
];

export const MOCK_AI_RESPONSES: Record<string, AIQueryResponse> = {
  default: {
    query: "What research has India conducted at Bharati Station?",
    answer: "India's Bharati Station, operational since 2012 in Larsemann Hills, East Antarctica, conducts multi-disciplinary scientific research focusing on: \n1. **Glaciology & Ice Dynamics:** Radar profiling of mass balance and ice velocity.\n2. **Atmospheric Physics:** Monitoring aerosol optical depth, cosmic radiation, and ozone layer transport.\n3. **Geology & Tectonics:** Probing the Gondwanaland supercontinent fit between India and East Antarctica.\n4. **Oceanography:** Coastal bathymetry, ocean currents, and sea-ice Polynya interactions in Prydz Bay.",
    confidenceScore: 0.96,
    sources: [
      {
        title: "Understanding Antarctic Ice Sheet Dynamics & Mass Loss",
        type: "Publication",
        id: "pub-01",
        doi: "10.1016/j.polar.2025.100982",
        snippet: "High-resolution radar profiling and strain gauge analysis surrounding Bharati Station..."
      },
      {
        title: "Atmospheric Aerosol & Radiation Balance at Bharati",
        type: "Publication",
        id: "pub-02",
        doi: "10.1007/s00376-024-3310-8",
        snippet: "Sky radiometer and boundary layer measurements conducted continuously at Bharati Station..."
      },
      {
        title: "43rd Indian Scientific Expedition Antarctic Report",
        type: "Expedition Report",
        id: "exp-43",
        snippet: "Operational log of atmospheric sensors and glaciology field traverses."
      }
    ]
  },
  datasets: {
    query: "What datasets are available for Antarctic climate research?",
    answer: "The POLAR EXPLORER repository archives 43+ datasets from Antarctica, including: \n• **Surface Mass Balance (2015-2025):** 10-year NetCDF4 surface ablation & ice stake velocities.\n• **Continuous Surface Ozone & GHG at Maitri:** Minute-by-minute O3, CO2, CH4 concentrations.\n• **Prydz Bay Seafloor Cores:** Diatom and sediment grain size parameters from Southern Ocean cruises.",
    confidenceScore: 0.98,
    sources: [
      {
        title: "High-Resolution Surface Mass Balance Dataset (Larsemann Hills)",
        type: "Dataset",
        id: "ds-01",
        doi: "10.5281/zenodo.8920192",
        snippet: "Contains daily surface ablation and accumulation measurements recorded over 10 years."
      },
      {
        title: "Continuous Surface Ozone & Greenhouse Gas Observations at Maitri",
        type: "Dataset",
        id: "ds-02",
        doi: "10.5281/zenodo.7410293",
        snippet: "Baseline minute-level O3, CO2, CH4 atmospheric concentrations."
      }
    ]
  },
  expeditions: {
    query: "Which expeditions studied glacier dynamics?",
    answer: "Glacier dynamics and ice mass balance were central objectives of the **41st, 42nd, 43rd, and 44th Indian Scientific Expeditions to Antarctica (IAE)**. Key field activities included 250m deep ice core extraction in Dronning Maud Land, ground-penetrating radar profiling along 400km traverses, and GPS tracking of coastal ice shelves.",
    confidenceScore: 0.94,
    sources: [
      {
        title: "43rd Indian Scientific Expedition to Antarctica Report",
        type: "Expedition Report",
        id: "exp-43",
        snippet: "Deep ice core drilling down to 250 meters in Central Dronning Maud Land."
      },
      {
        title: "44th Indian Scientific Expedition Field Log",
        type: "Expedition Report",
        id: "exp-44",
        snippet: "Long-traverse glaciology towards South Pole coordinates and basal melt mapping."
      }
    ]
  }
};
