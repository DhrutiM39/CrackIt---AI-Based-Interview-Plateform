import io
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from pypdf import PdfReader

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.services.gemini_service import gemini_service
from app.schemas.resume import ResumeAnalysisResult

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

@router.post("/analyze", response_model=ResumeAnalysisResult)
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form(None),
    current_user: dict = Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        # Read the file content
        content = await file.read()
        
        # Check size (5MB limit)
        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
            
        # Extract text from PDF
        pdf_file = io.BytesIO(content)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF. The file might be scanned or empty.")
            
        # Call Gemini AI
        analysis_result = gemini_service.analyze_resume(text, target_role)
        
        # Save to database
        try:
            db_data = {
                "user_id": current_user["id"],
                "ats_score": analysis_result.ats_score,
                "overall_score": analysis_result.overall_score,
                "target_role": target_role,
                "analysis_data": analysis_result.model_dump()
            }
            # Wait, the table might have different columns. Assuming analysis_data (JSONB) handles the complex object.
            # If the user hasn't created the table, this might fail, but it's part of the instructions.
            response = supabase.table("resume_analysis").insert(db_data).execute()
        except Exception as e:
            # We don't want to fail the whole request if DB insert fails, just log it.
            print(f"Warning: Failed to save to database: {e}")
            
        return analysis_result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during resume analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the resume: {str(e)}"
        )

@router.get("/analyses")
async def get_resume_analyses(current_user: dict = Depends(get_current_user)):
    try:
        response = supabase.table("resume_analysis") \
            .select("id, created_at, ats_score, overall_score, target_role") \
            .eq("user_id", current_user["id"]) \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analyses/{analysis_id}")
async def get_resume_analysis(analysis_id: str, current_user: dict = Depends(get_current_user)):
    try:
        response = supabase.table("resume_analysis") \
            .select("*") \
            .eq("id", analysis_id) \
            .eq("user_id", current_user["id"]) \
            .execute()
            
        if not response.data:
            raise HTTPException(status_code=404, detail="Analysis not found")
            
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
