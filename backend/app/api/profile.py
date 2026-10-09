"""
Profile API endpoints.

GET   /profile — get current user's profile
PATCH /profile — update profile fields
"""
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.profile import ProfileResponse, ProfileUpdateRequest

router = APIRouter(prefix="/profile", tags=["Profile"])
logger = logging.getLogger(__name__)


@router.get("", response_model=ProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get the current user's full profile."""
    user_id = current_user["sub"]
    try:
        res = (
            supabase.table("users")
            .select("id, full_name, email, profile_photo, target_job_role, experience_level, streak_count, created_at")
            .eq("id", user_id)
            .single()
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return res.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")


@router.patch("")
async def update_profile(
    body: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update the current user's profile. Only non-null fields are updated."""
    user_id = current_user["sub"]

    update_data = {}
    if body.full_name is not None:
        update_data["full_name"] = body.full_name
    if body.target_job_role is not None:
        update_data["target_job_role"] = body.target_job_role
    if body.experience_level is not None:
        update_data["experience_level"] = body.experience_level
    if body.profile_photo is not None:
        update_data["profile_photo"] = body.profile_photo

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    try:
        res = (
            supabase.table("users")
            .update(update_data)
            .eq("id", user_id)
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update profile error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile")
