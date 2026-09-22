from datetime import timedelta

from fastapi import HTTPException, status

from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.security import create_access_token
from app.database.supabase import supabase
from app.schemas.auth import LoginRequest, SignupRequest


class AuthService:

    @staticmethod
    def signup(user: SignupRequest) -> dict:
        """
        Register a new user via Supabase Auth.
        Returns our own JWT access token on success.
        """
        try:
            response = supabase.auth.sign_up(
                {
                    "email": user.email,
                    "password": user.password,
                    "options": {
                        "data": {
                            "full_name": user.full_name
                        }
                    }
                }
            )
        except Exception as e:
            error_msg = getattr(e, "message", str(e))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg or "Signup failed. Please try again."
            )

        auth_user = response.user

        if auth_user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Signup failed. Email may already be in use."
            )

        # Attempt to populate public.users profile row if not auto-populated by trigger
        try:
            supabase.table("users").upsert({
                "id": str(auth_user.id),
                "full_name": user.full_name,
                "email": user.email,
            }).execute()
        except Exception:
            pass

        full_name = (auth_user.user_metadata or {}).get("full_name", user.full_name)

        # Issue our own JWT
        access_token = create_access_token(
            data={
                "sub": str(auth_user.id),
                "email": auth_user.email,
                "full_name": full_name,
            },
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(auth_user.id),
                "full_name": full_name,
                "email": auth_user.email,
            },
        }

    @staticmethod
    def login(user: LoginRequest) -> dict:
        """
        Authenticate via Supabase Auth and return our own JWT.
        """
        try:
            response = supabase.auth.sign_in_with_password(
                {
                    "email": user.email,
                    "password": user.password
                }
            )
        except Exception as e:
            error_msg = getattr(e, "message", "Invalid email or password")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=error_msg,
                headers={"WWW-Authenticate": "Bearer"},
            )

        auth_user = response.user
        session = response.session

        if auth_user is None or session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        full_name = (auth_user.user_metadata or {}).get("full_name", "")

        # Issue our own JWT
        access_token = create_access_token(
            data={
                "sub": str(auth_user.id),
                "email": auth_user.email,
                "full_name": full_name,
            },
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(auth_user.id),
                "full_name": full_name,
                "email": auth_user.email,
            },
        }

    @staticmethod
    def get_me(user_id: str) -> dict:
        """
        Fetch the current user's profile from public.users table.
        Falls back to default profile data if the profile row doesn't exist yet.
        """
        try:
            result = (
                supabase
                .table("users")
                .select("id, full_name, email, target_job_role, experience_level, streak_count")
                .eq("id", user_id)
                .single()
                .execute()
            )
            if result.data:
                return result.data
        except Exception:
            pass

        return {
            "id": user_id,
            "full_name": "",
            "email": "",
            "target_job_role": None,
            "experience_level": None,
            "streak_count": 0,
        }