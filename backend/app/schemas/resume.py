from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SectionDetail(BaseModel):
    score: float = Field(..., ge=0, le=100)
    tips: List[str] = Field(default_factory=list)


class DetectedSkill(BaseModel):
    skill: str
    category: Optional[str] = "Technical"
    confidence: Optional[float] = Field(default=85.0, ge=0, le=100)


class PriorityActionItem(BaseModel):
    section: str
    action: str
    potential_gain: int = 5
    impact: str = "High"


class ResumeAnalysisDetail(BaseModel):
    overall_score: float = Field(..., ge=0, le=100)
    ats_score: float = Field(..., ge=0, le=100)
    readability_score: float = Field(default=80.0, ge=0, le=100)
    keyword_match_score: float = Field(default=70.0, ge=0, le=100)
    summary_feedback: str
    sections: Dict[str, Any]
    detected_skills: List[Dict[str, Any]] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    found_keywords: List[str] = Field(default_factory=list)
    priority_action_plan: List[Dict[str, Any]] = Field(default_factory=list)


class ResumeAnalysisResponse(BaseModel):
    success: bool = True
    resume_id: Optional[int] = None
    ats_score: Optional[float] = Field(default=None, ge=0, le=100)
    overall_score: Optional[float] = Field(default=None, ge=0, le=100)
    ai_feedback: Optional[str] = None
    full_analysis: Dict[str, Any]
    persisted: bool = False
    message: Optional[str] = None
