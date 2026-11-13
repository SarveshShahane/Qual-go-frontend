import { apiClient } from './axios';
import type { CanonicalCircuit } from '../types/circuit';
import type {
  AIResponse,
  DebugRequest,
  ExplainRequest,
  GenerateCircuitRequest,
  GenerateCodeRequest,
  HintRequest,
  RecommendationRequest,
  TutorChatRequest,
} from '../types/ai';

export async function askAITutor(request: TutorChatRequest): Promise<AIResponse> {
  const res = await apiClient.post<AIResponse>('/api/v1/ai/chat', request);
  return res.data;
}

export async function explainConcept(request: ExplainRequest): Promise<AIResponse> {
  const res = await apiClient.post<AIResponse>('/api/v1/ai/explain', request);
  return res.data;
}

export async function generateAICode(request: GenerateCodeRequest): Promise<AIResponse> {
  const res = await apiClient.post<AIResponse>('/api/v1/ai/generate-code', request);
  return res.data;
}

export async function generateAICircuit(request: GenerateCircuitRequest): Promise<AIResponse> {
  const res = await apiClient.post<AIResponse>('/api/v1/ai/generate-circuit', request);
  return res.data;
}

export async function debugAICircuit(request: DebugRequest): Promise<AIResponse> {
  const res = await apiClient.post<AIResponse>('/api/v1/ai/debug', request);
  return res.data;
}

export async function getAIHint(request: HintRequest): Promise<AIResponse> {
  const res = await apiClient.post<AIResponse>('/api/v1/ai/hint', request);
  return res.data;
}

export async function getAIRecommendations(request: RecommendationRequest): Promise<AIResponse> {
  const res = await apiClient.post<AIResponse>('/api/v1/ai/recommendations', request);
  return res.data;
}

export async function analyzeAICircuit(circuit: CanonicalCircuit): Promise<AIResponse> {
  const res = await apiClient.post<AIResponse>('/api/v1/ai/analyze-circuit', circuit);
  return res.data;
}
