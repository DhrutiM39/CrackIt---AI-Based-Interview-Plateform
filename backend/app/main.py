from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.database.supabase import supabase

app = FastAPI(
    title="CrackIt API",
    description="AI-Based Interview Preparation Platform",
    version="1.0.0"
)


app.include_router(auth_router)


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