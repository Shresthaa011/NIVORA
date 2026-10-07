"""
SQLAlchemy ORM models for POLAR EXPLORER.
All repository content types with full metadata, versioning, and audit fields.
"""
import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime,
    ForeignKey, Enum, BigInteger, JSON
)
from sqlalchemy.orm import relationship
from database import Base


# ──────────────────────────────────────────────
# ENUMS
# ──────────────────────────────────────────────

class UploadStatus(str, PyEnum):
    UPLOADING = "UPLOADING"
    PROCESSING = "PROCESSING"
    READY = "READY"
    FAILED = "FAILED"


class ReviewStatus(str, PyEnum):
    DRAFT = "DRAFT"
    PENDING_REVIEW = "PENDING_REVIEW"
    SCIENTIFIC_REVIEW = "SCIENTIFIC_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CHANGES_REQUESTED = "CHANGES_REQUESTED"


class UserRole(str, PyEnum):
    PUBLIC = "PUBLIC"
    RESEARCHER = "RESEARCHER"
    OUTREACH_EDITOR = "OUTREACH_EDITOR"
    SCIENTIFIC_REVIEWER = "SCIENTIFIC_REVIEWER"
    ADMIN = "ADMIN"


class MediaType(str, PyEnum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"


def gen_uuid() -> str:
    return str(uuid.uuid4())


def now_utc() -> datetime:
    return datetime.utcnow()


# ──────────────────────────────────────────────
# CORE LOOKUP TABLES
# ──────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.RESEARCHER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=now_utc)
    updated_at = Column(DateTime, default=now_utc, onupdate=now_utc)

    audit_logs = relationship("AuditLog", back_populates="user_rel", lazy="dynamic")


class Expedition(Base):
    __tablename__ = "expeditions"

    id = Column(String, primary_key=True, default=gen_uuid)
    code = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(500), nullable=False)
    region = Column(String(100))
    year = Column(String(20))
    leader = Column(String(255))
    participant_count = Column(Integer)
    summary = Column(Text)
    status = Column(String(50), default="COMPLETED")
    created_at = Column(DateTime, default=now_utc)


class Station(Base):
    __tablename__ = "stations"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    region = Column(String(100))
    location = Column(String(500))
    coordinates = Column(String(100))
    established = Column(Integer)
    status = Column(String(50))
    description = Column(Text)
    created_at = Column(DateTime, default=now_utc)


class ResearchTopic(Base):
    __tablename__ = "research_topics"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    created_at = Column(DateTime, default=now_utc)


# ──────────────────────────────────────────────
# REPOSITORY CONTENT MODELS
# ──────────────────────────────────────────────

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False, index=True)
    description = Column(Text)
    authors = Column(Text)
    publication_date = Column(String(100))
    document_type = Column(String(100), default="Expedition Report")
    version = Column(String(50), default="1.0")
    parent_id = Column(String, ForeignKey("reports.id"), nullable=True)
    language = Column(String(50), default="English")
    license = Column(String(100), default="CC BY 4.0")
    keywords = Column(Text)

    # Storage
    file_name = Column(String(500))
    file_size = Column(BigInteger)
    mime_type = Column(String(100))
    checksum = Column(String(64), index=True)
    storage_key = Column(String(500))

    # Status & Versioning
    upload_status = Column(Enum(UploadStatus), default=UploadStatus.READY)
    review_status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING_REVIEW)
    is_public = Column(Boolean, default=True)
    is_latest_version = Column(Boolean, default=True)

    # Metadata FK / String fields
    expedition_id = Column(String(100), nullable=True)
    station_id = Column(String(100), nullable=True)
    research_topic_id = Column(String(100), nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)
    review_notes = Column(Text)

    # Timestamps
    created_at = Column(DateTime, default=now_utc)
    updated_at = Column(DateTime, default=now_utc, onupdate=now_utc)


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False, index=True)
    dataset_identifier = Column(String(255), index=True)
    description = Column(Text)
    authors = Column(Text)
    organization = Column(String(255), default="NCPOR")
    measurement_type = Column(String(255))
    start_date = Column(String(100))
    end_date = Column(String(100))
    latitude_min = Column(Float)
    latitude_max = Column(Float)
    longitude_min = Column(Float)
    longitude_max = Column(Float)
    format = Column(String(50), default="CSV")
    license = Column(String(100), default="CC BY 4.0")
    version = Column(String(50), default="1.0")
    parent_id = Column(String, ForeignKey("datasets.id"), nullable=True)
    keywords = Column(Text)

    # Storage
    file_name = Column(String(500))
    file_size = Column(BigInteger)
    mime_type = Column(String(100))
    checksum = Column(String(64), index=True)
    storage_key = Column(String(500))

    # Status
    upload_status = Column(Enum(UploadStatus), default=UploadStatus.READY)
    review_status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING_REVIEW)
    is_public = Column(Boolean, default=True)
    is_latest_version = Column(Boolean, default=True)

    # Metadata
    expedition_id = Column(String(100), nullable=True)
    station_id = Column(String(100), nullable=True)
    research_topic_id = Column(String(100), nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)
    review_notes = Column(Text)

    created_at = Column(DateTime, default=now_utc)
    updated_at = Column(DateTime, default=now_utc, onupdate=now_utc)


