"""
LinkedIn analysis API endpoints.

POST /linkedin/analyze     — analyze profile text with Gemini
GET  /linkedin/analyses    — list user's analyses
GET  /linkedin/analyses/{id} — get full analysis
"""
import json
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.linkedin import (
    LinkedInAnalyzeRequest,
    LinkedInAnalysisResponse,
    LinkedInAnalysisSummary,
)
from app.services.gemini_service import gemini_service
from app.services.ai_logging import log_ai_call

router = APIRouter(prefix="/linkedin", tags=["LinkedIn"])
logger = logging.getLogger(__name__)


@router.post("/analyze", response_model=LinkedInAnalysisResponse)
async def analyze_linkedin(
    body: LinkedInAnalyzeRequest,
    current_user: dict = Depends(get_current_user),
):
    """Analyze a LinkedIn profile using Gemini AI."""
    user_id = current_user["sub"]

    # Build profile data dict from the request
    profile_data = {}
    if body.headline:
        profile_data["headline"] = body.headline
    if body.about:
        profile_data["about"] = body.about
    if body.experience:
        profile_data["experience"] = body.experience
    if body.skills:
        profile_data["skills"] = body.skills
    if body.education:
        profile_data["education"] = body.education
    if body.projects:
        profile_data["projects"] = body.projects
    if body.certifications:
        profile_data["certifications"] = body.certifications
    if body.profile_text:
        profile_data["raw_profile_text"] = body.profile_text

    if not profile_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide at least one profile section to analyze.",
        )

    # Call Gemini
    try:
        ai_result = gemini_service.analyze_linkedin(profile_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"LinkedIn analysis error: {e}")
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")

    # Log AI call
    log_ai_call(user_id=user_id, feature_name="linkedin_analysis")

    # Persist to database
    analysis_id = None
    try:
        ai_suggestions = json.dumps({
            "profile_score": ai_result.profile_score,
            "headline_score": ai_result.headline_score,
            "about_score": ai_result.about_score,
            "experience_score": ai_result.experience_score,
            "skills_score": ai_result.skills_score,
            "education_score": ai_result.education_score,
            "summary": ai_result.summary,
            "strengths": ai_result.strengths,
            "weaknesses": ai_result.weaknesses,
            "missing_sections": ai_result.missing_sections,
            "keyword_suggestions": ai_result.keyword_suggestions,
            "improvement_suggestions": ai_result.improvement_suggestions,
        })

        record = {
            "user_id": user_id,
            "linkedin_url": body.linkedin_url or "submitted_via_form",
            "profile_data": json.dumps(profile_data),
            "analysis_score": ai_result.profile_score,
            "ai_suggestions": ai_suggestions,
        }
        res = supabase.table("linkedin_analysis").insert(record).execute()
        if res.data:
            analysis_id = res.data[0]["id"]
    except Exception as e:
        logger.warning(f"LinkedIn analysis persistence failed: {e}")

    return LinkedInAnalysisResponse(
        id=analysis_id,
        profile_score=ai_result.profile_score,
        headline_score=ai_result.headline_score,
        about_score=ai_result.about_score,
        experience_score=ai_result.experience_score,
        skills_score=ai_result.skills_score,
        education_score=ai_result.education_score,
        summary=ai_result.summary,
        strengths=ai_result.strengths,
        weaknesses=ai_result.weaknesses,
        missing_sections=ai_result.missing_sections,
        keyword_suggestions=ai_result.keyword_suggestions,
        improvement_suggestions=ai_result.improvement_suggestions,
        persisted=analysis_id is not None,
    )


@router.get("/analyses", response_model=List[LinkedInAnalysisSummary])
async def get_linkedin_analyses(current_user: dict = Depends(get_current_user)):
    """List all LinkedIn analyses for the current user."""
    user_id = current_user["sub"]
    try:
        res = (
            supabase.table("linkedin_analysis")
            .select("id, linkedin_url, analysis_score, analyzed_at")
            .eq("user_id", user_id)
            .order("analyzed_at", desc=True)
            .execute()
        )
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyses/{analysis_id}")
async def get_linkedin_analysis(
    analysis_id: int,
    current_user: dict = Depends(get_current_user),
):
    """Get a specific LinkedIn analysis."""
    user_id = current_user["sub"]
    try:
        res = (
            supabase.table("linkedin_analysis")
            .select("*")
            .eq("id", analysis_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="Analysis not found")

        row = res.data[0]
        # Parse the stored JSON suggestions back
        suggestions = {}
        try:
            suggestions = json.loads(row.get("ai_suggestions") or "{}")
        except Exception:
            pass

        return {
            "id": row["id"],
            "linkedin_url": row.get("linkedin_url"),
            "analysis_score": row.get("analysis_score"),
            "analyzed_at": row.get("analyzed_at"),
            **suggestions,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
