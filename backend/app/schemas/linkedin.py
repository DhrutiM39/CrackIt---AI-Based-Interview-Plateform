from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class LinkedInAnalyzeRequest(BaseModel):
    headline: Optional[str] = None
    about: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[List[str]] = None
    education: Optional[str] = None
    projects: Optional[str] = None
    certifications: Optional[str] = None
    linkedin_url: Optional[str] = None
    profile_text: Optional[str] = None  # Legacy: raw text input


class LinkedInAnalysisResponse(BaseModel):
    id: Optional[int] = None
    profile_score: float
    headline_score: float
    about_score: float
    experience_score: float
    skills_score: float
    education_score: float
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    missing_sections: List[str]
    keyword_suggestions: List[str]
    improvement_suggestions: List[str]
    persisted: bool = False


class LinkedInAnalysisSummary(BaseModel):
    id: int
    linkedin_url: Optional[str] = None
    analysis_score: Optional[float] = None
    analyzed_at: Optional[datetime] = None
