from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.interviews import router as interviews_router, ai_router
from app.api.reports import router as reports_router
from app.api.dashboard import router as dashboard_router
from app.api.subjects import router as subjects_router
from app.api.domains import router as domains_router
from app.api.ai_prep import router as ai_prep_router
from app.api.linkedin import router as linkedin_router
from app.api.projects import router as projects_router
from app.api.notifications import router as notifications_router
from app.api.profile import router as profile_router
from app.api.settings import router as settings_router
from app.api.roadmap import router as roadmap_router
from app.core.config import FRONTEND_URL
from app.database.supabase import supabase

app = FastAPI(
    title="CrackIt API",
    description="AI-Based Interview Preparation Platform",
    version="1.0.0",
)

# ─── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys([
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ])),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───────────────────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(interviews_router)
app.include_router(ai_router)
app.include_router(reports_router)
app.include_router(dashboard_router)
app.include_router(subjects_router)
app.include_router(domains_router)
app.include_router(ai_prep_router)
app.include_router(linkedin_router)
app.include_router(projects_router)
app.include_router(notifications_router)
app.include_router(profile_router)
app.include_router(settings_router)
app.include_router(roadmap_router)


@app.get("/", tags=["Root"])
def root():
    return {"message": "Welcome to CrackIt API 🚀"}


@app.get("/health", tags=["Health"])
def health():
    """Quick connectivity check."""
    return {"status": "ok", "service": "CrackIt API"}