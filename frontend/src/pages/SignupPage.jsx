import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { User, Mail, Lock, Languages, SlidersHorizontal, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [explanationLevel, setExplanationLevel] = useState('simple');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, preferredLanguage, explanationLevel);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Your AccessFlow AI Profile
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Configure your language and cognitive preferences so your workflows are tailored to your needs.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="signup-name">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="signup-email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="signup-password">
                Password (min 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Accessibility Onboarding Preferences */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-indigo-900 block">
                Accessibility Preferences
              </span>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Preferred Language for Explanations
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredLanguage('en')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                      preferredLanguage === 'en'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>English</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredLanguage('te')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                      preferredLanguage === 'te'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>తెలుగు (Telugu)</span>
                  </button>
                </div>
              </div>

              {/* Explanation Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Explanation Complexity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExplanationLevel('simple')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                      explanationLevel === 'simple'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Simple (Jargon-free)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExplanationLevel('detailed')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                      explanationLevel === 'detailed'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Detailed & In-depth</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Your Profile...</span>
                </>
              ) : (
                <span>Register & Continue to Copilot</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
