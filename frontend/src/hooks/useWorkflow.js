import { useState, useEffect, useCallback } from 'react';
import { workflowApi } from '../services/workflowApi';

export const useWorkflow = (workflowId) => {
  const [workflow, setWorkflow] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStep, setUpdatingStep] = useState(false);

  const fetchWorkflow = useCallback(async () => {
    if (!workflowId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await workflowApi.getWorkflow(workflowId);
      if (res.success && res.data?.workflow) {
        setWorkflow(res.data.workflow);
      }
    } catch (err) {
      setError(err.message || 'Failed to load workflow');
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  const markStepComplete = async (stepId, fieldPayload = null) => {
    if (!workflowId || !stepId) return;
    try {
      setUpdatingStep(true);
      const payload = { status: 'completed' };
      if (fieldPayload) payload.fieldPayload = fieldPayload;

      const res = await workflowApi.updateStep(workflowId, stepId, payload);
      if (res.success && res.data?.workflow) {
        setWorkflow(res.data.workflow);
        // Automatically advance to next step if available
        if (currentStepIndex < (res.data.workflow.steps?.length || 1) - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
        return res.data;
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to update step');
    } finally {
      setUpdatingStep(false);
    }
  };

  const toggleRequirement = async (requirementId, isSatisfied) => {
    if (!workflowId || !requirementId) return;
    try {
      const res = await workflowApi.updateRequirement(workflowId, requirementId, isSatisfied);
      if (res.success && res.data?.workflow) {
        setWorkflow(res.data.workflow);
        return res.data;
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to toggle requirement');
    }
  };

  const steps = workflow?.steps || [];
  const currentStep = steps[currentStepIndex] || null;

  return {
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
    refreshWorkflow: fetchWorkflow,
  };
};

export default useWorkflow;
