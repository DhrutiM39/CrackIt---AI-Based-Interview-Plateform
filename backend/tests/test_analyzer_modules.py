import io

from fastapi.testclient import TestClient

from app.main import app
from app.core.security import get_current_user
from app.services.gemini_service import LinkedInAnalysisAI, ProjectAnalysisAI


client = TestClient(app)


def override_user():
    return {"sub": "user-123", "email": "demo@example.com", "full_name": "Demo User"}


app.dependency_overrides[get_current_user] = override_user


def test_resume_analyzer_route(monkeypatch):
    import app.api.resume as resume_api

    async def fake_process_resume_upload(file, user_id, target_role=None, job_description=None):
        return {
            "success": True,
            "resume_id": 1,
            "ats_score": 92,
            "overall_score": 90,
            "ai_feedback": "Strong technical resume with measurable impact and clear role alignment.",
            "full_analysis": {"summary": "Strong candidate profile", "skills": ["Python", "FastAPI"]},
            "persisted": True,
            "message": "Resume analyzed successfully",
        }

    monkeypatch.setattr(resume_api, "process_resume_upload", fake_process_resume_upload)

    response = client.post(
        "/resume/analyze",
        files={"file": ("resume.pdf", b"fake resume data", "application/pdf")},
        data={"target_role": "Software Engineer", "job_description": "Build backend services in Python"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["ats_score"] == 92
    assert payload["overall_score"] == 90
    assert "Strong technical resume" in payload["ai_feedback"]


def test_linkedin_analyzer_route(monkeypatch):
    import app.api.linkedin as linkedin_api

    def fake_analyze_linkedin(profile_data):
        return LinkedInAnalysisAI(
            profile_score=88,
            headline_score=84,
            about_score=90,
            experience_score=87,
            skills_score=86,
            education_score=82,
            summary="Strong developer profile with clear career progression.",
            strengths=["Strong experience", "Clear visibility", "Good skill coverage"],
            weaknesses=["Add metrics", "Clarify leadership impact"],
            missing_sections=["Certifications"],
            keyword_suggestions=["System Design", "Kubernetes", "SQL"],
            improvement_suggestions=["Add measurable outcomes", "Highlight leadership", "Mention deployment scale"],
        )

    class FakeInsertResult:
        def __init__(self, data):
            self.data = data

        def execute(self):
            return self

    class FakeTable:
        def __init__(self):
            self.insert_calls = []

        def insert(self, record):
            self.insert_calls.append(record)
            return FakeInsertResult([{"id": 7}])

    monkeypatch.setattr(linkedin_api, "supabase", type("SupabaseStub", (), {"table": lambda self, _name: FakeTable()})())
    monkeypatch.setattr(linkedin_api.gemini_service, "analyze_linkedin", fake_analyze_linkedin)

    response = client.post(
        "/linkedin/analyze",
        json={
            "headline": "Full Stack Engineer",
            "about": "I build scalable web apps and backend systems.",
            "experience": "Senior Engineer at a fintech startup.",
            "skills": ["Python", "FastAPI", "React", "SQL"],
            "education": "B.S. in Computer Science",
            "projects": "Built a trading dashboard.",
            "certifications": "AWS Cloud Practitioner",
            "linkedin_url": "https://linkedin.com/in/demo-user",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["profile_score"] == 88
    assert payload["persisted"] is True
    assert "Strong developer profile" in payload["summary"]
    assert "System Design" in payload["keyword_suggestions"]


def test_project_analyzer_route(monkeypatch):
    import app.api.projects as projects_api

    def fake_analyze_project(project_info):
        return ProjectAnalysisAI(
            overall_score=91,
            technical_quality=89,
            complexity_score=92,
            resume_value=94,
            summary="The project shows strong engineering trade-offs and deployable architecture.",
            strengths=["Scalable architecture", "Clear documentation", "Measurable impact"],
            weaknesses=["Could add monitoring", "Might improve test coverage"],
            missing_features=["CI/CD pipeline", "Production monitoring"],
            interview_questions=["How did you handle load balancing?", "What trade-offs did you make?"],
            suggested_improvements=["Add observability", "Expand automated tests"],
        )

    class FakeInsertResult:
        def __init__(self, data):
            self.data = data

        def execute(self):
            return self

    class FakeTable:
        def __init__(self):
            self.insert_calls = []

        def insert(self, record):
            self.insert_calls.append(record)
            return FakeInsertResult([{"id": 12}])

        def upsert(self, record, on_conflict=None):
            return FakeInsertResult([{"id": 4}])

    monkeypatch.setattr(projects_api, "supabase", type("SupabaseStub", (), {"table": lambda self, _name: FakeTable()})())
    monkeypatch.setattr(projects_api.gemini_service, "analyze_project", fake_analyze_project)

    response = client.post(
        "/projects/analyze",
        json={
            "project_name": "AI Interview Coach",
            "description": "AI-powered interview analysis platform for candidates.",
            "technologies": ["Python", "FastAPI", "React", "Supabase"],
            "github_url": "https://github.com/demo/ai-interview-coach",
            "live_url": "https://demo.example.com",
            "role": "Full Stack Engineer",
            "features": "Live scorecards, AI feedback, analytics dashboard",
            "challenges": "Latency tuning, prompt quality, scale and reliability",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["overall_score"] == 91
    assert payload["resume_value"] == 94
    assert payload["persisted"] is True
    assert "strong engineering trade-offs" in payload["summary"].lower()
    assert "How did you handle load balancing?" in payload["interview_questions"]
