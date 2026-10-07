"""
Repository endpoints for POLAR EXPLORER.
Handles upload, versioning, duplicate detection via SHA-256, listing with filters, and detail views.
"""
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy import select, func, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import (
    ReportModel, DatasetModel, PublicationModel, MediaModel, ActivityDocumentModel, AuditLogModel,
    UploadStatus, ReviewStatus, UserRole, MediaType
)
from storage import local_storage
from validators import validate_file_upload
from schemas import (
    ReportCreate, ReportResponse,
    DatasetCreate, DatasetResponse,
    PublicationCreate, PublicationResponse,
    MediaCreate, MediaResponse,
    ActivityDocumentResponse,
    RepositoryStatsResponse, DuplicateCheckResponse
)

router = APIRouter(prefix="/api/repository", tags=["Repository"])


async def audit_log(db: AsyncSession, action: str, content_type: str, content_id: str, user: str = "system", metadata_dict: dict = None):
    log = AuditLogModel(
        user=user,
        action=action,
        content_type=content_type,
        content_id=content_id,
        meta_data=metadata_dict or {}
    )
    db.add(log)


# ----------------------------------------------------
# STATS
# ----------------------------------------------------
@router.get("/stats", response_model=RepositoryStatsResponse)
async def get_repository_stats(db: AsyncSession = Depends(get_db)):
    reports_cnt = await db.scalar(select(func.count(ReportModel.id)).where(ReportModel.review_status == ReviewStatus.APPROVED)) or 0
    datasets_cnt = await db.scalar(select(func.count(DatasetModel.id)).where(DatasetModel.review_status == ReviewStatus.APPROVED)) or 0
    publications_cnt = await db.scalar(select(func.count(PublicationModel.id)).where(PublicationModel.review_status == ReviewStatus.APPROVED)) or 0
    media_cnt = await db.scalar(select(func.count(MediaModel.id)).where(MediaModel.review_status == ReviewStatus.APPROVED)) or 0
    expeditions_cnt = 44  # Total Indian Polar Expeditions recorded

    return RepositoryStatsResponse(
        reports_count=reports_cnt,
        datasets_count=datasets_cnt,
        publications_count=publications_cnt,
        media_count=media_cnt,
        expeditions_count=expeditions_cnt
    )