class Publication(Base):
    __tablename__ = "publications"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False, index=True)
    authors = Column(Text)
    abstract = Column(Text)
    publication_date = Column(String(100))
    journal = Column(String(500))
    doi = Column(String(255), index=True)
    keywords = Column(Text)
    citations = Column(Integer, default=0)
    version = Column(String(50), default="1.0")
    parent_id = Column(String, ForeignKey("publications.id"), nullable=True)

    # Storage
    document_url = Column(String(500))
    file_name = Column(String(500))
    file_size = Column(BigInteger)
    mime_type = Column(String(100))
    checksum = Column(String(64), index=True)
    storage_key = Column(String(500))

    # Status
    upload_status = Column(Enum(UploadStatus), default=UploadStatus.READY)
    review_status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING_REVIEW)
    is_public = Column(Boolean, default=True)
    is_latest_version = Column(Boolean, default=True)

    # Metadata
    research_topic_id = Column(String(100), nullable=True)
    expedition_id = Column(String(100), nullable=True)
    dataset_id = Column(String(100), nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)
    review_notes = Column(Text)

    created_at = Column(DateTime, default=now_utc)
    updated_at = Column(DateTime, default=now_utc, onupdate=now_utc)


class MediaItem(Base):
    __tablename__ = "media_items"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False, index=True)
    description = Column(Text)
    media_type = Column(Enum(MediaType), nullable=False)
    capture_date = Column(String(100))
    location = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    creator = Column(String(255))
    license = Column(String(100), default="CC BY 4.0")
    copyright = Column(String(255))
    duration_seconds = Column(Integer)

    # Storage
    file_name = Column(String(500))
    file_size = Column(BigInteger)
    mime_type = Column(String(100))
    checksum = Column(String(64), index=True)
    storage_key = Column(String(500))

    # Status
    upload_status = Column(Enum(UploadStatus), default=UploadStatus.READY)
    review_status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING_REVIEW)
    is_public = Column(Boolean, default=True)

    # Metadata
    station_id = Column(String(100), nullable=True)
    expedition_id = Column(String(100), nullable=True)
    research_topic_id = Column(String(100), nullable=True)
    created_by = Column(String(255), nullable=True)
    review_notes = Column(Text)

    created_at = Column(DateTime, default=now_utc)
    updated_at = Column(DateTime, default=now_utc, onupdate=now_utc)


class ActivityFile(Base):
    __tablename__ = "activity_files"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String(500))
    activity_category = Column(String(100))
    description = Column(Text)
    event_date = Column(String(100))
    location = Column(String(500))
    organizer = Column(String(255))
    document_type = Column(String(100))
    file_name = Column(String(500))
    file_size = Column(BigInteger)
    mime_type = Column(String(100))
    checksum = Column(String(64), index=True)
    storage_key = Column(String(500))
    upload_status = Column(Enum(UploadStatus), default=UploadStatus.READY)
    review_status = Column(Enum(ReviewStatus), default=ReviewStatus.APPROVED)
    created_at = Column(DateTime, default=now_utc)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    user = Column(String(255), default="system")
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    content_type = Column(String(100))
    content_id = Column(String(255))
    meta_data = Column(JSON)
    timestamp = Column(DateTime, default=now_utc)

    user_rel = relationship("User", back_populates="audit_logs")


# Model Aliases for consistent import names
ReportModel = Report
DatasetModel = Dataset
PublicationModel = Publication
MediaModel = MediaItem
ActivityDocumentModel = ActivityFile
AuditLogModel = AuditLog
