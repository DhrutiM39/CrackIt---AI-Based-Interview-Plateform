import io
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile, status
from pypdf import PdfReader

from app.core.security import get_current_user
from app.database.supabase import supabase
from app.schemas.resume import ResumeAnalysisResponse
from app.services.resume_service import analyze_with_gemini, process_resume_upload

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


def get_optional_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Extract user_id from Supabase JWT bearer token if present."""
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split("Bearer ")[1].strip()
    try:
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            return user_response.user.id
    except Exception:
        pass
    return None


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
    user_id: Optional[str] = Depends(get_optional_user_id)
):
    """
    Upload any .pdf or .docx resume for ATS scoring and deep Gemini AI evaluation.
    Supports optional authenticated session for saving to database profile.
    """
    result = await process_resume_upload(
        file=file,
        user_id=user_id,
        target_role=target_role
    )
    return result


@router.post("/sample", response_model=ResumeAnalysisResponse)
def analyze_sample_resume(
    target_role: Optional[str] = Form("Full Stack Developer")
):
    """
    Instantly analyze a comprehensive sample software engineer resume using Gemini AI.
    """
    sample_text = """
    ALEXANDER CHEN
    San Francisco, CA • alex.chen@example.com • linkedin.com/in/alexchen-dev • github.com/alexchen

    SUMMARY
    Full Stack Software Engineer with 3+ years of experience building high-scale distributed web applications.
    Specialized in React, TypeScript, Node.js, Python, PostgreSQL, and cloud deployments on AWS. Passionate about system design and automated CI/CD.

    TECHNICAL SKILLS
    • Languages: TypeScript, JavaScript, Python, SQL, Go (Basic)
    • Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, HTML5/CSS3
    • Backend: Node.js, Express, FastAPI, Django, REST APIs, GraphQL
    • Databases: PostgreSQL, MongoDB, Redis, Supabase
    • DevOps & Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes, GitHub Actions, CI/CD

    WORK EXPERIENCE
    Software Engineer | Nexus Cloud Systems | June 2023 - Present
    • Engineered real-time collaborative workspace using React, TypeScript, and WebSockets, serving 120,000+ daily active users.
    • Architected microservices with FastAPI and PostgreSQL, reducing API endpoint p99 response times from 450ms to 110ms.
    • Automated CI/CD pipelines via GitHub Actions and Docker, reducing production deployment failure rates by 40%.
    • Implemented Redis caching tier for frequent queries, decreasing primary database CPU utilization by 35%.

    Junior Full Stack Developer | BrightPath Digital | Aug 2021 - May 2023
    • Developed 15+ responsive web features using Next.js and Tailwind CSS, increasing mobile user retention by 22%.
    • Integrated Stripe payment gateway and webhook reconciliation processing over $1.5M in quarterly transactions.
    • Authored unit and integration test suites using Jest and React Testing Library, achieving 88% overall code coverage.

    PROJECTS
    AI-Powered Code Assistant (Open Source) | github.com/alexchen/ai-code-assist
    • Built a VS Code extension and FastAPI backend using LLMs to automatically generate docstrings and unit tests.
    • Gathered 1,400+ GitHub stars and 20,000+ downloads on the VS Code marketplace.

    EDUCATION
    Bachelor of Science in Computer Science
    University of California, Berkeley | 2017 - 2021
    """
    analysis = analyze_with_gemini(sample_text, target_role)
    return {
        "success": True,
        "resume_id": None,
        "ats_score": analysis.get("ats_score"),
        "overall_score": analysis.get("overall_score"),
        "ai_feedback": analysis.get("summary_feedback"),
        "full_analysis": analysis,
        "persisted": False,
        "message": "Sample resume evaluated by Gemini AI"
    }


@router.get("/analyses")
async def get_resume_analyses(current_user: dict = Depends(get_current_user)):
    try:
        response = supabase.table("resume_analysis") \
            .select("id, created_at, ats_score, overall_score, target_role") \
            .eq("user_id", current_user["sub"]) \
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
            .eq("user_id", current_user["sub"]) \
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Analysis not found")

        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
