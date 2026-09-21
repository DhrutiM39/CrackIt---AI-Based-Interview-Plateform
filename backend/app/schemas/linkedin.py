from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class LinkedInAnalyzeRequest(BaseModel):
    profile_text: str
    linkedin_url: Optional[str] = None

class LinkedInSection(BaseModel):
    name: str
    score: int
    tips: List[str]

class LinkedInAnalyzeResponse(BaseModel):
    id: int
    user_id: str
    linkedin_url: str
    analysis_score: float
    sections: List[LinkedInSection]
    overall_suggestions: str
    analyzed_at: datetime
