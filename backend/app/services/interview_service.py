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
        return {
            "session": session,
            "total_questions": len(questions),
            "question": questions[0],
        }
    except HTTPException:
        try:
            supabase.table("interview_sessions").update({"status": "abandoned", "ended_at": datetime.now(timezone.utc).isoformat()}).eq("id", session["id"]).eq("user_id", user_id).execute()
        except Exception:
            logger.exception("Unable to mark failed interview session as abandoned")
        raise
    except Exception as exc:
        logger.error("start_ai_session error: %s", exc)
        try:
            supabase.table("interview_sessions").update({"status": "abandoned", "ended_at": datetime.now(timezone.utc).isoformat()}).eq("id", session["id"]).eq("user_id", user_id).execute()
        except Exception:
            logger.exception("Unable to mark failed interview session as abandoned")
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
    session = session_result.data[0]
    if session.get("status") != "in_progress":
        raise HTTPException(409, "This interview is no longer accepting answers")

    question_result = supabase.table("interview_questions").select("*").eq("id", question_id).eq("session_id", session_id).execute()
    if not question_result.data:
        raise HTTPException(404, "Interview question not found")
    question = question_result.data[0]

    existing_answer = supabase.table("interview_answers").select("id").eq("question_id", question_id).limit(1).execute()
    if existing_answer.data:
        raise HTTPException(409, "This question has already been answered")

    evaluation = gemini_service.evaluate_answer(
        question=question["question_text"],
        answer=answer_text,
        difficulty=session.get("difficulty", "Medium"),
        interview_type=session.get("interview_type", "Technical"),
        category=session.get("interview_type", "Technical"),
    )
    answer_result = supabase.table("interview_answers").insert({
        "question_id": question_id,
        "answer_type": "text",
        "answer_text": answer_text,
        "ai_score": evaluation.overall_score,
        "ai_feedback": evaluation.model_dump_json(),
    }).execute()
    if not answer_result.data:
        raise HTTPException(500, "Failed to save interview answer")

    answer = answer_result.data[0]
    all_questions = supabase.table("interview_questions").select("*").eq("session_id", session_id).order("sequence_no").execute().data or []
    answered = supabase.table("interview_answers").select("question_id").in_("question_id", [q["id"] for q in all_questions]).execute().data if all_questions else []
    answered_ids = {item["question_id"] for item in answered}
    next_question = next((item for item in all_questions if item["id"] not in answered_ids), None)

    evaluation_payload = {
        "overall_score": evaluation.overall_score,
        "rubric": evaluation.rubric.model_dump(),
        "strengths": evaluation.strengths,
        "missing_points": evaluation.missing_points,
        "incorrect_or_unclear_points": evaluation.incorrect_or_unclear_points,
        "improvement_suggestions": evaluation.improvement_suggestions,
        "improved_answer_outline": evaluation.improved_answer_outline,
        "recommended_topics": evaluation.recommended_topics,
        "feedback_summary": evaluation.feedback_summary,
    }
    return {
        "question_id": question_id,
        "answer_id": answer["id"],
        "evaluation": evaluation_payload,
        "next_question": next_question,
        "completed": next_question is None,
    }


def get_session(session_id: int, user_id: str) -> Dict[str, Any]:
    return get_session_with_qa(session_id, user_id)


def save_question_answer(
    session_id: int,
    user_id: str,
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
        # Verify ownership before inserting any question or answer rows.
        session_result = (
            supabase.table("interview_sessions")
            .select("id")
            .eq("id", session_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not session_result.data:
            raise HTTPException(404, "Interview session not found")

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


def end_session(session_id: int, user_id: str, reason: str = "completed") -> Dict[str, Any]:
    """Mark an owned in-progress session completed or abandoned."""
    try:
        if reason not in {"completed", "abandoned"}:
            raise HTTPException(422, "Invalid interview finish reason")

        session_result = (
            supabase.table("interview_sessions")
            .select("id,status")
            .eq("id", session_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not session_result.data:
            raise HTTPException(404, "Interview session not found")
        if session_result.data[0].get("status") != "in_progress":
            raise HTTPException(409, "This interview has already been finished")

        result = (
            supabase.table("interview_sessions")
            .update({
                "status": reason,
                "ended_at": datetime.now(timezone.utc).isoformat(),
            })
            .eq("id", session_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(409, "Interview could not be finished")
        total_result = supabase.table("interview_questions").select("id", count="exact").eq("session_id", session_id).execute()
        question_ids = [row["id"] for row in (supabase.table("interview_questions").select("id").eq("session_id", session_id).execute().data or [])]
        answered_result = supabase.table("interview_answers").select("id", count="exact").in_("question_id", question_ids).execute() if question_ids else None
        return {
            "session_id": session_id,
            "status": reason,
            "ended_at": result.data[0].get("ended_at"),
            "answered_questions": answered_result.count if answered_result else 0,
            "total_questions": total_result.count or 0,
            "report_status": "pending" if reason == "completed" else "not_available",
        }
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
