from fastapi import APIRouter, Depends, HTTPException, status
import logging

from app.core.security import get_current_user
from app.services.gemini_service import gemini_service
from app.schemas.prep import GenerateQuestionsRequest, GeneratedQuestionList

router = APIRouter(prefix="/questions", tags=["AI Generation"])
logger = logging.getLogger(__name__)

@router.post("/generate", response_model=GeneratedQuestionList)
async def generate_questions(payload: GenerateQuestionsRequest, current_user: dict = Depends(get_current_user)):
    try:
        # In a full implementation, you could look up resume_analysis_id to append resume context
        
        result = gemini_service.generate_questions(
            job_role=payload.job_role,
            domain=payload.domain,
            skills=payload.skills,
            difficulty=payload.difficulty,
            number_of_questions=payload.number_of_questions,
            category=payload.category
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in /generate endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
