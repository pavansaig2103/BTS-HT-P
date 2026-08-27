import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workflowApi } from '../services/workflowApi';
import ProgressBar from '../components/workflow/ProgressBar';
import RequirementChecklist from '../components/workflow/RequirementChecklist';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export const CompletionPage = () => {
  const { id: workflowId } = useParams();
  const [checklistData, setChecklistData] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        setLoading(true);
        const [clRes, wfRes] = await Promise.all([
          workflowApi.getChecklist(workflowId),
          workflowApi.getWorkflow(workflowId),
        ]);

        if (clRes.success && clRes.data?.checklist) {
          setChecklistData(clRes.data.checklist);
        }
        if (wfRes.success && wfRes.data?.workflow) {
          setWorkflow(wfRes.data.workflow);
        }
      } catch (err) {
        setError(err.message || 'Failed to compile readiness checklist');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [workflowId]);

  const handleToggleRequirement = async (reqId, isSatisfied) => {
    try {
      await workflowApi.updateRequirement(workflowId, reqId, isSatisfied);
      // Re-fetch checklist to get updated deterministic readiness
      const clRes = await workflowApi.getChecklist(workflowId);
      if (clRes.success && clRes.data?.checklist) {
        setChecklistData(clRes.data.checklist);
      }
      const wfRes = await workflowApi.getWorkflow(workflowId);
      if (wfRes.success && wfRes.data?.workflow) {
        setWorkflow(wfRes.data.workflow);
      }
    } catch (err) {
      console.warn('Failed to update requirement:', err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
        <h2 className="text-base font-bold text-slate-800 animate-pulse">
          Evaluating application completeness & readiness...
        </h2>
      </div>
    );
  }

  if (error || !checklistData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Checklist unavailable</h2>
        <p className="text-xs text-slate-600">{error}</p>
        <Link
          to={`/workflow/${workflowId}`}
          className="inline-flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workflow Wizard</span>
        </Link>
      </div>
    );
  }

  const isReady = checklistData.readinessStatus === 'READY_FOR_FINAL_REVIEW';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to={`/workflow/${workflowId}`}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wizard Steps</span>
        </Link>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Final Review Stage
        </span>
      </div>

      {/* Hero Readiness Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isReady
            ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white border-emerald-500 shadow-emerald-900/10'
            : 'bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 text-white border-amber-500 shadow-amber-900/10'
        }`}
      >
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold backdrop-blur-sm">
            {isReady ? (
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-200" />
            )}
            <span>Deterministic Backend Evaluation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isReady
              ? 'READY FOR FINAL REVIEW'
              : 'NOT READY — MISSING REQUIREMENTS'}
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
            {isReady
              ? 'All required steps are marked complete and all mandatory certificates/eligibility items are satisfied. You are prepared to complete your official submission.'
              : `You still have ${checklistData.summary.missingRequirementsCount} missing requirement(s) or incomplete step(s) before you can submit on the official portal.`}
          </p>
        </div>

        <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center space-y-1">
          <div className="text-3xl font-black">{checklistData.progressPercentage}%</div>
          <div className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
            {checklistData.summary.completedStepsCount} / {checklistData.summary.totalSteps} Steps Complete
          </div>
        </div>
      </div>

      {/* Deterministic Progress Summary */}
      <ProgressBar
        completedSteps={checklistData.summary.completedStepsCount}
        totalSteps={checklistData.summary.totalSteps}
        progressPercentage={checklistData.progressPercentage}
        readinessStatus={checklistData.readinessStatus}
      />

      {/* Deadlines & Warnings Summary */}
      {checklistData.deadlines.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Extracted Deadlines & Timelines</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklistData.deadlines.map((d, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block">{d.title}</span>
                <span className="text-indigo-600 font-extrabold text-sm">{d.value}</span>
                {d.sourceText && (
                  <p className="text-[11px] text-slate-500 italic mt-0.5">"{d.sourceText}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      <RequirementChecklist
        requirements={workflow?.requirements || []}
        onToggleRequirement={handleToggleRequirement}
      />

      {/* CRITICAL ETHICAL DISCLAIMER: NEVER CLAIM OFFICIAL ACCEPTANCE */}
      <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-3 text-xs leading-relaxed shadow-xl">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Official Submission & Non-Affiliation Notice</span>
        </div>
        <p>
          <strong>AccessFlow AI is an accessibility and document preparation copilot.</strong> AccessFlow AI does not officially submit, approve, or accept government, scholarship, or banking applications.
        </p>
        <p className="text-slate-400">
          Once you have verified that all requirements above are satisfied and all physical certificates (such as your attested marks memo and MeeSeva income certificate) are ready, please proceed to the issuing authority's official portal to perform final submission.
        </p>
      </div>
    </div>
  );
};

export default CompletionPage;
