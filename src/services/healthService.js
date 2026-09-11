import api from './api';

export const healthService = {
  async getMetrics(type = '') {
    const params = type ? { type } : {};
    const res = await api.get('/health-metrics', { params });
    return res.data.data;
  },

  async addMetric(data) {
    const res = await api.post('/health-metrics', data);
    return res.data.data;
  },

  async updateMetric(id, data) {
    const res = await api.put(`/health-metrics/${id}`, data);
    return res.data.data;
  },

  async deleteMetric(id) {
    const res = await api.delete(`/health-metrics/${id}`);
    return res.data;
  }
};
