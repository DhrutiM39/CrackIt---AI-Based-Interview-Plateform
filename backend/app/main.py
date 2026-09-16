from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.database.supabase import supabase

app = FastAPI(
    title="CrackIt API",
    description="AI-Based Interview Preparation Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(resume_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to CrackIt Backend 🚀"
    }


@app.get("/health")
def health():

    try:
        response = (
            supabase
            .table("subjects")
            .select("*")
            .limit(5)
            .execute()
        )

        return {
            "status": "success",
            "message": "Supabase connection successful",
            "count": len(response.data),
            "data": response.data
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }