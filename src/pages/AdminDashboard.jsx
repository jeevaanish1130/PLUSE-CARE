import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboard();
      setStats(data);
    } catch (err) {
      showToast('Failed to load admin statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Administrative Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">Platform Operations</h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              System overview of registered users, physician networks, active bookings, and system health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Users}
              onClick={() => navigate('/admin/users')}
            >
              Manage Users
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Stethoscope}
              onClick={() => navigate('/admin/doctors')}
            >
              Verify Doctors
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats?.totalUsers || 0}
          subtitle="across all roles"
          icon={Users}
          color="brand"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Registered Patients"
          value={stats?.totalPatients || 0}
          subtitle="active profiles"
          icon={Activity}
          color="teal"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Physicians / Doctors"
          value={stats?.totalDoctors || 0}
          subtitle="board certified"
          icon={Stethoscope}
          color="indigo"
          onClick={() => navigate('/admin/doctors')}
        />
        <StatCard
          title="Total Consultations"
          value={stats?.totalAppointments || 0}
          subtitle="platform appointments"
          icon={Calendar}
          color="amber"
          onClick={() => navigate('/admin/appointments')}
        />
      </div>

      {/* Platform Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Appointment Fulfillment Rate</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Completed Appointments</span>
                <span className="text-emerald-600">{stats?.completedAppointments || 0}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-3/4"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Pending / Scheduled Visits</span>
                <span className="text-amber-600">{stats?.pendingAppointments || 0}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-1/3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Security & Infrastructure</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-400">Database Engine:</span>
              <span className="font-semibold text-slate-800">Persistent H2 Relational DB</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-400">Authentication Protocol:</span>
              <span className="font-semibold text-slate-800">Stateless JWT + BCrypt Salted Hash</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-400">Active Accounts:</span>
              <span className="font-semibold text-emerald-700">{stats?.activeUsers || 0} Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
