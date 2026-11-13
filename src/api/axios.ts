import axios, { type InternalAxiosRequestConfig } from 'axios';
import { clearStoredAuth, loadStoredAuth, saveStoredAuth } from '../store/storage';
import type { AuthResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables sending and receiving HttpOnly cookies (refresh_token)
});

// Initialize in-memory credentials immediately from persistent storage
const storedAuth = loadStoredAuth();
let currentAccessToken: string | null = storedAuth?.accessToken ?? null;
let currentCsrfToken: string | null = storedAuth?.csrfToken ?? null;

export const setAuthToken = (token: string | null) => {
  currentAccessToken = token;
};

export const getAuthToken = (): string | null => {
  return currentAccessToken;
};

type CsrfListener = (token: string | null) => void;
const csrfListeners: Set<CsrfListener> = new Set();

export const subscribeToCsrfToken = (listener: CsrfListener): (() => void) => {
  csrfListeners.add(listener);
  return () => {
    csrfListeners.delete(listener);
  };
};

export const setCsrfToken = (token: string | null) => {
  if (currentCsrfToken !== token) {
    currentCsrfToken = token;
    csrfListeners.forEach((listener) => {
      try {
        listener(token);
      } catch {
        // ignore listener errors
      }
    });
  }
};

// Helper to extract CSRF token from browser cookies as fallback
export const getCookieCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const getCsrfToken = (): string | null => {
  return currentCsrfToken || getCookieCsrfToken();
};

// Request interceptor to attach bearer access token & CSRF token
apiClient.interceptors.request.use(
  (config) => {
    if (currentAccessToken) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }

    const csrf = currentCsrfToken || getCookieCsrfToken();
    if (csrf) {
      config.headers['X-CSRF-Token'] = csrf;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Concurrency control for background token refreshing
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Response interceptor to auto-capture CSRF tokens and handle seamless 401 token refresh
apiClient.interceptors.response.use(
  (response) => {
    const headerCsrf =
      response.headers['x-csrf-token'] ||
      response.headers['X-CSRF-Token'];
    if (typeof headerCsrf === 'string' && headerCsrf) {
      setCsrfToken(headerCsrf);
    } else if (response.data && typeof response.data.csrf_token === 'string') {
      setCsrfToken(response.data.csrf_token);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // Auto-refresh token if 401 Unauthorized on non-auth endpoints
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((newToken: string | null) => {
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt refresh via HttpOnly cookie
        const res = await axios.post<AuthResponse>(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.access_token;
        const newCsrfToken = res.data.csrf_token || null;

        setAuthToken(newAccessToken);
        if (newCsrfToken) setCsrfToken(newCsrfToken);

        if (res.data.user) {
          saveStoredAuth({
            isAuthenticated: true,
            user: res.data.user,
            accessToken: newAccessToken,
            csrfToken: newCsrfToken,
          });
        }

        onRefreshed(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        if (newCsrfToken) {
          originalRequest.headers['X-CSRF-Token'] = newCsrfToken;
        }

        return apiClient(originalRequest);
      } catch (refreshErr) {
        onRefreshed(null);
        clearStoredAuth();
        setAuthToken(null);
        setCsrfToken(null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper to extract clean error message from backend responses
export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail) && data.detail.length > 0) {
      // Pydantic validation errors
      return data.detail.map((err: { msg: string }) => err.msg).join(', ');
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
