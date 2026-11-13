import { describe, it, expect, beforeEach } from 'vitest';
import {
  apiClient,
  extractErrorMessage,
  getAuthToken,
  getCookieCsrfToken,
  getCsrfToken,
  setAuthToken,
  setCsrfToken,
  subscribeToCsrfToken,
} from '../axios';

describe('axios api client and csrf handling', () => {
  beforeEach(() => {
    setAuthToken(null);
    setCsrfToken(null);
  });

  it('manages auth tokens in memory', () => {
    expect(getAuthToken()).toBeNull();
    setAuthToken('sample-jwt-token');
    expect(getAuthToken()).toBe('sample-jwt-token');
    setAuthToken(null);
    expect(getAuthToken()).toBeNull();
  });

  it('checks apiClient defaults and cookie fallback', () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
    expect(getCookieCsrfToken()).toBeNull();
  });

  it('manages CSRF tokens in memory and notifies subscribers', () => {
    let notifiedValue: string | null = null;
    const unsubscribe = subscribeToCsrfToken((token) => {
      notifiedValue = token;
    });

    expect(getCsrfToken()).toBeNull();

    setCsrfToken('token.12345.sha256');
    expect(getCsrfToken()).toBe('token.12345.sha256');
    expect(notifiedValue).toBe('token.12345.sha256');

    unsubscribe();
    setCsrfToken('another-token');
    // Notified value shouldn't update after unsubscribe
    expect(notifiedValue).toBe('token.12345.sha256');
    expect(getCsrfToken()).toBe('another-token');
  });

  it('extracts error messages from various response formats', () => {
    const errorObj = new Error('Network unreachable');
    expect(extractErrorMessage(errorObj)).toBe('Network unreachable');

    expect(extractErrorMessage('string error')).toBe('An unexpected error occurred');
  });
});
