from pydantic import BaseModel, HttpUrl
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

class ProjectCriteria(BaseModel):
    name: str
    score: int
    desc: str

class ProjectAnalyzeResponse(BaseModel):
    id: int
    project_id: int
    user_id: str
    project_title: str
    ai_score: float
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    interview_questions: List[str]
    criteria: List[ProjectCriteria]
    analyzed_at: datetime
