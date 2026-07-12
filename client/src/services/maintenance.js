import api from './api';

export const maintenanceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/maintenance', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/maintenance', data);
    return response.data;
  },

  approve: async (id, data) => {
    const response = await api.patch(`/maintenance/${id}/approve`, data);
    return response.data;
  },

  assign: async (id, data) => {
    const response = await api.patch(`/maintenance/${id}/assign`, data);
    return response.data;
  },

  start: async (id, data) => {
    const response = await api.patch(`/maintenance/${id}/start`, data);
    return response.data;
  },

  resolve: async (id, data) => {
    const response = await api.patch(`/maintenance/${id}/resolve`, data);
    return response.data;
  },

  getAssetHistory: async (assetId) => {
    const response = await api.get(`/assets/${assetId}/maintenance`);
    return response.data;
  }
};
