import os
import zipfile
import tempfile
import requests
import mimetypes

IGNORED_DIRS = {".git", "node_modules", "venv", ".venv", "__pycache__", "dist", "build", ".next", "out"}
IGNORED_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".pdf", ".zip", ".tar", ".gz", ".mp4", ".mp3", ".wav", ".lock", ".pyc", ".whl"}
MAX_FILE_SIZE = 500 * 1024 # 500 KB limit per file

def is_text_file(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    if ext in IGNORED_EXTS:
        return False
    mime, _ = mimetypes.guess_type(filepath)
    if mime and mime.startswith('text/'):
        return True
    if ext in {".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".py", ".java", ".c", ".cpp", ".cs", ".go", ".rs", ".php", ".rb", ".yaml", ".yml", ".toml", ".env", ".example", ".css", ".html"}:
        return True
    return False

def parse_zip_file(zip_path: str) -> str:
    combined_code = []
    with zipfile.ZipFile(zip_path, 'r') as z:
        for file_info in z.infolist():
            if file_info.is_dir():
                continue
            
            # Check ignored dirs
            parts = file_info.filename.split('/')
            if any(part in IGNORED_DIRS for part in parts):
                continue
                
            # Check ignored extensions
            if os.path.splitext(file_info.filename)[1].lower() in IGNORED_EXTS:
                continue

            if file_info.file_size > MAX_FILE_SIZE:
                continue

            try:
                with z.open(file_info) as f:
                    content = f.read().decode('utf-8')
                    combined_code.append(f"--- File: {file_info.filename} ---\n{content}\n")
            except Exception:
                pass # skip non-utf8 files
    return "\n".join(combined_code)

def download_github_repo(github_url: str) -> str:
    url_parts = github_url.rstrip('/').split('/')
    if len(url_parts) < 2:
        raise Exception("Invalid GitHub URL")
    repo_name = f"{url_parts[-2]}/{url_parts[-1]}"
    zip_url = f"https://api.github.com/repos/{repo_name}/zipball"
    
    response = requests.get(zip_url, headers={"User-Agent": "AI-Code-Analyzer"})
    if response.status_code != 200:
        raise Exception(f"Failed to download repository: HTTP {response.status_code}")
        
    with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as tmp:
        tmp.write(response.content)
        tmp_path = tmp.name
        
    try:
        return parse_zip_file(tmp_path)
    finally:
        os.remove(tmp_path)
