from pydantic import BaseModel, Field
from typing import List, Optional

class SectionScore(BaseModel):
    name: str
    score: int
    tips: List[str]

class KeywordMatch(BaseModel):
    word: str
    found: bool

class ResumeAnalysisResult(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall resume score out of 100")
    ats_score: int = Field(..., ge=0, le=100, description="ATS compatibility score out of 100")
    job_role_match: int = Field(..., ge=0, le=100, description="Job role match score out of 100")
    readability_score: int = Field(..., ge=0, le=100, description="Readability and formatting score out of 100")
    
    summary: str = Field(..., description="A brief summary of the resume's quality")
    strengths: List[str] = Field(..., description="Key strengths found in the resume")
    weaknesses: List[str] = Field(..., description="Key weaknesses found in the resume")
    
    skills: List[str] = Field(..., description="Skills detected in the resume")
    missing_skills: List[str] = Field(..., description="Important skills missing based on the target role")
    
    formatting_issues: List[str] = Field(..., description="Any formatting issues detected")
    improvements: List[str] = Field(..., description="Actionable improvements for the resume")
    
    sections: List[SectionScore] = Field(..., description="Detailed breakdown of each resume section (e.g., Experience, Education, Projects)")
    keywords: List[KeywordMatch] = Field(..., description="Keyword analysis showing found vs missing keywords")
