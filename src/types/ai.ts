import type { CanonicalCircuit, SimulationResponse } from './circuit';

export type TutoringMode = 'explain' | 'hint' | 'socratic' | 'debug' | 'generate';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export type AIDiagnosticSeverity = 'error' | 'warning' | 'info';

export type AIDiagnosticCategory = 'syntax' | 'quantum_concept' | 'hardware_limit' | 'logic_mismatch';

export interface AIDiagnostic {
  severity: AIDiagnosticSeverity;
  category: AIDiagnosticCategory;
  line?: number | null;
  problem: string;
  cause: string;
  suggested_fix: string;
  corrected_snippet?: string | null;
}

export interface AIHint {
  level: number; // 1 to 4
  label: string;
  content: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  reason: string;
  target_module: string;
  target_chapter?: string | null;
  difficulty: string;
  priority: number;
}

export interface AISourceReference {
  module_id: string;
  module_name: string;
  chapter_id?: string | null;
  chapter_name?: string | null;
  snippet: string;
}

export interface TopicMastery {
  topic_id: string;
  topic_name: string;
  score: number;
  confidence: number;
  status: 'needs_review' | 'learning' | 'mastered';
}

export interface LearnerProfile {
  user_id?: number | null;
  completed_topics: string[];
  weak_topics: string[];
  strong_topics: string[];
  recent_mistakes: string[];
  assessment_scores: Record<string, number>;
  hint_dependency_score: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  circuit?: CanonicalCircuit | null;
  code?: string | null;
  diagnostics?: AIDiagnostic[] | null;
  hints?: AIHint[] | null;
  recommendations?: AIRecommendation[] | null;
  sources?: AISourceReference[] | null;
  suggestedFollowups?: string[];
}

export interface TutorContext {
  user_level: UserLevel;
  current_module?: string | null;
  current_chapter?: string | null;
  current_topic?: string | null;
  circuit?: CanonicalCircuit | null;
  code?: string | null;
  selected_code?: string | null;
  error_message?: string | null;
  simulation_result?: SimulationResponse | null;
  completed_topics?: string[];
  recent_mistakes?: string[];
  current_challenge_id?: string | null;
  hint_level?: number;
  tutoring_mode?: TutoringMode;
}

export interface TutorChatRequest {
  prompt: string;
  context?: TutorContext | null;
  history?: { role: 'user' | 'assistant' | 'system'; content: string }[];
}

export interface ExplainRequest {
  concept?: string | null;
  context?: TutorContext | null;
}

export interface GenerateCodeRequest {
  prompt: string;
  target_framework?: string;
  context?: TutorContext | null;
}

export interface GenerateCircuitRequest {
  prompt: string;
  context?: TutorContext | null;
}

export interface DebugRequest {
  code?: string | null;
  circuit?: CanonicalCircuit | null;
  error_message?: string | null;
  simulation_result?: SimulationResponse | null;
  context?: TutorContext | null;
}

export interface HintRequest {
  challenge_id?: string | null;
  hint_level: number;
  context?: TutorContext | null;
}

export interface RecommendationRequest {
  profile?: LearnerProfile | null;
  context?: TutorContext | null;
}

export interface AIResponse {
  type: 'explanation' | 'code' | 'debug' | 'hint' | 'recommendation' | 'circuit' | 'socratic';
  message: string;
  code?: string | null;
  language?: string | null;
  circuit?: CanonicalCircuit | null;
  diagnostics?: AIDiagnostic[] | null;
  recommendations?: AIRecommendation[] | null;
  hints?: AIHint[] | null;
  sources?: AISourceReference[] | null;
  suggested_followups?: string[];
  mastery_update?: TopicMastery | null;
  provider: string;
  model: string;
}
