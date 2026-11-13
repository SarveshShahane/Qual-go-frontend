import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import {
  clearStoredAuth,
  loadStoredAppView,
  loadStoredAuth,
  loadStoredCourseNav,
  saveStoredAppView,
  saveStoredAuth,
  saveStoredCourseNav,
} from '../storage';

describe('Redux store persistent storage utilities', () => {
  let storeMock: Record<string, string> = {};

  const localStorageMock = {
    getItem: (key: string) => storeMock[key] ?? null,
    setItem: (key: string, value: string) => {
      storeMock[key] = value;
    },
    removeItem: (key: string) => {
      delete storeMock[key];
    },
    clear: () => {
      storeMock = {};
    },
  };

  const originalWindow = globalThis.window;

  beforeAll(() => {
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: localStorageMock,
    };
  });

  afterAll(() => {
    (globalThis as unknown as { window: unknown }).window = originalWindow;
  });

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('loads null when no auth data is stored', () => {
    expect(loadStoredAuth()).toBeNull();
  });

  it('saves and loads valid auth data', () => {
    const authData = {
      isAuthenticated: true,
      user: { id: 10, username: 'quantum_dev', email: 'dev@qual.dev' },
      accessToken: 'access-token-12345',
      csrfToken: 'csrf-token-abcde',
    };

    saveStoredAuth(authData);
    const loaded = loadStoredAuth();

    expect(loaded).not.toBeNull();
    expect(loaded?.user.username).toBe('quantum_dev');
    expect(loaded?.accessToken).toBe('access-token-12345');
    expect(loaded?.csrfToken).toBe('csrf-token-abcde');
  });

  it('clears stored auth when isAuthenticated is false', () => {
    saveStoredAuth({
      isAuthenticated: true,
      user: { id: 10, username: 'quantum_dev', email: 'dev@qual.dev' },
      accessToken: 'token-xyz',
    });

    expect(loadStoredAuth()).not.toBeNull();

    saveStoredAuth({ isAuthenticated: false });
    expect(loadStoredAuth()).toBeNull();
  });

  it('explicit clearStoredAuth removes data from localStorage', () => {
    saveStoredAuth({
      isAuthenticated: true,
      user: { id: 1, username: 'test', email: 'test@example.com' },
      accessToken: 'token-abc',
    });
    expect(loadStoredAuth()).not.toBeNull();

    clearStoredAuth();
    expect(loadStoredAuth()).toBeNull();
  });

  it('manages persisted app view', () => {
    expect(loadStoredAppView('home')).toBe('home');

    saveStoredAppView('courses');
    expect(loadStoredAppView('home')).toBe('courses');

    saveStoredAppView('designer');
    expect(loadStoredAppView('home')).toBe('designer');
  });

  it('manages persisted course navigation', () => {
    expect(loadStoredCourseNav()).toBeNull();

    saveStoredCourseNav({
      moduleId: 'mod-1',
      chapterId: 'chap-2',
      topicId: 'top-3',
    });

    const loadedNav = loadStoredCourseNav();
    expect(loadedNav).toEqual({
      moduleId: 'mod-1',
      chapterId: 'chap-2',
      topicId: 'top-3',
    });
  });
});
