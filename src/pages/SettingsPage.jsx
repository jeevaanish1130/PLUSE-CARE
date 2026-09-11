import React, { useState } from 'react';
import { Settings, Lock, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Mock Notification Preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [medicineReminders, setMedicineReminders] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);

  const { user, role, logout } = useAuth();
  const { showToast } = useToast();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    setSavingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      showToast('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      showToast(msg, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Settings & Preferences"
        description="Manage your security credentials, notification preferences, and session."
      />

      {/* Account Info Summary */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-600" />
          <span>Account Information</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Signed In As:</span>
            <span className="font-semibold text-slate-800 text-sm">{user?.fullName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Registered Email:</span>
            <span className="font-semibold text-slate-800 text-sm">{user?.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Active Portal Role:</span>
            <span className="font-semibold text-brand-600 text-sm">{role}</span>
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-600" />
          <span>Change Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="sm" loading={savingPassword}>
            Update Password
          </Button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">Medicine Reminder Alarms</span>
              <span className="text-[11px] text-slate-500">Receive timely in-app reminders for scheduled doses</span>
            </div>
            <input
              type="checkbox"
              checked={medicineReminders}
              onChange={(e) => setMedicineReminders(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">Appointment Confirmation & Updates</span>
              <span className="text-[11px] text-slate-500">Alerts when doctors confirm or reschedule appointments</span>
            </div>
            <input
              type="checkbox"
              checked={appointmentAlerts}
              onChange={(e) => setAppointmentAlerts(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
            />
          </label>
        </div>
      </div>

      {/* Privacy Information */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-900 text-sm">Privacy & Clinical Data Security</h4>
        <p className="leading-relaxed">
          In this local demonstration deployment, all vital readings, appointments, and medical records are stored in a persistent local H2 database instance. Patient passwords are encrypted using BCrypt salted hashing and authenticated via signed JWT tokens. For real clinical deployment, full HIPAA/GDPR encryption-at-rest and certified EHR integrations would be configured.
        </p>
      </div>

      {/* Sign Out Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Sign Out of Session</h4>
          <p className="text-xs text-slate-500">Safely terminate your authenticated credentials on this device.</p>
        </div>
        <Button variant="danger" size="sm" icon={LogOut} onClick={logout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
