from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ==========================================
# Subject Models
# ==========================================
class TopicBase(BaseModel):
    id: int
    topic_name: str
    subject_id: int
    
class SubjectBase(BaseModel):
    id: int
    subject_name: str
    icon: Optional[str] = None
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None

class SubjectProgress(BaseModel):
    completed_questions: int = 0
    total_questions: int = 0
    completion_percentage: float = 0.0
    streak: int = 0

class SubjectResponse(SubjectBase):
    progress: float = 0.0
    total_topics: int = 0
    done_topics: int = 0
    streak: int = 0

class SubjectDetailResponse(SubjectResponse):
    topics: List[Dict[str, Any]] = [] # Includes completion status
    
# ==========================================
# Domain Models
# ==========================================
class DomainBase(BaseModel):
    id: int
    domain_name: str
    icon: Optional[str] = None

class DomainProgress(BaseModel):
    completed_questions: int = 0
    total_questions: int = 0
    completion_percentage: float = 0.0
    streak: int = 0

class DomainResponse(DomainBase):
    progress: float = 0.0
    total_topics: int = 0
    done_topics: int = 0
    streak: int = 0

class DomainDetailResponse(DomainResponse):
    topics: List[Dict[str, Any]] = []

# ==========================================
# Question Models
# ==========================================
class QuestionBase(BaseModel):
    id: int
    question: str
    difficulty: Optional[str] = None
    topic_id: int
    
class QuestionResponse(QuestionBase):
    completed: bool = False
    score: Optional[float] = None
    
class SubmitAnswerRequest(BaseModel):
    answer: str

class SubmitAnswerResponse(BaseModel):
    is_correct: bool
    score: float
    feedback: Optional[str] = None
    correct_answer: Optional[str] = None

# ==========================================
# AI Generated Question Models
# ==========================================
class GenerateQuestionsRequest(BaseModel):
    job_role: Optional[str] = None
    domain: Optional[str] = None
    skills: Optional[List[str]] = None
    resume_analysis_id: Optional[int] = None
    difficulty: str = "Medium"
    number_of_questions: int = 5
    category: str = "Technical" # Technical, Behavioral, HR, Project, Resume, Coding, Situational

class GeneratedQuestion(BaseModel):
    question: str
    category: str
    difficulty: str
    topic: str
    suggested_answer: Optional[str] = None

class GeneratedQuestionList(BaseModel):
    questions: List[GeneratedQuestion]
