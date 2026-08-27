import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  SlidersHorizontal,
  Languages,
  Eye,
  Type,
  CheckCircle2,
  Sparkles,
  Save,
  Loader2
} from 'lucide-react';

export const PreferencesPage = () => {
  const {
    language,
    explanationLevel,
    guidanceMode,
    highContrast,
    fontSize,
    setLanguage,
    setExplanationLevel,
    setHighContrast,
    setFontSize,
    saving,
  } = useAccessibility();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveNotification = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <SlidersHorizontal className="w-4 h-4" />
          <span>User Accessibility Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Accessibility & Language Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize how AccessFlow AI translates, simplifies, and presents official instructions to you.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Preferences saved and synchronized across your workflows!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Selection */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-sm">
            <Languages className="w-5 h-5 text-indigo-600" />
            <span>Explanation Language</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Choose whether instructions and terminology explanations are shown in English or Telugu.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                handleSaveNotification();
              }}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                language === 'en'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold">English (Default)</div>
                <div className="text-[11px] text-slate-500">Standard plain-language simplified English</div>
              </div>
              {language === 'en' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage('te');
                handleSaveNotification();
              }}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                language === 'te'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold">తెలుగు (Telugu)</div>
                <div className="text-[11px] text-slate-500">పూర్తి తెలుగు అనువాదం మరియు వివరణలు</div>
              </div>
              {language === 'te' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </button>
          </div>
        </div>

        {/* Explanation Complexity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Explanation Complexity</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select the detail level tailored to your reading style and technical familiarity.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setExplanationLevel('simple');
                handleSaveNotification();
              }}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                explanationLevel === 'simple'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold">Simple (Jargon-Free)</div>
                <div className="text-[11px] text-slate-500">Concise, action-focused, eliminates complex bureaucracy</div>
              </div>
              {explanationLevel === 'simple' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setExplanationLevel('detailed');
                handleSaveNotification();
              }}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                explanationLevel === 'detailed'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold">Detailed & Comprehensive</div>
                <div className="text-[11px] text-slate-500">Full explanations with underlying legal/administrative clauses</div>
              </div>
              {explanationLevel === 'detailed' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Visual Accessibility: High Contrast */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-sm">
            <Eye className="w-5 h-5 text-indigo-600" />
            <span>High Contrast Mode</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enhances text contrast and visual borders for improved legibility.
          </p>

          <button
            type="button"
            onClick={() => setHighContrast(!highContrast)}
            className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
              highContrast
                ? 'bg-slate-900 border-slate-900 text-yellow-300 font-bold shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-bold">
              {highContrast ? 'High Contrast Mode: Active' : 'Normal Contrast'}
            </div>
            {highContrast && <CheckCircle2 className="w-4 h-4 text-yellow-300" />}
          </button>
        </div>

        {/* Visual Accessibility: Font Scaling */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-sm">
            <Type className="w-5 h-5 text-indigo-600" />
            <span>Font Size & Scaling</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Scale typography across the application for comfortable reading.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Default' },
              { id: 'large', label: 'Large' },
              { id: 'xlarge', label: 'X-Large' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFontSize(s.id)}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                  fontSize === s.id
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
