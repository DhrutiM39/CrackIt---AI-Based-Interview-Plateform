import os
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or SUPABASE_ANON_KEY

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY")
if not SECRET_KEY:
	if ENVIRONMENT in {"production", "staging"}:
		raise RuntimeError("JWT_SECRET or SECRET_KEY must be configured outside development")
	SECRET_KEY = "change-this-secret-key-in-development-only"
if ENVIRONMENT in {"production", "staging"} and SECRET_KEY == "change-this-secret-key-in-development-only":
	raise RuntimeError("A unique JWT secret is required outside development")
ALGORITHM = os.getenv("JWT_ALGORITHM") or os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days

# CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
