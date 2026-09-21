"""
Project analysis API endpoints.

POST /projects/analyze  — analyze a project with Gemini
GET  /projects          — list user's projects
GET  /projects/{id}     — get project with analysis
"""
import json
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.projects import ProjectAnalyzeRequest, ProjectAnalysisResponse, ProjectSummary
from app.services.gemini_service import gemini_service
from app.services.ai_logging import log_ai_call

router = APIRouter(prefix="/projects", tags=["Projects"])
logger = logging.getLogger(__name__)


@router.post("/analyze", response_model=ProjectAnalysisResponse)
async def analyze_project(
    body: ProjectAnalyzeRequest,
    current_user: dict = Depends(get_current_user),
):
    """Analyze a project using Gemini AI."""
    user_id = current_user["sub"]

    project_info = {
        "project_name": body.project_name,
        "description": body.description,
        "technologies": body.technologies,
        "github_url": body.github_url,
        "live_url": body.live_url,
        "role": body.role,
        "features": body.features,
        "challenges": body.challenges,
    }

    # Call Gemini
    try:
        ai_result = gemini_service.analyze_project(project_info)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Project analysis error: {e}")
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")

    # Log AI call
    log_ai_call(user_id=user_id, feature_name="project_analysis")

    # Persist project + analysis
    project_id = None
    analysis_id = None
    try:
        # Insert project
        project_record = {
            "user_id": user_id,
            "project_title": body.project_name,
            "description": body.description,
            "github_url": body.github_url,
            "live_url": body.live_url,
        }
        p_res = supabase.table("projects").insert(project_record).execute()
        if p_res.data:
            project_id = p_res.data[0]["id"]

            # Upsert technologies
            for tech_name in body.technologies:
                try:
                    t_res = (
                        supabase.table("technologies")
                        .upsert({"technology_name": tech_name.strip()[:100]}, on_conflict="technology_name")
                        .execute()
                    )
                    if t_res.data:
                        tech_id = t_res.data[0]["id"]
                        supabase.table("project_technologies").insert({
                            "project_id": project_id,
                            "technology_id": tech_id,
                        }).execute()
                except Exception as te:
                    logger.debug(f"Tech upsert minor error: {te}")

            # Insert analysis
            analysis_record = {
                "project_id": project_id,
                "ai_score": ai_result.overall_score,
                "strengths": json.dumps(ai_result.strengths),
                "weaknesses": json.dumps(ai_result.weaknesses),
                "suggestions": json.dumps({
                    "technical_quality": ai_result.technical_quality,
                    "complexity_score": ai_result.complexity_score,
                    "resume_value": ai_result.resume_value,
                    "summary": ai_result.summary,
                    "missing_features": ai_result.missing_features,
                    "interview_questions": ai_result.interview_questions,
                    "suggested_improvements": ai_result.suggested_improvements,
                }),
            }
            a_res = supabase.table("project_analysis").insert(analysis_record).execute()
            if a_res.data:
                analysis_id = a_res.data[0]["id"]
    except Exception as e:
        logger.warning(f"Project persistence failed: {e}")

    return ProjectAnalysisResponse(
        id=analysis_id,
        project_id=project_id,
        overall_score=ai_result.overall_score,
        technical_quality=ai_result.technical_quality,
        complexity_score=ai_result.complexity_score,
        resume_value=ai_result.resume_value,
        summary=ai_result.summary,
        strengths=ai_result.strengths,
        weaknesses=ai_result.weaknesses,
        missing_features=ai_result.missing_features,
        interview_questions=ai_result.interview_questions,
        suggested_improvements=ai_result.suggested_improvements,
        persisted=project_id is not None,
    )


@router.get("", response_model=List[ProjectSummary])
async def list_projects(current_user: dict = Depends(get_current_user)):
    """List all projects for the current user."""
    user_id = current_user["sub"]
    try:
        res = (
            supabase.table("projects")
            .select("id, project_title, description, github_url, created_at, project_analysis(ai_score, strengths, weaknesses, suggestions)")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        results = []
        for p in res.data or []:
            analysis = None
            if p.get("project_analysis"):
                pa = p["project_analysis"]
                analysis = {"ai_score": pa.get("ai_score")}
                try:
                    suggestions = json.loads(pa.get("suggestions") or "{}")
                    analysis.update(suggestions)
                except Exception:
                    pass
            results.append(ProjectSummary(
                id=p["id"],
                project_title=p["project_title"],
                description=p.get("description"),
                github_url=p.get("github_url"),
                created_at=p.get("created_at"),
                analysis=analysis,
            ))
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}")
async def get_project(project_id: int, current_user: dict = Depends(get_current_user)):
    """Get a specific project with its analysis."""
    user_id = current_user["sub"]
    try:
        res = (
            supabase.table("projects")
            .select("*, project_analysis(*)")
            .eq("id", project_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="Project not found")

        project = res.data[0]
        analysis = project.pop("project_analysis", None)
        if analysis:
            try:
                analysis["strengths"] = json.loads(analysis.get("strengths") or "[]")
                analysis["weaknesses"] = json.loads(analysis.get("weaknesses") or "[]")
                suggestions = json.loads(analysis.get("suggestions") or "{}")
                analysis.update(suggestions)
            except Exception:
                pass
        project["analysis"] = analysis
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
