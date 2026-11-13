import { describe, it, expect } from 'vitest';
import authReducer, {
  clearError,
  fetchCsrfToken,
  loginUser,
  logoutLocal,
  logoutUser,
  registerUser,
  restoreSession,
  selectCsrfToken,
  selectCurrentUser,
  selectIsAuthenticated,
  setCsrfTokenAction,
} from '../authSlice';
import type { AuthState } from '../../../types/auth';

describe('authSlice CSRF & authentication state', () => {
  const initialAuthState: AuthState = {
    user: null,
    accessToken: null,
    csrfToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('handles clearError reducer', () => {
    const errorState: AuthState = { ...initialAuthState, error: 'Some error' };
    const nextState = authReducer(errorState, clearError());
    expect(nextState.error).toBeNull();
  });

  it('has initial csrfToken as null', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.csrfToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('handles setCsrfTokenAction reducer', () => {
    const nextState = authReducer(
      initialAuthState,
      setCsrfTokenAction('sample-csrf-token-123')
    );
    expect(nextState.csrfToken).toBe('sample-csrf-token-123');
  });

  it('handles fetchCsrfToken.fulfilled', () => {
    const token = 'csrf-token-hmac-sha256';
    const nextState = authReducer(
      initialAuthState,
      fetchCsrfToken.fulfilled(token, 'requestId')
    );
    expect(nextState.csrfToken).toBe(token);
    expect(nextState.error).toBeNull();
  });

  it('handles loginUser.fulfilled and stores csrf_token', () => {
    const authPayload = {
      success: true,
      access_token: 'jwt-access-token',
      token_type: 'bearer',
      csrf_token: 'new-csrf-token-login',
      user: {
        id: 1,
        username: 'alice',
        email: 'alice@example.com',
      },
    };

    const nextState = authReducer(
      initialAuthState,
      loginUser.fulfilled(authPayload, 'requestId', {
        email: 'alice@example.com',
        password: 'password123',
      })
    );

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.accessToken).toBe('jwt-access-token');
    expect(nextState.csrfToken).toBe('new-csrf-token-login');
    expect(nextState.user?.username).toBe('alice');
  });

  it('handles registerUser.fulfilled and stores csrf_token', () => {
    const registerPayload = {
      success: true,
      csrf_token: 'csrf-token-register',
      user: {
        id: 2,
        username: 'bob',
        email: 'bob@example.com',
      },
    };

    const nextState = authReducer(
      initialAuthState,
      registerUser.fulfilled(registerPayload, 'requestId', {
        username: 'bob',
        email: 'bob@example.com',
        password: 'password123',
      })
    );

    expect(nextState.csrfToken).toBe('csrf-token-register');
    expect(nextState.loading).toBe(false);
  });

  it('handles restoreSession.fulfilled and restores user session', () => {
    const sessionPayload = {
      success: true,
      access_token: 'restored-access-token',
      token_type: 'bearer',
      csrf_token: 'restored-csrf-token',
      user: {
        id: 5,
        username: 'charlie',
        email: 'charlie@qual.dev',
      },
    };

    const nextState = authReducer(
      initialAuthState,
      restoreSession.fulfilled(sessionPayload, 'requestId')
    );

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.accessToken).toBe('restored-access-token');
    expect(nextState.csrfToken).toBe('restored-csrf-token');
    expect(nextState.user?.username).toBe('charlie');
  });

  it('handles restoreSession.rejected by clearing session', () => {
    const activeState: AuthState = {
      user: { id: 5, username: 'charlie', email: 'charlie@qual.dev' },
      accessToken: 'expired-token',
      csrfToken: 'csrf-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const nextState = authReducer(
      activeState,
      restoreSession.rejected(new Error('Session expired'), 'requestId', undefined, 'Session expired')
    );

    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.accessToken).toBeNull();
    expect(nextState.user).toBeNull();
    expect(nextState.csrfToken).toBeNull();
  });

  it('handles logoutUser.fulfilled and resets csrfToken and credentials', () => {
    const loggedInState: AuthState = {
      user: { id: 1, username: 'alice', email: 'alice@example.com' },
      accessToken: 'valid-token',
      csrfToken: 'existing-csrf-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const nextState = authReducer(
      loggedInState,
      logoutUser.fulfilled(undefined, 'requestId')
    );

    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.accessToken).toBeNull();
    expect(nextState.csrfToken).toBeNull();
    expect(nextState.user).toBeNull();
  });

  it('handles logoutLocal and resets csrfToken', () => {
    const loggedInState: AuthState = {
      user: { id: 1, username: 'alice', email: 'alice@example.com' },
      accessToken: 'valid-token',
      csrfToken: 'existing-csrf-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const nextState = authReducer(loggedInState, logoutLocal());

    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.accessToken).toBeNull();
    expect(nextState.csrfToken).toBeNull();
    expect(nextState.user).toBeNull();
  });

  it('selectors extract correct fields', () => {
    const rootState = {
      auth: {
        user: { id: 10, username: 'quantum_physicist', email: 'qp@qual.dev' },
        accessToken: 'access-123',
        csrfToken: 'token-abc.123.sig',
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    };

    expect(selectCsrfToken(rootState)).toBe('token-abc.123.sig');
    expect(selectCurrentUser(rootState)?.username).toBe('quantum_physicist');
    expect(selectIsAuthenticated(rootState)).toBe(true);
  });
});
