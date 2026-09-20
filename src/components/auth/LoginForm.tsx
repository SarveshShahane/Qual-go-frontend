import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearError, loginUser } from '../../store/slices/authSlice';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await dispatch(loginUser({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert-error">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => dispatch(clearError())}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          className="form-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          className="form-input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text)' }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Create one
        </button>
      </p>
    </form>
  );
};

