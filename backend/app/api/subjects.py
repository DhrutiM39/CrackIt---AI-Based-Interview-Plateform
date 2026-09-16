from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import logging

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.prep import (
    SubjectResponse, SubjectDetailResponse, QuestionResponse, 
    SubmitAnswerRequest, SubmitAnswerResponse, SubjectProgress
)

router = APIRouter(prefix="/subjects", tags=["Subjects"])
logger = logging.getLogger(__name__)

@router.get("", response_model=List[SubjectResponse])
async def get_subjects(current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        
        # 1. Fetch all subjects
        subjects_res = supabase.table("subjects").select("*").execute()
        subjects = subjects_res.data
        
        if not subjects:
            return []
            
        # 2. Fetch all user progress for subjects
        progress_res = supabase.table("user_subject_progress").select("*").eq("user_id", user_id).execute()
        progress_dict = {p["subject_id"]: p for p in progress_res.data}
        
        # 3. Compile the response
        result = []
        for s in subjects:
            sid = s["id"]
            p = progress_dict.get(sid, {})
            result.append(SubjectResponse(
                id=sid,
                subject_name=s["subject_name"],
                icon=s.get("icon"),
                difficulty=s.get("difficulty"),
                tags=s.get("tags", []),
                progress=float(p.get("completion_percentage", 0.0)),
                total_topics=p.get("total_questions", 0), # using total_questions to track topic/questions count
                done_topics=p.get("completed_questions", 0),
                streak=p.get("streak", 0)
            ))
            
        return result
    except Exception as e:
        logger.error(f"Error fetching subjects: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{subject_id}", response_model=SubjectDetailResponse)
async def get_subject_detail(subject_id: int, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        
        # Fetch subject
        subject_res = supabase.table("subjects").select("*").eq("id", subject_id).execute()
        if not subject_res.data:
            raise HTTPException(status_code=404, detail="Subject not found")
        subject = subject_res.data[0]
        
        # Fetch progress
        progress_res = supabase.table("user_subject_progress").select("*").eq("user_id", user_id).eq("subject_id", subject_id).execute()
        p = progress_res.data[0] if progress_res.data else {}
        
        # Fetch topics
        topics_res = supabase.table("topics").select("*").eq("subject_id", subject_id).execute()
        topics = topics_res.data
        
        # We would typically need to fetch completed status per topic based on user_question_progress,
        # but for simplicity we'll just mock the topic completion state or calculate it simply
        topics_with_status = []
        for t in topics:
            topics_with_status.append({
                "id": t["id"],
                "name": t["topic_name"],
                "done": False, # simplified
                "q": 0,
                "current": False
            })
            
        return SubjectDetailResponse(
            id=subject["id"],
            subject_name=subject["subject_name"],
            icon=subject.get("icon"),
            difficulty=subject.get("difficulty"),
            tags=subject.get("tags", []),
            progress=float(p.get("completion_percentage", 0.0)),
            total_topics=p.get("total_questions", 0),
            done_topics=p.get("completed_questions", 0),
            streak=p.get("streak", 0),
            topics=topics_with_status
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching subject detail: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{subject_id}/questions", response_model=List[QuestionResponse])
async def get_subject_questions(subject_id: int, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        
        # 1. Get all topics for this subject
        topics_res = supabase.table("topics").select("id").eq("subject_id", subject_id).execute()
        if not topics_res.data:
            return []
            
        topic_ids = [t["id"] for t in topics_res.data]
        
        # 2. Get questions for these topics
        questions_res = supabase.table("questions").select("*").in_("topic_id", topic_ids).execute()
        questions = questions_res.data
        
        if not questions:
            return []
            
        question_ids = [q["id"] for q in questions]
        
        # 3. Get user progress on these questions
        progress_res = supabase.table("user_question_progress").select("*").eq("user_id", user_id).in_("question_id", question_ids).execute()
        progress_dict = {p["question_id"]: p for p in progress_res.data}
        
        result = []
        for q in questions:
            qid = q["id"]
            p = progress_dict.get(qid, {})
            result.append(QuestionResponse(
                id=qid,
                question=q["question"],
                difficulty=q.get("difficulty"),
                topic_id=q["topic_id"],
                completed=p.get("completed", False),
                score=p.get("score")
            ))
            
        return result
    except Exception as e:
        logger.error(f"Error fetching questions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/questions/{question_id}/answer", response_model=SubmitAnswerResponse)
async def submit_question_answer(question_id: int, payload: SubmitAnswerRequest, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        
        # 1. Verify question exists and get answer
        q_res = supabase.table("questions").select("answer").eq("id", question_id).execute()
        if not q_res.data:
            raise HTTPException(status_code=404, detail="Question not found")
        
        # In a real scenario, we might use AI to evaluate the answer. 
        # For this prototype, we'll assume they completed it.
        is_correct = len(payload.answer.strip()) > 10
        score = 100.0 if is_correct else 50.0
        
        # 2. Upsert user_question_progress
        progress_data = {
            "user_id": user_id,
            "question_id": question_id,
            "completed": is_correct,
            "score": score,
            "solved_at": "now()"
        }
        
        # Check if exists first
        existing_res = supabase.table("user_question_progress").select("id").eq("user_id", user_id).eq("question_id", question_id).execute()
        if existing_res.data:
            supabase.table("user_question_progress").update(progress_data).eq("id", existing_res.data[0]["id"]).execute()
        else:
            supabase.table("user_question_progress").insert(progress_data).execute()
            
        return SubmitAnswerResponse(
            is_correct=is_correct,
            score=score,
            feedback="Great job!" if is_correct else "Your answer needs more detail."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting answer: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
