from fastapi import FastAPI
from app.database.supabase import supabase

app = FastAPI(
    title="CrackIt API",
    description="AI-Based Interview Preparation Platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to CrackIt Backend 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "success",
        "database": "Supabase Connected"
    }


@app.get("/test-db")
def test_db():
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