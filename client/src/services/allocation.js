import api from './api';

export const allocationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/allocations', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/allocations/${id}`);
    return response.data;
  },

  allocate: async (data) => {
    const response = await api.post('/allocations', data);
    return response.data;
  },

  returnAsset: async (data) => {
    const response = await api.post('/allocations/return', data);
    return response.data;
  },

  transfer: async (data) => {
    const response = await api.post('/allocations/transfer', data);
    return response.data;
  },

  getAssetHistory: async (assetId) => {
    const response = await api.get(`/allocations/history/${assetId}`);
    return response.data;
  }
};
