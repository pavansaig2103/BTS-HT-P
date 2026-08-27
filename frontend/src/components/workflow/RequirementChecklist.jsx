import React from 'react';
import ConfidenceBadge from '../ai/ConfidenceBadge';
import {
  FileText,
  CheckSquare,
  Square,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const RequirementChecklist = ({
  requirements = [],
  onToggleRequirement,
  className = '',
}) => {
  const getRequirementIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'eligibility':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  const missingCount = requirements.filter((r) => !r.is_satisfied).length;
  const satisfiedCount = requirements.filter((r) => r.is_satisfied).length;

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Required Documents & Criteria</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {satisfiedCount} / {requirements.length} Satisfied
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified checklist compiled deterministically from official scheme rules.
          </p>
        </div>

        {missingCount > 0 ? (
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {missingCount} Missing
          </span>
        ) : (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            All Satisfied
          </span>
        )}
      </div>

      <div className="space-y-3">
        {requirements.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">No explicit document requirements found.</p>
        ) : (
          requirements.map((req) => (
            <div
              key={req.id}
              onClick={() => onToggleRequirement && onToggleRequirement(req.id, !req.is_satisfied)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 group ${
                req.is_satisfied
                  ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
              }`}
              role="checkbox"
              aria-checked={req.is_satisfied}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onToggleRequirement && onToggleRequirement(req.id, !req.is_satisfied);
                }
              }}
            >
              <button
                type="button"
                className="mt-0.5 shrink-0 text-slate-400 group-hover:text-indigo-600 focus:outline-none"
                tabIndex={-1}
                aria-hidden="true"
              >
                {req.is_satisfied ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                )}
              </button>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-2">
                    {getRequirementIcon(req.requirement_type)}
                    <span
                      className={`text-xs font-bold ${
                        req.is_satisfied ? 'text-emerald-900 line-through decoration-emerald-500' : 'text-slate-900'
                      }`}
                    >
                      {req.title}
                    </span>
                  </div>
                  <ConfidenceBadge confidence={req.confidence} sourceText={req.source_text} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {req.description}
                </p>

                {req.source_text && (
                  <div className="text-[11px] text-slate-400 italic">
                    Source text: "{req.source_text}"
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequirementChecklist;
