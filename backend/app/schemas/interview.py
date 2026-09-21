from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# ── Session ───────────────────────────────────────────────────────────────────

class InterviewSessionCreate(BaseModel):
    interview_type: str = Field(..., description="HR | Technical | Behavioral")
    target_role: str
    difficulty: str = Field(..., description="Easy | Medium | Hard")


class InterviewSessionResponse(BaseModel):
    id: int
    user_id: str
    interview_type: Optional[str]
    target_role: Optional[str]
    difficulty: Optional[str]
    status: Optional[str]
    started_at: Optional[datetime]
    ended_at: Optional[datetime]


# ── Question + Answer ─────────────────────────────────────────────────────────

class SaveQuestionAnswerRequest(BaseModel):
    question_text: str
    sequence_no: int
    answer_text: Optional[str] = None
    # These are pre-computed on frontend (simulated) or can be null for Gemini to compute
    ai_score: Optional[float] = None
    ai_feedback: Optional[str] = None


class QuestionAnswerResponse(BaseModel):
    question_id: int
    answer_id: Optional[int]
    question_text: str
    sequence_no: int
    answer_text: Optional[str]
    ai_score: Optional[float]
    ai_feedback: Optional[str]


# ── Report ────────────────────────────────────────────────────────────────────

class QuestionPerformance(BaseModel):
    sequence_no: int
    question_text: str
    answer_text: Optional[str]
    score: Optional[float]
    feedback: Optional[str]
    grade: Optional[str]


class ReportGenerateRequest(BaseModel):
    session_id: int


class ReportSummary(BaseModel):
    id: int
    session_id: int
    target_role: Optional[str]
    interview_type: Optional[str]
    difficulty: Optional[str]
    overall_score: Optional[float]
    technical_score: Optional[float]
    communication_score: Optional[float]
    generated_at: Optional[datetime]
    interview_date: Optional[datetime]


class ReportResponse(BaseModel):
    id: int
    session_id: int

    # User info
    user_name: Optional[str]

    # Session metadata
    target_role: Optional[str]
    interview_type: Optional[str]
    difficulty: Optional[str]
    interview_date: Optional[datetime]
    duration_seconds: Optional[int]

    # Scores
    overall_score: Optional[float]
    technical_score: Optional[float]
    communication_score: Optional[float]

    # AI-generated content
    strengths: Optional[List[str]]
    weaknesses: Optional[List[str]]
    missed_concepts: Optional[List[str]]
    recommended_topics: Optional[List[str]]
    summary: Optional[str]
    next_steps: Optional[List[str]]

    # Per-question detail
    question_performance: Optional[List[QuestionPerformance]]

    generated_at: Optional[datetime]
