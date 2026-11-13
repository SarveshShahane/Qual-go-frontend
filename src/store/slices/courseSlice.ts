import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { extractErrorMessage } from '../../api/axios';
import * as courseApi from '../../api/courses';
import { loadStoredCourseNav } from '../storage';
import type {
  Module,
  ModuleDetail,
  ChapterTopics,
  CourseState,
} from '../../types/course';

const storedNav = loadStoredCourseNav();

const initialState: CourseState = {
  modules: [],
  currentModule: null,
  currentChapter: null,
  currentTopicContent: null,
  currentTopicQuestionType: null,
  navigation: storedNav || {
    moduleId: null,
    chapterId: null,
    topicId: null,
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchModules = createAsyncThunk<
  Module[],
  void,
  { rejectValue: string }
>('course/fetchModules', async (_, { rejectWithValue }) => {
  try {
    return await courseApi.getModules();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchModule = createAsyncThunk<
  ModuleDetail,
  string,
  { rejectValue: string }
>('course/fetchModule', async (moduleId, { rejectWithValue }) => {
  try {
    return await courseApi.getModule(moduleId);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchChapterTopics = createAsyncThunk<
  ChapterTopics,
  { moduleId: string; chapterId: string },
  { rejectValue: string }
>('course/fetchChapterTopics', async ({ moduleId, chapterId }, { rejectWithValue }) => {
  try {
    return await courseApi.getChapterTopics(moduleId, chapterId);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchTopicContent = createAsyncThunk<
  { content: string; question_type?: string | null },
  { moduleId: string; chapterId: string; topicId: string },
  { rejectValue: string }
>('course/fetchTopicContent', async ({ moduleId, chapterId, topicId }, { rejectWithValue }) => {
  try {
    return await courseApi.getTopicContent(moduleId, chapterId, topicId);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const markTopicComplete = createAsyncThunk<
  { topicId: string; completed: boolean },
  { moduleId: string; chapterId: string; topicId: string; completed?: boolean },
  { rejectValue: string }
>('course/markTopicComplete', async ({ moduleId, chapterId, topicId, completed = true }, { rejectWithValue }) => {
  try {
    await courseApi.updateTopicProgress(moduleId, chapterId, topicId, completed);
    return { topicId, completed };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    clearCourseError: (state) => {
      state.error = null;
    },
    navigateToModules: (state) => {
      state.navigation = { moduleId: null, chapterId: null, topicId: null };
      state.currentModule = null;
      state.currentChapter = null;
      state.currentTopicContent = null;
      state.currentTopicQuestionType = null;
    },
    navigateToModule: (state, action: { payload: string }) => {
      state.navigation = { moduleId: action.payload, chapterId: null, topicId: null };
      state.currentChapter = null;
      state.currentTopicContent = null;
      state.currentTopicQuestionType = null;
    },
    navigateToTopic: (state, action: { payload: { moduleId: string; chapterId: string; topicId: string } }) => {
      state.navigation = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchModules
    builder
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch modules';
      });

    // fetchModule
    builder
      .addCase(fetchModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModule.fulfilled, (state, action) => {
        state.loading = false;
        state.currentModule = action.payload;
      })
      .addCase(fetchModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch module';
      });

    // fetchChapterTopics
    builder
      .addCase(fetchChapterTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChapterTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChapter = action.payload;
      })
      .addCase(fetchChapterTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch chapter topics';
      });

    // fetchTopicContent
    builder
      .addCase(fetchTopicContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicContent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTopicContent = action.payload.content;
        state.currentTopicQuestionType = action.payload.question_type || null;
      })
      .addCase(fetchTopicContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch topic content';
      });

    // markTopicComplete
    builder
      .addCase(markTopicComplete.fulfilled, (state, action) => {
        const { topicId, completed } = action.payload;
        // Update in currentChapter topics list
        if (state.currentChapter) {
          const topic = state.currentChapter.topics.find((t) => t.id === topicId);
          if (topic) {
            topic.completed = completed;
            // Recalculate completed count
            state.currentChapter.completed_topics = state.currentChapter.topics.filter(
              (t) => t.completed
            ).length;
          }
        }
      })
      .addCase(markTopicComplete.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update progress';
      });
  },
});

export const {
  clearCourseError,
  navigateToModules,
  navigateToModule,
  navigateToTopic,
} = courseSlice.actions;

export default courseSlice.reducer;
