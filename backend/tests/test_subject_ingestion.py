import pytest
from pydantic import ValidationError

from app.services.subject_ingestion.models import PreparationRecord
from app.services.subject_ingestion import database
from app.services.subject_ingestion import parser


def sample_record():
    return {
        "subject_name": "Control Systems",
        "unit_name": "Unit 1: Modeling",
        "topic": "Transfer functions",
        "difficulty": "Medium",
        "questions": [
            {
                "question_id": "q-1",
                "type": "MCQ",
                "question_text": "What does a transfer function describe?",
                "options": ["Input-output relationship", "A physical dimension"],
                "correct_answer": "Input-output relationship",
                "explanation": "It represents the system relationship in the Laplace domain.",
            }
        ],
    }


class FakeResult:
    def __init__(self, data):
        self.data = data


class FakeQuery:
    def __init__(self, client, table):
        self.client = client
        self.table = table
        self.filters = []
        self.operation = "select"
        self.payload = None

    def select(self, *_args):
        self.operation = "select"
        return self

    def eq(self, field, value):
        self.filters.append((field, value))
        return self

    def limit(self, _count):
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
        rows = self.client.tables.setdefault(self.table, [])
        matches = [
            row for row in rows
            if all(row.get(field) == value for field, value in self.filters)
        ]
        if self.operation == "insert":
            payloads = self.payload if isinstance(self.payload, list) else [self.payload]
            inserted = []
            for payload in payloads:
                row = {"id": self.client.next_id, **payload}
                self.client.next_id += 1
                rows.append(row)
                inserted.append(row)
            return FakeResult(inserted)
        if self.operation == "update":
            for row in matches:
                row.update(self.payload)
            return FakeResult(matches)
        return FakeResult(matches)


class FakeSupabase:
    def __init__(self):
        self.tables = {"subjects": [], "topics": [], "questions": []}
        self.next_id = 1

    def table(self, name):
        return FakeQuery(self, name)


def test_preparation_record_rejects_invalid_difficulty_and_extra_fields():
    invalid = sample_record()
    invalid["difficulty"] = "Extreme"
    with pytest.raises(ValidationError):
        PreparationRecord.model_validate(invalid)

    invalid = sample_record()
    invalid["unexpected"] = True
    with pytest.raises(ValidationError):
        PreparationRecord.model_validate(invalid)


def test_parser_validates_and_scopes_question_ids_by_source(monkeypatch):
    monkeypatch.setattr(
        parser.gemini_service,
        "_call_gemini",
        lambda *_args, **_kwargs: {"data": {"records": [sample_record()]}},
    )

    records = parser.parse_material("lecture text", subject_name="Control Systems", source_label="video-1")

    assert records[0].subject_name == "Control Systems"
    assert records[0].questions[0].question_id != "q-1"
    assert records[0].questions[0].question_id.endswith(":q-1")


def test_supabase_client_requires_and_uses_service_role_key(monkeypatch):
    captured = {}
    monkeypatch.setattr(database, "supabase", None)
    monkeypatch.setattr(database, "SUPABASE_URL", "https://example.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "service-role-secret")
    monkeypatch.setattr(
        database,
        "create_client",
        lambda url, key: captured.update(url=url, key=key) or "client",
    )

    assert database.get_supabase_client() == "client"
    assert captured == {
        "url": "https://example.supabase.co",
        "key": "service-role-secret",
    }

    monkeypatch.delenv("SUPABASE_SERVICE_ROLE_KEY")
    monkeypatch.setattr(database, "supabase", None)
    with pytest.raises(RuntimeError, match="SUPABASE_SERVICE_ROLE_KEY"):
        database.get_supabase_client()


def test_insert_failure_prints_exact_supabase_error(capsys):
    class FailingQuery:
        def insert(self, _payload):
            return self

        def execute(self):
            raise RuntimeError("row level security policy violation")

    class FailingClient:
        def table(self, _table_name):
            return FailingQuery()

    with pytest.raises(RuntimeError, match="row level security policy violation"):
        database._insert_row(FailingClient(), "questions", {"question": "Q"})

    assert "row level security policy violation" in capsys.readouterr().out


def test_store_records_is_repeat_safe(monkeypatch):
    client = FakeSupabase()
    monkeypatch.setattr(database, "supabase", client)

    assert database.store_records([sample_record()]) == 1
    assert database.store_records([sample_record()]) == 1

    assert len(client.tables["subjects"]) == 1
    assert len(client.tables["topics"]) == 1
    assert len(client.tables["questions"]) == 1
    question = client.tables["questions"][0]
    assert set(question) == {"id", "topic_id", "question", "answer", "difficulty"}
    assert "A. Input-output relationship" in question["question"]
    assert "B. A physical dimension" in question["question"]
    assert question["answer"].startswith("Correct answer: Input-output relationship")
    assert "Explanation: It represents" in question["answer"]