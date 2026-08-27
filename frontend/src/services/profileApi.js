import api from './api';

export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.patch('/profile', data),
};

export default profileApi;
