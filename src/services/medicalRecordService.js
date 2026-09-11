import api from './api';

export const medicalRecordService = {
  async getRecords(category = '') {
    const params = category ? { category } : {};
    const res = await api.get('/medical-records', { params });
    return res.data.data;
  },

  async addRecord(data) {
    const res = await api.post('/medical-records', data);
    return res.data.data;
  },

  async deleteRecord(id) {
    const res = await api.delete(`/medical-records/${id}`);
    return res.data;
  }
};
