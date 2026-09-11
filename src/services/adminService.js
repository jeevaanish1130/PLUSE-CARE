import api from './api';

export const adminService = {
  async getDashboard() {
    const res = await api.get('/admin/dashboard');
    return res.data.data;
  },

  async getUsers() {
    const res = await api.get('/admin/users');
    return res.data.data;
  },

  async toggleUserStatus(id) {
    const res = await api.put(`/admin/users/${id}/toggle-status`);
    return res.data.data;
  },

  async getDoctors() {
    const res = await api.get('/admin/doctors');
    return res.data.data;
  },

  async getAppointments() {
    const res = await api.get('/admin/appointments');
    return res.data.data;
  }
};
