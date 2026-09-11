import api from './api';

export const medicineService = {
  async getMedicines(status = '') {
    const params = status ? { status } : {};
    const res = await api.get('/medicines', { params });
    return res.data.data;
  },

  async addMedicine(data) {
    const res = await api.post('/medicines', data);
    return res.data.data;
  },

  async updateMedicine(id, data) {
    const res = await api.put(`/medicines/${id}`, data);
    return res.data.data;
  },

  async deleteMedicine(id) {
    const res = await api.delete(`/medicines/${id}`);
    return res.data;
  }
};
