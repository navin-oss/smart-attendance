from app.db.mongo import db
from bson import ObjectId
from datetime import datetime

students_col = db["students"]
users_col = db["users"]
attendance_col = db["attendance"]


async def get_student_profile(user_id: str):
    """
    Build a complete student profile by merging data from:
    - users collection
    - students collection
    - attendance summary
    """

    # 1. Get user document (contains name, email, branch)
    user = await users_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None

    # 2. Get student doc using user_id
    student = await students_col.find_one({"user_id": ObjectId(user_id)})
    if not student:
        return None

    # 3. Build attendance summary
    attendance_summary = await build_attendance_summary(student["_id"])

    # 4. Merge everything into a single clean object
    profile = {
        "id": str(student["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "branch": user.get("branch") or student.get("branch"),
        "year": student.get("year"),
        "subjects": student.get("subjects", []),
        "avatarUrl": student.get("avatarUrl"),
        "attendance": attendance_summary,
        "recent_attendance": attendance_summary["recent_attendance"],
    }

    return profile


async def build_attendance_summary(student_doc_id: ObjectId):
    """
    Returns:
    {
      total_classes,
      present,
      absent,
      percentage,
      forecasted_score,
      recent_attendance: [...]
    }
    """

    q = {"student_id": student_doc_id}

    total_classes = await attendance_col.count_documents(q)
    present = await attendance_col.count_documents({**q, "present": True})
    absent = total_classes - present

    percentage = round((present / total_classes) * 100, 2) if total_classes else 0
    forecasted_score = 2 if percentage < 50 else 5  # example logic

    # Last 5 records
    recent_cursor = attendance_col.find(q).sort("date", -1).limit(5)
    recent = []
    async for r in recent_cursor:
        recent.append({
            "id": str(r["_id"]),
            "date": r.get("date"),
            "period": r.get("period"),
            "present": r.get("present"),
            "class_id": str(r.get("class_id")),
        })

    return {
        "total_classes": total_classes,
        "present": present,
        "absent": absent,
        "percentage": percentage,
        "forecasted_score": forecasted_score,
        "recent_attendance": recent,
    }
