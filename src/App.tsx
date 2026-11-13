import React, { useEffect, useState } from 'react';
import { Navbar } from './components/home/Navbar';
import { HomePage } from './components/home/HomePage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { UserProfile } from './components/auth/UserProfile';
import { CoursesContainer } from './components/course/CoursesContainer';
import { CircuitDesigner } from './components/circuit/CircuitDesigner';
import { useAppDispatch, useAppSelector } from './store';
import { clearError, fetchCsrfToken, restoreSession } from './store/slices/authSlice';
import { loadStoredAppView, saveStoredAppView } from './store/storage';
import './styles/auth.css';

export type AppView = 'home' | 'auth' | 'courses' | 'designer';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState<AppView>(() => loadStoredAppView<AppView>('home'));
  const [activeAuthTab, setActiveAuthTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(restoreSession());
    } else {
      dispatch(fetchCsrfToken());
    }
  }, [dispatch]);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    saveStoredAppView(view);
  };

  const handleSwitchTab = (tab: 'login' | 'register') => {
    dispatch(clearError());
    setActiveAuthTab(tab);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-paper text-ink">
      {/* Universal Top Navigation */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Router */}
      {currentView === 'home' ? (
        <HomePage onNavigate={handleNavigate} />
      ) : currentView === 'designer' ? (
        <div className="flex-1 flex flex-col min-h-0">
          <CircuitDesigner />
        </div>
      ) : currentView === 'courses' ? (
        <div className="flex-1 flex flex-col min-h-0">
          <CoursesContainer onNavigateAuth={() => handleNavigate('auth')} />
        </div>
      ) : (
        <div className="auth-container">
          <div className="w-full max-w-md mb-6 flex items-center justify-between">
            <button
              onClick={() => handleNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-body text-accent hover:text-ink active:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Platform
            </button>
            <span className="text-xs text-muted">QUALGO Auth Service</span>
          </div>

          <header className="mb-8 text-center max-w-md">
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-2">
              Quantum Learning Portal
            </h1>
            <p className="text-sm text-muted">
              Sign in to save quantum circuits and track course mastery.
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
