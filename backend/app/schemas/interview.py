from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime


# ── Session ───────────────────────────────────────────────────────────────────

class InterviewType(str, Enum):
    HR = "HR"
    TECHNICAL = "Technical"
    BEHAVIORAL = "Behavioral"


class InterviewDifficulty(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"


class FinishReason(str, Enum):
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class InterviewSessionCreate(BaseModel):
    interview_type: InterviewType
    target_role: str = Field(..., min_length=2, max_length=100)
    difficulty: InterviewDifficulty


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


class InterviewStartRequest(BaseModel):
    interview_type: InterviewType = InterviewType.TECHNICAL
    target_role: str = Field(..., min_length=2, max_length=100)
    difficulty: InterviewDifficulty = InterviewDifficulty.MEDIUM
    number_of_questions: int = Field(5, ge=1, le=15)


class InterviewAnswerRequest(BaseModel):
    session_id: int
    question_id: int
    answer_text: str = Field(..., min_length=1, max_length=10000)


class InterviewAnswerResult(BaseModel):
    question_id: int
    answer_id: int
    evaluation: Dict[str, Any]
    next_question: Optional[Dict[str, Any]] = None
    completed: bool = False


class FinishInterviewRequest(BaseModel):
    reason: FinishReason = FinishReason.COMPLETED


class FinishInterviewResponse(BaseModel):
    session_id: int
    status: FinishReason
    ended_at: datetime
    answered_questions: int
    total_questions: int
    report_status: str


class AnswerEvaluationResponse(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    rubric: Dict[str, int]
    strengths: List[str]
    missing_points: List[str]
    incorrect_or_unclear_points: List[str]
    improvement_suggestions: List[str]
    improved_answer_outline: List[str]
    recommended_topics: List[str]
    feedback_summary: str


class InterviewAnswerResponse(BaseModel):
    question_id: int
    answer_id: int
    evaluation: AnswerEvaluationResponse
    next_question: Optional[Dict[str, Any]] = None
    completed: bool = False


class InterviewStartResponse(BaseModel):
    session: InterviewSessionResponse
    question: Optional[Dict[str, Any]] = None


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
    fallback_used: bool = False

    # Per-question detail
    question_performance: Optional[List[QuestionPerformance]]

    generated_at: Optional[datetime]
