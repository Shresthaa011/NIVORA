"""
File access router for POLAR EXPLORER.
Handles safe download streaming and inline preview streams.
Prevents path traversal and protects unpublished files.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import ReportModel, DatasetModel, PublicationModel, MediaModel, ReviewStatus
from storage import local_storage

router = APIRouter(prefix="/api/repository/files", tags=["Files"])


async def get_item_storage_meta(file_type: str, item_id: str, db: AsyncSession):
    file_type = file_type.lower()
    item = None

    if file_type == "report":
        item = (await db.execute(select(ReportModel).where(ReportModel.id == item_id))).scalar_one_or_none()
    elif file_type == "dataset":
        item = (await db.execute(select(DatasetModel).where(DatasetModel.id == item_id))).scalar_one_or_none()
    elif file_type == "publication":
        item = (await db.execute(select(PublicationModel).where(PublicationModel.id == item_id))).scalar_one_or_none()
    elif file_type == "media":
        item = (await db.execute(select(MediaModel).where(MediaModel.id == item_id))).scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Requested file item not found")

    if not item.storage_key:
        raise HTTPException(status_code=404, detail="Item has no stored file attached")

    return item


@router.get("/{file_type}/{item_id}/download")
async def download_file(file_type: str, item_id: str, db: AsyncSession = Depends(get_db)):
    item = await get_item_storage_meta(file_type, item_id, db)
    
    if not await local_storage.file_exists(item.storage_key):
        raise HTTPException(status_code=404, detail="File content missing from storage")

    path = local_storage.get_absolute_path(item.storage_key)
    return FileResponse(
        path=path,
        media_type=item.mime_type or "application/octet-stream",
        filename=item.file_name or "download",
        headers={"Content-Disposition": f'attachment; filename="{item.file_name}"'}
    )


@router.get("/{file_type}/{item_id}/preview")
async def preview_file(file_type: str, item_id: str, db: AsyncSession = Depends(get_db)):
    item = await get_item_storage_meta(file_type, item_id, db)
    
    if not await local_storage.file_exists(item.storage_key):
        raise HTTPException(status_code=404, detail="File content missing from storage")

    path = local_storage.get_absolute_path(item.storage_key)
    return FileResponse(
        path=path,
        media_type=item.mime_type or "application/octet-stream",
        headers={"Content-Disposition": f'inline; filename="{item.file_name}"'}
    )
