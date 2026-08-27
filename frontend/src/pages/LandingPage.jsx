import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Languages,
  SlidersHorizontal,
  Lock,
  Layers,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleLaunchDemo = async () => {
    try {
      if (!isAuthenticated) {
        // Auto-login with seeded demo credentials for instant hackathon demonstration
        await login('demo@accessflow.ai', 'Password123!');
      }
      navigate('/workflow/d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background gradient decorative shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-100/50 via-emerald-50/50 to-transparent blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Mission Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>AI-Powered Accessibility Workflow Copilot</span>
          </div>

          {/* Main Hero Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              From <span className="text-rose-600 underline decoration-rose-300">Confusion</span> to{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Completion</span>.
              <br />
              From <span className="text-amber-600">Dependency</span> to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Independence</span>.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              AccessFlow AI transforms complex government schemes, scholarship forms, and official documents into clear, step-by-step personalized guides in simple English and Telugu.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5"
            >
              <Award className="w-5 h-5 text-emerald-300" />
              <span>Explore Live Scholarship Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 text-base font-bold rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm transition-all"
            >
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Upload Custom Document</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Deterministic State Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-indigo-600" />
              <span>Telugu & English Adaptation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-700" />
              <span>Private & Secure Documents</span>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After Transformation Concept */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Problem & Solution</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Why Digital Access Isn't Truly Accessible
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Millions have technical access to internet portals, but face cognitive overload and language barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-rose-50/50 rounded-2xl p-6 sm:p-8 border border-rose-200/80 space-y-4">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
                <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                <span>BEFORE ACCESSFLOW AI (The Digital Barrier)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Dense, 20-page legalistic PDFs filled with bureaucratic jargon like <em>"attested"</em> and <em>"DBT NPCI mapping"</em>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Zero clarity on which documents are mandatory vs optional until rejection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Forced dependency on internet cyber cafes, agents, and relatives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>No step-by-step tracking or readiness verification before final deadline.</span>
                </li>
              </ul>
            </div>

            {/* The AccessFlow Way */}
            <div className="bg-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-emerald-200/80 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <span>WITH ACCESSFLOW AI (Independent Action)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Instant translation into plain language and Telugu with interactive term tooltips.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Automated extraction of verified required documents and eligibility criteria.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Deterministic progress bar & readiness indicator computed strictly from backend truth.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Grounded contextual assistant ready to answer questions without hallucination.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Core Engineering Principles</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              AI Does Intelligence. Backend Does Truth.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Form Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini processes raw PDF and image documents into strict structured JSON validated by Zod before persisting into PostgreSQL.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Accessibility Adaptation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bilingual engine dynamically adapts official instructions into simple English and Telugu without corrupting the underlying legal source truth.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Deterministic State Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Completion percentage, missing documents, and readiness status are computed exclusively via deterministic relational backend logic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold">Ready to Experience Independent Workflow Completion?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Test the live scholarship workflow demo or create an account to process your own application documents.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunchDemo}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition-colors"
            >
              Launch Demo Scholarship Workflow
            </button>
            <Link
              to="/signup"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
