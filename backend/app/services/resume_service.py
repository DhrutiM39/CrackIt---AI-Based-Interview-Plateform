import io
import json
from pathlib import Path
from uuid import uuid4

import docx
import google.generativeai as genai
from fastapi import HTTPException, UploadFile, status
from pypdf import PdfReader

from app.core.config import GEMINI_API_KEY
from app.database.supabase import supabase

MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
STORAGE_BUCKET = "resumes"


ANALYSIS_PROMPT = """You are an expert technical resume reviewer and ATS (Applicant \
Tracking System) evaluator for software engineering roles.

Analyze the following resume text and return ONLY a valid JSON object (no markdown, no \
backticks, no preamble) with exactly this structure:

{{
  "ats_score": <number 0-100, overall ATS-compatibility and quality score>,
  "summary_feedback": "<2-3 sentence overall assessment>",
  "sections": {{
    "contact_info": {{"score": <0-100>, "tips": ["<tip1>", "<tip2>"]}},
    "work_experience": {{"score": <0-100>, "tips": ["<tip1>", "<tip2>"]}},
    "education": {{"score": <0-100>, "tips": ["<tip1>", "<tip2>"]}},
    "skills": {{"score": <0-100>, "tips": ["<tip1>", "<tip2>"]}},
    "projects": {{"score": <0-100>, "tips": ["<tip1>", "<tip2>"]}},
    "summary": {{"score": <0-100>, "tips": ["<tip1>", "<tip2>"]}}
  }},
  "detected_skills": [
    {{"skill": "<skill name>", "confidence": <0-100>}}
  ],
  "missing_keywords": ["<keyword1>", "<keyword2>"]
}}

Resume text:
---
{resume_text}
---
"""


def extract_text(file_bytes: bytes, filename: str) -> str:
    extension = Path(filename).suffix.lower()

    try:
        if extension == ".pdf":
            reader = PdfReader(io.BytesIO(file_bytes))
            return "\n".join(page.extract_text() or "" for page in reader.pages)

        if extension == ".docx":
            document = docx.Document(io.BytesIO(file_bytes))
            return "\n".join(paragraph.text for paragraph in document.paragraphs)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file could not be read as a valid resume.",
        ) from exc

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unsupported file type. Please upload a PDF or DOCX resume.",
    )


def _parse_analysis(raw_response: str) -> dict:
    raw_response = raw_response.strip()
    if raw_response.startswith("```"):
        raw_response = raw_response.split("\n", 1)[1] if "\n" in raw_response else ""
        raw_response = raw_response.rsplit("```", 1)[0].strip()

    try:
        analysis = json.loads(raw_response)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI analysis returned an unexpected format. Please try again.",
        ) from exc

    if not isinstance(analysis, dict):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI analysis returned an unexpected format. Please try again.",
        )
    return analysis


def analyze_with_gemini(resume_text: str) -> dict:
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Resume analysis is not configured. Set GEMINI_API_KEY on the server.",
        )

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = ANALYSIS_PROMPT.format(resume_text=resume_text[:15000])

    try:
        response = model.generate_content(prompt)
        return _parse_analysis(response.text)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI analysis failed. Please try again.",
        ) from exc


def upload_resume_file(file_bytes: bytes, filename: str, user_id: str) -> str:
    extension = Path(filename).suffix.lower()
    storage_path = f"{user_id}/{uuid4().hex}{extension}"
    content_type = "application/pdf" if extension == ".pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    try:
        supabase.storage.from_(STORAGE_BUCKET).upload(
            storage_path,
            file_bytes,
            {"content-type": content_type, "upsert": "false"},
        )
        return supabase.storage.from_(STORAGE_BUCKET).get_public_url(storage_path)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Resume upload failed. Ensure the Supabase 'resumes' bucket exists.",
        ) from exc


def save_resume_analysis(user_id: str, file_url: str, parsed_text: str, analysis: dict) -> dict:
    try:
        insert_response = (
            supabase.table("resume_analysis")
            .insert({
                "user_id": user_id,
                "resume_file_url": file_url,
                "parsed_text": parsed_text[:10000],
                "ats_score": analysis.get("ats_score"),
                "ai_feedback": json.dumps(analysis),
            })
            .execute()
        )
        resume_row = insert_response.data[0]

        for item in analysis.get("detected_skills", []):
            if not isinstance(item, dict) or not item.get("skill"):
                continue
            skill_response = (
                supabase.table("skills")
                .upsert({"skill_name": str(item["skill"])[:100]}, on_conflict="skill_name")
                .execute()
            )
            supabase.table("resume_skills").upsert({
                "resume_id": resume_row["id"],
                "skill_id": skill_response.data[0]["id"],
                "confidence_score": item.get("confidence"),
            }, on_conflict="resume_id,skill_id").execute()

        return resume_row
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Resume analysis could not be saved. Please try again.",
        ) from exc


async def process_resume(file: UploadFile, user_id: str) -> dict:
    filename = file.filename or ""
    if Path(filename).suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Please upload a PDF or DOCX resume.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded file is empty.")
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large. Max 5MB.")

    parsed_text = extract_text(file_bytes, filename)
    if not parsed_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Couldn't extract text from this file. Try a different format.",
        )

    analysis = analyze_with_gemini(parsed_text)
    file_url = upload_resume_file(file_bytes, filename, user_id)
    resume_row = save_resume_analysis(user_id, file_url, parsed_text, analysis)

    return {
        "success": True,
        "resume_id": resume_row["id"],
        "ats_score": analysis.get("ats_score"),
        "ai_feedback": analysis.get("summary_feedback"),
        "full_analysis": analysis,
    }
