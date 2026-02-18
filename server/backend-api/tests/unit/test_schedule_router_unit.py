import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from httpx import AsyncClient, ASGITransport
from uuid import uuid4
from app.main import app
from app.api.deps import get_current_teacher

@pytest.fixture
def mock_db():
    with patch("app.api.routes.schedule.db") as mock:
        yield mock

@pytest.fixture
def mock_teacher_dep():
    user_id = "user_123"
    teacher_id = "teacher_123"
    # Provide a mock schedule
    teacher = {
        "_id": teacher_id,
        "userId": user_id,
        "schedule": {
            "exams": [
                {"id": str(uuid4()), "name": "Existing Exam", "date": "2024-01-01"}
            ]
        }
    }
    return {"id": user_id, "teacher": teacher, "user": {}}

@pytest.mark.asyncio
async def test_get_exams(mock_teacher_dep):
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_dep
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/schedule/exams")
    assert res.status_code == 200
    exams = res.json()
    assert len(exams) == 1
    assert exams[0]["name"] == "Existing Exam"
    app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_add_exam(mock_db, mock_teacher_dep):
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_dep

    # Mock update_one
    mock_db.teachers.update_one = AsyncMock(return_value=MagicMock(modified_count=1))

    new_exam = {"date": "2024-12-25", "name": "Christmas"}

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/schedule/exams", json=new_exam)

    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Christmas"
    assert "id" in data

    # Verify DB call
    mock_db.teachers.update_one.assert_called_once()
    call_args = mock_db.teachers.update_one.call_args
    # call_args[0] is positional args tuple: (filter, update)
    assert call_args[0][0] == {"_id": "teacher_123"}
    assert "$push" in call_args[0][1]
    assert call_args[0][1]["$push"]["schedule.exams"]["name"] == "Christmas"

    app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_update_exam(mock_db, mock_teacher_dep):
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_dep
    mock_db.teachers.update_one = AsyncMock(return_value=MagicMock(matched_count=1))

    exam_uuid = str(uuid4())
    update_data = {"date": "2024-01-02", "name": "Updated Name"}

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.put(f"/api/schedule/exams/{exam_uuid}", json=update_data)

    assert res.status_code == 200
    assert res.json()["name"] == "Updated Name"

    mock_db.teachers.update_one.assert_called_once()
    call_args = mock_db.teachers.update_one.call_args
    # Check query
    assert call_args[0][0] == {"_id": "teacher_123", "schedule.exams.id": exam_uuid}
    # Check update
    assert "$set" in call_args[0][1]
    assert call_args[0][1]["$set"]["schedule.exams.$"]["name"] == "Updated Name"

    app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_delete_exam(mock_db, mock_teacher_dep):
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_dep
    mock_db.teachers.update_one = AsyncMock(return_value=MagicMock(modified_count=1))

    exam_uuid = str(uuid4())

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.delete(f"/api/schedule/exams/{exam_uuid}")

    assert res.status_code == 200

    mock_db.teachers.update_one.assert_called_once()
    assert "$pull" in mock_db.teachers.update_one.call_args[0][1]
    assert mock_db.teachers.update_one.call_args[0][1]["$pull"]["schedule.exams"]["id"] == exam_uuid

    app.dependency_overrides = {}
