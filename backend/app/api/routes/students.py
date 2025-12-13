from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ...schemas.user import Student
from ...db.mongo import db
# from ...schemas.student import StudentCreate, StudentOut
from app.services.students import get_student_profile
from fastapi.responses import JSONResponse
from ...core.security import get_current_user

router = APIRouter(prefix="/students", tags=["students"])


# Return logged in user details
@router.get("/me/profile")
async def api_get_my_profile(current_user: dict = Depends(get_current_user)):
    
    # print(current_user)
    if current_user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Not a student")

    student_id = current_user.get("id")
    profile = await get_student_profile(student_id)

    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    return profile



@router.get("/{students_id}/profile")
async def api_get_student_profile(student_id: str):
    profile = await get_student_profile(student_id)
    if not profile:
        raise HTTPException(status_code=401, detail="Student not found")
    
    return JSONResponse(content=profile)




# @router.get("/")
# async def api_create_student(payload: StudentCreate):
#     doc = await create_student(payload.dict())
#     if not doc:
#         raise HTTPException(status_code=400, detail="Create failed")
    
#     doc["_id"] = str(doc["_id"])
#     return doc

# @router.get("/", response_model=list[StudentOut])
# async def api_list_students(skip: int = 0, limit: int = 50):
#     docs = await list_students(skip, limit)
#     return docs

# @router.get("/{student_id}", response_model=StudentOut)
# async def api_get_student(student_id: str):
#     doc = await get_student(student_id)
#     if not doc:
#         raise HTTPException(404, "Not found")
#     return doc