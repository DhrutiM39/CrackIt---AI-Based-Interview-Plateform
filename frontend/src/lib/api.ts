// ─── Centralized API client ───────────────────────────────────────────────────
// Uses native fetch with automatic Authorization header injection.

import { clearAuth, getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getToken();

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? (options.body as FormData) : (options.body ? JSON.stringify(options.body) : undefined),
    });
  } catch {
    throw new Error(`Unable to reach the CrackIt backend at ${BASE_URL}. Start FastAPI and try again.`);
  }

  // 401 → clear auth and redirect to login
  if (res.status === 401) {
    clearAuth();
    window.location.href = "/";
    throw new Error("Unauthorized — please log in again");
  }

  // Parse error response
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      detail = err.detail ?? err.message ?? detail;
    } catch { /* ignore */ }
    throw new Error(detail);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// ─── Convenience methods ──────────────────────────────────────────────────────
export const api = {
  get:    <T>(path: string, opts?: RequestOptions) => request<T>("GET",    path, opts),
  post:   <T>(path: string, opts?: RequestOptions) => request<T>("POST",   path, opts),
  put:    <T>(path: string, opts?: RequestOptions) => request<T>("PUT",    path, opts),
  patch:  <T>(path: string, opts?: RequestOptions) => request<T>("PATCH",  path, opts),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, opts),
};

// ─── Auth-specific API calls ──────────────────────────────────────────────────
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface MeResponse {
  id: string;
  full_name: string;
  email: string;
  target_job_role?: string;
  experience_level?: string;
  streak_count: number;
}

