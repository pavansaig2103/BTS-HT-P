import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  Sparkles,
  User,
  LogOut,
  Languages,
  SlidersHorizontal,
  Eye,
  FileText,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, explanationLevel, setExplanationLevel, highContrast, setHighContrast } = useAccessibility();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-slate-900 bg-clip-text text-transparent tracking-tight">
                  AccessFlow <span className="text-emerald-600">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                  Workflow Copilot
                </span>
              </div>
            </Link>
          </div>

          {/* Accessibility & Language Quick Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200" title="Choose Language">
              <Languages className="w-4 h-4 text-slate-500 ml-1.5 mr-1 hidden sm:inline" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'te'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Switch to Telugu"
              >
                తెలుగు
              </button>
            </div>

            {/* Explanation Level Quick Toggle */}
            <button
              onClick={() => setExplanationLevel(explanationLevel === 'simple' ? 'detailed' : 'simple')}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
              title="Toggle Simple or Detailed explanations"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>{explanationLevel === 'simple' ? 'Level: Simple' : 'Level: Detailed'}</span>
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                highContrast
                  ? 'bg-slate-900 text-yellow-300 border-slate-900'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              }`}
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Navigation / User Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <Link
                  to="/dashboard"
                  className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/upload"
                  className="hidden sm:flex items-center space-x-1 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>New Workflow</span>
                </Link>

                <Link
                  to="/preferences"
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Accessibility Preferences"
                >
                  <User className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm shadow-indigo-100 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
