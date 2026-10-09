from pydantic import BaseModel
from typing import List, Optional

class DailyActivity(BaseModel):
    day: str
    topics: int
    mock: int

class WeeklyProgress(BaseModel):
    week: str
    progress: int
    target: int

class SkillGrowth(BaseModel):
    month: str
    DSA: int
    System: int
    OOP: int
    SQL: int

class RecentActivity(BaseModel):
    id: str
    type: str # 'interview', 'resume', 'project', 'topic'
    label: str
    time: str
    color: str

class SubjectCompletion(BaseModel):
    id: int
    name: str
    progress: int
    color: str

class DomainCompletion(BaseModel):
    id: int
    name: str
    progress: int
    color: str

class InterviewHistoryItem(BaseModel):
    type: str
    score: int
    date: str
    grade: str
    color: str

class AnalysisHistoryItem(BaseModel):
    name: str
    score: int
    color: str
    date: Optional[str] = None
    type: str # 'resume' or 'project'

class DashboardMetrics(BaseModel):
    overall_progress: int
    study_streak: int
    mock_interviews_done: int
    average_interview_score: int
    latest_interview_score: Optional[int] = None
    goals_completed: int
    total_goals: int
    
    weekly_activity: List[DailyActivity]
    monthly_progress: List[WeeklyProgress]
    skills_growth: List[SkillGrowth]
    recent_activity: List[RecentActivity]
    
    subject_completion: List[SubjectCompletion]
    domain_completion: List[DomainCompletion]
    
    interview_history: List[InterviewHistoryItem]
    analysis_history: List[AnalysisHistoryItem]
