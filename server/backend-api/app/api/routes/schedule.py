from fastapi import APIRouter, Depends, HTTPException, Body
from app.api.deps import get_current_teacher
from app.db.mongo import db
from app.schemas.schedule import ExamOverride
from typing import List
from uuid import UUID, uuid4
from bson import ObjectId

router = APIRouter()

@router.get("/exams", response_model=List[ExamOverride])
async def get_exams(current: dict = Depends(get_current_teacher)):
    teacher = current["teacher"]
    schedule = teacher.get("schedule") or {}
    exams = schedule.get("exams") or []
    return exams

@router.post("/exams", response_model=ExamOverride)
async def add_exam(
    exam: ExamOverride,
    current: dict = Depends(get_current_teacher)
):
    teacher_id = current["teacher"]["_id"]

    # Prepare exam dict
    exam_dict = exam.dict()
    # Ensure ID is string for storage consistency
    exam_dict["id"] = str(exam_dict["id"])

    # Ensure Date is string (ISO) for storage consistency
    if hasattr(exam_dict["date"], "isoformat"):
        exam_dict["date"] = exam_dict["date"].isoformat()

    # Push to array
    result = await db.teachers.update_one(
        {"_id": teacher_id},
        {"$push": {"schedule.exams": exam_dict}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to add exam")

    return exam

@router.put("/exams/{exam_id}", response_model=ExamOverride)
async def update_exam(
    exam_id: UUID,
    exam_in: ExamOverride,
    current: dict = Depends(get_current_teacher)
):
    teacher_id = current["teacher"]["_id"]
    exam_id_str = str(exam_id)

    exam_dict = exam_in.dict()
    # Enforce ID from path
    exam_dict["id"] = exam_id_str

    if hasattr(exam_dict["date"], "isoformat"):
        exam_dict["date"] = exam_dict["date"].isoformat()

    # Update specific element in array
    query = {
        "_id": teacher_id,
        "schedule.exams.id": exam_id_str
    }
    update = {
        "$set": {"schedule.exams.$": exam_dict}
    }

    result = await db.teachers.update_one(query, update)

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Exam not found")

    # Ensure returned object has the correct ID (from URL), not the default one
    exam_in.id = exam_id
    return exam_in

@router.delete("/exams/{exam_id}")
async def delete_exam(
    exam_id: UUID,
    current: dict = Depends(get_current_teacher)
):
    teacher_id = current["teacher"]["_id"]
    exam_id_str = str(exam_id)

    # Pull from array
    result = await db.teachers.update_one(
        {"_id": teacher_id},
        {"$pull": {"schedule.exams": {"id": exam_id_str}}}
    )

    if result.modified_count == 0:
        # Check if exam existed
        teacher = await db.teachers.find_one(
            {"_id": teacher_id, "schedule.exams.id": exam_id_str}
        )
        if not teacher:
            raise HTTPException(status_code=404, detail="Exam not found")

        raise HTTPException(status_code=500, detail="Failed to delete exam")

    return {"message": "Exam deleted successfully"}
