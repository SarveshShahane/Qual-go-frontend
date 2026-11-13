import type { AuthState, User } from '../types/auth';

export const AUTH_STORAGE_KEY = 'qualgo_auth_state';
export const APP_VIEW_STORAGE_KEY = 'qualgo_app_view';
export const COURSE_NAV_STORAGE_KEY = 'qualgo_course_nav';

export interface StoredAuthData {
  user: User;
  accessToken: string;
  csrfToken: string | null;
}

export interface StoredCourseNav {
  moduleId: string | null;
  chapterId: string | null;
  topicId: string | null;
}

/**
 * Safely loads persisted authentication state from localStorage.
 */
export function loadStoredAuth(): StoredAuthData | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.user && typeof parsed.accessToken === 'string' && parsed.accessToken) {
      return {
        user: parsed.user,
        accessToken: parsed.accessToken,
        csrfToken: typeof parsed.csrfToken === 'string' ? parsed.csrfToken : null,
      };
    }
  } catch (err) {
    console.warn('Failed to load stored auth state from localStorage:', err);
  }
  return null;
}

/**
 * Persists current authentication state to localStorage.
 */
export function saveStoredAuth(auth: Partial<AuthState>): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    if (auth.isAuthenticated && auth.user && auth.accessToken) {
      const data: StoredAuthData = {
        user: auth.user,
        accessToken: auth.accessToken,
        csrfToken: auth.csrfToken ?? null,
      };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    } else {
      clearStoredAuth();
    }
  } catch (err) {
    console.warn('Failed to save auth state to localStorage:', err);
  }
}

/**
 * Clears stored auth state from localStorage.
 */
export function clearStoredAuth(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear stored auth state:', err);
  }
}

/**
 * Safely loads persisted app view (e.g. 'home', 'courses', 'designer', 'auth').
 */
export function loadStoredAppView<T extends string>(fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const saved = window.localStorage.getItem(APP_VIEW_STORAGE_KEY);
    if (saved) return saved as T;
  } catch {
    // ignore
  }
  return fallback;
}

/**
 * Persists app view to localStorage.
 */
export function saveStoredAppView(view: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(APP_VIEW_STORAGE_KEY, view);
  } catch {
    // ignore
  }
}

/**
 * Safely loads persisted course navigation.
 */
export function loadStoredCourseNav(): StoredCourseNav | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(COURSE_NAV_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Persists course navigation to localStorage.
 */
export function saveStoredCourseNav(nav: StoredCourseNav): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(COURSE_NAV_STORAGE_KEY, JSON.stringify(nav));
  } catch {
    // ignore
  }
}
