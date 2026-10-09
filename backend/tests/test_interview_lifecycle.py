import json
from dataclasses import dataclass
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.services import interview_service, report_service
from app.services.gemini_service import AnswerEvaluationAI, AnswerRubricAI


@dataclass
class FakeResult:
    data: list
    count: int | None = None


class FakeQuery:
    def __init__(self, client, table):
        self.client = client
        self.table_name = table
        self.rows = client.tables.setdefault(table, [])
        self.filters = []
        self.operation = "select"
        self.payload = None
        self._count = None

    def select(self, *_args, count=None, **_kwargs):
        self.operation = "select"
        self._count = count
        return self

    def eq(self, field, value):
        self.filters.append(lambda row: row.get(field) == value)
        return self

    def in_(self, field, values):
        self.filters.append(lambda row: row.get(field) in values)
        return self

    def limit(self, _value):
        return self

    def order(self, *_args, **_kwargs):
        return self

    def insert(self, payload):
        self.operation = "insert"
        self.payload = payload
        return self

    def update(self, payload):
        self.operation = "update"
        self.payload = payload
        return self

    def execute(self):
        matches = [row for row in self.rows if all(predicate(row) for predicate in self.filters)]
        if self.operation == "insert":
            row = dict(self.payload)
            row.setdefault("id", self.client.next_id)
            self.client.next_id += 1
            self.rows.append(row)
            return FakeResult([row], 1)
        if self.operation == "update":
            for row in matches:
                row.update(self.payload)
            return FakeResult(matches, len(matches))
        return FakeResult(matches, len(matches) if self._count == "exact" else None)


class FakeSupabase:
    def __init__(self, tables):
        self.tables = tables
        self.next_id = 1000

    def table(self, name):
        return FakeQuery(self, name)


def evaluation():
    return AnswerEvaluationAI(
        overall_score=80,
        rubric=AnswerRubricAI(
            technical_correctness=84,
            relevance=80,
            completeness=76,
            clarity_structure=80,
        ),
        strengths=["Explains the main idea"],
        missing_points=["Mention a trade-off"],
        incorrect_or_unclear_points=[],
        improvement_suggestions=["Add one concrete example"],
        improved_answer_outline=["Define it", "Explain the trade-off"],
        recommended_topics=["Indexes"],
        feedback_summary="Good foundation with one important omission.",
    )


def client_with_session(status="in_progress", user_id="user-a"):
    return FakeSupabase(
        {
            "interview_sessions": [
                {
                    "id": 1,
                    "user_id": user_id,
                    "status": status,
                    "interview_type": "Technical",
                    "difficulty": "Medium",
                    "target_role": "Backend Developer",
                    "started_at": "2026-09-23T10:00:00+00:00",
                }
            ],
            "interview_questions": [{"id": 11, "session_id": 1, "sequence_no": 1, "question_text": "What is an index?"}],
            "interview_answers": [],
            "interview_reports": [],
        }
    )


def test_user_cannot_submit_answer_to_another_users_session(monkeypatch):
    client = client_with_session(user_id="user-b")
    monkeypatch.setattr(interview_service, "supabase", client)

    with pytest.raises(HTTPException) as error:
        interview_service.evaluate_session_answer(1, 11, "user-a", "answer")

    assert error.value.status_code == 404
    assert client.tables["interview_answers"] == []


def test_user_cannot_finish_another_users_session(monkeypatch):
    client = client_with_session(user_id="user-b")
    monkeypatch.setattr(interview_service, "supabase", client)

    with pytest.raises(HTTPException) as error:
        interview_service.end_session(1, "user-a")

    assert error.value.status_code == 404


def test_duplicate_answer_returns_conflict(monkeypatch):
    client = client_with_session()
    client.tables["interview_answers"].append({"id": 20, "question_id": 11, "answer_text": "old"})
    monkeypatch.setattr(interview_service, "supabase", client)

    with pytest.raises(HTTPException) as error:
        interview_service.evaluate_session_answer(1, 11, "user-a", "new")

    assert error.value.status_code == 409
    assert len(client.tables["interview_answers"]) == 1


def test_answer_after_completion_returns_conflict(monkeypatch):
    client = client_with_session(status="completed")
    monkeypatch.setattr(interview_service, "supabase", client)

    with pytest.raises(HTTPException) as error:
        interview_service.evaluate_session_answer(1, 11, "user-a", "answer")

    assert error.value.status_code == 409


def test_report_requires_completed_session(monkeypatch):
    monkeypatch.setattr(
        report_service,
        "get_session_with_qa",
        lambda _session_id, _user_id: {"session": {"id": 1, "status": "in_progress"}, "questions": []},
    )

    with pytest.raises(HTTPException) as error:
        report_service.generate_and_save_report(1, "user-a")

    assert error.value.status_code == 409


def test_invalid_gemini_evaluation_is_not_persisted(monkeypatch):
    client = client_with_session()
    monkeypatch.setattr(interview_service, "supabase", client)
    monkeypatch.setattr(
        interview_service.gemini_service,
        "evaluate_answer",
        lambda **_kwargs: (_ for _ in ()).throw(HTTPException(502, "AI answer evaluation failed. Please retry shortly.")),
    )

    with pytest.raises(HTTPException) as error:
        interview_service.evaluate_session_answer(1, 11, "user-a", "answer")

    assert error.value.status_code == 502
    assert client.tables["interview_answers"] == []


def test_valid_rubric_output_is_validated_and_stored(monkeypatch):
    client = client_with_session()
    monkeypatch.setattr(interview_service, "supabase", client)
    monkeypatch.setattr(interview_service.gemini_service, "evaluate_answer", lambda **_kwargs: evaluation())

    result = interview_service.evaluate_session_answer(1, 11, "user-a", "An index speeds up lookups.")

    assert result["evaluation"]["overall_score"] == 80
    assert result["evaluation"]["rubric"]["technical_correctness"] == 84
    assert len(client.tables["interview_answers"]) == 1
    stored = json.loads(client.tables["interview_answers"][0]["ai_feedback"])
    assert stored["feedback_summary"] == "Good foundation with one important omission."
