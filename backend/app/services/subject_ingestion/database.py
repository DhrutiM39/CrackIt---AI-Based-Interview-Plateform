"""Supabase persistence for the subject-wise NPTEL extraction pipeline."""

import logging
import os
from collections.abc import Iterable, Mapping
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from supabase import create_client

from app.services.subject_ingestion.models import PreparationRecord, QuestionRecord

logger = logging.getLogger(__name__)

# Load backend/.env regardless of the process's current working directory.
BACKEND_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(BACKEND_ROOT / ".env", override=False)
SUPABASE_URL = os.getenv("SUPABASE_URL")

# Optional client injection is useful for tests; production creates this lazily.
supabase: Any | None = None


def get_supabase_client() -> Any:
    """Initialize Supabase using the service-role key, never the anon key."""
    global supabase
    if supabase is None:
        url = SUPABASE_URL or os.getenv("SUPABASE_URL")
        service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not service_role_key:
            raise RuntimeError(
                "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env"
            )
        supabase = create_client(url, service_role_key)
    return supabase


def _client(client: Any | None = None) -> Any:
    return client if client is not None else get_supabase_client()


def _insert(table_name: str, payload: dict[str, Any] | list[dict[str, Any]], client: Any) -> list[dict[str, Any]]:
    """Execute inserts with the original Supabase error visible in logs."""
    try:
        response = client.table(table_name).insert(payload).execute()
    except Exception as exc:
        logger.exception("Supabase insert failed for %s: %s", table_name, exc)
        print(f"ERROR inserting into {table_name}: {exc}")
        raise

    rows = response.data or []
    if not rows:
        raise RuntimeError(f"Supabase insert into {table_name!r} returned no rows")
    return rows


def _insert_row(client: Any, table_name: str, payload: dict[str, Any]) -> dict[str, Any]:
    """Compatibility wrapper for a single-row Supabase insert."""
    return _insert(table_name, payload, client)[0]


def _get_or_create_subject(subject_name: str, difficulty: str, client: Any) -> int:
    rows = (
        client.table("subjects")
        .select("id")
        .eq("subject_name", subject_name)
        .limit(1)
        .execute()
        .data
        or []
    )
    if rows:
        return rows[0]["id"]

    subject = _insert("subjects", {
        "subject_name": subject_name,
        "difficulty": difficulty,
        "tags": ["NPTEL"],
    }, client)[0]
    return subject["id"]


def get_or_create_topic(topic_name: str, subject_id: int | None = None) -> int:
    """Return a topic ID, creating a topic under its required parent subject.

    The current schema requires `topics.subject_id`. Supply it when creating a
    topic. Without it, an existing uniquely named topic can still be retrieved;
    an ambiguous or missing topic raises a clear error rather than violating FK.
    """
    return _get_or_create_topic(topic_name, subject_id, _client())


def _get_or_create_topic(topic_name: str, subject_id: int | None, client: Any) -> int:
    query = client.table("topics").select("id, subject_id").eq("topic_name", topic_name)
    if subject_id is not None:
        query = query.eq("subject_id", subject_id)
    rows = query.limit(2).execute().data or []

    if rows:
        if subject_id is None and len(rows) > 1:
            raise ValueError(
                f"Topic {topic_name!r} exists under multiple subjects; pass subject_id"
            )
        return rows[0]["id"]
    if subject_id is None:
        raise ValueError(
            f"Cannot create topic {topic_name!r} without subject_id; topics.subject_id is required"
        )

    topic = _insert("topics", {
        "subject_id": subject_id,
        "topic_name": topic_name,
    }, client)[0]
    return topic["id"]


def get_or_create_topic_id(client: Any, topic_name: str, subject_id: int) -> int:
    """Compatibility wrapper used by older pipeline callers and tests."""
    return _get_or_create_topic(topic_name, subject_id, client)


