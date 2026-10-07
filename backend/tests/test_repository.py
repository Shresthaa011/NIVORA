"""
POLAR EXPLORER — Backend Repository API Tests
Comprehensive test suite using pytest & httpx AsyncClient.
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from main import app
from database import init_db


@pytest_asyncio.fixture(autouse=True, loop_scope="function")
async def prepare_db():
    await init_db()


@pytest.mark.asyncio(loop_scope="function")
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"


@pytest.mark.asyncio(loop_scope="function")
async def test_repository_stats():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/repository/stats")
        assert res.status_code == 200
        data = res.json()
        assert "reports_count" in data
        assert "datasets_count" in data


@pytest.mark.asyncio(loop_scope="function")
async def test_list_reports():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/repository/reports?review_status=APPROVED")
        assert res.status_code == 200
        reports = res.json()
        assert isinstance(reports, list)
        assert len(reports) > 0


@pytest.mark.asyncio(loop_scope="function")
async def test_report_upload_and_duplicate_prevention():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        pdf_content = b"%PDF-1.4 Test unique report file content for ingestion testing"
        files = {"file": ("unique_report.pdf", pdf_content, "application/pdf")}
        data = {
            "title": "Automated Test Expedition Report",
            "document_type": "PDF",
            "version": "1.0",
            "expedition_id": "ISEA-99"
        }
        res = await ac.post("/api/repository/reports/upload", data=data, files=files)
        assert res.status_code == 201
        res_json = res.json()
        assert res_json["title"] == "Automated Test Expedition Report"
        assert res_json["checksum"] is not None

        # Duplicate upload attempt
        files_dup = {"file": ("unique_report_copy.pdf", pdf_content, "application/pdf")}
        res_dup = await ac.post("/api/repository/reports/upload", data=data, files=files_dup)
        assert res_dup.status_code == 409
        assert "Duplicate" in res_dup.json()["detail"]


@pytest.mark.asyncio(loop_scope="function")
async def test_invalid_file_extension():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        exe_content = b"MZ executable content"
        files = {"file": ("malicious.exe", exe_content, "application/x-msdownload")}
        data = {"title": "Invalid File Test"}
        res = await ac.post("/api/repository/reports/upload", data=data, files=files)
        assert res.status_code == 400
        assert "Invalid file extension" in res.json()["detail"]


@pytest.mark.asyncio(loop_scope="function")
async def test_dataset_upload_and_filter():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        csv_content = b"timestamp,temperature,salinity\n2023-01-01T00:00,-1.8,34.2\n"
        files = {"file": ("ocean_data.csv", csv_content, "text/csv")}
        data = {
            "title": "Automated Ocean Temp Test Dataset",
            "dataset_identifier": "DS-TEST-0099",
            "format": "CSV",
            "expedition_id": "SOE-99"
        }
        res = await ac.post("/api/repository/datasets/upload", data=data, files=files)
        assert res.status_code == 201
        item_id = res.json()["id"]

        # Detail fetch
        res_detail = await ac.get(f"/api/repository/datasets/{item_id}")
        assert res_detail.status_code == 200
        assert res_detail.json()["dataset_identifier"] == "DS-TEST-0099"


@pytest.mark.asyncio(loop_scope="function")
async def test_file_download_and_preview():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        reports_res = await ac.get("/api/repository/reports?review_status=APPROVED")
        report_id = reports_res.json()[0]["id"]

        download_res = await ac.get(f"/api/repository/files/report/{report_id}/download")
        assert download_res.status_code == 200
        assert "attachment" in download_res.headers.get("content-disposition", "")

        preview_res = await ac.get(f"/api/repository/files/report/{report_id}/preview")
        assert preview_res.status_code == 200
        assert "inline" in preview_res.headers.get("content-disposition", "")


@pytest.mark.asyncio(loop_scope="function")
async def test_review_workflow_approval():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        pdf_content = b"%PDF-1.4 Review Workflow Test Report"
        files = {"file": ("review_test.pdf", pdf_content, "application/pdf")}
        data = {"title": "Pending Review Report Test"}
        res = await ac.post("/api/repository/reports/upload", data=data, files=files)
        report_id = res.json()["id"]

        action_data = {
            "action": "APPROVE",
            "reviewer_comment": "Verified scientific accuracy.",
            "reviewer_name": "Dr. Chief Scientific Officer"
        }
        action_res = await ac.post(f"/api/repository/review/report/{report_id}/action", json=action_data)
        assert action_res.status_code == 200
        assert action_res.json()["review_status"] == "APPROVED"
