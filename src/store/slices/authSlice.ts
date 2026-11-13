import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  apiClient,
  extractErrorMessage,
  getAuthToken,
  setAuthToken,
  setCsrfToken,
} from '../../api/axios';
import { clearStoredAuth, loadStoredAuth } from '../storage';
import type {
  AuthResponse,
  AuthState,
  CsrfResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  User,
} from '../../types/auth';

// Initialize state from persistent storage immediately to prevent logout flash on page refresh
const persistedAuth = loadStoredAuth();

const initialState: AuthState = {
  user: persistedAuth?.user ?? null,
  accessToken: persistedAuth?.accessToken ?? null,
  csrfToken: persistedAuth?.csrfToken ?? null,
  isAuthenticated: persistedAuth ? !!(persistedAuth.user && persistedAuth.accessToken) : false,
  loading: false,
  error: null,
};

// Async thunk to fetch a fresh CSRF token from the backend
export const fetchCsrfToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('auth/fetchCsrfToken', async (_, { rejectWithValue }) => {
  try {
    // Try /api/v1/auth/csrf-token first, fallback to /auth/csrf-token
    let response;
    try {
      response = await apiClient.get<CsrfResponse>('/api/v1/auth/csrf-token');
    } catch {
      response = await apiClient.get<CsrfResponse>('/auth/csrf-token');
    }

    const token =
      response.data?.csrf_token ||
      (response.headers['x-csrf-token'] as string | undefined) ||
      (response.headers['X-CSRF-Token'] as string | undefined);

    if (!token) {
      return rejectWithValue('No CSRF token returned from server');
    }

    setCsrfToken(token);
    return token;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Async thunk to restore/revalidate session in the background on app load
export const restoreSession = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    // 1. Try refreshing via the HttpOnly cookie
    try {
      const res = await apiClient.post<AuthResponse>('/api/v1/auth/refresh');
      setAuthToken(res.data.access_token);
      if (res.data.csrf_token) {
        setCsrfToken(res.data.csrf_token);
      }
      return res.data;
    } catch {
      // 2. Fallback: try fetching current user with existing access token
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No active session token');
      }
      const meRes = await apiClient.get<{ success: boolean; user: User; csrf_token?: string }>('/api/v1/auth/me');
      if (meRes.data.csrf_token) {
        setCsrfToken(meRes.data.csrf_token);
      }
      return {
        success: true,
        access_token: token,
        token_type: 'bearer',
        csrf_token: meRes.data.csrf_token,
        user: meRes.data.user,
      };
    }
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<RegisterResponse>('/auth/register', payload);
    if (response.data.csrf_token) {
      setCsrfToken(response.data.csrf_token);
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Async thunk for user login
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    setAuthToken(response.data.access_token);
    if (response.data.csrf_token) {
      setCsrfToken(response.data.csrf_token);
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Async thunk for user logout
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Even if backend fails, we proceed to clean up local state
    return rejectWithValue(extractErrorMessage(error));
  } finally {
    setAuthToken(null);
    setCsrfToken(null);
    clearStoredAuth();
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCsrfTokenAction: (state, action: PayloadAction<string | null>) => {
      state.csrfToken = action.payload;
      setCsrfToken(action.payload);
    },
    logoutLocal: (state) => {
      state.user = null;
      state.accessToken = null;
      state.csrfToken = null;
      state.isAuthenticated = false;
      state.error = null;
      setAuthToken(null);
      setCsrfToken(null);
      clearStoredAuth();
    },
  },
  extraReducers: (builder) => {
    // CSRF Token
    builder
      .addCase(fetchCsrfToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.csrfToken = action.payload;
      })
      .addCase(fetchCsrfToken.rejected, (state, action) => {
        state.error = action.payload || null;
      });

    // Session Restore
    builder
      .addCase(restoreSession.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload.access_token;
        state.user = action.payload.user;
        if (action.payload.csrf_token) {
          state.csrfToken = action.payload.csrf_token;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        // If restoring session was rejected due to invalid credentials, clear stored state
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.csrfToken = null;
        clearStoredAuth();
        setAuthToken(null);
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.loading = false;
        state.error = null;
        if (action.payload.csrf_token) {
          state.csrfToken = action.payload.csrf_token;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access_token;
        state.user = action.payload.user;
        if (action.payload.csrf_token) {
          state.csrfToken = action.payload.csrf_token;
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.csrfToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.csrfToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setCsrfTokenAction, logoutLocal } = authSlice.actions;

// Selectors
export const selectCsrfToken = (state: { auth: AuthState }) => state.auth.csrfToken;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
