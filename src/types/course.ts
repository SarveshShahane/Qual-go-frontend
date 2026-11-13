// Module list item from GET /api/v1/modules
export interface Module {
  id: string;
  name: string;
  total_chapters: number;
  completed_chapters: number;
}

// Module detail from GET /api/v1/modules/{id}
export interface ModuleDetail {
  id: string;
  name: string;
  total_topics: number;
  completed_topics: number;
  chapters: ChapterSummary[];
}

// Chapter summary (used in module detail and chapter list)
export interface ChapterSummary {
  id: string;
  name: string;
}

// Chapter topics from GET /api/v1/modules/{id}/{chapter}
export interface ChapterTopics {
  chapter_id: string;
  total_topics: number;
  completed_topics: number;
  topics: TopicItem[];
}

// Topic item with progress
export interface TopicItem {
  id: string;
  name: string;
  completed: boolean;
  question_type?: 'mcq' | 'code' | 'reading' | string | null;
}

// Request payloads
export interface CreateModulePayload {
  moduleName: string;
}

export interface CreateChapterPayload {
  chapterName: string;
}

export interface CreateTopicPayload {
  topicName: string;
  contentPath?: string | null;
  content?: string | null;
  questionType?: string | null;
}

export interface UpdateResourcePayload {
  name?: string | null;
  content?: string | null;
  questionType?: string | null;
}

export interface TopicContentData {
  content: string;
  question_type?: 'mcq' | 'code' | 'reading' | string | null;
}

// Navigation state for the course views
export interface CourseNavigation {
  moduleId: string | null;
  chapterId: string | null;
  topicId: string | null;
}

// Redux state
export interface CourseState {
  modules: Module[];
  currentModule: ModuleDetail | null;
  currentChapter: ChapterTopics | null;
  currentTopicContent: string | null;
  currentTopicQuestionType: 'mcq' | 'code' | 'reading' | string | null;
  navigation: CourseNavigation;
  loading: boolean;
  error: string | null;
}
