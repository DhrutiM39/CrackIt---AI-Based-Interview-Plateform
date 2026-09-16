from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import logging

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.prep import (
    DomainResponse, DomainDetailResponse, QuestionResponse, 
    SubmitAnswerRequest, SubmitAnswerResponse
)

router = APIRouter(prefix="/domains", tags=["Domains"])
logger = logging.getLogger(__name__)

@router.get("", response_model=List[DomainResponse])
async def get_domains(current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        
        # 1. Fetch all domains
        domains_res = supabase.table("domains").select("*").execute()
        domains = domains_res.data
        
        if not domains:
            return []
            
        # 2. Fetch all user progress for domains
        progress_res = supabase.table("user_domain_progress").select("*").eq("user_id", user_id).execute()
        progress_dict = {p["domain_id"]: p for p in progress_res.data}
        
        # 3. Compile the response
        result = []
        for d in domains:
            did = d["id"]
            p = progress_dict.get(did, {})
            result.append(DomainResponse(
                id=did,
                domain_name=d["domain_name"],
                icon=d.get("icon"),
                progress=float(p.get("completion_percentage", 0.0)),
                total_topics=p.get("total_questions", 0), 
                done_topics=p.get("completed_questions", 0),
                streak=p.get("streak", 0)
            ))
            
        return result
    except Exception as e:
        logger.error(f"Error fetching domains: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{domain_id}", response_model=DomainDetailResponse)
async def get_domain_detail(domain_id: int, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        
        # Fetch domain
        domain_res = supabase.table("domains").select("*").eq("id", domain_id).execute()
        if not domain_res.data:
            raise HTTPException(status_code=404, detail="Domain not found")
        domain = domain_res.data[0]
        
        # Fetch progress
        progress_res = supabase.table("user_domain_progress").select("*").eq("user_id", user_id).eq("domain_id", domain_id).execute()
        p = progress_res.data[0] if progress_res.data else {}
        
        # Fetch topics
        topics_res = supabase.table("domain_topics").select("*").eq("domain_id", domain_id).execute()
        topics = topics_res.data
        
        topics_with_status = []
        for t in topics:
            topics_with_status.append({
                "id": t["id"],
                "name": t["topic_name"],
                "done": False, 
                "q": 0,
                "current": False
            })
            
        return DomainDetailResponse(
            id=domain["id"],
            domain_name=domain["domain_name"],
            icon=domain.get("icon"),
            progress=float(p.get("completion_percentage", 0.0)),
            total_topics=p.get("total_questions", 0),
            done_topics=p.get("completed_questions", 0),
            streak=p.get("streak", 0),
            topics=topics_with_status
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching domain detail: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{domain_id}/questions", response_model=List[QuestionResponse])
async def get_domain_questions(domain_id: int, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        
        topics_res = supabase.table("domain_topics").select("id").eq("domain_id", domain_id).execute()
        if not topics_res.data:
            return []
            
        topic_ids = [t["id"] for t in topics_res.data]
        
        questions_res = supabase.table("domain_questions").select("*").in_("topic_id", topic_ids).execute()
        questions = questions_res.data
        
        if not questions:
            return []
            
        question_ids = [q["id"] for q in questions]
        
        progress_res = supabase.table("user_domain_question_progress").select("*").eq("user_id", user_id).in_("question_id", question_ids).execute()
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
        logger.error(f"Error fetching domain questions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/questions/{question_id}/answer", response_model=SubmitAnswerResponse)
async def submit_domain_question_answer(question_id: int, payload: SubmitAnswerRequest, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        
        q_res = supabase.table("domain_questions").select("answer").eq("id", question_id).execute()
        if not q_res.data:
            raise HTTPException(status_code=404, detail="Question not found")
        
        is_correct = len(payload.answer.strip()) > 10
        score = 100.0 if is_correct else 50.0
        
        progress_data = {
            "user_id": user_id,
            "question_id": question_id,
            "completed": is_correct,
            "score": score,
            "solved_at": "now()"
        }
        
        existing_res = supabase.table("user_domain_question_progress").select("id").eq("user_id", user_id).eq("question_id", question_id).execute()
        if existing_res.data:
            supabase.table("user_domain_question_progress").update(progress_data).eq("id", existing_res.data[0]["id"]).execute()
        else:
            supabase.table("user_domain_question_progress").insert(progress_data).execute()
            
        return SubmitAnswerResponse(
            is_correct=is_correct,
            score=score,
            feedback="Great job!" if is_correct else "Your answer needs more detail."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting domain answer: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
