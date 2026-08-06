from app.database.supabase import supabase
from app.schemas.auth import SignupRequest, LoginRequest


class AuthService:

    @staticmethod
    def signup(user: SignupRequest):
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

        auth_user = response.user

        if auth_user is None:
            return {
                "success": False,
                "message": "Signup failed"
            }

        return {
            "success": True,
            "message": "User registered successfully",
            "user": {
                "id": auth_user.id,
                "full_name": auth_user.user_metadata.get("full_name", ""),
                "email": auth_user.email
            }
        }

    @staticmethod
    def login(user: LoginRequest):
        response = supabase.auth.sign_in_with_password(
            {
                "email": user.email,
                "password": user.password
            }
        )

        auth_user = response.user
        session = response.session

        if auth_user is None or session is None:
            return {
                "success": False,
                "message": "Invalid email or password"
            }

        return {
            "success": True,
            "message": "Login successful",
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "user": {
                "id": auth_user.id,
                "full_name": auth_user.user_metadata.get("full_name", ""),
                "email": auth_user.email
            }
        }