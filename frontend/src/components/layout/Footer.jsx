import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AccessFlow AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering individuals to independently understand, prepare, track, and complete complex applications without digital dependency.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Core Pillars</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Deterministic Backend Truth</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Grounded AI Form Intelligence</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Multilingual Telugu & English Guidance</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Trust & Safety</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs leading-relaxed space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Hallucination Submission Notice</span>
              </div>
              <p className="text-slate-400">
                AccessFlow AI guides document preparation and verifies readiness. Official application submissions must always be completed directly on the issuing government or institutional portal.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-center text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} AccessFlow AI. Built with care for digital inclusion.</span>
          <span className="flex items-center gap-1">
            From Confusion to Completion &bull; From Dependency to Independence
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
