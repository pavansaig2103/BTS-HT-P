const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/supabase');
const AppError = require('../utils/AppError');
const { ReadinessStatus, StepStatus, WorkflowStatus } = require('../constants/enums');

class WorkflowService {
  /**
   * Deterministically creates workflow from structured Form Intelligence result
   */
  async createWorkflowFromIntelligence({ userId, documentId, analysisResult }) {
    const workflowId = uuidv4();
    const steps = analysisResult.steps || [];
    const requirements = analysisResult.requirements || [];

    const totalSteps = steps.length;
    const completedSteps = 0;
    const progressPercentage = 0.0;
    const readinessStatus = ReadinessStatus.NOT_READY;

    // 1. Create Workflow Record
    const { data: workflow, error: wfError } = await supabase
      .from('workflows')
      .insert({
        id: workflowId,
        user_id: userId,
        document_id: documentId,
        title: analysisResult.documentTitle || 'Application Workflow',
        status: WorkflowStatus.ACTIVE,
        total_steps: totalSteps,
        completed_steps: completedSteps,
        progress_percentage: progressPercentage,
        readiness_status: readinessStatus,
      })
      .select()
      .single();

    if (wfError || !workflow) {
      throw new AppError(`Failed to persist workflow: ${wfError?.message || 'DB Error'}`, 500, 'DB_ERROR');
    }

    // 2. Insert Steps
    const stepRecords = [];
    const stepOrderToIdMap = new Map();

    for (const step of steps) {
      const stepId = uuidv4();
      stepOrderToIdMap.set(step.stepOrder, stepId);

      stepRecords.push({
        id: stepId,
        workflow_id: workflowId,
        step_order: step.stepOrder,
        title: step.title,
        official_instruction: step.officialInstruction,
        simplified_explanation: step.simplifiedExplanation,
        field_payload: {
          fields: step.suggestedFields || [],
        },
        status: StepStatus.PENDING,
        is_required: step.isRequired !== undefined ? step.isRequired : true,
        confidence: step.confidence || 'confirmed',
        source_text: step.sourceText || '',
      });
    }

    if (stepRecords.length > 0) {
      await supabase.from('workflow_steps').insert(stepRecords);
    }

    // 3. Insert Requirements
    const reqRecords = [];
    for (const req of requirements) {
      const stepId = req.stepOrderRef ? stepOrderToIdMap.get(req.stepOrderRef) || null : null;
      reqRecords.push({
        id: uuidv4(),
        workflow_id: workflowId,
        step_id: stepId,
        requirement_type: req.requirementType || 'document',
        title: req.title,
        description: req.description,
        is_required: req.isRequired !== undefined ? req.isRequired : true,
        is_satisfied: false,
        confidence: req.confidence || 'confirmed',
        source_text: req.sourceText || '',
        status: 'pending',
      });
    }

    if (reqRecords.length > 0) {
      await supabase.from('workflow_requirements').insert(reqRecords);
    }

    return this.getWorkflowById(workflowId, userId);
  }

  /**
   * Fetches full workflow including ordered steps, requirements, and document context
   */
  async getWorkflowById(workflowId, userId) {
    const { data: workflow, error: wfError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .eq('user_id', userId)
      .single();

    if (wfError || !workflow) {
      throw new AppError('Workflow not found or access denied.', 404, 'WORKFLOW_NOT_FOUND');
    }

    const { data: steps } = await supabase
      .from('workflow_steps')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('step_order', { ascending: true });

    const { data: requirements } = await supabase
      .from('workflow_requirements')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: true });

    const { data: document } = await supabase
      .from('documents')
      .select('id, document_title, document_type, original_filename, ai_analysis')
      .eq('id', workflow.document_id)
      .single();

