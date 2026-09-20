import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';

export const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, loading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  if (!user) {
    return null;
  }

  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="user-badge">
          <div className="user-avatar">{initial}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{user.username}</h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? 'Logging out...' : 'Sign Out'}
        </button>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <div className="info-label">User ID</div>
          <div className="info-val">#{user.id}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Account Status</div>
          <div className="info-val">
            Verified <span className="badge-active">Active</span>
          </div>
        </div>
      </div>

      <div className="token-status">
        <div style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-h)' }}>
          🔐 Authentication Security
        </div>
        <div>
          • <strong>Access Token (15m):</strong> Stored securely in Redux application memory
          {accessToken && <span className="badge-active">Active</span>}
        </div>
        <div style={{ marginTop: '4px' }}>
          • <strong>Refresh Token (7d):</strong> Stored securely in browser <code>HttpOnly + SameSite</code> cookie
          <span className="badge-active">Protected</span>
        </div>
      </div>
    </div>
  );
};

