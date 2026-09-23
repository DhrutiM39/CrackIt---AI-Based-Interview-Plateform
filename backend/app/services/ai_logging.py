"""
AI Logging service.
Records metadata about Gemini API calls to the ai_logs table.
Never stores API keys, passwords, or sensitive raw user data.
"""
import logging
from typing import Optional

from app.database.supabase import supabase

logger = logging.getLogger(__name__)


def log_ai_call(
    user_id: Optional[str],
    feature_name: str,
    model_name: str = "gemini-2.0-flash",
    processing_time_ms: Optional[int] = None,
    tokens_used: Optional[int] = None,
    status: str = "success",
) -> None:
    """Log an AI API call to the ai_logs table. Non-blocking — errors are swallowed."""
    try:
        record = {
            "feature_name": feature_name,
            "model_name": model_name,
            "processing_time_ms": processing_time_ms,
            "tokens_used": tokens_used,
            # Store status in prompt field since we don't want to log raw prompts
            "prompt": f"status:{status}",
            "response": None,
        }
        if user_id:
            record["user_id"] = user_id

        supabase.table("ai_logs").insert(record).execute()
    except Exception as e:
        # Never let logging failures break the main flow
        logger.debug(f"AI log insert failed (non-critical): {e}")