def insert_question(
    topic_id: int,
    question: str,
    answer: str,
    difficulty: str,
    *,
    client: Any | None = None,
) -> dict[str, Any]:
    """Insert one question using exactly the four confirmed table columns."""
    if not isinstance(topic_id, int) or isinstance(topic_id, bool) or topic_id <= 0:
        raise ValueError("topic_id must be a positive integer")
    payload = {
        "topic_id": topic_id,
        "question": question,
        "answer": answer,
        "difficulty": difficulty,
    }
    row = _insert("questions", payload, _client(client))[0]
    logger.info("Inserted question id=%s topic_id=%s", row.get("id"), topic_id)
    print(f"Inserted question for topic_id={topic_id}")
    return row


def bulk_insert_questions(
    questions_list: Iterable[Mapping[str, Any]],
    *,
    client: Any | None = None,
) -> int:
    """Bulk insert question dictionaries using only confirmed schema columns.

    Each item must contain `question`, `answer`, and `difficulty`, plus either
    `topic_id` or `topic_name` and `subject_id` (used to create/find a topic).
    """
    db = _client(client)
    payloads = []
    for item in questions_list:
        topic_id = item.get("topic_id")
        if topic_id is None:
            topic_name = item.get("topic_name")
            if not topic_name:
                raise ValueError("Each question needs topic_id or topic_name and subject_id")
            topic_id = _get_or_create_topic(topic_name, item.get("subject_id"), db)
        if not isinstance(topic_id, int) or isinstance(topic_id, bool) or topic_id <= 0:
            raise ValueError("topic_id must be a positive integer")
        payloads.append({
            "topic_id": topic_id,
            "question": item["question"],
            "answer": item["answer"],
            "difficulty": item["difficulty"],
        })

    if not payloads:
        return 0
    inserted = _insert("questions", payloads, db)
    logger.info("Bulk inserted %d questions", len(inserted))
    print(f"Inserted {len(inserted)} questions")
    return len(inserted)


def _format_question_and_answer(question: QuestionRecord, topic: str) -> tuple[str, str]:
    """Store MCQ options and the solution in the existing text columns."""
    question_text = question.question_text
    if topic:
        question_text = f"Topic: {topic}\n\n{question_text}"
    if question.type == "MCQ" and question.options:
        option_lines = [f"{chr(65 + index)}. {option}" for index, option in enumerate(question.options)]
        question_text += "\n\nOptions:\n" + "\n".join(option_lines)

    answer_text = f"Correct answer: {question.correct_answer}"
    if question.explanation:
        answer_text += f"\n\nExplanation: {question.explanation}"
    return question_text, answer_text


def store_records(
    records: Iterable[PreparationRecord | dict[str, Any]],
    *,
    client: Any | None = None,
) -> int:
    """Persist parsed LLM records, creating subjects/topics before questions."""
    db = _client(client)
    pending_questions = []
    updated_count = 0

    for raw_record in records:
        record = PreparationRecord.model_validate(raw_record)
        subject_id = _get_or_create_subject(record.subject_name, record.difficulty, db)
        topic_id = _get_or_create_topic(record.unit_name, subject_id, db)

        for parsed_question in record.questions:
            question_text, answer_text = _format_question_and_answer(parsed_question, record.topic)
            existing = (
                db.table("questions")
                .select("id")
                .eq("topic_id", topic_id)
                .eq("question", question_text)
                .limit(1)
                .execute()
                .data
                or []
            )
            if existing:
                try:
                    (
                        db.table("questions")
                        .update({"answer": answer_text, "difficulty": record.difficulty})
                        .eq("id", existing[0]["id"])
                        .execute()
                    )
                except Exception as exc:
                    logger.exception("Supabase update failed for question %s: %s", existing[0]["id"], exc)
                    print(f"ERROR updating question {existing[0]['id']}: {exc}")
                    raise
                updated_count += 1
            else:
                pending_questions.append({
                    "topic_id": topic_id,
                    "question": question_text,
                    "answer": answer_text,
                    "difficulty": record.difficulty,
                })

    return updated_count + bulk_insert_questions(pending_questions, client=db)