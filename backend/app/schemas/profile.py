from pydantic import BaseModel, EmailStr
from typing import Optional


class ProfileResponse(BaseModel):
    id: str
    full_name: str
    email: str
    profile_photo: Optional[str] = None
    target_job_role: Optional[str] = None
    experience_level: Optional[str] = None
    streak_count: int = 0
    created_at: Optional[str] = None


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    target_job_role: Optional[str] = None
    experience_level: Optional[str] = None
    profile_photo: Optional[str] = None
