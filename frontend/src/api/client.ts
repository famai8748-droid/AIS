// ============================================================
// FindSelf Class (by AIS) — API Client
// All requests proxy through Vite → FastAPI (port 8000)
// ============================================================

import type {
  HealthResponse,
  AuthResponse,
  TeacherAnalytics,
  RemedialResponse,
  SelfDiscoveryResponse,
  CourseItem,
  ChatResponse,
} from '../types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  /** GET /api/health */
  healthCheck: () => request<HealthResponse>('/health'),

  /** POST /api/auth/ais-verify */
  verifyAIS: (phone_number: string) =>
    request<AuthResponse>('/auth/ais-verify', {
      method: 'POST',
      body: JSON.stringify({ phone_number }),
    }),

  /** GET /api/teacher/analytics */
  teacherAnalytics: () => request<TeacherAnalytics>('/teacher/analytics'),

  /** POST /api/teacher/generate-remedial */
  generateRemedial: (topic: string, weakness_summary: string) =>
    request<RemedialResponse>('/teacher/generate-remedial', {
      method: 'POST',
      body: JSON.stringify({ topic, weakness_summary }),
    }),

  /** POST /api/student/self-discovery */
  selfDiscovery: (interests: string, student_name: string) =>
    request<SelfDiscoveryResponse>('/student/self-discovery', {
      method: 'POST',
      body: JSON.stringify({ interests, student_name }),
    }),

  /** GET /api/student/free-hub */
  freeHub: () => request<CourseItem[]>('/student/free-hub'),

  /** POST /api/chat/ollama */
  chatOllama: (message: string) =>
    request<ChatResponse>('/chat/ollama', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};
