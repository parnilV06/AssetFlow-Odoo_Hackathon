import api from './api';

export const bookingService = {
  getAll: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getCalendar: async (params = {}) => {
    const response = await api.get('/bookings/calendar', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  }
};
