from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ProjectAnalyzeRequest(BaseModel):
    project_name: str
    description: str
    technologies: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    role: Optional[str] = None
    features: Optional[str] = None
    challenges: Optional[str] = None


class ProjectAnalysisResponse(BaseModel):
    id: Optional[int] = None
    project_id: Optional[int] = None
    overall_score: float
    technical_quality: float
    complexity_score: float
    resume_value: float
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    missing_features: List[str]
    interview_questions: List[str]
    suggested_improvements: List[str]
    persisted: bool = False


class ProjectSummary(BaseModel):
    id: int
    project_title: str
    description: Optional[str] = None
    github_url: Optional[str] = None
    created_at: Optional[datetime] = None
    analysis: Optional[dict] = None
