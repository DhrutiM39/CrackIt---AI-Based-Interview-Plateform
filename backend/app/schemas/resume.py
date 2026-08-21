from typing import Any

from pydantic import BaseModel, Field


class ResumeAnalysisResponse(BaseModel):
    success: bool = True
    resume_id: int
    ats_score: float | None = Field(default=None, ge=0, le=100)
    ai_feedback: str | None = None
    full_analysis: dict[str, Any]
