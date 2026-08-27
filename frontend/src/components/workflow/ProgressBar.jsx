import React from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ProgressBar = ({
  completedSteps = 0,
  totalSteps = 0,
  progressPercentage = 0,
  readinessStatus = 'NOT_READY',
  className = '',
}) => {
  const isReady = readinessStatus === 'READY_FOR_FINAL_REVIEW';

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Deterministic Backend State
          </span>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Overall Workflow Progress</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {completedSteps} of {totalSteps} Steps Complete
            </span>
          </h3>
        </div>

        {/* Readiness Pill */}
        <div>
          {isReady ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>READY FOR FINAL REVIEW</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>NOT READY — REQUIREMENTS PENDING</span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              progressPercentage === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>0%</span>
          <span className="text-indigo-600 font-bold">{progressPercentage}% Complete</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
