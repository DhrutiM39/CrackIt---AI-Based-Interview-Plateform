from fastapi import APIRouter, Depends, status

from app.core.security import get_current_user
from app.schemas.auth import LoginRequest, MeResponse, SignupRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
def signup(user: SignupRequest):
    return AuthService.signup(user)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive an access token",
)
def login(user: LoginRequest):
    return AuthService.login(user)


@router.get(
    "/me",
    response_model=MeResponse,
    summary="Get the currently authenticated user's profile",
)
def get_me(current_user: dict = Depends(get_current_user)):
    """Protected route — requires valid JWT in Authorization header."""
    user_id: str = current_user["sub"]
    return AuthService.get_me(user_id)