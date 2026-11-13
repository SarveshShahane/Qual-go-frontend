import { apiClient, getCsrfToken } from './axios';
import type {
  Module,
  ModuleDetail,
  ChapterSummary,
  ChapterTopics,
  CreateModulePayload,
  CreateChapterPayload,
  CreateTopicPayload,
  UpdateResourcePayload,
} from '../types/course';

// Helper for CSRF headers on state-changing requests
function csrfHeaders(): Record<string, string> {
  const token = getCsrfToken();
  return token ? { 'X-CSRF-Token': token } : {};
}

// ---- Modules ----

export async function getModules(): Promise<Module[]> {
  const res = await apiClient.get<{ success: boolean; modules: Module[] }>('/api/v1/modules');
  return res.data.modules;
}

export async function getModule(id: string): Promise<ModuleDetail> {
  const res = await apiClient.get<{ success: boolean; module: ModuleDetail }>(`/api/v1/modules/${id}`);
  return res.data.module;
}

export async function createModule(payload: CreateModulePayload): Promise<string> {
  const res = await apiClient.post<{ success: boolean; id: string }>('/api/v1/modules', payload, {
    headers: csrfHeaders(),
  });
  return res.data.id;
}

export async function updateModule(id: string, payload: UpdateResourcePayload): Promise<void> {
  await apiClient.patch(`/api/v1/modules/${id}`, payload, {
    headers: csrfHeaders(),
  });
}

export async function deleteModule(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/modules/${id}`, {
    headers: csrfHeaders(),
  });
}

// ---- Chapters ----

export async function getChapters(moduleId: string): Promise<ChapterSummary[]> {
  const res = await apiClient.get<{ success: boolean; chapters: ChapterSummary[] }>(
    `/api/v1/modules/${moduleId}/chapters`
  );
  return res.data.chapters;
}

export async function createChapter(moduleId: string, payload: CreateChapterPayload): Promise<string> {
  const res = await apiClient.post<{ success: boolean; id: string }>(
    `/api/v1/modules/${moduleId}`,
    payload,
    { headers: csrfHeaders() }
  );
  return res.data.id;
}

export async function updateChapter(
  moduleId: string,
  chapterId: string,
  payload: UpdateResourcePayload
): Promise<void> {
  await apiClient.patch(`/api/v1/modules/${moduleId}/${chapterId}`, payload, {
    headers: csrfHeaders(),
  });
}

export async function deleteChapter(moduleId: string, chapterId: string): Promise<void> {
  await apiClient.delete(`/api/v1/modules/${moduleId}/${chapterId}`, {
    headers: csrfHeaders(),
  });
}

// ---- Chapter Topics ----

export async function getChapterTopics(moduleId: string, chapterId: string): Promise<ChapterTopics> {
  const res = await apiClient.get<{
    success: boolean;
    chapter_id: string;
    total_topics: number;
    completed_topics: number;
    topics: { id: string; name: string; completed: boolean }[];
  }>(`/api/v1/modules/${moduleId}/${chapterId}`);
  return {
    chapter_id: res.data.chapter_id,
    total_topics: res.data.total_topics,
    completed_topics: res.data.completed_topics,
    topics: res.data.topics,
  };
}

export async function createTopic(
  moduleId: string,
  chapterId: string,
  payload: CreateTopicPayload
): Promise<string> {
  const res = await apiClient.post<{ success: boolean; id: string }>(
    `/api/v1/modules/${moduleId}/${chapterId}`,
    payload,
    { headers: csrfHeaders() }
  );
  return res.data.id;
}

export async function updateTopic(
  moduleId: string,
  chapterId: string,
  topicId: string,
  payload: UpdateResourcePayload
): Promise<void> {
  await apiClient.patch(`/api/v1/modules/${moduleId}/${chapterId}/${topicId}`, payload, {
    headers: csrfHeaders(),
  });
}

export async function deleteTopic(
  moduleId: string,
  chapterId: string,
  topicId: string
): Promise<void> {
  await apiClient.delete(`/api/v1/modules/${moduleId}/${chapterId}/${topicId}`, {
    headers: csrfHeaders(),
  });
}

// ---- Topic Content ----

export async function getTopicContent(
  moduleId: string,
  chapterId: string,
  topicId: string
): Promise<{ content: string; question_type?: string | null }> {
  const res = await apiClient.get<{ success: boolean; content: string; question_type?: string | null }>(
    `/api/v1/modules/${moduleId}/${chapterId}/${topicId}`
  );
  return {
    content: res.data.content,
    question_type: res.data.question_type,
  };
}

// ---- Progress ----

export async function updateTopicProgress(
  moduleId: string,
  chapterId: string,
  topicId: string,
  completed: boolean = true
): Promise<void> {
  await apiClient.post(
    `/api/v1/modules/${moduleId}/${chapterId}/${topicId}/progress`,
    null,
    {
      params: { completed },
      headers: csrfHeaders(),
    }
  );
}
