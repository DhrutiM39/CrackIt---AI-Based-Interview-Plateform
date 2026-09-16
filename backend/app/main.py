from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.subjects import router as subjects_router
from app.api.domains import router as domains_router
from app.api.ai_prep import router as ai_prep_router
from app.core.config import FRONTEND_URL

app = FastAPI(
    title="CrackIt API",
    description="AI-Based Interview Preparation Platform",
    version="1.0.0",
)

# ─── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(subjects_router)
app.include_router(domains_router)
app.include_router(ai_prep_router)


@app.get("/", tags=["Root"])
def root():
    return {"message": "Welcome to CrackIt API 🚀"}


@app.get("/health", tags=["Health"])
def health():
    """Quick connectivity check — does not hit the database."""
    return {"status": "ok", "service": "CrackIt API"}