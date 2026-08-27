import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useWorkflow from '../hooks/useWorkflow';
import ProgressBar from '../components/workflow/ProgressBar';
import WorkflowSidebar from '../components/workflow/WorkflowSidebar';
import StepCard from '../components/workflow/StepCard';
import RequirementChecklist from '../components/workflow/RequirementChecklist';
import AIAssistPanel from '../components/ai/AIAssistPanel';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  HelpCircle,
  Layers,
  FileCheck
} from 'lucide-react';

export const WorkflowWizardPage = () => {
  const { id: workflowId } = useParams();
  const {
    workflow,
    steps,
    currentStep,
    currentStepIndex,
    setCurrentStepIndex,
    loading,
    error,
    updatingStep,
    markStepComplete,
    toggleRequirement,
  } = useWorkflow(workflowId);

  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
        <h2 className="text-base font-bold text-slate-800 animate-pulse">
          Loading your personalized workflow...
        </h2>
        <p className="text-xs text-slate-500">Retrieving verified steps and requirement state from database.</p>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Unable to load workflow</h2>
        <p className="text-xs text-slate-600">{error || 'Workflow not found.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const difficultTerms = workflow.document?.ai_analysis?.difficultTerms || [];
  const deadlines = workflow.document?.ai_analysis?.deadlines || [];
  const warnings = workflow.document?.ai_analysis?.warnings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Workflow Header & Progress Summary */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{workflow.document?.document_type || 'Accessible Application Workflow'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {workflow.title}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAiPanelOpen(true)}
              className="lg:hidden inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>

            <Link
              to={`/workflow/${workflow.id}/complete`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Final Review Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Deterministic Progress Bar */}
        <ProgressBar
          completedSteps={workflow.completed_steps}
          totalSteps={workflow.total_steps}
          progressPercentage={workflow.progress_percentage}
          readinessStatus={workflow.readiness_status}
        />
      </div>

      {/* Warnings Banner if any */}
      {warnings.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Important Scheme Notices:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800/90 pl-1">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 3-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ordered Steps Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <WorkflowSidebar
            steps={steps}
            currentStepIndex={currentStepIndex}
            onSelectStep={(idx) => setCurrentStepIndex(idx)}
            workflowId={workflow.id}
            readinessStatus={workflow.readiness_status}
          />
        </div>

        {/* Center Column: Active Step Card & Checklist (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <StepCard
            step={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={steps.length}
            difficultTerms={difficultTerms}
            updating={updatingStep}
            onComplete={markStepComplete}
            onNext={() => {
              if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex((prev) => prev + 1);
              }
            }}
            onPrevious={() => {
              if (currentStepIndex > 0) {
                setCurrentStepIndex((prev) => prev - 1);
              }
            }}
            onOpenAiAssist={() => setIsAiPanelOpen(true)}
          />

          {/* Integrated Requirements Checklist */}
          <RequirementChecklist
            requirements={workflow.requirements || []}
            onToggleRequirement={toggleRequirement}
          />
        </div>

        {/* Right Column: Contextual AI Assistant Panel (3 cols) */}
        <div className="hidden lg:block lg:col-span-3">
          <AIAssistPanel
            workflowId={workflow.id}
            currentStep={currentStep}
            isOpen={true}
            onClose={() => {}}
          />
        </div>
      </div>

      {/* Mobile AI Drawer Modal */}
      <div className="lg:hidden">
        <AIAssistPanel
          workflowId={workflow.id}
          currentStep={currentStep}
          isOpen={isAiPanelOpen}
          onClose={() => setIsAiPanelOpen(false)}
        />
      </div>
    </div>
  );
};

export default WorkflowWizardPage;
