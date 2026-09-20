import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiClient, extractErrorMessage, setAuthToken } from '../../api/axios';
import type {
  AuthResponse,
  AuthState,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from '../../types/auth';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<RegisterResponse>('/auth/register', payload);
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
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logoutLocal: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
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
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, logoutLocal } = authSlice.actions;
export default authSlice.reducer;

