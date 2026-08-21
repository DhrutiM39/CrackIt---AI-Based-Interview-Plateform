from fastapi import APIRouter, Depends, File, UploadFile

from app.core.security import get_current_user
from app.schemas.resume import ResumeAnalysisResponse
from app.services.resume_service import process_resume

router = APIRouter(prefix="/resume", tags=["Resume Analyzer"])


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(..., description="A PDF or DOCX resume, up to 5 MB."),
    user=Depends(get_current_user),
):
    return await process_resume(file, user.id)
