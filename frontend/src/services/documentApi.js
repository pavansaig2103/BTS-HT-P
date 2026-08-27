import api from './api';

export const documentApi = {
  upload: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUserDocuments: () => api.get('/documents'),
  getDocument: (id) => api.get(`/documents/${id}`),
  getDocumentStatus: (id) => api.get(`/documents/${id}/status`),
};

export default documentApi;
