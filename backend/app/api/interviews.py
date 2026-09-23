"""
Interview session API endpoints.

POST /interviews/sessions                  — create a new session
POST /interviews/sessions/{id}/answers     — save Q&A for a session
POST /interviews/sessions/{id}/end         — mark session completed
GET  /interviews/sessions                  — list user's sessions
"""
from typing import List

from fastapi import APIRouter, Depends, status

from app.core.security import get_current_user
from app.schemas.interview import (
    InterviewSessionCreate,
    InterviewSessionResponse,
    SaveQuestionAnswerRequest,
    QuestionAnswerResponse,
    InterviewStartRequest,
    InterviewAnswerRequest,
)
from app.services import interview_service

router = APIRouter(prefix="/interviews", tags=["Interviews"])

ai_router = APIRouter(prefix="/interview", tags=["AI Mock Interview"])


@ai_router.post("/start", status_code=status.HTTP_201_CREATED)
def start_interview(
    body: InterviewStartRequest,
    current_user: dict = Depends(get_current_user),
):
    return interview_service.start_ai_session(
        user_id=current_user["sub"],
        interview_type=body.interview_type,
        target_role=body.target_role,
        difficulty=body.difficulty,
        number_of_questions=body.number_of_questions,
    )


@ai_router.post("/answer")
def answer_interview(
    body: InterviewAnswerRequest,
    current_user: dict = Depends(get_current_user),
):
    return interview_service.evaluate_session_answer(
        session_id=body.session_id,
        question_id=body.question_id,
        user_id=current_user["sub"],
        answer_text=body.answer_text,
    )


@ai_router.get("/history")
def interview_history(current_user: dict = Depends(get_current_user)):
    return interview_service.list_user_sessions(current_user["sub"])


@ai_router.get("/{session_id}")
def get_interview(session_id: int, current_user: dict = Depends(get_current_user)):
    return interview_service.get_session(session_id, current_user["sub"])


@ai_router.post("/{session_id}/finish")
def finish_interview(session_id: int, current_user: dict = Depends(get_current_user)):
    return interview_service.end_session(session_id, current_user["sub"])


@router.post(
    "/sessions",
    status_code=status.HTTP_201_CREATED,
    summary="Start a new interview session",
)
def create_session(
    body: InterviewSessionCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create an interview session row. Returns the created session."""
    user_id: str = current_user["sub"]
    return interview_service.create_session(
        user_id=user_id,
        interview_type=body.interview_type,
        target_role=body.target_role,
        difficulty=body.difficulty,
    )


@router.post(
    "/sessions/{session_id}/answers",
    status_code=status.HTTP_201_CREATED,
    summary="Save a question and answer for the session",
)
def save_answer(
    session_id: int,
    body: SaveQuestionAnswerRequest,
    current_user: dict = Depends(get_current_user),
):
    """Store one Q&A pair linked to the session."""
    return interview_service.save_question_answer(
        session_id=session_id,
        question_text=body.question_text,
        sequence_no=body.sequence_no,
        answer_text=body.answer_text,
        ai_score=body.ai_score,
        ai_feedback=body.ai_feedback,
    )


@router.post(
    "/sessions/{session_id}/end",
    summary="Mark a session as completed",
)
def end_session(
    session_id: int,
    current_user: dict = Depends(get_current_user),
):
    """Update status=completed and set ended_at for the session."""
    user_id: str = current_user["sub"]
    return interview_service.end_session(session_id=session_id, user_id=user_id)


@router.get(
    "/sessions",
    summary="List all interview sessions for current user",
)
def list_sessions(current_user: dict = Depends(get_current_user)):
    user_id: str = current_user["sub"]
    return interview_service.list_user_sessions(user_id=user_id)
