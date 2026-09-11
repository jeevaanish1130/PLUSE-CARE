import api from './api';

export const symptomService = {
  async assess(data) {
    const res = await api.post('/symptoms/assess', data);
    return res.data.data;
  },

  async getHistory() {
    const res = await api.get('/symptoms/history');
    return res.data.data;
  }
};
