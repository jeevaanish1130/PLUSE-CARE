import api from './api';

export const consultationService = {
  async getConsultations() {
    const res = await api.get('/consultations');
    return res.data.data;
  },

  async createConsultationNote(data) {
    const res = await api.post('/consultations', data);
    return res.data.data;
  }
};
