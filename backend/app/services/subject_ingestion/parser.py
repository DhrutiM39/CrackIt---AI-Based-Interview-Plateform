"""Convert raw NPTEL material into strictly validated preparation records."""

import hashlib

from app.services.gemini_service import gemini_service
from app.services.subject_ingestion.models import PreparationDataset, PreparationRecord

PROMPT_TEMPLATE = """You are an engineering educator building a subject-wise exam preparation dataset.
Extract meaningful concepts and create practice questions grounded only in the source material.
Return JSON matching this schema exactly: {{"records": [{{"subject_name": "string", "unit_name": "string", "topic": "string", "difficulty": "Easy | Medium | Hard", "questions": [{{"question_id": "string", "type": "MCQ | Theory", "question_text": "string", "options": ["string"], "correct_answer": "string", "explanation": "string"}}]}}]}}.
Use MCQ only when there are answer options; use Theory for open-ended questions and set options to [].
Provide a stable, unique question_id within this source. Do not invent facts absent from the material.
Subject hint: {subject_name}
Source label: {source_label}

SOURCE MATERIAL:
{source_text}
"""


def parse_material(
    source_text: str,
    *,
    subject_name: str,
    source_label: str = "NPTEL course material",
) -> list[PreparationRecord]:
    """Ask the configured Gemini service to parse text and validate every record."""
    if not source_text.strip():
        raise ValueError("Source material must not be empty")
    prompt = PROMPT_TEMPLATE.format(
        subject_name=subject_name,
        source_label=source_label,
        source_text=source_text,
    )
    response = gemini_service._call_gemini(prompt, PreparationDataset, temperature=0.2)
    dataset = PreparationDataset.model_validate(response["data"])
    source_prefix = hashlib.sha256(source_label.encode("utf-8")).hexdigest()[:12]
    return [
        record.model_copy(update={
            "questions": [
                question.model_copy(update={"question_id": f"{source_prefix}:{question.question_id}"})
                for question in record.questions
            ]
        })
        for record in dataset.records
    ]