# ----------------------------------------------------
# CHECKSUM DUPLICATE CHECK
# ----------------------------------------------------
@router.post("/check-duplicate", response_model=DuplicateCheckResponse)
async def check_duplicate_file(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    content = await file.read()
    await file.seek(0)
    checksum = local_storage.compute_checksum(content)

    # Check across models
    existing_report = (await db.execute(select(ReportModel).where(ReportModel.checksum == checksum))).scalar_one_or_none()
    if existing_report:
        return DuplicateCheckResponse(is_duplicate=True, checksum=checksum, existing_item_id=str(existing_report.id), existing_item_type="report")

    existing_dataset = (await db.execute(select(DatasetModel).where(DatasetModel.checksum == checksum))).scalar_one_or_none()
    if existing_dataset:
        return DuplicateCheckResponse(is_duplicate=True, checksum=checksum, existing_item_id=str(existing_dataset.id), existing_item_type="dataset")

    existing_pub = (await db.execute(select(PublicationModel).where(PublicationModel.checksum == checksum))).scalar_one_or_none()
    if existing_pub:
        return DuplicateCheckResponse(is_duplicate=True, checksum=checksum, existing_item_id=str(existing_pub.id), existing_item_type="publication")

    existing_media = (await db.execute(select(MediaModel).where(MediaModel.checksum == checksum))).scalar_one_or_none()
    if existing_media:
        return DuplicateCheckResponse(is_duplicate=True, checksum=checksum, existing_item_id=str(existing_media.id), existing_item_type="media")

    return DuplicateCheckResponse(is_duplicate=False, checksum=checksum)


# ----------------------------------------------------
# REPORTS
# ----------------------------------------------------
@router.post("/reports/upload", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def upload_report(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    authors: Optional[str] = Form(None),
    publication_date: Optional[str] = Form(None),
    expedition_id: Optional[str] = Form(None),
    station_id: Optional[str] = Form(None),
    research_topic_id: Optional[str] = Form(None),
    document_type: str = Form("Expedition Report"),
    version: str = Form("1.0"),
    language: str = Form("English"),
    license: str = Form("CC BY 4.0"),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    await validate_file_upload(file, "report")
    content = await file.read()
    await file.seek(0)
    checksum = local_storage.compute_checksum(content)

    # Check duplicate
    existing = (await db.execute(select(ReportModel).where(ReportModel.checksum == checksum))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail=f"Duplicate file detected! Identical checksum already exists in Report ID: {existing.id}")

    subfolder = f"reports/{expedition_id or 'general'}"
    storage_meta = await local_storage.upload_file(file.filename, content, file.content_type, subfolder=subfolder)

    report_id = str(uuid.uuid4())
    report = ReportModel(
        id=report_id,
        title=title,
        description=description,
        authors=authors,
        publication_date=publication_date,
        expedition_id=expedition_id,
        station_id=station_id,
        research_topic_id=research_topic_id,
        document_type=document_type,
        version=version,
        language=language,
        license=license,
        upload_status=UploadStatus.READY,
        review_status=ReviewStatus.PENDING_REVIEW,
        file_name=storage_meta["file_name"],
        file_size=storage_meta["file_size"],
        mime_type=storage_meta["mime_type"],
        checksum=checksum,
        storage_key=storage_meta["storage_key"],
        is_latest_version=True
    )

    db.add(report)
    await audit_log(db, "UPLOAD", "report", report_id, metadata_dict={"filename": file.filename, "size": storage_meta["file_size"]})
    await db.commit()
    await db.refresh(report)

    return report


@router.get("/reports", response_model=List[ReportResponse])
async def list_reports(
    query: Optional[str] = Query(None),
    expedition_id: Optional[str] = Query(None),
    station_id: Optional[str] = Query(None),
    research_topic_id: Optional[str] = Query(None),
    author: Optional[str] = Query(None),
    year: Optional[str] = Query(None),
    review_status: Optional[str] = Query("APPROVED"),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ReportModel)
    filters = []

    if review_status and review_status != "ALL":
        filters.append(ReportModel.review_status == review_status)
    if expedition_id:
        filters.append(ReportModel.expedition_id == expedition_id)
    if station_id:
        filters.append(ReportModel.station_id == station_id)
    if research_topic_id:
        filters.append(ReportModel.research_topic_id == research_topic_id)
    if author:
        filters.append(ReportModel.authors.ilike(f"%{author}%"))
    if year:
        filters.append(ReportModel.publication_date.startswith(year))
    if query:
        search_fmt = f"%{query}%"
        filters.append(or_(
            ReportModel.title.ilike(search_fmt),
            ReportModel.description.ilike(search_fmt),
            ReportModel.authors.ilike(search_fmt),
            ReportModel.document_type.ilike(search_fmt)
        ))

    if filters:
        stmt = stmt.where(and_(*filters))

    stmt = stmt.order_by(ReportModel.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/reports/{report_id}", response_model=ReportResponse)
async def get_report_detail(report_id: str, db: AsyncSession = Depends(get_db)):
    report = (await db.execute(select(ReportModel).where(ReportModel.id == report_id))).scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


# ----------------------------------------------------
# DATASETS
# ----------------------------------------------------
@router.post("/datasets/upload", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    title: str = Form(...),
    dataset_identifier: str = Form(...),
    description: Optional[str] = Form(None),
    authors: Optional[str] = Form(None),
    organization: Optional[str] = Form("NCPOR"),
    expedition_id: Optional[str] = Form(None),
    station_id: Optional[str] = Form(None),
    research_topic_id: Optional[str] = Form(None),
    measurement_type: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    end_date: Optional[str] = Form(None),
    latitude_min: Optional[float] = Form(None),
    latitude_max: Optional[float] = Form(None),
    longitude_min: Optional[float] = Form(None),
    longitude_max: Optional[float] = Form(None),
    format: str = Form("CSV"),
    license: str = Form("CC BY 4.0"),
    version: str = Form("1.0"),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    await validate_file_upload(file, "dataset")
    content = await file.read()
    await file.seek(0)
    checksum = local_storage.compute_checksum(content)

    existing = (await db.execute(select(DatasetModel).where(DatasetModel.checksum == checksum))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail=f"Duplicate file detected! Identical checksum exists in Dataset ID: {existing.id}")

    subfolder = f"datasets/{format.lower()}"
    storage_meta = await local_storage.upload_file(file.filename, content, file.content_type, subfolder=subfolder)

    ds_id = str(uuid.uuid4())
    dataset = DatasetModel(
        id=ds_id,
        title=title,
        dataset_identifier=dataset_identifier,
        description=description,
        authors=authors,
        organization=organization,
        expedition_id=expedition_id,
        station_id=station_id,
        research_topic_id=research_topic_id,
        measurement_type=measurement_type,
        start_date=start_date,
        end_date=end_date,
        latitude_min=latitude_min,
        latitude_max=latitude_max,
        longitude_min=longitude_min,
        longitude_max=longitude_max,
        format=format,
        license=license,
        version=version,
        upload_status=UploadStatus.READY,
        review_status=ReviewStatus.PENDING_REVIEW,
        file_name=storage_meta["file_name"],
        file_size=storage_meta["file_size"],
        mime_type=storage_meta["mime_type"],
        checksum=checksum,
        storage_key=storage_meta["storage_key"],
        is_latest_version=True
    )

    db.add(dataset)
    await audit_log(db, "UPLOAD", "dataset", ds_id, metadata_dict={"filename": file.filename, "size": storage_meta["file_size"]})
    await db.commit()
    await db.refresh(dataset)

    return dataset


@router.get("/datasets", response_model=List[DatasetResponse])
async def list_datasets(
    query: Optional[str] = Query(None),
    expedition_id: Optional[str] = Query(None),
    station_id: Optional[str] = Query(None),
    research_topic_id: Optional[str] = Query(None),
    author: Optional[str] = Query(None),
    format: Optional[str] = Query(None),
    review_status: Optional[str] = Query("APPROVED"),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(DatasetModel)
    filters = []

    if review_status and review_status != "ALL":
        filters.append(DatasetModel.review_status == review_status)
    if expedition_id:
        filters.append(DatasetModel.expedition_id == expedition_id)
    if station_id:
        filters.append(DatasetModel.station_id == station_id)
    if research_topic_id:
        filters.append(DatasetModel.research_topic_id == research_topic_id)
    if author:
        filters.append(DatasetModel.authors.ilike(f"%{author}%"))
    if format:
        filters.append(DatasetModel.format.ilike(format))
    if query:
        search_fmt = f"%{query}%"
        filters.append(or_(
            DatasetModel.title.ilike(search_fmt),
            DatasetModel.dataset_identifier.ilike(search_fmt),
            DatasetModel.description.ilike(search_fmt),
            DatasetModel.authors.ilike(search_fmt),
            DatasetModel.measurement_type.ilike(search_fmt)
        ))

    if filters:
        stmt = stmt.where(and_(*filters))

    stmt = stmt.order_by(DatasetModel.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/datasets/{dataset_id}", response_model=DatasetResponse)
async def get_dataset_detail(dataset_id: str, db: AsyncSession = Depends(get_db)):
    dataset = (await db.execute(select(DatasetModel).where(DatasetModel.id == dataset_id))).scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


# ----------------------------------------------------
# PUBLICATIONS
# ----------------------------------------------------
@router.post("/publications/upload", response_model=PublicationResponse, status_code=status.HTTP_201_CREATED)
async def upload_publication(
    title: str = Form(...),
    authors: Optional[str] = Form(None),
    abstract: Optional[str] = Form(None),
    publication_date: Optional[str] = Form(None),
    journal: Optional[str] = Form(None),
    doi: Optional[str] = Form(None),
    keywords: Optional[str] = Form(None),
    research_topic_id: Optional[str] = Form(None),
    expedition_id: Optional[str] = Form(None),
    dataset_id: Optional[str] = Form(None),
    document_url: Optional[str] = Form(None),
    version: str = Form("1.0"),
    file: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    storage_meta = None
    checksum = None

    if file:
        await validate_file_upload(file, "publication")
        content = await file.read()
        await file.seek(0)
        checksum = local_storage.compute_checksum(content)

        existing = (await db.execute(select(PublicationModel).where(PublicationModel.checksum == checksum))).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=409, detail=f"Duplicate file detected! Identical checksum exists in Publication ID: {existing.id}")

        storage_meta = await local_storage.upload_file(file.filename, content, file.content_type, subfolder="publications")

    pub_id = str(uuid.uuid4())
    publication = PublicationModel(
        id=pub_id,
        title=title,
        authors=authors,
        abstract=abstract,
        publication_date=publication_date,
        journal=journal,
        doi=doi,
        keywords=keywords,
        research_topic_id=research_topic_id,
        expedition_id=expedition_id,
        dataset_id=dataset_id,
        document_url=document_url,
        version=version,
        upload_status=UploadStatus.READY if storage_meta else UploadStatus.READY,
        review_status=ReviewStatus.PENDING_REVIEW,
        file_name=storage_meta["file_name"] if storage_meta else None,
        file_size=storage_meta["file_size"] if storage_meta else None,
        mime_type=storage_meta["mime_type"] if storage_meta else None,
        checksum=checksum,
        storage_key=storage_meta["storage_key"] if storage_meta else None,
        is_latest_version=True
    )

    db.add(publication)
    await audit_log(db, "UPLOAD", "publication", pub_id, metadata_dict={"title": title, "doi": doi})
    await db.commit()
    await db.refresh(publication)

    return publication


@router.get("/publications", response_model=List[PublicationResponse])
async def list_publications(
    query: Optional[str] = Query(None),
    expedition_id: Optional[str] = Query(None),
    research_topic_id: Optional[str] = Query(None),
    author: Optional[str] = Query(None),
    year: Optional[str] = Query(None),
    review_status: Optional[str] = Query("APPROVED"),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(PublicationModel)
    filters = []

    if review_status and review_status != "ALL":
        filters.append(PublicationModel.review_status == review_status)
    if expedition_id:
        filters.append(PublicationModel.expedition_id == expedition_id)
    if research_topic_id:
        filters.append(PublicationModel.research_topic_id == research_topic_id)
    if author:
        filters.append(PublicationModel.authors.ilike(f"%{author}%"))
    if year:
        filters.append(PublicationModel.publication_date.startswith(year))
    if query:
        search_fmt = f"%{query}%"
        filters.append(or_(
            PublicationModel.title.ilike(search_fmt),
            PublicationModel.abstract.ilike(search_fmt),
            PublicationModel.authors.ilike(search_fmt),
            PublicationModel.journal.ilike(search_fmt),
            PublicationModel.doi.ilike(search_fmt),
            PublicationModel.keywords.ilike(search_fmt)
        ))

    if filters:
        stmt = stmt.where(and_(*filters))

    stmt = stmt.order_by(PublicationModel.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/publications/{pub_id}", response_model=PublicationResponse)
async def get_publication_detail(pub_id: str, db: AsyncSession = Depends(get_db)):
    pub = (await db.execute(select(PublicationModel).where(PublicationModel.id == pub_id))).scalar_one_or_none()
    if not pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    return pub


# ----------------------------------------------------
# MEDIA (IMAGES & VIDEOS)
# ----------------------------------------------------
@router.post("/media/upload", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(
    title: str = Form(...),
    media_type: str = Form("IMAGE"),  # IMAGE or VIDEO
    description: Optional[str] = Form(None),
    capture_date: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    station_id: Optional[str] = Form(None),
    expedition_id: Optional[str] = Form(None),
    research_topic_id: Optional[str] = Form(None),
    creator: Optional[str] = Form("NCPOR Expedition Team"),
    license: str = Form("CC BY 4.0"),
    copyright: Optional[str] = Form("NCPOR / MoES, Govt of India"),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    kind = "image" if media_type.upper() == "IMAGE" else "video"
    await validate_file_upload(file, kind)
    content = await file.read()
    await file.seek(0)
    checksum = local_storage.compute_checksum(content)

    existing = (await db.execute(select(MediaModel).where(MediaModel.checksum == checksum))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail=f"Duplicate media file detected! Identical checksum exists in Media ID: {existing.id}")

    subfolder = f"media/{kind}s"
    storage_meta = await local_storage.upload_file(file.filename, content, file.content_type, subfolder=subfolder)

    media_id = str(uuid.uuid4())
    media = MediaModel(
        id=media_id,
        title=title,
        description=description,
        media_type=MediaType.IMAGE if kind == "image" else MediaType.VIDEO,
        capture_date=capture_date,
        location=location,
        latitude=latitude,
        longitude=longitude,
        station_id=station_id,
        expedition_id=expedition_id,
        research_topic_id=research_topic_id,
        creator=creator,
        license=license,
        copyright=copyright,
        upload_status=UploadStatus.READY,
        review_status=ReviewStatus.PENDING_REVIEW,
        file_name=storage_meta["file_name"],
        file_size=storage_meta["file_size"],
        mime_type=storage_meta["mime_type"],
        checksum=checksum,
        storage_key=storage_meta["storage_key"]
    )

    db.add(media)
    await audit_log(db, "UPLOAD", "media", media_id, metadata_dict={"type": media_type, "filename": file.filename})
    await db.commit()
    await db.refresh(media)

    return media


@router.get("/media", response_model=List[MediaResponse])
async def list_media(
    query: Optional[str] = Query(None),
    media_type: Optional[str] = Query(None),
    expedition_id: Optional[str] = Query(None),
    station_id: Optional[str] = Query(None),
    research_topic_id: Optional[str] = Query(None),
    review_status: Optional[str] = Query("APPROVED"),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(MediaModel)
    filters = []

    if review_status and review_status != "ALL":
        filters.append(MediaModel.review_status == review_status)
    if media_type:
        filters.append(MediaModel.media_type == media_type.upper())
    if expedition_id:
        filters.append(MediaModel.expedition_id == expedition_id)
    if station_id:
        filters.append(MediaModel.station_id == station_id)
    if research_topic_id:
        filters.append(MediaModel.research_topic_id == research_topic_id)
    if query:
        search_fmt = f"%{query}%"
        filters.append(or_(
            MediaModel.title.ilike(search_fmt),
            MediaModel.description.ilike(search_fmt),
            MediaModel.location.ilike(search_fmt),
            MediaModel.creator.ilike(search_fmt)
        ))

    if filters:
        stmt = stmt.where(and_(*filters))

    stmt = stmt.order_by(MediaModel.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/media/{media_id}", response_model=MediaResponse)
async def get_media_detail(media_id: str, db: AsyncSession = Depends(get_db)):
    media = (await db.execute(select(MediaModel).where(MediaModel.id == media_id))).scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return media
