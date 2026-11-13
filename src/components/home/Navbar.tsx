import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';

interface NavbarProps {
  currentView: 'home' | 'auth' | 'courses' | 'designer';
  onNavigate: (view: 'home' | 'auth' | 'courses' | 'designer') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-rule bg-paper/95 backdrop-blur-md">
      <div className="academic-container">
        <div className="flex items-center justify-between h-16">
          {/* Institution Masthead */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 rounded-sm bg-ink text-paper flex items-center justify-center font-display font-bold text-sm tracking-tight">
              QG
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight text-ink leading-tight">
                QUALGO
              </span>
              <span className="text-xs text-muted font-body tracking-normal">
                Quantum Algorithm Laboratory
              </span>
            </div>
          </div>

          {/* Academic Primary Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('designer')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm border transition-colors cursor-pointer ${
                currentView === 'designer'
                  ? 'text-accent-ink bg-accent border-accent font-semibold'
                  : 'text-ink bg-paper-2 border-rule hover:border-rule-2'
              }`}
            >
              Quantum Bench
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm border transition-colors cursor-pointer ${
                currentView === 'courses'
                  ? 'text-accent-ink bg-navy border-navy font-semibold'
                  : 'text-ink bg-transparent border-transparent hover:bg-paper-2 hover:border-rule'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => scrollToSection('circuit-demo')}
              className="px-3 py-1.5 text-sm font-medium text-ink/80 hover:text-ink hover:bg-paper-2 rounded-sm border border-transparent hover:border-rule transition-colors cursor-pointer"
            >
              Interactive Laboratory
            </button>
            <button
              onClick={() => scrollToSection('problem-solution')}
              className="px-3 py-1.5 text-sm font-medium text-ink/80 hover:text-ink hover:bg-paper-2 rounded-sm border border-transparent hover:border-rule transition-colors cursor-pointer"
            >
              Foundations
            </button>
            <button
              onClick={() => scrollToSection('deliverables')}
              className="px-3 py-1.5 text-sm font-medium text-ink/80 hover:text-ink hover:bg-paper-2 rounded-sm border border-transparent hover:border-rule transition-colors cursor-pointer"
            >
              Syllabus & Register
            </button>
          </div>

          {/* Right Action / Academic User Session */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('auth')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-sheet border border-rule hover:border-rule-2 rounded-sm text-sm text-ink transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                  <span className="font-mono text-xs font-medium">{user?.email || 'Student Account'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-muted hover:text-accent px-2 py-1 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-3.5 py-1.5 text-sm font-medium text-ink bg-paper-2 hover:bg-paper-3 border border-rule rounded-sm transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('auth');
                  }}
                  className="px-3.5 py-1.5 text-sm font-medium text-accent-ink bg-accent hover:opacity-95 rounded-sm transition-opacity cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:bg-paper-2 rounded-sm border border-rule"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rule bg-paper px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => {
              onNavigate('designer');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-accent-ink bg-accent rounded-sm"
          >
            Quantum Bench
          </button>
          <button
            onClick={() => {
              onNavigate('courses');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-ink hover:bg-paper-2 rounded-sm"
          >
            Curriculum
          </button>
          <button
            onClick={() => scrollToSection('circuit-demo')}
            className="w-full text-left px-3 py-2 text-sm font-medium text-ink hover:bg-paper-2 rounded-sm"
          >
            Interactive Laboratory
          </button>
          <button
            onClick={() => scrollToSection('problem-solution')}
            className="w-full text-left px-3 py-2 text-sm font-medium text-ink hover:bg-paper-2 rounded-sm"
          >
            Foundations
          </button>
          <button
            onClick={() => scrollToSection('deliverables')}
            className="w-full text-left px-3 py-2 text-sm font-medium text-ink hover:bg-paper-2 rounded-sm"
          >
            Syllabus & Register
          </button>
          <div className="pt-3 border-t border-rule flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted">{user?.email}</span>
                <button onClick={handleLogout} className="text-xs text-accent font-medium">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigate('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-sm font-medium text-accent-ink bg-accent rounded-sm"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
