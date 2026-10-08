"""
POLAR EXPLORER — Backend Main Application
FastAPI application entrypoint.
"""
import sys
from contextlib import asynccontextmanager
from pathlib import Path

# Add backend directory to sys.path to allow relative imports
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from config import get_settings
from database import init_db
from routes.repository import router as repository_router
from routes.files import router as files_router
from routes.review import router as review_router

settings = get_settings()
DIST_DIR = Path(__file__).resolve().parent.parent / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Scientific Knowledge Repository + Ingestion API for India's Polar Explorer",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(repository_router)
app.include_router(files_router)
app.include_router(review_router)


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "storage_provider": settings.STORAGE_PROVIDER
    }


# Mount static assets if dist/assets exists
assets_dir = DIST_DIR / "assets"
if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")


# SPA Fallback Route for non-API frontend routes (e.g. /repository, /upload)
@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(request: Request, full_path: str):
    # Do not intercept API requests or OpenAPI documentation
    if full_path.startswith("api") or full_path in ("docs", "redoc", "openapi.json"):
        return JSONResponse(status_code=404, content={"detail": f"API endpoint /{full_path} not found"})

    # Check if a specific file exists in dist (e.g. favicon, vite.svg)
    file_path = DIST_DIR / full_path
    if file_path.is_file():
        return FileResponse(file_path)

    # Fallback to index.html for React Router SPA routes
    index_path = DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)

    return JSONResponse(
        status_code=404,
        content={"message": "POLAR EXPLORER API Server. Build frontend with 'npm run build' to serve UI."}
    )
