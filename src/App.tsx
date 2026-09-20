import React, { useState } from 'react';
import { Navbar } from './components/home/Navbar';
import { HomePage } from './components/home/HomePage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { UserProfile } from './components/auth/UserProfile';
import { useAppDispatch, useAppSelector } from './store';
import { clearError } from './store/slices/authSlice';
import './styles/auth.css';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState<'home' | 'auth'>('home');
  const [activeAuthTab, setActiveAuthTab] = useState<'login' | 'register'>('login');

  const handleSwitchTab = (tab: 'login' | 'register') => {
    dispatch(clearError());
    setActiveAuthTab(tab);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#07090e] text-slate-200">
      {/* Universal Top Navigation */}
      <Navbar currentView={currentView} onNavigate={(view) => setCurrentView(view)} />

      {/* Main Content Router */}
      {currentView === 'home' ? (
        <HomePage />
      ) : (
        <div className="auth-container">
          <div className="w-full max-w-md mb-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Platform
            </button>
            <span className="text-xs font-mono text-slate-500">QUAL.DEV AUTH SERVICE</span>
          </div>

          <header className="mb-8 text-center max-w-md">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
              Quantum Learning Portal
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to save your quantum circuits, sync simulation telemetry, and track course mastery.
            </p>
          </header>

          {isAuthenticated ? (
            <div className="w-full max-w-2xl">
              <UserProfile />
            </div>
          ) : (
            <div className="auth-card">
              <div className="auth-header">
                <h2>{activeAuthTab === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
                <p>
                  {activeAuthTab === 'login'
                    ? 'Enter your credentials to access the quantum workspace'
                    : 'Register for free to start building quantum algorithms'}
                </p>
              </div>

              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${activeAuthTab === 'login' ? 'active' : ''}`}
                  onClick={() => handleSwitchTab('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${activeAuthTab === 'register' ? 'active' : ''}`}
                  onClick={() => handleSwitchTab('register')}
                >
                  Register
                </button>
              </div>

              {activeAuthTab === 'login' ? (
                <LoginForm onSwitchToRegister={() => handleSwitchTab('register')} />
              ) : (
                <RegisterForm onSwitchToLogin={() => handleSwitchTab('login')} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
