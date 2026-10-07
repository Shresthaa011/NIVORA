# POLAR EXPLORER — India’s Polar Knowledge Portal

**Integrated Polar Science Outreach, Knowledge Repository & Media Dissemination Portal**
*Smart India Hackathon (SIH) Solution for NCPOR / Ministry of Earth Sciences (MoES), Govt of India*

---

## 🏔️ Phase 3: Scientific Knowledge Repository + Document/Data Ingestion Pipeline

### Architecture Overview

POLAR EXPLORER is built with a decoupled architecture separating metadata registration from binary content storage:

```
┌──────────────────────────────────────────────────────────────────┐
│                    POLAR EXPLORER FRONTEND                       │
│           (React 19 + TypeScript + Vite + Tailwind/CSS)          │
└─────────────────────────────────┬────────────────────────────────┘
                                  │ REST APIs (JSON / FormData)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                     FASTAPI BACKEND SERVICE                      │
│      (Python 3.13 + Async SQLAlchemy 2.0 + Pydantic v2)           │
└────────────────┬────────────────────────────────┬────────────────┘
                 │                                │
                 ▼                                ▼
┌────────────────────────────────┐ ┌───────────────────────────────┐
│     METADATA DATABASE          │ │      STORAGE SERVICE          │
│   (SQLite / PostgreSQL)        │ │  (Local Filesystem / S3)      │
│  - Reports & Datasets Metadata │ │  - Object Storage Abstraction │
│  - Publications & Media Metas  │ │  - SHA-256 Hashed Keys        │
│  - Review Audit Logs           │ │  - Direct Streaming Stream    │
└────────────────────────────────┘ └───────────────────────────────┘
```

---

## 📑 Supported Content Types

1. **Reports** (`PDF`): Expedition Reports (ISEA), Annual Reports, Technical Reports, Station Mission Logs.
2. **Datasets** (`CSV`, `XLSX`, `JSON`, `ZIP`): Hourly meteorology, CTD hydrographic ocean profiles, InSAR ice velocity grids, limnology chemistry, permafrost genomics.
3. **Publications** (`PDF`): Peer-reviewed journal papers, conference proceedings, books with registered DOIs.
4. **Media** (`JPG`, `PNG`, `WEBP`, `MP4`, `WEBM`): High-resolution Antarctic photography, auroral phenomena, drone surveys, icebreaker footage.
5. **Activity Documents**: Workshop brochures, outreach documents, seminar materials, training announcements.

---

## 🔒 Security & Provenance

- **Path Traversal Protection**: Server-side storage keys generated with UUID prefixes, preventing relative path manipulation.
- **SHA-256 Checksum Duplicate Detection**: Every uploaded file is hashed prior to storage. Identical content triggers duplicate detection.
- **MIME & Extension Validation**: File extension and MIME type validated before disk writing.
- **Scientific Review Workflow**: Content uploads start in `PENDING_REVIEW` status and require approval before public dissemination.

---

## 🚀 How to Run Locally

### 1. Start FastAPI Backend

```bash
cd backend
python -m pip install -r requirements.txt
python seed_data.py   # Seed database with realistic Indian Polar data
python -m uvicorn main:app --reload --port 8000
```
Backend API interactive docs: `http://localhost:8000/docs`

### 2. Run Backend Tests

```bash
cd backend
python -m pytest -v
```

### 3. Start Frontend Development Server

```bash
npm install
npm run dev
```
Frontend Web Portal: `http://localhost:5173`

---

## 📌 Repository Frontend Routes

- `/repository` — Polar Knowledge Repository Landing Page
- `/repository/reports` — Expedition & Scientific Reports Catalog
- `/repository/datasets` — Scientific Datasets Catalog
- `/repository/publications` — Research Publications Catalog
- `/repository/media` — Visual Media Gallery (Images & Videos)
- `/repository/activities` — Institutional Activities Catalog
- `/repository/detail/:type/:id` — Universal Item Detail View
- `/admin/repository/upload` — Ingestion & Upload Dashboard
- `/admin/repository/review` — Scientific Reviewer Dashboard

---

## 🔮 Future AI Extension Points

The repository architecture is designed to feed the future AI pipeline:
`UPLOAD` ➔ `STORAGE & METADATA` ➔ `TEXT EXTRACTION` ➔ `CHUNKING` ➔ `VECTOR EMBEDDINGS` ➔ `POLAR KNOWLEDGE GRAPH` ➔ `SOURCE-GROUNDED RAG`
