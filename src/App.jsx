import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Patient Pages
import PatientDashboard from './pages/PatientDashboard';
import PatientProfile from './pages/PatientProfile';
import SymptomChecker from './pages/SymptomChecker';
import AiAssistant from './pages/AiAssistant';
import HealthTracking from './pages/HealthTracking';
import MedicineManagement from './pages/MedicineManagement';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecords from './pages/MedicalRecords';
import NotificationsPage from './pages/NotificationsPage';
import EmergencySupport from './pages/EmergencySupport';
import SettingsPage from './pages/SettingsPage';

// Doctor Pages
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatients from './pages/DoctorPatients';
import PatientDetailView from './pages/PatientDetailView';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorConsultations from './pages/DoctorConsultations';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDoctors from './pages/AdminDoctors';
import AdminAppointments from './pages/AdminAppointments';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Patient Portal */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['PATIENT', 'DOCTOR', 'ADMIN']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="symptoms" element={<SymptomChecker />} />
        <Route path="ai-assistant" element={<AiAssistant />} />
        <Route path="health" element={<HealthTracking />} />
        <Route path="medicines" element={<MedicineManagement />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="records" element={<MedicalRecords />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="emergency" element={<EmergencySupport />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Doctor Portal */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="patients/:id" element={<PatientDetailView />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="consultations" element={<DoctorConsultations />} />
      </Route>

      {/* Admin Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="appointments" element={<AdminAppointments />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
