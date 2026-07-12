import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    // Backend logout logic if it exists, otherwise just return success
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn("Logout endpoint failed, proceeding with local logout");
    }
  }
};
