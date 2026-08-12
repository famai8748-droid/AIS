// ============================================================
// FindSelf Class (by AIS) — TypeScript Interfaces & Types
// ============================================================

export interface WeaknessAlert {
  id: number;
  topic: string;
  affected_students_pct: number;
  affected_students_count: number;
  severity: 'high' | 'medium' | 'low';
  recommended_remedial: string;
}

export interface TeacherAnalytics {
  classroom_name: string;
  total_students: number;
  average_score: number;
  weakness_alerts: WeaknessAlert[];
}

export interface CourseItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  icon: string;
}

export interface UserInfo {
  name: string;
  role: 'teacher' | 'student';
  school: string;
  verified_at: string;
}

export interface AuthResponse {
  status: string;
  verification_method: string;
  phone_number: string;
  user_info: UserInfo;
}

export interface HealthResponse {
  status: string;
  app: string;
  ais_edge_computing: boolean;
  typhoon_online: boolean;
  model: string;
}

export interface AIResult {
  status: string;
  source: string;
  content: string;
}

export interface RemedialResponse {
  status: string;
  source: string;
  content: string;
}

export interface SelfDiscoveryResponse {
  student_name: string;
  interests_input: string;
  ai_result: AIResult;
}

export interface ChatResponse {
  status: string;
  source: string;
  reply: string;
}

export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  source?: string;
  isLoading?: boolean;
  isTyping?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  icon: string;
  text: string;
}

export type RoleType = 'teacher' | 'student';
