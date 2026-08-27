import api from './api';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.patch('/profile', data),
};

export const documentApi = {
  upload: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUserDocuments: () => api.get('/documents'),
  getDocument: (id) => api.get(`/documents/${id}`),
  getDocumentStatus: (id) => api.get(`/documents/${id}/status`),
};

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

export const aiApi = {
  ask: ({ workflowId, stepId, question }) =>
    api.post('/ai/ask', { workflowId, stepId, question }),
  adapt: ({ text, language, explanationLevel }) =>
    api.post('/ai/adapt', { text, language, explanationLevel }),
};
