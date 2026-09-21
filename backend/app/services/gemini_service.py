import json
import logging
from typing import List, Dict, Any
import google.generativeai as genai
from fastapi import HTTPException, status
from pydantic import BaseModel, ValidationError

from app.core.config import GEMINI_API_KEY
from app.schemas.resume import ResumeAnalysisResult
from app.schemas.prep import GeneratedQuestionList


# ── Structured output schema for interview report ─────────────────────────────
class InterviewReportAI(BaseModel):
    overall_score: float  # 0-100
    technical_score: float
    communication_score: float
    strengths: List[str]
    weaknesses: List[str]
    missed_concepts: List[str]
    recommended_topics: List[str]
    summary: str
    next_steps: List[str]

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

    def generate_interview_report(
        self,
        interview_type: str,
        target_role: str,
        difficulty: str,
        questions_and_answers: List[Dict[str, Any]],
        user_name: str = "Candidate",
    ) -> InterviewReportAI:
        """
        Given full interview Q&A data, produce a structured evaluation report.
        Uses actual answer content — does NOT invent scores.
        """
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini API is not configured on the server."
            )

        # Build Q&A transcript string
        qa_text = ""
        for i, qa in enumerate(questions_and_answers, 1):
            q = qa.get("question_text", "")
            a = qa.get("answer_text") or "[No answer provided]"
            score = qa.get("ai_score")
            feedback = qa.get("ai_feedback") or ""
            score_str = f"  Pre-score: {score}/100" if score is not None else ""
            qa_text += f"\nQ{i}: {q}\nAnswer: {a}{score_str}\n{feedback}\n"

        n = len(questions_and_answers)
        answered = sum(1 for qa in questions_and_answers if qa.get("answer_text"))

        prompt = f"""
        You are an expert technical interviewer and talent evaluator at a top tech company.
        Evaluate the following mock {interview_type} interview for the role of "{target_role}" at {difficulty} difficulty level.
        The candidate is: {user_name}.
        They answered {answered} out of {n} questions.

        INTERVIEW TRANSCRIPT:
        {qa_text}

        Provide a thorough, honest, and constructive evaluation. Base ALL scores strictly on the answers provided above — do NOT invent positive scores for missing or weak answers.

        Scoring guidelines:
        - overall_score: weighted combination of technical + communication (0-100)
        - technical_score: accuracy, depth, correctness of technical answers (0-100)
        - communication_score: clarity, structure, articulation of answers (0-100)
        - If answers are missing or very weak, scores should reflect that honestly (e.g. 30-50)

        Provide:
        - strengths: 3-5 specific things the candidate did well (based on actual answers)
        - weaknesses: 3-5 specific areas needing improvement
        - missed_concepts: concepts/topics the candidate clearly didn't know or skipped
        - recommended_topics: 4-6 specific topics/resources the candidate should study next
        - summary: 2-3 sentence overall evaluation paragraph
        - next_steps: 3-5 concrete actionable next steps for the candidate
        """

        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=InterviewReportAI,
                    temperature=0.3,
                ),
            )

            if not response.text:
                raise HTTPException(500, "Empty response from Gemini API")

            raw_json = response.text
            result_dict = json.loads(raw_json)
            return InterviewReportAI(**result_dict)

        except (json.JSONDecodeError, ValidationError) as e:
            logger.error(f"Failed to parse Gemini interview report: {e}")
            # Return a fallback with computed scores
            scores = [qa["ai_score"] for qa in questions_and_answers if qa.get("ai_score") is not None]
            avg = round(sum(scores) / len(scores), 1) if scores else 50.0
            return InterviewReportAI(
                overall_score=avg,
                technical_score=avg,
                communication_score=avg,
                strengths=["Attempted the interview"],
                weaknesses=["Could not fully evaluate responses"],
                missed_concepts=[],
                recommended_topics=["Review core concepts for " + target_role],
                summary=f"Completed a {interview_type} interview for {target_role}.",
                next_steps=["Review interview feedback", "Practice more questions"],
            )
        except Exception as e:
            logger.error(f"Gemini API error during interview report: {e}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"AI service error: {str(e)}"
            )


# Singleton instance
gemini_service = GeminiService()
