"""
Roadmap API endpoints.

POST /roadmap/generate — generate personalized roadmap using Gemini
GET  /roadmap          — list user's roadmaps
GET  /roadmap/{id}     — get roadmap with milestones
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.roadmap import RoadmapGenerateRequest, RoadmapResponse, RoadmapSummary, RoadmapMilestoneResponse
from app.services.gemini_service import gemini_service
from app.services.ai_logging import log_ai_call

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])
logger = logging.getLogger(__name__)


@router.post("/generate", response_model=RoadmapResponse)
async def generate_roadmap(
    body: RoadmapGenerateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Generate a personalized learning roadmap using Gemini AI."""
    user_id = current_user["sub"]

    # Call Gemini
    try:
        ai_result = gemini_service.generate_roadmap(
            target_role=body.target_role,
            current_skills=body.current_skills,
            skill_gaps=body.skill_gaps,
            experience_level=body.experience_level,
            duration_months=body.duration_months,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Roadmap generation error: {e}")
        raise HTTPException(status_code=502, detail=f"AI generation failed: {str(e)}")

    # Log AI call
    log_ai_call(user_id=user_id, feature_name="generate_roadmap")

    # Persist roadmap and milestones
    roadmap_id = None
    milestones_response = []
    
    try:
        # Insert roadmap
        roadmap_record = {
            "user_id": user_id,
            "roadmap_title": ai_result.roadmap_title,
        }
        r_res = supabase.table("roadmaps").insert(roadmap_record).execute()
        if r_res.data:
            roadmap_id = r_res.data[0]["id"]
            created_at = r_res.data[0]["created_at"]

            # Insert milestones
            for phase in ai_result.phases:
                ms_desc = f"{phase.description}\n\nTopics: {', '.join(phase.topics)}\n\nResources: {', '.join(phase.resources)}"
                ms_record = {
                    "roadmap_id": roadmap_id,
                    "title": f"Phase {phase.phase_number}: {phase.title}",
                    "description": ms_desc,
                    "status": "pending",
                    "progress_percentage": 0,
                }
                ms_res = supabase.table("roadmap_milestones").insert(ms_record).execute()
                if ms_res.data:
                    ms_data = ms_res.data[0]
                    milestones_response.append(
                        RoadmapMilestoneResponse(
                            id=ms_data["id"],
                            title=ms_data["title"],
                            description=ms_data["description"],
                            status=ms_data["status"],
                            due_date=ms_data.get("due_date"),
                            progress_percentage=ms_data.get("progress_percentage"),
                        )
                    )
    except Exception as e:
        logger.warning(f"Roadmap persistence failed: {e}")

    return RoadmapResponse(
        id=roadmap_id,
        roadmap_title=ai_result.roadmap_title,
        summary=ai_result.summary,
        total_duration_weeks=ai_result.total_duration_weeks,
        milestones=milestones_response,
        created_at=created_at if roadmap_id else None
    )


@router.get("", response_model=List[RoadmapSummary])
async def list_roadmaps(current_user: dict = Depends(get_current_user)):
    """List all roadmaps for the current user."""
    user_id = current_user["sub"]
    try:
        # Get roadmaps
        res = (
            supabase.table("roadmaps")
            .select("id, roadmap_title, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        
        results = []
        for r in res.data or []:
            # Get milestone counts for this roadmap
            ms_res = (
                supabase.table("roadmap_milestones")
                .select("id, status")
                .eq("roadmap_id", r["id"])
                .execute()
            )
            
            milestones = ms_res.data or []
            total = len(milestones)
            completed = sum(1 for m in milestones if m.get("status") == "completed")
            
            results.append(RoadmapSummary(
                id=r["id"],
                roadmap_title=r.get("roadmap_title"),
                created_at=r.get("created_at"),
                milestone_count=total,
                completed_count=completed,
            ))
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{roadmap_id}", response_model=RoadmapResponse)
async def get_roadmap(roadmap_id: int, current_user: dict = Depends(get_current_user)):
    """Get a specific roadmap with its milestones."""
    user_id = current_user["sub"]
    try:
        # Get roadmap
        res = (
            supabase.table("roadmaps")
            .select("*")
            .eq("id", roadmap_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        roadmap = res.data[0]
        
        # Get milestones
        ms_res = (
            supabase.table("roadmap_milestones")
            .select("*")
            .eq("roadmap_id", roadmap_id)
            .order("id", desc=False)
            .execute()
        )
        
        milestones = []
        for ms in ms_res.data or []:
            milestones.append(RoadmapMilestoneResponse(
                id=ms["id"],
                title=ms["title"],
                description=ms.get("description"),
                status=ms.get("status"),
                due_date=ms.get("due_date"),
                progress_percentage=ms.get("progress_percentage"),
            ))
            
        return RoadmapResponse(
            id=roadmap["id"],
            roadmap_title=roadmap.get("roadmap_title"),
            created_at=roadmap.get("created_at"),
            milestones=milestones,
            # We don't store summary and total_duration_weeks directly in DB right now
            # but they were returned on generation.
            summary=f"Personalized learning roadmap: {roadmap.get('roadmap_title')}",
            total_duration_weeks=len(milestones) * 2  # rough estimate if not stored
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
