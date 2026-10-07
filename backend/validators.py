"""
File validation utilities.
Validates extension, MIME type, file size, and filename safety.
"""
from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from storage import ALLOWED_EXTENSIONS, ALLOWED_MIMETYPES, sanitize_filename
from config import get_settings

settings = get_settings()

MAX_SIZES = settings.max_sizes_bytes


async def validate_upload(file: UploadFile, category: str) -> tuple[str, str]:
    """
    Validate an uploaded file for category-specific rules.
    Returns (safe_filename, mime_type) on success.
    Raises HTTPException on failure.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File has no filename."
        )

    safe_name = sanitize_filename(file.filename)
    ext = Path(safe_name).suffix.lower()

    allowed_exts = ALLOWED_EXTENSIONS.get(category, set())
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension '{ext}' for {category}. "
                   f"Allowed: {', '.join(sorted(allowed_exts))}"
        )

    content_type = file.content_type or ""
    allowed_types = ALLOWED_MIMETYPES.get(category, set())
    # Normalize content type (strip charset params)
    base_type = content_type.split(";")[0].strip().lower()
    if allowed_types and base_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"MIME type '{base_type}' not permitted for {category}. "
                   f"Allowed: {', '.join(sorted(allowed_types))}"
        )

    # Check size
    max_bytes = MAX_SIZES.get(category, 50 * 1024 * 1024)
    await file.seek(0)
    content = await file.read()
    file_size = len(content)
    await file.seek(0)

    if file_size > max_bytes:
        max_mb = max_bytes // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size {file_size / (1024*1024):.1f} MB exceeds "
                   f"the {max_mb} MB limit for {category}."
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file is not allowed."
        )

    return safe_name, base_type or file.content_type or "application/octet-stream"


validate_file_upload = validate_upload

