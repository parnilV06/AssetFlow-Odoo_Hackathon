import api from './api';

export const categoryService = {
  getAll: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  }
};
