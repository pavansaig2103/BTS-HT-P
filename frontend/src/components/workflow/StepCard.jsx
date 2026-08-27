import React, { useState, useEffect } from 'react';
import ConfidenceBadge from '../ai/ConfidenceBadge';
import TermTooltip from '../ai/TermTooltip';
import FieldExplainer from './FieldExplainer';
import { useAccessibility } from '../../context/AccessibilityContext';
import { aiApi } from '../../services/aiApi';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  BookOpen,
  Loader2,
  Languages
} from 'lucide-react';

export const StepCard = ({
  step,
  stepIndex,
  totalSteps,
  onComplete,
  onNext,
  onPrevious,
  onOpenAiAssist,
  difficultTerms = [],
  updating = false,
}) => {
  const { language, explanationLevel } = useAccessibility();
  const [fieldValues, setFieldValues] = useState({});
  const [adaptedText, setAdaptedText] = useState(null);
  const [adapting, setAdapting] = useState(false);

  // Initialize fields from step payload
  useEffect(() => {
    if (step?.field_payload?.fields) {
      const initial = {};
      step.field_payload.fields.forEach((f) => {
        initial[f.name] = f.value || '';
      });
      setFieldValues(initial);
    } else {
      setFieldValues({});
    }
  }, [step]);

  // Dynamically adapt explanation if language is Telugu or detailed level requested
  useEffect(() => {
    let isMounted = true;
    const fetchAdaptation = async () => {
      if (!step) return;
      if (language === 'en' && explanationLevel === 'simple') {
        setAdaptedText(null);
        return;
      }

      setAdapting(true);
      try {
        const res = await aiApi.adapt({
          text: step.official_instruction || step.simplified_explanation,
          language,
          explanationLevel,
        });
        if (isMounted && res.success && res.data) {
          setAdaptedText(res.data.adaptedExplanation);
        }
      } catch (err) {
        console.warn('Adaptation fetch error:', err.message);
      } finally {
        if (isMounted) setAdapting(false);
      }
    };

    fetchAdaptation();
    return () => {
      isMounted = false;
    };
  }, [step, language, explanationLevel]);

  if (!step) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <p className="text-sm text-slate-500">No step selected.</p>
      </div>
    );
  }

  const isCompleted = step.status === 'completed';
  const fields = step.field_payload?.fields || [];

  const handleFieldChange = (name, val) => {
    setFieldValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleMarkComplete = () => {
    onComplete(step.id, { fields: fields.map((f) => ({ ...f, value: fieldValues[f.name] || '' })) });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Step {step.step_order} of {totalSteps}
            </span>
            {step.is_required && (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Required
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {step.title}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <ConfidenceBadge confidence={step.confidence} sourceText={step.source_text} />
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          )}
        </div>
      </div>

      {/* Official Instruction Box (Strict Facts) */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            Official Requirement Text
          </span>
          <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
            Source Ground Truth
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          {step.official_instruction}
        </p>
      </div>

      {/* Simplified / Adapted Explanation Box (Accessibility Layer) */}
      <div className="bg-gradient-to-br from-indigo-50/60 to-emerald-50/40 rounded-xl p-4 sm:p-5 border border-indigo-100 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>
              {language === 'te'
                ? 'మీ కోసం సరళమైన వివరణ (Telugu)'
                : explanationLevel === 'detailed'
                ? 'Detailed Plain-Language Guidance'
                : 'Plain-Language Guidance (What You Need To Do)'}
            </span>
          </span>

          {language === 'te' && (
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Languages className="w-3.5 h-3.5" />
              తెలుగు
            </span>
          )}
        </div>

        {adapting ? (
          <div className="flex items-center space-x-2 py-3 text-xs text-indigo-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adapting explanation to your language preference...</span>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
            {adaptedText || step.simplified_explanation}
          </p>
        )}
      </div>

      {/* Difficult Terms Identified in Document */}
      {difficultTerms.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Difficult Terminology Explained
          </span>
          <div className="flex flex-wrap items-center">
            {difficultTerms.map((t, idx) => (
              <TermTooltip
                key={idx}
                term={t.term}
                simpleExplanation={t.simpleExplanation}
                teluguExplanation={t.teluguExplanation}
              />
            ))}
          </div>
        </div>
      )}

      {/* Form Fields / Upload Requirements */}
      {fields.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-900 block">
            Step Details & Preparations
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field, idx) => (
              <FieldExplainer
                key={idx}
                field={field}
                value={fieldValues[field.name]}
                onChange={(val) => handleFieldChange(field.name, val)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions & Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onPrevious}
            disabled={stepIndex === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={onOpenAiAssist}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
            title="Ask AI Assistant about this specific step"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Ask Assistant</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={updating}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            {updating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{isCompleted ? 'Update / Mark Done' : 'Mark Step Complete'}</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={stepIndex === totalSteps - 1}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
