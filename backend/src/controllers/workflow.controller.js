const workflowService = require('../services/workflow.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getWorkflow = asyncHandler(async (req, res) => {
  const workflow = await workflowService.getWorkflowById(req.params.id, req.user.id);
  return successResponse(res, { workflow }, 200);
});

const getWorkflowProgress = asyncHandler(async (req, res) => {
  const progress = await workflowService.recalculateProgress(req.params.id);
  return successResponse(res, { progress }, 200);
});

const updateStep = asyncHandler(async (req, res) => {
  const { workflowId, stepId } = req.params;
  const result = await workflowService.updateStep(req.user.id, workflowId, stepId, {
    status: req.body.status,
    fieldPayload: req.body.fieldPayload,
  });
  return successResponse(res, result, 200);
});

const updateRequirement = asyncHandler(async (req, res) => {
  const { workflowId, requirementId } = req.params;
  const result = await workflowService.updateRequirement(
    req.user.id,
    workflowId,
    requirementId,
    req.body.isSatisfied
  );
  return successResponse(res, result, 200);
});

const getWorkflowChecklist = asyncHandler(async (req, res) => {
  const checklist = await workflowService.getWorkflowChecklist(req.user.id, req.params.id);
  return successResponse(res, { checklist }, 200);
});

const getUserWorkflows = asyncHandler(async (req, res) => {
  const workflows = await workflowService.getUserWorkflows(req.user.id);
  return successResponse(res, { workflows }, 200);
});

module.exports = {
  getWorkflow,
  getWorkflowProgress,
  updateStep,
  updateRequirement,
  getWorkflowChecklist,
  getUserWorkflows,
};
