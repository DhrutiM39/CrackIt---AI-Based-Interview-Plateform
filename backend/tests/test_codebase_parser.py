from io import BytesIO
import zipfile

import pytest
from fastapi.testclient import TestClient

from app.core.security import get_current_user
from app.main import app
from app.utils import codebase_parser


@pytest.fixture
def client():
    previous_override = app.dependency_overrides.get(get_current_user)
    app.dependency_overrides[get_current_user] = lambda: {"sub": "test-user"}
    try:
        yield TestClient(app)
    finally:
        if previous_override is None:
            app.dependency_overrides.pop(get_current_user, None)
        else:
            app.dependency_overrides[get_current_user] = previous_override


def make_repository_zip():
    archive = BytesIO()
    with zipfile.ZipFile(archive, "w") as repository:
        repository.writestr("owner-repo/src/main.py", "print('hello')\n")
    return archive.getvalue()


def test_download_github_repo_accepts_repository_subpaths_and_git_suffix(monkeypatch):
    class Response:
        status_code = 200
        content = make_repository_zip()

    requests = {}

    def fake_get(url, **kwargs):
        requests["url"] = url
        requests["kwargs"] = kwargs
        return Response()

    monkeypatch.setattr(codebase_parser.requests, "get", fake_get)

    code = codebase_parser.download_github_repo(
        "https://github.com/example/project.git/tree/main/src"
    )

    assert "print('hello')" in code
    assert requests["url"] == "https://api.github.com/repos/example/project/zipball"
    assert requests["kwargs"]["timeout"] == 30


@pytest.mark.parametrize(
    ("url", "message"),
    [
        ("https://example.com/owner/repo", "valid GitHub repository URL"),
        ("https://github.com/owner", "includes an owner and repository"),
    ],
)
def test_download_github_repo_rejects_invalid_urls(url, message):
    with pytest.raises(ValueError, match=message):
        codebase_parser.download_github_repo(url)


def test_download_github_repo_reports_missing_or_private_repositories(monkeypatch):
    class Response:
        status_code = 404

    monkeypatch.setattr(codebase_parser.requests, "get", lambda *_args, **_kwargs: Response())

    with pytest.raises(ValueError, match="not found or is private"):
        codebase_parser.download_github_repo("https://github.com/example/missing")


def test_codebase_route_returns_actionable_error_for_invalid_github_url(client):
    response = client.post(
        "/projects/analyze-codebase",
        data={
            "project_name": "Example project",
            "description": "A sample project",
            "github_url": "https://example.com/owner/repo",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Enter a valid GitHub repository URL."


def test_codebase_route_returns_actionable_error_for_invalid_zip(client):
    response = client.post(
        "/projects/analyze-codebase",
        data={
            "project_name": "Example project",
            "description": "A sample project",
        },
        files={"file": ("project.zip", b"not a zip archive", "application/zip")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "The uploaded file is not a valid ZIP archive."
