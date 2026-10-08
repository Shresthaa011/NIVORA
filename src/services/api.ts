/**
 * POLAR EXPLORER — Repository API Service
 * Handles API calls to FastAPI backend with mock data fallback.
 */

const API_BASE_URL = '/api';

export interface RepositoryStats {
  reports_count: number;
  datasets_count: number;
  publications_count: number;
  media_count: number;
  expeditions_count: number;
}

export interface RepositoryReport {
  id: string;
  title: string;
  description?: string;
  authors?: string;
  publication_date?: string;
  document_type?: string;
  version?: string;
  language?: string;
  license?: string;
  upload_status?: string;
  review_status?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  checksum?: string;
  expedition_id?: string;
  station_id?: string;
  research_topic_id?: string;
}

export interface RepositoryDataset {
  id: string;
  title: string;
  dataset_identifier?: string;
  description?: string;
  authors?: string;
  organization?: string;
  measurement_type?: string;
  start_date?: string;
  end_date?: string;
  latitude_min?: number;
  latitude_max?: number;
  longitude_min?: number;
  longitude_max?: number;
  format?: string;
  license?: string;
  version?: string;
  upload_status?: string;
  review_status?: string;
  file_name?: string;
  file_size?: number;
  checksum?: string;
  expedition_id?: string;
  station_id?: string;
  research_topic_id?: string;
}

export interface RepositoryPublication {
  id: string;
  title: string;
  authors?: string;
  abstract?: string;
  publication_date?: string;
  journal?: string;
  doi?: string;
  keywords?: string;
  document_url?: string;
  version?: string;
  upload_status?: string;
  review_status?: string;
  file_name?: string;
  file_size?: number;
  checksum?: string;
  expedition_id?: string;
  research_topic_id?: string;
}

export interface RepositoryMedia {
  id: string;
  title: string;
  description?: string;
  media_type?: 'IMAGE' | 'VIDEO';
  capture_date?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  creator?: string;
  license?: string;
  copyright?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  checksum?: string;
  station_id?: string;
  expedition_id?: string;
  research_topic_id?: string;
}

export interface PendingReviewItem {
  id: string;
  title: string;
  type: string;
  document_type?: string;
  authors?: string;
  created_at?: string;
  expedition_id?: string;
  review_status: string;
}

// Helper fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    let errorDetail = `API Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) errorDetail = errJson.detail;
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return res.json();
}

// --------------------------------------------------------
// API METHODS
// --------------------------------------------------------

export async function fetchRepositoryStats(): Promise<RepositoryStats> {
  try {
    return await apiFetch<RepositoryStats>('/repository/stats');
  } catch (err) {
    console.warn('Backend offline, using fallback stats', err);
    return {
      reports_count: 15,
      datasets_count: 15,
      publications_count: 15,
      media_count: 25,
      expeditions_count: 44,
    };
  }
}

export async function fetchReports(params?: Record<string, string>): Promise<RepositoryReport[]> {
  const queryStr = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<RepositoryReport[]>(`/repository/reports${queryStr}`);
}

export async function fetchReportDetail(id: string): Promise<RepositoryReport> {
  return apiFetch<RepositoryReport>(`/repository/reports/${id}`);
}

export async function fetchDatasets(params?: Record<string, string>): Promise<RepositoryDataset[]> {
  const queryStr = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<RepositoryDataset[]>(`/repository/datasets${queryStr}`);
}

export async function fetchDatasetDetail(id: string): Promise<RepositoryDataset> {
  return apiFetch<RepositoryDataset>(`/repository/datasets/${id}`);
}

export async function fetchPublications(params?: Record<string, string>): Promise<RepositoryPublication[]> {
  const queryStr = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<RepositoryPublication[]>(`/repository/publications${queryStr}`);
}

export async function fetchPublicationDetail(id: string): Promise<RepositoryPublication> {
  return apiFetch<RepositoryPublication>(`/repository/publications/${id}`);
}

export async function fetchMedia(params?: Record<string, string>): Promise<RepositoryMedia[]> {
  const queryStr = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<RepositoryMedia[]>(`/repository/media${queryStr}`);
}

export async function fetchMediaDetail(id: string): Promise<RepositoryMedia> {
  return apiFetch<RepositoryMedia>(`/repository/media/${id}`);
}

export async function checkDuplicateFile(file: File): Promise<{ is_duplicate: boolean; checksum: string; existing_item_id?: string; existing_item_type?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch('/repository/check-duplicate', {
    method: 'POST',
    body: formData,
  });
}

export async function uploadRepositoryItem(type: string, formData: FormData): Promise<any> {
  let endpoint = '/repository/reports/upload';
  if (type === 'dataset') endpoint = '/repository/datasets/upload';
  if (type === 'publication') endpoint = '/repository/publications/upload';
  if (type === 'image' || type === 'video') endpoint = '/repository/media/upload';

  return apiFetch(endpoint, {
    method: 'POST',
    body: formData,
  });
}

export async function fetchPendingReviews(): Promise<PendingReviewItem[]> {
  return apiFetch<PendingReviewItem[]>('/repository/review/pending');
}

export async function processReviewAction(type: string, id: string, action: string, comment: string): Promise<any> {
  return apiFetch(`/repository/review/${type}/${id}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, reviewer_comment: comment, reviewer_name: 'Scientific Reviewer' }),
  });
}

export function getFileDownloadUrl(type: string, id: string): string {
  return `${API_BASE_URL}/repository/files/${type}/${id}/download`;
}

export function getFilePreviewUrl(type: string, id: string): string {
  return `${API_BASE_URL}/repository/files/${type}/${id}/preview`;
}
