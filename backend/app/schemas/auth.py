from pydantic import BaseModel, EmailStr
from typing import Optional


class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MeResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    target_job_role: Optional[str] = None
    experience_level: Optional[str] = None
    streak_count: int = 0