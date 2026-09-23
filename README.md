# CrackIt - AI-Based Interview Preparation Platform

CrackIt is a full-stack interview preparation platform for students, fresh graduates, and working professionals. It combines structured preparation content with AI-assisted resume analysis, mock interviews, feedback, progress tracking, and personalized learning support.

## Project Status

This repository contains the Semester 5 project implementation for the AI-Based Interview Preparation Platform.

## Features

- Secure registration, login, token-based authentication, and profile management.
- Resume upload and AI analysis with ATS scoring, skill extraction, gaps, suggestions, and history.
- LinkedIn profile analysis through a public URL or pasted profile content.
- Project analysis with optional public GitHub repository metadata.
- Subject-wise preparation for DSA, DBMS, OS, CN, OOP, software engineering, and web development.
- Domain-wise preparation for frontend, backend, data science, AI/ML, cybersecurity, cloud, DevOps, and Android.
- Chat-based AI mock interviews with configurable role, difficulty, category, and duration.
- Interview reports with scores, strengths, weaknesses, suggestions, and PDF downloads.
- Personalized roadmaps and dashboard progress summaries.
- Notifications, profile, and application settings.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide icons |
| Backend | FastAPI, Python 3.11+, Pydantic, Uvicorn |
| Database and authentication | PostgreSQL, Supabase Auth, JWT |
| Storage | Supabase Storage |
| AI | Google Gemini API through the backend |
| Deployment targets | Vercel for frontend, Render for backend |

## Architecture

The application uses a client-server architecture:

1. The React single-page application provides the user interface.
2. The FastAPI service exposes REST endpoints and validates requests.
3. Supabase provides authentication, PostgreSQL persistence, and file storage.
4. AI requests are sent from FastAPI to Gemini; the browser never calls Gemini directly.

```text
Browser
  |
  | HTTPS / REST / JSON
  v
React + Vite frontend
  |
  | Authenticated API requests
  v
FastAPI backend
  |                |
  |                +--> Google Gemini API
  |
  +--> Supabase Auth
  +--> Supabase PostgreSQL
  +--> Supabase Storage
```

## Repository Structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- api/          # FastAPI route modules
|   |   |-- core/         # Configuration and security
|   |   |-- database/     # Supabase client integration
|   |   |-- schemas/      # Request and response models
|   |   |-- services/     # Authentication, AI, reports, and domain logic
|   |   `-- main.py       # FastAPI application entry point
|   |-- requirements.txt
|   `-- .env.example
|-- database/
|   |-- schema.sql        # Database schema
|   |-- indexes.sql       # Database indexes
|   |-- rls.sql           # Row-Level Security policies
|   `-- seed.sql          # Development seed data
|-- frontend/
|   |-- src/app/          # Application shell and pages
|   |-- src/lib/          # API client and auth helpers
|   |-- src/styles/        # Global styles and theme
|   |-- package.json
|   `-- vite.config.ts
`-- README.md
```

## Prerequisites

- Python 3.11 or later
- Node.js 18 or later
- npm
- A Supabase project with its URL and API keys
- A Google Gemini API key for AI-powered features

## Configuration

### Backend

Create `backend/.env` from `backend/.env.example` and set the real values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

JWT_SECRET=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

FRONTEND_URL=http://localhost:5173

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
```

Never commit `backend/.env` or expose the Supabase service-role key in the frontend.

### Frontend

The frontend uses `http://localhost:8000` by default. To use another backend URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

The API client also retries the local backend through `127.0.0.1` when the default `localhost` connection cannot be established.

## Database Setup

Run the SQL files in the Supabase SQL editor in this order:

1. `database/schema.sql`
2. `database/indexes.sql`
3. `database/rls.sql`
4. `database/seed.sql` for development data only

Review Row-Level Security policies before deployment. Use the Supabase service-role key only on the backend.

## Local Development

### Start the backend

From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:

- API: `http://localhost:8000/`
- Health check: `http://localhost:8000/health`
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

### Start the frontend

Open a second terminal from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/` in a browser. Start the backend before using features that load or save data.

### Build the frontend

```powershell
cd frontend
npm run build
```

The production output is written to `frontend/dist`.

## API Overview

The FastAPI application groups endpoints by feature:

| Area | Main endpoints |
| --- | --- |
| Authentication | `/auth/register`, `/auth/login`, `/auth/me`, password recovery endpoints |
| Profile and settings | `/profile`, `/settings` |
| Resume analysis | `/resume`, `/resume/{id}` |
| LinkedIn analysis | `/linkedin` |
| Project analysis | `/project` |
| Preparation | `/subjects`, `/domains`, `/ai-prep` |
| Interviews | `/interview/start`, `/interview/{id}/answer`, `/interview/{id}/end` |
| Reports | `/reports`, `/reports/{id}`, `/reports/{id}/pdf` |
| Roadmaps | `/roadmap`, `/roadmap/generate` |
| Dashboard | `/dashboard` and dashboard metrics endpoints |
| Notifications | `/notifications` |

The complete request and response schemas are available in Swagger UI at `/docs` while the backend is running.

## Security and Privacy

- Keep Supabase service-role keys and Gemini keys on the backend only.
- Use a strong production JWT secret.
- Serve the frontend and backend over HTTPS in production.
- Validate uploaded file type and size before storing resumes.
- Protect user-owned records with authentication checks and Supabase Row-Level Security.
- Never commit credentials, tokens, generated reports, or local environment files.

## Troubleshooting

### Backend connection error

Check that FastAPI is running and that the health endpoint responds:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Expected response:

```json
{"status":"ok","service":"CrackIt API"}
```

If the port is already in use, stop the old process or run FastAPI on another port and update `VITE_API_URL` and `FRONTEND_URL`.

### Authentication errors

Sign out or clear the site's local storage, then sign in again. Also confirm that Supabase credentials and database tables are configured correctly.

### CORS errors

Set `FRONTEND_URL` to the exact frontend origin, including the port, and restart FastAPI after changing environment variables.

## Development Guidelines

- Keep frontend API calls in `frontend/src/lib/api.ts`.
- Keep authentication state in `frontend/src/app/AuthContext.tsx` and authentication helpers.
- Add backend endpoints under `backend/app/api/` with schemas under `backend/app/schemas/`.
- Put reusable business logic in backend services rather than route handlers.
- Keep user-owned database records protected by RLS.
- Run the frontend build and backend syntax checks before committing.

## Academic Project Details

- Project: AI-Based Interview Preparation Platform
- Students: Dhruti Movaliya (24DCS057), Dhrupal Godhani (24DCS029)
- Institute: Devang Patel Institute of Advance Technology & Research (DEPSTAR), CHARUSAT
- Academic year: 2026-27

## License

This project is developed for academic and educational use.
