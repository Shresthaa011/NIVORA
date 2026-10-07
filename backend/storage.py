"""
StorageService — abstraction over local filesystem (dev) or MinIO/S3 (production).
Never exposes raw filesystem paths to callers.
"""
import uuid
import hashlib
import re
from pathlib import Path
from typing import BinaryIO, Optional, Dict, Any
import aiofiles
import aiofiles.os
from config import get_settings

settings = get_settings()

# Allowed extensions and mimetypes
ALLOWED_EXTENSIONS: Dict[str, set[str]] = {
    "report": {".pdf"},
    "dataset": {".csv", ".xlsx", ".json", ".zip"},
    "publication": {".pdf"},
    "image": {".jpg", ".jpeg", ".png", ".webp"},
    "video": {".mp4", ".webm"},
    "activity": {".pdf", ".jpg", ".jpeg", ".png", ".webp", ".docx"},
}

ALLOWED_MIMETYPES: Dict[str, set[str]] = {
    "report": {"application/pdf"},
    "dataset": {
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/json",
        "application/zip",
        "application/x-zip-compressed",
        "text/plain"
    },
    "publication": {"application/pdf"},
    "image": {"image/jpeg", "image/png", "image/webp"},
    "video": {"video/mp4", "video/webm"},
    "activity": {
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
}


def sanitize_filename(filename: str) -> str:
    """Remove dangerous characters and path traversal components from filenames."""
    name = Path(filename).name
    name = re.sub(r"[^\w.\-]", "_", name)
    name = re.sub(r"_+", "_", name)
    if name.startswith("."):
        name = "uploaded_" + name[1:]
    return name or "file"


class LocalStorage:
    def __init__(self, storage_dir: Optional[str] = None):
        self.base_dir = Path(storage_dir or settings.STORAGE_PATH)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def compute_checksum(self, data: bytes) -> str:
        return hashlib.sha256(data).hexdigest()

    def get_absolute_path(self, storage_key: str) -> Path:
        # Prevent path traversal
        clean_key = Path(storage_key).as_posix().lstrip("/")
        full_path = (self.base_dir / clean_key).resolve()
        if not str(full_path).startswith(str(self.base_dir.resolve())):
            raise ValueError("Path traversal attempt detected")
        return full_path

    async def upload_file(
        self,
        filename: str,
        content: bytes,
        content_type: str,
        subfolder: str = "general"
    ) -> Dict[str, Any]:
        safe_name = sanitize_filename(filename)
        unique_prefix = str(uuid.uuid4())[:8]
        key = f"{subfolder}/{unique_prefix}_{safe_name}"

        full_path = self.get_absolute_path(key)
        full_path.parent.mkdir(parents=True, exist_ok=True)

        async with aiofiles.open(full_path, "wb") as f:
            await f.write(content)

        return {
            "file_name": safe_name,
            "file_size": len(content),
            "mime_type": content_type,
            "storage_key": key
        }

    async def file_exists(self, storage_key: str) -> bool:
        try:
            full_path = self.get_absolute_path(storage_key)
            return full_path.exists() and full_path.is_file()
        except ValueError:
            return False

    async def delete_file(self, storage_key: str) -> bool:
        try:
            full_path = self.get_absolute_path(storage_key)
            if full_path.exists():
                await aiofiles.os.remove(full_path)
                return True
            return False
        except Exception:
            return False

    def get_file_url(self, storage_key: str) -> str:
        return f"/api/repository/files/raw/{storage_key}"


# Singleton Instance
local_storage = LocalStorage()
