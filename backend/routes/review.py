"""
Review workflow routes for POLAR EXPLORER.
Supports approval, rejection, and change requests by scientific reviewers.
"""
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import (
    ReportModel, DatasetModel, PublicationModel, MediaModel, ReviewStatus
)
from routes.repository import audit_log

router = APIRouter(prefix="/api/repository/review", tags=["Review Workflow"])


class ReviewActionRequest(BaseModel):
    action: str  # APPROVE, REJECT, REQUEST_CHANGES
    reviewer_comment: Optional[str] = None
    reviewer_name: Optional[str] = "Scientific Committee Reviewer"


@router.get("/pending")
async def get_pending_reviews(db: AsyncSession = Depends(get_db)):
    reports = (await db.execute(select(ReportModel).where(ReportModel.review_status == ReviewStatus.PENDING_REVIEW))).scalars().all()
    datasets = (await db.execute(select(DatasetModel).where(DatasetModel.review_status == ReviewStatus.PENDING_REVIEW))).scalars().all()
    pubs = (await db.execute(select(PublicationModel).where(PublicationModel.review_status == ReviewStatus.PENDING_REVIEW))).scalars().all()
    media = (await db.execute(select(MediaModel).where(MediaModel.review_status == ReviewStatus.PENDING_REVIEW))).scalars().all()

    items = []

    for r in reports:
        items.append({
            "id": r.id,
            "title": r.title,
            "type": "report",
            "document_type": r.document_type,
            "authors": r.authors,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "expedition_id": r.expedition_id,
            "review_status": r.review_status.value
        })
    for d in datasets:
        items.append({
            "id": d.id,
            "title": d.title,
            "type": "dataset",
            "document_type": d.format,
            "authors": d.authors,
            "created_at": d.created_at.isoformat() if d.created_at else None,
            "expedition_id": d.expedition_id,
            "review_status": d.review_status.value
        })
    for p in pubs:
        items.append({
            "id": p.id,
            "title": p.title,
            "type": "publication",
            "document_type": p.journal or "Journal",
            "authors": p.authors,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "expedition_id": p.expedition_id,
            "review_status": p.review_status.value
        })
    for m in media:
        items.append({
            "id": m.id,
            "title": m.title,
            "type": "media",
            "document_type": m.media_type.value,
            "authors": m.creator,
            "created_at": m.created_at.isoformat() if m.created_at else None,
            "expedition_id": m.expedition_id,
            "review_status": m.review_status.value
        })

    return items


@router.post("/{item_type}/{item_id}/action")
async def process_review_action(
    item_type: str,
    item_id: str,
    req: ReviewActionRequest,
    db: AsyncSession = Depends(get_db)
):
    item_type = item_type.lower()
    item = None

    if item_type == "report":
        item = (await db.execute(select(ReportModel).where(ReportModel.id == item_id))).scalar_one_or_none()
    elif item_type == "dataset":
        item = (await db.execute(select(DatasetModel).where(DatasetModel.id == item_id))).scalar_one_or_none()
    elif item_type == "publication":
        item = (await db.execute(select(PublicationModel).where(PublicationModel.id == item_id))).scalar_one_or_none()
    elif item_type == "media":
        item = (await db.execute(select(MediaModel).where(MediaModel.id == item_id))).scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    action_upper = req.action.upper()
    if action_upper == "APPROVE":
        item.review_status = ReviewStatus.APPROVED
    elif action_upper == "REJECT":
        item.review_status = ReviewStatus.REJECTED
    elif action_upper == "REQUEST_CHANGES":
        item.review_status = ReviewStatus.CHANGES_REQUESTED
    else:
        raise HTTPException(status_code=400, detail="Invalid review action")

    item.review_notes = req.reviewer_comment
    await audit_log(
        db,
        action=f"REVIEW_{action_upper}",
        content_type=item_type,
        content_id=item_id,
        user=req.reviewer_name,
        metadata_dict={"comment": req.reviewer_comment, "new_status": item.review_status.value}
    )

    await db.commit()
    await db.refresh(item)

    return {
        "id": item.id,
        "review_status": item.review_status.value,
        "notes": item.review_notes,
        "message": f"Successfully updated status to {item.review_status.value}"
    }
