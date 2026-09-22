"""
Interview session CRUD service.
Handles creating sessions, saving Q&A pairs, and ending sessions.
"""
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from fastapi import HTTPException, status

from app.database.supabase import supabase
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


def create_session(
    user_id: str,
    interview_type: str,
    target_role: str,
    difficulty: str,
) -> Dict[str, Any]:
    """Create a new interview session row and return it."""
    try:
        result = (
            supabase.table("interview_sessions")
            .insert({
                "user_id": user_id,
                "interview_type": interview_type,
                "target_role": target_role,
                "difficulty": difficulty,
                "status": "in_progress",
            })
            .execute()
        )
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create interview session",
            )
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"create_session error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def start_ai_session(
    user_id: str,
    interview_type: str,
    target_role: str,
    difficulty: str,
    number_of_questions: int,
) -> Dict[str, Any]:
    """Create a session and persist its Gemini-generated question set."""
    session = create_session(user_id, interview_type, target_role, difficulty)
    try:
        generated = gemini_service.generate_questions(
            job_role=target_role,
            difficulty=difficulty,
            number_of_questions=number_of_questions,
            category=interview_type,
        )
        questions = []
        for sequence_no, generated_question in enumerate(generated.questions, 1):
            result = supabase.table("interview_questions").insert({
                "session_id": session["id"],
                "question_text": generated_question.question,
                "sequence_no": sequence_no,
            }).execute()
            if not result.data:
                raise HTTPException(500, "Failed to save generated interview question")
            questions.append(result.data[0])
        if not questions:
            raise HTTPException(502, "AI generated no interview questions")
        return {"session": session, "question": questions[0]}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("start_ai_session error: %s", exc)
        raise HTTPException(status_code=502, detail="Unable to generate interview questions") from exc


def evaluate_session_answer(
    session_id: int,
    question_id: int,
    user_id: str,
    answer_text: str,
) -> Dict[str, Any]:
    """Evaluate and save an answer, returning the next unanswered question."""
    session_result = supabase.table("interview_sessions").select("*").eq("id", session_id).eq("user_id", user_id).execute()
    if not session_result.data:
        raise HTTPException(404, "Interview session not found")

    question_result = supabase.table("interview_questions").select("*").eq("id", question_id).eq("session_id", session_id).execute()
    if not question_result.data:
        raise HTTPException(404, "Interview question not found")
    question = question_result.data[0]

    evaluation = gemini_service.evaluate_answer(
        question=question["question_text"],
        answer=answer_text,
        difficulty=session_result.data[0].get("difficulty", "Medium"),
    )
    answer_result = supabase.table("interview_answers").insert({
        "question_id": question_id,
        "answer_type": "text",
        "answer_text": answer_text,
        "ai_score": evaluation.score,
        "ai_feedback": evaluation.model_dump_json(),
    }).execute()
    if not answer_result.data:
        raise HTTPException(500, "Failed to save interview answer")

    answer = answer_result.data[0]
    all_questions = supabase.table("interview_questions").select("*").eq("session_id", session_id).order("sequence_no").execute().data or []
    answered = supabase.table("interview_answers").select("question_id").in_("question_id", [q["id"] for q in all_questions]).execute().data if all_questions else []
    answered_ids = {item["question_id"] for item in answered}
    next_question = next((item for item in all_questions if item["id"] not in answered_ids), None)

    return {
        "question_id": question_id,
        "answer_id": answer["id"],
        "score": evaluation.score,
        "correctness": evaluation.correctness,
        "relevance": evaluation.relevance,
        "clarity": evaluation.clarity,
        "feedback": evaluation.feedback,
        "missing_points": evaluation.missing_points,
        "suggestions": evaluation.suggestions,
        "next_question": next_question,
        "completed": next_question is None,
    }


def get_session(session_id: int, user_id: str) -> Dict[str, Any]:
    return get_session_with_qa(session_id, user_id)


def save_question_answer(
    session_id: int,
    question_text: str,
    sequence_no: int,
    answer_text: Optional[str] = None,
    ai_score: Optional[float] = None,
    ai_feedback: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Insert a question row then (optionally) its answer row.
    Returns a dict with question_id, answer_id (or None).
    """
    try:
        # 1. Insert question
        q_result = (
            supabase.table("interview_questions")
            .insert({
                "session_id": session_id,
                "question_text": question_text,
                "sequence_no": sequence_no,
            })
            .execute()
        )
        if not q_result.data:
            raise HTTPException(500, "Failed to save interview question")
        question_id = q_result.data[0]["id"]

        answer_id = None
        # 2. Insert answer if we have one
        if answer_text:
            a_result = (
                supabase.table("interview_answers")
                .insert({
                    "question_id": question_id,
                    "answer_type": "text",
                    "answer_text": answer_text,
                    "ai_score": ai_score,
                    "ai_feedback": ai_feedback,
                })
                .execute()
            )
            if a_result.data:
                answer_id = a_result.data[0]["id"]

        return {
            "question_id": question_id,
            "answer_id": answer_id,
            "question_text": question_text,
            "sequence_no": sequence_no,
            "answer_text": answer_text,
            "ai_score": ai_score,
            "ai_feedback": ai_feedback,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"save_question_answer error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def end_session(session_id: int, user_id: str) -> Dict[str, Any]:
    """Mark a session as completed and record ended_at timestamp."""
    try:
        result = (
            supabase.table("interview_sessions")
            .update({
                "status": "completed",
                "ended_at": datetime.now(timezone.utc).isoformat(),
            })
            .eq("id", session_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(404, "Session not found or not owned by user")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"end_session error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def get_session_with_qa(session_id: int, user_id: str) -> Dict[str, Any]:
    """
    Fetch a session row plus all associated questions and answers.
    Returns a dict: { session, questions: [ { ...question, answer: {...} } ] }
    """
    try:
        # Fetch session
        s_result = (
            supabase.table("interview_sessions")
            .select("*")
            .eq("id", session_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not s_result.data:
            raise HTTPException(404, "Interview session not found")
        session = s_result.data[0]

        # Fetch questions for this session
        q_result = (
            supabase.table("interview_questions")
            .select("*")
            .eq("session_id", session_id)
            .order("sequence_no")
            .execute()
        )
        questions_raw = q_result.data or []

        # Fetch answers for those questions
        question_ids = [q["id"] for q in questions_raw]
        answers_map: Dict[int, Dict] = {}
        if question_ids:
            a_result = (
                supabase.table("interview_answers")
                .select("*")
                .in_("question_id", question_ids)
                .execute()
            )
            for a in (a_result.data or []):
                answers_map[a["question_id"]] = a

        # Combine
        questions = []
        for q in questions_raw:
            q_copy = dict(q)
            q_copy["answer"] = answers_map.get(q["id"])
            questions.append(q_copy)

        return {"session": session, "questions": questions}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"get_session_with_qa error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def list_user_sessions(user_id: str) -> List[Dict[str, Any]]:
    """Return all sessions belonging to the user, most recent first."""
    try:
        result = (
            supabase.table("interview_sessions")
            .select("*")
            .eq("user_id", user_id)
            .order("started_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        logger.error(f"list_user_sessions error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
