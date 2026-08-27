import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { workflowApi } from '../services/workflowApi';
import { documentApi } from '../services/documentApi';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Loader2,
  Layers,
  Languages
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { language, explanationLevel } = useAccessibility();
  const [workflows, setWorkflows] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [wfRes, docRes] = await Promise.all([
          workflowApi.getUserWorkflows(),
          documentApi.getUserDocuments(),
        ]);
        if (wfRes.success && wfRes.data?.workflows) {
          setWorkflows(wfRes.data.workflows);
        }
        if (docRes.success && docRes.data?.documents) {
          setDocuments(docRes.data.documents);
        }
      } catch (err) {
        console.warn('Dashboard data fetch note:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accessibility Copilot Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Applicant'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Your personalized accessibility profile is set to{' '}
            <strong className="text-white">
              {language === 'te' ? 'Telugu (తెలుగు)' : 'English'}
            </strong>{' '}
            with <strong className="text-white">{explanationLevel} explanations</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Process New Document</span>
          </Link>
        </div>
      </div>

      {/* Featured / Seeded Scholarship Demo Flow Card */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50/40 rounded-3xl p-6 border-2 border-indigo-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
            <Award className="w-6 h-6 text-emerald-300" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                Verified Hackathon Demo
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Ready to Test
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              National Merit-cum-Means Scholarship 2026 Preparation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Complete pre-seeded scholarship application guide with 6 ordered steps, document checklists (attested marks memo, MeeSeva income certificate), and Telugu translations.
            </p>
          </div>
        </div>

        <Link
          to="/workflow/d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
        >
          <span>Open Scholarship Guide</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Workflows Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Your Workflows</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {workflows.length} Total Applications
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading workflows...</p>
          </div>
        ) : workflows.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No custom workflows created yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload a scholarship PDF, admission notice, or government form to generate your step-by-step guide.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload First Document</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflows.map((wf) => {
              const isReady = wf.readiness_status === 'READY_FOR_FINAL_REVIEW';

              return (
                <div
                  key={wf.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {wf.total_steps} Steps
                      </span>
                      {isReady ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Ready for Review</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {wf.title}
                    </h3>

                    {/* Progress indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Progress</span>
                        <span className="text-indigo-600 font-bold">{wf.progress_percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                          style={{ width: `${wf.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {wf.completed_steps} / {wf.total_steps} Completed
                    </span>
                    <Link
                      to={`/workflow/${wf.id}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Documents Table */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Uploaded Source Documents</span>
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{doc.document_title || doc.original_filename}</div>
                    <div className="text-slate-500 flex items-center gap-2">
                      <span>{doc.original_filename}</span>
                      <span>&bull;</span>
                      <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
