"""Validated data contracts for subject-preparation ingestion."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class QuestionRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    question_id: str = Field(min_length=1)
    type: Literal["MCQ", "Theory"]
    question_text: str = Field(min_length=1)
    options: list[str]
    correct_answer: str
    explanation: str


class PreparationRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    subject_name: str = Field(min_length=1)
    unit_name: str = Field(min_length=1)
    topic: str = Field(min_length=1)
    difficulty: Literal["Easy", "Medium", "Hard"]
    questions: list[QuestionRecord] = Field(min_length=1)


class PreparationDataset(BaseModel):
    """Gemini response envelope; each contained record matches the requested schema."""

    model_config = ConfigDict(extra="forbid")

    records: list[PreparationRecord] = Field(min_length=1)