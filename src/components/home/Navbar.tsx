import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';

interface NavbarProps {
  currentView: 'home' | 'auth';
  onNavigate: (view: 'home' | 'auth') => void;
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
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-[#07090e] rounded-[7px] flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-tight text-white flex items-center gap-2">
                QUAL<span className="text-cyan-400">.DEV</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 rounded">
                  Egreen Quanta
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-sans tracking-wide">
                Interactive Quantum AI Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => scrollToSection('problem-solution')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5 rounded-md transition-colors"
            >
              Background
            </button>
            <button
              onClick={() => scrollToSection('objectives')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5 rounded-md transition-colors"
            >
              Objectives
            </button>
            <button
              onClick={() => scrollToSection('circuit-demo')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5 rounded-md transition-colors"
            >
              Interactive Studio
            </button>
            <button
              onClick={() => scrollToSection('deliverables')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5 rounded-md transition-colors"
            >
              Deliverables
            </button>
            <button
              onClick={() => scrollToSection('curriculum')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5 rounded-md transition-colors"
            >
              Curriculum
            </button>
            <button
              onClick={() => scrollToSection('metadata')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5 rounded-md transition-colors"
            >
              Organization Info
            </button>
          </div>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('auth')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg text-sm text-slate-200 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-xs">{user?.email || 'My Profile'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-1.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => scrollToSection('circuit-demo')}
                  className="px-4 py-1.5 text-sm font-medium text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 rounded-lg shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all font-semibold"
                >
                  Launch Studio
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#07090e]/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => scrollToSection('problem-solution')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400"
          >
            Background & Problem
          </button>
          <button
            onClick={() => scrollToSection('objectives')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400"
          >
            Key Objectives
          </button>
          <button
            onClick={() => scrollToSection('circuit-demo')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400"
          >
            Interactive Studio
          </button>
          <button
            onClick={() => scrollToSection('deliverables')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400"
          >
            Deliverables Matrix
          </button>
          <button
            onClick={() => scrollToSection('curriculum')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400"
          >
            Curriculum
          </button>
          <button
            onClick={() => scrollToSection('metadata')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400"
          >
            Organization Info
          </button>
          <div className="pt-4 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                onNavigate('auth');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-sm font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg"
            >
              {isAuthenticated ? 'My Account' : 'Sign In'}
            </button>
            <button
              onClick={() => scrollToSection('circuit-demo')}
              className="flex-1 py-2 text-center text-sm font-semibold text-slate-950 bg-cyan-400 rounded-lg"
            >
              Launch Studio
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

