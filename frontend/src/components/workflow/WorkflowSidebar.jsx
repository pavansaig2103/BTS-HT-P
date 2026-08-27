import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkflowSidebar = ({
  steps = [],
  currentStepIndex = 0,
  onSelectStep,
  workflowId,
  readinessStatus = 'NOT_READY',
}) => {
  return (
    <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4" aria-label="Workflow Navigation">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Workflow Steps
        </h3>
        <p className="text-xs text-slate-600 mt-0.5">
          Step-by-step guidance sequence
        </p>
      </div>

      <nav className="space-y-1.5" aria-label="Steps">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = step.status === 'completed';

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(idx)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 group ${
                isCurrent
                  ? 'bg-indigo-50 border-2 border-indigo-600 shadow-sm'
                  : isCompleted
                  ? 'bg-emerald-50/40 border border-emerald-200/60 hover:bg-emerald-50'
                  : 'bg-white border border-slate-200/80 hover:bg-slate-50'
              }`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></div>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {step.step_order}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Step {step.step_order}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-700">Done</span>
                  )}
                </div>
                <h4
                  className={`text-xs font-semibold truncate ${
                    isCurrent
                      ? 'text-indigo-900 font-bold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-600'
                  }`}
                >
                  {step.title}
                </h4>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Completion Page Link */}
      <div className="pt-3 border-t border-slate-100">
        <Link
          to={`/workflow/${workflowId}/complete`}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Final Review Checklist</span>
        </Link>
      </div>
    </aside>
  );
};

export default WorkflowSidebar;
