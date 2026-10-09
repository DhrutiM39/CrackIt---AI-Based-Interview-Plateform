"""
Settings API endpoints.

GET   /settings — get current user's settings
PATCH /settings — update settings
"""
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.settings import SettingsResponse, SettingsUpdateRequest

router = APIRouter(prefix="/settings", tags=["Settings"])
logger = logging.getLogger(__name__)


@router.get("", response_model=SettingsResponse)
async def get_settings(current_user: dict = Depends(get_current_user)):
    """Get the current user's settings. Creates defaults if none exist."""
    user_id = current_user["sub"]
    try:
        res = (
            supabase.table("user_settings")
            .select("id, theme, language, email_notifications, push_notifications")
            .eq("user_id", user_id)
            .execute()
        )
        if res.data:
            return res.data[0]

        # Create default settings
        default = {
            "user_id": user_id,
            "theme": "dark",
            "language": "en",
            "email_notifications": True,
            "push_notifications": True,
        }
        create_res = supabase.table("user_settings").insert(default).execute()
        if create_res.data:
            return create_res.data[0]

        return SettingsResponse()
    except Exception as e:
        logger.error(f"Get settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch settings")


@router.patch("")
async def update_settings(
    body: SettingsUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update user settings. Only non-null fields are updated."""
    user_id = current_user["sub"]

    update_data = {}
    if body.theme is not None:
        update_data["theme"] = body.theme
    if body.language is not None:
        update_data["language"] = body.language
    if body.email_notifications is not None:
        update_data["email_notifications"] = body.email_notifications
    if body.push_notifications is not None:
        update_data["push_notifications"] = body.push_notifications

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    try:
        # Check if settings exist
        existing = (
            supabase.table("user_settings")
            .select("id")
            .eq("user_id", user_id)
            .execute()
        )

        if existing.data:
            res = (
                supabase.table("user_settings")
                .update(update_data)
                .eq("user_id", user_id)
                .execute()
            )
        else:
            update_data["user_id"] = user_id
            res = supabase.table("user_settings").insert(update_data).execute()

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to save settings")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update settings")
