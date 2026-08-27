import api from './api';

export const aiApi = {
  ask: ({ workflowId, stepId, question }) =>
    api.post('/ai/ask', { workflowId, stepId, question }),
  adapt: ({ text, language, explanationLevel }) =>
    api.post('/ai/adapt', { text, language, explanationLevel }),
};

export default aiApi;
