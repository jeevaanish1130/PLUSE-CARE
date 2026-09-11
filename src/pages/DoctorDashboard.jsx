import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
  ChevronRight,
  User,
  Plus
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { doctorService } from '../services/doctorService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getDashboard();
      setData(res);
    } catch (err) {
      showToast('Failed to load doctor dashboard', 'error');
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

  const todayAppts = data?.todayAppointments || [];
  const recentAppts = data?.recentAppointments || [];

  return (
    <div className="space-y-8">
      {/* Doctor Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-700/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              Clinician Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Welcome, {user?.fullName || 'Doctor'}
            </h1>
            <p className="mt-1 text-sm text-teal-100 max-w-xl">
              You have {todayAppts.length} appointments scheduled today and{' '}
              {data?.pendingConsultationsCount || 0} consultations requiring your review.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Users}
              onClick={() => navigate('/doctor/patients')}
              className="bg-white text-teal-800 hover:bg-teal-50"
            >
              Patient Directory
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={ClipboardList}
              onClick={() => navigate('/doctor/consultations')}
              className="bg-teal-500 hover:bg-teal-400 text-white"
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={data?.todayAppointmentsCount || 0}
          subtitle="scheduled for today"
          icon={Calendar}
          color="brand"
          onClick={() => navigate('/doctor/appointments')}
        />
        <StatCard
          title="Total Registered Patients"
          value={data?.totalPatientsCount || 0}
          subtitle="under your care"
          icon={Users}
          color="indigo"
          onClick={() => navigate('/doctor/patients')}
        />
        <StatCard
          title="Pending Consultations"
          value={data?.pendingConsultationsCount || 0}
          subtitle="awaiting completion"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/doctor/appointments')}
        />
        <StatCard
          title="Completed Consultations"
          value={data?.completedConsultationsCount || 0}
          subtitle="all time"
          icon={CheckCircle2}
          color="green"
          onClick={() => navigate('/doctor/consultations')}
        />
      </div>

      {/* Today's Schedule & Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Today's Schedule ({todayAppts.length})</span>
            </h3>
            <Link to="/doctor/appointments" className="text-xs font-semibold text-brand-600 hover:underline">
              View Calendar
            </Link>
          </div>

          {todayAppts.length > 0 ? (
            <div className="space-y-3">
              {todayAppts.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                      {a.patientName?.split(' ').map((n) => n[0]).join('') || 'PT'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{a.patientName}</h4>
                      <p className="text-[11px] text-slate-500">{a.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 block">
                      {a.appointmentTime}
                    </span>
                    <button
                      onClick={() => navigate(`/doctor/patients/${a.patientId}`)}
                      className="text-[10px] text-brand-600 font-semibold hover:underline mt-1 block"
                    >
                      Patient Chart &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No appointments scheduled today"
              description="Check recent bookings or browse your complete patient directory."
            />
          )}
        </div>

        {/* Recent Platform Activity */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-600" />
              <span>Recent Consultations Overview</span>
            </h3>
            <Link to="/doctor/appointments" className="text-xs font-semibold text-brand-600 hover:underline">
              All Visits
            </Link>
          </div>

          {recentAppts.length > 0 ? (
            <div className="space-y-3">
              {recentAppts.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900">{a.patientName}</h5>
                    <p className="text-slate-500 text-[11px]">{formatDate(a.appointmentDate)} &bull; {a.appointmentTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.status === 'COMPLETED' ? 'green' : a.status === 'CONFIRMED' ? 'brand' : 'amber'}>
                      {a.status}
                    </Badge>
                    <button
                      onClick={() => navigate(`/doctor/patients/${a.patientId}`)}
                      className="text-xs text-brand-600 hover:underline font-semibold"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No recent appointments"
              description="Patient appointments will appear here."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
