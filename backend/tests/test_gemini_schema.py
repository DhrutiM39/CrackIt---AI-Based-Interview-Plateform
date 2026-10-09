import google.generativeai as genai

from app.schemas.prep import GeneratedQuestionList
from app.schemas.resume import ResumeAnalysisResult
from app.services.gemini_service import (
    AnswerEvaluationAI,
    InterviewReportAI,
    LinkedInAnalysisAI,
    ProjectAnalysisAI,
    RoadmapAI,
    _gemini_response_schema,
)
from app.services.subject_ingestion.models import PreparationDataset


def test_response_schemas_use_gemini_supported_fields():
    models = [
        AnswerEvaluationAI,
        GeneratedQuestionList,
        InterviewReportAI,
        LinkedInAnalysisAI,
        PreparationDataset,
        ProjectAnalysisAI,
        ResumeAnalysisResult,
        RoadmapAI,
    ]

    for model in models:
        response_schema = _gemini_response_schema(model)
        generation_config = genai.types.GenerationConfig(
            response_mime_type="application/json",
            response_schema=response_schema,
        )

        assert generation_config.response_schema is not None
        assert "maximum" not in str(response_schema)
        assert "minimum" not in str(response_schema)
