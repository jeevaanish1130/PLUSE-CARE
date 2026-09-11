import api from './api';

export const patientService = {
  async getProfile() {
    const res = await api.get('/patients/profile');
    return res.data.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/patients/profile', profileData);
    return res.data.data;
  },

  async getDashboard() {
    const res = await api.get('/patients/dashboard');
    return res.data.data;
  }
};
