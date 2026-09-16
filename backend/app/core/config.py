import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key-in-production-32chars")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days

# CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")