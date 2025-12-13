# backend/app/api/routes/settings.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pathlib import Path
from datetime import datetime
import aiofiles

from app.services.teacher_settings_service import ensure_settings_for_user, patch_settings, replace_settings
from app.db.teacher_settings_repo import create_index_once
from app.utils.utils import serialize_bson   # <-- new import
from app.db.mongo import db
from bson import ObjectId


router = APIRouter(prefix="/api/settings", tags=["settings"])

async def get_current_user():
    # Later replace with session/token logic
    raw_user_id = "693be3dea1a46302dc434cd4"
    oid = ObjectId(raw_user_id)

    user = await db["users"].find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch teacher (teachers.user_id is ObjectId)
    teacher = await db["teachers"].find_one({"userId": oid})

    # Merge logic:
    profile = {
        "id": user["_id"],

        "name": teacher.get("profile", {}).get("name", user.get("name", "")),

        "email": user.get("email", ""),

        "phone": teacher.get("profile", {}).get("phone", user.get("phone", "")),

        "role": teacher.get("profile", {}).get("role", user.get("role", "teacher")),

        "employee_id": teacher.get("employee_id", user.get("employee_id")),

        "subjects": teacher.get("subjects", []),

        "department": teacher.get("department"),

        "avatarUrl": teacher.get("avatarUrl"),
    }

    return profile

@router.on_event("startup")
async def _ensure_indexes():
    await create_index_once()

@router.get("/", response_model=dict)
async def get_settings(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    doc = await ensure_settings_for_user(user_id, current_user)
    return serialize_bson(doc)   # <-- convert before returning

@router.patch("/", response_model=dict)
async def patch_settings_route(payload: dict, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    if not payload:
        raise HTTPException(status_code=400, detail="Empty payload")
    updated = await patch_settings(user_id, payload)
    return serialize_bson(updated)   # <-- convert

@router.put("/", response_model=dict)
async def put_settings_route(payload: dict, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    updated = await replace_settings(user_id, payload)
    return serialize_bson(updated)   # <-- convert

# avatar upload route
UPLOAD_DIR = Path("app/static/avatars") # change the directory 
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload-avatar", response_model=dict)
async def upload_avatar(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    ext = Path(file.filename).suffix.lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    fname = f"{current_user['id']}_{int(datetime.utcnow().timestamp())}{ext}"
    dest = UPLOAD_DIR / fname
    async with aiofiles.open(dest, "wb") as out:
        content = await file.read()
        await out.write(content)
    avatar_url = f"/static/avatars/{fname}"
    updated = await patch_settings(current_user["id"], {"profile": {"avatarUrl": avatar_url}})
    return {"avatarUrl": avatar_url, "settings": serialize_bson(updated)}  # <-- convert nested doc