export const authApi = {
  signup: (full_name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/signup", { body: { full_name, email, password } }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { body: { email, password } }),

  me: () => api.get<MeResponse>("/auth/me"),
};

// ─── Resume-specific API calls ────────────────────────────────────────────────
export interface SectionScore {
  name: string;
  score: number;
  tips: string[];
}

export interface KeywordMatch {
  word: string;
  found: boolean;
}

export interface ResumeAnalysisResult {
  overall_score: number;
  ats_score: number;
  job_role_match: number;
  readability_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  missing_skills: string[];
  formatting_issues: string[];
  improvements: string[];
  sections: SectionScore[];
  keywords: KeywordMatch[];
}

export const resumeApi = {
  analyze: (file: File, targetRole?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (targetRole) {
      formData.append("target_role", targetRole);
    }
    return api.post<ResumeAnalysisResult>("/resume/analyze", { body: formData });
  },
  
  getHistory: () => api.get<any[]>("/resume/analyses"),
};

// ─── Prep-specific API calls ──────────────────────────────────────────────────
export const subjectsApi = {
  getAll: () => api.get<any[]>("/subjects"),
  getDetail: (id: string | number) => api.get<any>(`/subjects/${id}`),
  getQuestions: (id: string | number) => api.get<any[]>(`/subjects/${id}/questions`),
  submitAnswer: (questionId: string | number, answer: string) => 
    api.post<any>(`/subjects/questions/${questionId}/answer`, { body: { answer } }),
};

export const domainsApi = {
  getAll: () => api.get<any[]>("/domains"),
  getDetail: (id: string | number) => api.get<any>(`/domains/${id}`),
  getQuestions: (id: string | number) => api.get<any[]>(`/domains/${id}/questions`),
  submitAnswer: (questionId: string | number, answer: string) => 
    api.post<any>(`/domains/questions/${questionId}/answer`, { body: { answer } }),
};

export const aiPrepApi = {
  generateQuestions: (params: {
    job_role?: string;
    domain?: string;
    skills?: string[];
    difficulty?: string;
    number_of_questions?: number;
    category?: string;
  }) => api.post<any>("/questions/generate", { body: params }),
};

// ─── Interview-specific API calls ──────────────────────────────────────────────

export interface InterviewSessionPayload {
  interview_type: string;
  target_role: string;
  difficulty: string;
}

export interface QuestionAnswerPayload {
  question_text: string;
  sequence_no: number;
  answer_text?: string;
  ai_score?: number;
  ai_feedback?: string;
}

export const interviewsApi = {
  start: (payload: { interview_type: string; target_role: string; difficulty: string; number_of_questions?: number }) =>
    api.post<any>("/interview/start", { body: payload }),
  answer: (payload: { session_id: number; question_id: number; answer_text: string }) =>
    api.post<any>("/interview/answer", { body: payload }),
  get: (sessionId: number) => api.get<any>(`/interview/${sessionId}`),
  finish: (sessionId: number) => api.post<any>(`/interview/${sessionId}/finish`),
  history: () => api.get<any[]>("/interview/history"),
  createSession: (payload: InterviewSessionPayload) =>
    api.post<any>("/interviews/sessions", { body: payload }),

  saveAnswer: (sessionId: number, payload: QuestionAnswerPayload) =>
    api.post<any>(`/interviews/sessions/${sessionId}/answers`, { body: payload }),

  endSession: (sessionId: number) =>
    api.post<any>(`/interviews/sessions/${sessionId}/end`),

  listSessions: () => api.get<any[]>("/interviews/sessions"),
};

// ─── Report-specific API calls ────────────────────────────────────────────────

export interface QuestionPerformance {
  sequence_no: number;
  question_text: string;
  answer_text?: string;
  score?: number;
  feedback?: string;
  grade?: string;
}

export interface Report {
  id: number;
  session_id: number;
  user_name?: string;
  target_role?: string;
  interview_type?: string;
  difficulty?: string;
  interview_date?: string;
  duration_seconds?: number;
  overall_score?: number;
  technical_score?: number;
  communication_score?: number;
  strengths?: string[];
  weaknesses?: string[];
  missed_concepts?: string[];
  recommended_topics?: string[];
  summary?: string;
  next_steps?: string[];
  question_performance?: QuestionPerformance[];
  generated_at?: string;
}

export interface ReportSummary {
  id: number;
  session_id: number;
  target_role?: string;
  interview_type?: string;
  difficulty?: string;
  interview_date?: string;
  overall_score?: number;
  technical_score?: number;
  communication_score?: number;
  generated_at?: string;
}

export const reportsApi = {
  generate: (session_id: number) =>
    api.post<Report>("/reports/generate", { body: { session_id } }),

  list: () => api.get<ReportSummary[]>("/reports"),

  getById: (id: number) => api.get<Report>(`/reports/${id}`),

  /** Download PDF — returns a Blob URL for <a> download. */
  downloadPdf: async (id: number, filename: string): Promise<void> => {
    const token = (await import("./auth")).getToken();
    const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8000";
    const res = await fetch(`${BASE_URL}/reports/${id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`PDF download failed: HTTP ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

// ─── Dashboard API ────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  overall_progress: number;
  study_streak: number;
  mock_interviews_done: number;
  average_interview_score: number;
  latest_interview_score?: number;
  goals_completed: number;
  total_goals: number;

  weekly_activity: { day: string; topics: number; mock: number }[];
  monthly_progress: { week: string; progress: number; target: number }[];
  skills_growth: { month: string; DSA: number; System: number; OOP: number; SQL: number }[];
  recent_activity: { id: string; type: string; label: string; time: string; color: string }[];

  subject_completion: { id: number; name: string; progress: number; color: string }[];
  domain_completion: { id: number; name: string; progress: number; color: string }[];

  interview_history: { type: string; score: number; date: string; grade: string; color: string }[];
  analysis_history: { name: string; score: number; color: string; date?: string; type: string }[];
}

export const dashboardApi = {
  getMetrics: () => api.get<DashboardMetrics>("/dashboard/metrics"),
};

// ─── New Feature APIs ─────────────────────────────────────────────────────────

export const linkedinApi = {
  analyze: (payload: any) => api.post<any>("/linkedin/analyze", { body: payload }),
  getHistory: () => api.get<any[]>("/linkedin/analyses"),
  getById: (id: string | number) => api.get<any>(`/linkedin/analyses/${id}`),
};

export const projectsApi = {
  analyze: (payload: any) => api.post<any>("/projects/analyze", { body: payload }),
  list: () => api.get<any[]>("/projects"),
  getById: (id: string | number) => api.get<any>(`/projects/${id}`),
};

export const notificationsApi = {
  list: () => api.get<any[]>("/notifications"),
  markRead: (id: string | number) => api.patch<any>(`/notifications/${id}/read`),
};

export const profileApi = {
  get: () => api.get<any>("/profile"),
  update: (payload: any) => api.patch<any>("/profile", { body: payload }),
};

export const settingsApi = {
  get: () => api.get<any>("/settings"),
  update: (payload: any) => api.patch<any>("/settings", { body: payload }),
};

export const roadmapApi = {
  generate: (payload: any) => api.post<any>("/roadmap/generate", { body: payload }),
  list: () => api.get<any[]>("/roadmap"),
  getById: (id: string | number) => api.get<any>(`/roadmap/${id}`),
};

