from fastapi import APIRouter

from app.schemas.auth import SignupRequest, LoginRequest
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(user: SignupRequest):
    return AuthService.signup(user)


@router.post("/login")
def login(user: LoginRequest):
    return AuthService.login(user)