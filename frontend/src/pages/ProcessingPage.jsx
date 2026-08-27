import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ProcessingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const workflowId = searchParams.get('wfId');
  const documentId = searchParams.get('docId');

  const [currentStage, setCurrentStage] = useState(1);

  const stages = [
    {
      id: 1,
      title: 'Reading Document & Extracting Text',
      desc: 'Validating MIME types, private storage upload, and structured text parsing.',
      icon: FileText,
    },
    {
      id: 2,
      title: 'Form Intelligence Analysis',
      desc: 'Identifying eligibility criteria, deadlines, mandatory certificates, and complex legal jargon.',
      icon: Sparkles,
    },
    {
      id: 3,
      title: 'Accessibility & Language Formulation',
      desc: 'Generating plain-language translations and bilingual Telugu guidance modules.',
      icon: Layers,
    },
    {
      id: 4,
      title: 'Your Personalized Guide is Ready',
      desc: 'State persisted into relational PostgreSQL database.',
      icon: CheckCircle2,
    },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStage(2), 1200);
    const timer2 = setTimeout(() => setCurrentStage(3), 2400);
    const timer3 = setTimeout(() => setCurrentStage(4), 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleEnterWorkflow = () => {
    if (workflowId) {
      navigate(`/workflow/${workflowId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
          <Sparkles className="w-7 h-7 animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Processing Application Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          AccessFlow AI is breaking down your document facts and assembling your personalized accessibility workflow.
        </p>
      </div>

      {/* Visual Pipeline Steps */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 text-left">
        {stages.map((stage) => {
          const StageIcon = stage.icon;
          const isDone = currentStage > stage.id;
          const isActive = currentStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : isActive
                  ? 'bg-indigo-50 border-2 border-indigo-600 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                ) : (
                  <StageIcon className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div className="space-y-0.5 flex-1 min-w-0">
                <h3 className={`text-xs sm:text-sm font-bold ${isActive ? 'text-indigo-950' : ''}`}>
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Button */}
      {currentStage >= 4 && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={handleEnterWorkflow}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5"
          >
            <span>Open Step-by-Step Workflow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessingPage;
