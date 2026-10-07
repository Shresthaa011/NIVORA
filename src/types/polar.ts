export interface Station {
  id: string;
  name: string;
  region: 'Antarctica' | 'Arctic' | 'Southern Ocean';
  location: string;
  coordinates: string;
  established: number;
  status: 'Active (Year-round)' | 'Active (Seasonal)' | 'Decommissioned / Heritage';
  expeditionsCount: number;
  datasetsCount: number;
  publicationsCount: number;
  description: string;
  keyResearchAreas: string[];
  lat: number;
  lng: number;
  image: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  category: 'Glaciology' | 'Atmospheric Science' | 'Polar Biology' | 'Oceanography' | 'Geology & Geophysics' | 'Climate Change';
  shortDescription: string;
  fullDescription: string;
  year: number;
  leadInstitution: string;
  stationId?: string;
  doi?: string;
  image: string;
  datasetsAssociatedCount: number;
  tags: string[];
}

export interface Expedition {
  id: string;
  code: string;
  title: string;
  region: 'Antarctica' | 'Arctic' | 'Southern Ocean';
  year: string;
  leader: string;
  participantCount: number;
  summary: string;
  keyMilestones: string[];
  datasetsGenerated: number;
  status: 'Completed' | 'Ongoing' | 'Planned';
}

export interface Dataset {
  id: string;
  title: string;
  category: string;
  year: number;
  format: string;
  fileSize: string;
  station: string;
  doi: string;
  abstract: string;
  accessType: 'Open Access' | 'Restricted / Request Access';
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  authors: string[];
  year: number;
  category: string;
  doi: string;
  abstract: string;
  citations: number;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'Photo' | 'Video' | 'Infographic' | 'Audio Log';
  category: string;
  year: number;
  thumbnail: string;
  durationOrResolution: string;
  caption: string;
}

export interface ScienceStory {
  id: string;
  type: 'Science Brief' | 'Expedition Story' | 'Research Explained';
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  author: string;
  summary: string;
  image: string;
  originalResearchTitle: string;
}

export interface AIQueryResponse {
  query: string;
  answer: string;
  confidenceScore: number;
  sources: {
    title: string;
    type: 'Publication' | 'Dataset' | 'Expedition Report';
    id: string;
    doi?: string;
    snippet: string;
  }[];
}
