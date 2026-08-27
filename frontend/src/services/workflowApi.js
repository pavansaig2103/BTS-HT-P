import api from './api';

export const workflowApi = {
  getUserWorkflows: () => api.get('/workflows'),
  getWorkflow: (id) => api.get(`/workflows/${id}`),
  getProgress: (id) => api.get(`/workflows/${id}/progress`),
  getChecklist: (id) => api.get(`/workflows/${id}/checklist`),
  updateStep: (workflowId, stepId, data) =>
    api.patch(`/workflows/${workflowId}/steps/${stepId}`, data),
  updateRequirement: (workflowId, requirementId, isSatisfied) =>
    api.patch(`/workflows/${workflowId}/requirements/${requirementId}`, { isSatisfied }),
};

export default workflowApi;
