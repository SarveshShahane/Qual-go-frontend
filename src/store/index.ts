import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import { saveStoredAuth, saveStoredCourseNav } from './storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
  },
});

// Auto-sync state changes to persistent storage
let prevAuth = store.getState().auth;
let prevNav = store.getState().course.navigation;

store.subscribe(() => {
  const state = store.getState();
  if (state.auth !== prevAuth) {
    prevAuth = state.auth;
    saveStoredAuth(state.auth);
  }
  if (state.course.navigation !== prevNav) {
    prevNav = state.course.navigation;
    saveStoredCourseNav(state.course.navigation);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
