"""
Notifications API endpoints.

GET   /notifications           — list user's notifications
PATCH /notifications/{id}/read — mark as read
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.notifications import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])
logger = logging.getLogger(__name__)


@router.get("", response_model=List[NotificationResponse])
async def get_notifications(current_user: dict = Depends(get_current_user)):
    """List all notifications for the current user, newest first."""
    user_id = current_user["sub"]
    try:
        res = (
            supabase.table("notifications")
            .select("id, notification_type, title, message, is_read, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(50)
            .execute()
        )
        return res.data or []
    except Exception as e:
        logger.error(f"Fetch notifications error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch notifications")


@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user: dict = Depends(get_current_user),
):
    """Mark a notification as read."""
    user_id = current_user["sub"]
    try:
        res = (
            supabase.table("notifications")
            .update({"is_read": True})
            .eq("id", notification_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="Notification not found")
        return {"status": "ok", "id": notification_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Mark read error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update notification")
