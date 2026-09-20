import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearError, registerUser } from '../../store/slices/authSlice';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    if (username.length < 3) {
      return;
    }
    if (password.length < 8) {
      return;
    }

    const result = await dispatch(registerUser({ username, email, password }));
    if (registerUser.fulfilled.match(result)) {
      setSuccessMsg('Account created successfully! You can now sign in.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    }
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

      {successMsg && (
        <div className="alert-success">
          <span>{successMsg}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="reg-username">Username (min 3 chars)</label>
        <input
          id="reg-username"
          type="text"
          className="form-input"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
          maxLength={20}
          required
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-email">Email Address</label>
        <input
          id="reg-email"
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
        <label htmlFor="reg-password">Password (min 8 chars)</label>
        <input
          id="reg-password"
          type="password"
          className="form-input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          maxLength={72}
          required
          autoComplete="new-password"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text)' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

