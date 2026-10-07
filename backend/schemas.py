"""
Pydantic schemas for request/response serialization.
Keeps API contracts clean and separate from ORM models.
"""
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict


class RepositoryStatsResponse(BaseModel):
    reports_count: int = 0
    datasets_count: int = 0
    publications_count: int = 0
    media_count: int = 0
    expeditions_count: int = 44


class DuplicateCheckResponse(BaseModel):
    is_duplicate: bool
    checksum: str
    existing_item_id: Optional[str] = None
    existing_item_type: Optional[str] = None


class ReportCreate(BaseModel):
    title: str
    description: Optional[str] = None
    authors: Optional[str] = None
    publication_date: Optional[str] = None
    document_type: str = "Expedition Report"
    version: str = "1.0"
    language: str = "English"
    license: str = "CC BY 4.0"
    expedition_id: Optional[str] = None
    station_id: Optional[str] = None
    research_topic_id: Optional[str] = None


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str] = None
    authors: Optional[str] = None
    publication_date: Optional[str] = None
    document_type: Optional[str] = None
    version: Optional[str] = "1.0"
    language: Optional[str] = "English"
    license: Optional[str] = "CC BY 4.0"
    upload_status: Optional[str] = None
    review_status: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    checksum: Optional[str] = None
    storage_key: Optional[str] = None
    expedition_id: Optional[str] = None
    station_id: Optional[str] = None
    research_topic_id: Optional[str] = None


class DatasetCreate(BaseModel):
    title: str
    dataset_identifier: str
    description: Optional[str] = None
    authors: Optional[str] = None
    organization: Optional[str] = "NCPOR"
    measurement_type: Optional[str] = None
    format: str = "CSV"
    version: str = "1.0"


class DatasetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    dataset_identifier: Optional[str] = None
    description: Optional[str] = None
    authors: Optional[str] = None
    organization: Optional[str] = None
    measurement_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    latitude_min: Optional[float] = None
    latitude_max: Optional[float] = None
    longitude_min: Optional[float] = None
    longitude_max: Optional[float] = None
    format: Optional[str] = None
    license: Optional[str] = None
    version: Optional[str] = None
    upload_status: Optional[str] = None
    review_status: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    checksum: Optional[str] = None
    storage_key: Optional[str] = None
    expedition_id: Optional[str] = None
    station_id: Optional[str] = None
    research_topic_id: Optional[str] = None


class PublicationCreate(BaseModel):
    title: str
    authors: Optional[str] = None
    abstract: Optional[str] = None
    journal: Optional[str] = None
    doi: Optional[str] = None
    keywords: Optional[str] = None


class PublicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    authors: Optional[str] = None
    abstract: Optional[str] = None
    publication_date: Optional[str] = None
    journal: Optional[str] = None
    doi: Optional[str] = None
    keywords: Optional[str] = None
    document_url: Optional[str] = None
    version: Optional[str] = None
    upload_status: Optional[str] = None
    review_status: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    checksum: Optional[str] = None
    storage_key: Optional[str] = None
    expedition_id: Optional[str] = None
    research_topic_id: Optional[str] = None


class MediaCreate(BaseModel):
    title: str
    media_type: str = "IMAGE"
    description: Optional[str] = None
    location: Optional[str] = None


class MediaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str] = None
    media_type: Optional[Any] = None
    capture_date: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    creator: Optional[str] = None
    license: Optional[str] = None
    copyright: Optional[str] = None
    upload_status: Optional[str] = None
    review_status: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    checksum: Optional[str] = None
    storage_key: Optional[str] = None
    station_id: Optional[str] = None
    expedition_id: Optional[str] = None
    research_topic_id: Optional[str] = None


class ActivityDocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: Optional[str] = None
    activity_category: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[str] = None
    location: Optional[str] = None
    organizer: Optional[str] = None
    document_type: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    checksum: Optional[str] = None
    storage_key: Optional[str] = None
