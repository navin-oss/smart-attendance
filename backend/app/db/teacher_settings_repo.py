# backend/app/db/settings_repo.py
from typing import Optional, Dict, Any
from datetime import datetime
from app.db.mongo import db               # db must be an AsyncIOMotorDatabase instance
from pymongo import ReturnDocument

COL = "teachers"

def _flatten(prefix: str, d: Dict[str, Any], out: Dict[str, Any]) -> None:
    """Convert nested dict to dot notation for $set updates"""
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            _flatten(key, v, out)
        else:
            out[key] = v

async def get_by_user(user_id: str) -> Optional[Dict[str, Any]]:
    """Return the raw document or None"""
    return await db[COL].find_one({"userId": user_id})

async def create_default(user_id: str, profile: dict):
    now = datetime.utcnow()

    default = {
        "userId": user_id,
        "profile": {
            "name": profile.get("name", ""),
            "email": profile.get("email", ""),
            "phone": profile.get("phone", ""),
            "role": profile.get("role", ""),
            "subjects": profile.get("subjects", []),
            "avatarUrl": profile.get("avatarUrl", None),
            "employee_id": profile.get("employee_id"),
            "department": profile.get("department"),
        },
        "theme": "Light",
        "notifications": {"push": True, "inApp": True, "sound": False},
        "emailPreferences": [
            {"key": "daily_summary", "enabled": True},
            {"key": "critical_alerts", "enabled": True},
            {"key": "product_updates", "enabled": False},
        ],
        "thresholds": {"warningVal": 75, "safeVal": 85},
        "faceSettings": {"liveness": True, "sensitivity": 80, "enrolledAt": None},
        "createdAt": now,
        "updatedAt": now,
    }

    await db[COL].insert_one(default)
    return default


async def upsert(user_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Replace or upsert fields provided in payload (payload should be a dict of top-level fields).
    """
    if not isinstance(payload, dict) or not payload:
        # nothing to upsert; return existing document
        return await get_by_user(user_id)

    payload = payload.copy()
    payload["updatedAt"] = datetime.utcnow()

    # NOTE: we pass filter and update as positional args: (filter, update, ...)
    res = await db[COL].find_one_and_update(
        {"userId": user_id},
        {"$set": payload},                 # <-- required second positional arg 'update'
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    # find_one_and_update should return the document after update due to ReturnDocument.AFTER
    return res

async def patch(user_id: str, patch_payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Patch nested fields using dot-notation $set.
    patch_payload is a nested dict (e.g., {"profile": {"name": "New"}}).
    """
    if not isinstance(patch_payload, dict) or not patch_payload:
        # nothing to patch; return existing doc
        return await get_by_user(user_id)

    set_map: Dict[str, Any] = {}
    _flatten("", patch_payload, set_map)

    if not set_map:
        return await get_by_user(user_id)

    set_map["updatedAt"] = datetime.utcnow()

    # MUST pass 'update' as second positional argument
    res = await db[COL].find_one_and_update(
        {"userId": user_id},
        {"$set": set_map},                 # <-- this is the 'update' arg
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return res

async def create_index_once():
    """Ensure userId is unique/indexed at startup."""
    await db[COL].create_index("userId", unique=True)
