import api from './api';

export const appointmentService = {
  async getAppointments() {
    const res = await api.get('/appointments');
    return res.data.data;
  },

  async bookAppointment(data) {
    const res = await api.post('/appointments', data);
    return res.data.data;
  },

  async updateStatus(id, status) {
    const res = await api.put(`/appointments/${id}/status`, { status });
    return res.data.data;
  },

  async cancelAppointment(id) {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  }
};
