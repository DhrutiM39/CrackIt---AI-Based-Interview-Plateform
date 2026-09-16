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

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? (options.body as FormData) : (options.body ? JSON.stringify(options.body) : undefined),
  });

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

