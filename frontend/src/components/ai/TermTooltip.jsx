import React, { useState } from 'react';
import { HelpCircle, Languages, X } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const TermTooltip = ({ term, simpleExplanation, teluguExplanation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useAccessibility();

  return (
    <span className="relative inline-block my-1 mr-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        aria-expanded={isOpen}
      >
        <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
        <span>{term}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 bottom-full mb-2 z-50 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 text-left text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                {term}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                aria-label="Close term explanation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {language === 'te' && teluguExplanation ? (
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mb-0.5">
                    <Languages className="w-3 h-3" />
                    <span>తెలుగు వివరణ (Telugu):</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 font-sans">
                    {teluguExplanation}
                  </p>
                </div>
              ) : null}

              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">
                  Plain English Explanation:
                </div>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {simpleExplanation || 'No explanation available.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </span>
  );
};

export default TermTooltip;
