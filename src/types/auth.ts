export interface User {
  id: number;
  username: string;
  email: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  csrf_token?: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  csrf_token?: string;
  user: User;
}

export interface CsrfResponse {
  success: boolean;
  csrf_token: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

