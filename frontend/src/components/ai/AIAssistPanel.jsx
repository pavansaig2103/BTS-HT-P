import React, { useState } from 'react';
import { aiApi } from '../../services/aiApi';
import { useAccessibility } from '../../context/AccessibilityContext';
import ConfidenceBadge from './ConfidenceBadge';
import {
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  X,
  Languages
} from 'lucide-react';

export const AIAssistPanel = ({ workflowId, currentStep, isOpen, onClose }) => {
  const { language } = useAccessibility();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      answer:
        language === 'te'
          ? 'నమస్కారం! నేను AccessFlow AI సహాయకుడిని. ఈ దరఖాస్తులో ఏ పదం లేదా నియమం గురించి అయినా నన్ను అడగండి.'
          : 'Hello! I am your AccessFlow Contextual Assistant. Ask me about any difficult terms, eligibility rules, or required documents in this workflow.',
      grounded: true,
      confidence: 'confirmed',
      sources: ['Workflow Overview'],
      actionableTip: 'You can tap any suggested question below to get instant grounded guidance.',
    },
  ]);

  const quickQuestions = [
    { label: 'What does "attested" mean?', q: 'What does attested mean and how do I get it?' },
    { label: 'Required documents', q: 'What specific documents do I need for this step?' },
    { label: 'Income limit & certificate', q: 'What is the income limit and how to get MeeSeva income certificate?' },
    { label: 'Bank / Aadhaar DBT rules', q: 'What are the bank account and Aadhaar linking requirements?' },
  ];

  const handleAsk = async (queryText) => {
    const q = queryText || question;
    if (!q.trim() || loading) return;

    const userMessage = { role: 'user', question: q };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await aiApi.ask({
        workflowId,
        stepId: currentStep?.id,
        question: q,
      });

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            answer: res.data.answer,
            grounded: res.data.grounded,
            confidence: res.data.confidence,
            sources: res.data.sources || [],
            uncertaintyNote: res.data.uncertaintyNote,
            actionableTip: res.data.actionableTip,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          answer: 'Unable to reach assistant service. Please check your connection and try again.',
          grounded: false,
          confidence: 'uncertain',
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed lg:sticky top-0 right-0 h-screen lg:h-[calc(100vh-4rem)] w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl lg:shadow-none flex flex-col z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}
      role="region"
      aria-label="AI Accessibility Assistant"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50/70 to-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              AccessFlow Assistant
            </h3>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
              {currentStep ? currentStep.title : 'Contextual Guidance'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-1.5">
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs font-medium max-w-[85%] shadow-sm">
                  {msg.question}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-sm p-3.5 space-y-2 text-xs text-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Grounded Answer
                  </span>
                  <ConfidenceBadge confidence={msg.confidence} />
                </div>

                <p className="leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
                  {msg.answer}
                </p>

                {msg.actionableTip && (
                  <div className="flex items-start gap-1.5 bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200/70 text-[11px]">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Action Tip: </span>
                      <span>{msg.actionableTip}</span>
                    </div>
                  </div>
                )}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-100">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span>Source: {msg.sources.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span className="animate-pulse">Consulting document context & accessibility rules...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Suggested Questions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleAsk(chip.q)}
              disabled={loading}
              className="text-[11px] font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-lg transition-colors text-left"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              language === 'te'
                ? 'ఏదైనా అడగండి (ఉదా: "attested అంటే ఏమిటి?")...'
                : 'Ask a question (e.g., "What does attested mean?")...'
            }
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            disabled={loading}
            aria-label="Ask the AI assistant a question"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistPanel;
