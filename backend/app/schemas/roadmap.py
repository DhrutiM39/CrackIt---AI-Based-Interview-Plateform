from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class RoadmapGenerateRequest(BaseModel):
    target_role: str
    current_skills: Optional[List[str]] = None
    skill_gaps: Optional[List[str]] = None
    experience_level: Optional[str] = "Student"
    duration_months: Optional[int] = 6


class RoadmapMilestoneResponse(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"
    due_date: Optional[str] = None
    progress_percentage: Optional[float] = 0


class RoadmapResponse(BaseModel):
    id: Optional[int] = None
    roadmap_title: Optional[str] = None
    summary: Optional[str] = None
    total_duration_weeks: Optional[int] = None
    milestones: List[RoadmapMilestoneResponse] = []
    created_at: Optional[datetime] = None


class RoadmapSummary(BaseModel):
    id: int
    roadmap_title: Optional[str] = None
    created_at: Optional[datetime] = None
    milestone_count: int = 0
    completed_count: int = 0
