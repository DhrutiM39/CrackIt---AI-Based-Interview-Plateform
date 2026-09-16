import json
import logging
import google.generativeai as genai
from fastapi import HTTPException, status
from pydantic import ValidationError

from app.core.config import GEMINI_API_KEY
from app.schemas.resume import ResumeAnalysisResult
from app.schemas.prep import GeneratedQuestionList

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        if not GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY is not set in environment variables.")
        else:
            genai.configure(api_key=GEMINI_API_KEY)
            
        # We use a model that supports structured output well. gemini-1.5-flash is great for this.
        self.model_name = "gemini-1.5-flash"

    def analyze_resume(self, resume_text: str, target_role: str = None) -> ResumeAnalysisResult:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini API is not configured on the server."
            )

        prompt = f"""
        You are an expert ATS (Applicant Tracking System) and tech recruiter. 
        Analyze the following resume text.
        
        {f'The candidate is targeting the role of: {target_role}' if target_role else 'The candidate is looking for software engineering roles.'}
        
        Evaluate the resume based on ATS compatibility, overall quality, readability, and content.
        Break down the score into specific sections (e.g., Experience, Education, Projects, Skills).
        Provide a list of keywords found and missing based on standard expectations for this role.
        
        RESUME TEXT:
        {resume_text}
        """

        try:
            model = genai.GenerativeModel(self.model_name)
            
            # Requesting JSON response matching our Pydantic schema
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=ResumeAnalysisResult,
                    temperature=0.2, # Low temperature for more deterministic analysis
                ),
            )
            
            if not response.text:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Empty response from Gemini API"
                )
                
            raw_json = response.text
            
            try:
                # Parse the JSON string into our Pydantic model
                analysis_dict = json.loads(raw_json)
                result = ResumeAnalysisResult(**analysis_dict)
                return result
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"Failed to parse Gemini response: {e}")
                logger.error(f"Raw response: {raw_json}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to parse analysis results from AI"
                )
                
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"AI service error: {str(e)}"
            )

    def generate_questions(
        self,
        job_role: str = None,
        domain: str = None,
        skills: list[str] = None,
        difficulty: str = "Medium",
        number_of_questions: int = 5,
        category: str = "Technical"
    ) -> GeneratedQuestionList:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini API is not configured on the server."
            )
            
        skills_str = ", ".join(skills) if skills else "general software engineering skills"
        role_str = f"for a {job_role} role" if job_role else ""
        domain_str = f"in the {domain} domain" if domain else ""
        
        prompt = f"""
        You are an expert technical interviewer and hiring manager.
        Generate a list of {number_of_questions} {difficulty} difficulty {category} interview questions {role_str} {domain_str}.
        Focus on evaluating the following skills: {skills_str}.
        
        For each question, provide a suggested brief answer or key points the candidate should hit.
        Ensure the output strictly follows the requested JSON schema.
        """
        
        try:
            model = genai.GenerativeModel(self.model_name)
            
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=GeneratedQuestionList,
                    temperature=0.7,
                ),
            )
            
            if not response.text:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Empty response from Gemini API"
                )
                
            raw_json = response.text
            
            try:
                result_dict = json.loads(raw_json)
                result = GeneratedQuestionList(**result_dict)
                return result
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"Failed to parse Gemini generated questions: {e}")
                logger.error(f"Raw response: {raw_json}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to parse generated questions from AI"
                )
                
        except Exception as e:
            logger.error(f"Gemini API error during question generation: {e}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"AI service error: {str(e)}"
            )

# Singleton instance
gemini_service = GeminiService()
