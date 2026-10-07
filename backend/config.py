"""
POLAR EXPLORER Backend
Configuration management using Pydantic Settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    # App
    app_name: str = "POLAR EXPLORER"
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "polar-explorer-dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Database
    database_url: str = "sqlite+aiosqlite:///./polar_explorer.db"

    # Storage
    storage_backend: str = "local"
    storage_base_path: str = "./storage/uploads"
    storage_base_url: str = "http://localhost:8000/api/repository/files"

    # File size limits (MB)
    max_report_size_mb: int = 50
    max_dataset_size_mb: int = 200
    max_image_size_mb: int = 20
    max_video_size_mb: int = 500
    max_publication_size_mb: int = 50
    max_activity_size_mb: int = 50

    # CORS
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def PROJECT_NAME(self) -> str:
        return self.app_name

    @property
    def VERSION(self) -> str:
        return "1.0.0"

    @property
    def STORAGE_PATH(self) -> Path:
        return self.storage_path

    @property
    def STORAGE_PROVIDER(self) -> str:
        return self.storage_backend

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


    @property
    def storage_path(self) -> Path:
        return Path(self.storage_base_path)

    @property
    def max_sizes_bytes(self) -> dict[str, int]:
        return {
            "report": self.max_report_size_mb * 1024 * 1024,
            "dataset": self.max_dataset_size_mb * 1024 * 1024,
            "image": self.max_image_size_mb * 1024 * 1024,
            "video": self.max_video_size_mb * 1024 * 1024,
            "publication": self.max_publication_size_mb * 1024 * 1024,
            "activity": self.max_activity_size_mb * 1024 * 1024,
        }


@lru_cache()
def get_settings() -> Settings:
    return Settings()
