import api from './api';

export const doctorService = {
  async getAllDoctors(specialty = '') {
    const params = specialty ? { specialty } : {};
    const res = await api.get('/doctors', { params });
    return res.data.data;
  },

  async getDoctorById(id) {
    const res = await api.get(`/doctors/${id}`);
    return res.data.data;
  },

  async getProfile() {
    const res = await api.get('/doctor/profile');
    return res.data.data;
  },

  async updateProfile(data) {
    const res = await api.put('/doctor/profile', data);
    return res.data.data;
  },

  async getDashboard() {
    const res = await api.get('/doctor/dashboard');
    return res.data.data;
  },

  async getPatients() {
    const res = await api.get('/doctor/patients');
    return res.data.data;
  },

  async getPatientDetails(patientId) {
    const res = await api.get(`/doctor/patients/${patientId}`);
    return res.data.data;
  }
};