    return {
      ...workflow,
      document: document || null,
      steps: steps || [],
      requirements: requirements || [],
    };
  }

  /**
   * Deterministically calculates workflow progress and completion readiness
   */
  async recalculateProgress(workflowId) {
    const { data: steps } = await supabase
      .from('workflow_steps')
      .select('id, is_required, status')
      .eq('workflow_id', workflowId);

    const { data: requirements } = await supabase
      .from('workflow_requirements')
      .select('id, is_required, is_satisfied')
      .eq('workflow_id', workflowId);

    const totalSteps = steps ? steps.length : 0;
    const completedSteps = steps ? steps.filter((s) => s.status === StepStatus.COMPLETED).length : 0;
    const progressPercentage =
      totalSteps > 0 ? parseFloat(((completedSteps / totalSteps) * 100).toFixed(2)) : 0.0;

    // Check readiness criteria
    // 1. All required steps must be completed
    const requiredSteps = steps ? steps.filter((s) => s.is_required) : [];
    const allRequiredStepsCompleted =
      requiredSteps.length > 0 && requiredSteps.every((s) => s.status === StepStatus.COMPLETED);

    // 2. All required requirements must be satisfied
    const requiredReqs = requirements ? requirements.filter((r) => r.is_required) : [];
    const allRequiredReqsSatisfied =
      requiredReqs.length === 0 || requiredReqs.every((r) => r.is_satisfied);

    const readinessStatus =
      allRequiredStepsCompleted && allRequiredReqsSatisfied
        ? ReadinessStatus.READY_FOR_FINAL_REVIEW
        : ReadinessStatus.NOT_READY;

    // Update workflow record in DB
    await supabase
      .from('workflows')
      .update({
        total_steps: totalSteps,
        completed_steps: completedSteps,
        progress_percentage: progressPercentage,
        readiness_status: readinessStatus,
        status: progressPercentage === 100 ? WorkflowStatus.COMPLETED : WorkflowStatus.ACTIVE,
      })
      .eq('id', workflowId);

    return {
      totalSteps,
      completedSteps,
      progressPercentage,
      readinessStatus,
      allRequiredStepsCompleted,
      allRequiredReqsSatisfied,
    };
  }

  /**
   * Updates workflow step and recalculates progress
   */
  async updateStep(userId, workflowId, stepId, { status, fieldPayload }) {
    // Verify workflow ownership
    const { data: workflow } = await supabase
      .from('workflows')
      .select('id')
      .eq('id', workflowId)
      .eq('user_id', userId)
      .single();

    if (!workflow) {
      throw new AppError('Workflow not found or access denied.', 404, 'WORKFLOW_NOT_FOUND');
    }

    const updates = {};
    if (status) updates.status = status;
    if (fieldPayload) updates.field_payload = fieldPayload;

    const { error: stepError } = await supabase
      .from('workflow_steps')
      .update(updates)
      .eq('id', stepId)
      .eq('workflow_id', workflowId);

    if (stepError) {
      throw new AppError(`Failed to update step: ${stepError.message}`, 500, 'DB_ERROR');
    }

    // Auto update linked requirement if step is completed
    if (status === StepStatus.COMPLETED) {
      await supabase
        .from('workflow_requirements')
        .update({ is_satisfied: true, status: 'satisfied' })
        .eq('step_id', stepId)
        .eq('workflow_id', workflowId);
    } else if (status === StepStatus.PENDING || status === StepStatus.IN_PROGRESS) {
      await supabase
        .from('workflow_requirements')
        .update({ is_satisfied: false, status: 'pending' })
        .eq('step_id', stepId)
        .eq('workflow_id', workflowId);
    }

    const progress = await this.recalculateProgress(workflowId);
    const updatedWorkflow = await this.getWorkflowById(workflowId, userId);

    return {
      workflow: updatedWorkflow,
      progress,
    };
  }

  /**
   * Toggles requirement satisfaction and recalculates readiness
   */
  async updateRequirement(userId, workflowId, requirementId, isSatisfied) {
    const { data: workflow } = await supabase
      .from('workflows')
      .select('id')
      .eq('id', workflowId)
      .eq('user_id', userId)
      .single();

    if (!workflow) {
      throw new AppError('Workflow not found or access denied.', 404, 'WORKFLOW_NOT_FOUND');
    }

    await supabase
      .from('workflow_requirements')
      .update({
        is_satisfied: isSatisfied,
        status: isSatisfied ? 'satisfied' : 'missing',
      })
      .eq('id', requirementId)
      .eq('workflow_id', workflowId);

    const progress = await this.recalculateProgress(workflowId);
    const updatedWorkflow = await this.getWorkflowById(workflowId, userId);

    return {
      workflow: updatedWorkflow,
      progress,
    };
  }

  /**
   * Fetches user's workflows for dashboard
   */
  async getUserWorkflows(userId) {
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch workflows: ${error.message}`, 500, 'DB_ERROR');
    }

    return workflows || [];
  }

  /**
   * Returns deterministic checklist with missing items & warnings
   */
  async getWorkflowChecklist(userId, workflowId) {
    const wf = await this.getWorkflowById(workflowId, userId);

    const missingRequirements = wf.requirements.filter((r) => !r.is_satisfied);
    const satisfiedRequirements = wf.requirements.filter((r) => r.is_satisfied);
    const incompleteSteps = wf.steps.filter((s) => s.status !== StepStatus.COMPLETED);
    const completedSteps = wf.steps.filter((s) => s.status === StepStatus.COMPLETED);

    return {
      workflowId: wf.id,
      workflowTitle: wf.title,
      progressPercentage: wf.progress_percentage,
      readinessStatus: wf.readiness_status,
      summary: {
        totalSteps: wf.total_steps,
        completedStepsCount: completedSteps.length,
        incompleteStepsCount: incompleteSteps.length,
        totalRequirements: wf.requirements.length,
        satisfiedRequirementsCount: satisfiedRequirements.length,
        missingRequirementsCount: missingRequirements.length,
      },
      missingRequirements,
      satisfiedRequirements,
      incompleteSteps,
      completedSteps,
      warnings: wf.document?.ai_analysis?.warnings || [],
      deadlines: wf.document?.ai_analysis?.deadlines || [],
      difficultTerms: wf.document?.ai_analysis?.difficultTerms || [],
    };
  }
}

module.exports = new WorkflowService();
