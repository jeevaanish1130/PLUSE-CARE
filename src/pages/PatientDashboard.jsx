import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Heart,
  Calendar,
  Pill,
  Stethoscope,
  Bot,
  AlertOctagon,
  FilePlus,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { patientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/formatters';

const PatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await patientService.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" count={4} />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const latestMetrics = data?.latestMetrics || {};
  const upcomingAppt = data?.upcomingAppointment;
  const activeMeds = data?.activeMedicines || [];

  return (
    <div className="space-y-8">
      {/* Top Greeting & Health Score Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-teal-600 p-6 sm:p-8 text-white shadow-lg shadow-brand-500/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-100">
              {getGreeting()} 👋
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Welcome back, {user?.fullName || 'Patient'}
            </h1>
            <p className="mt-1 text-sm text-brand-100 max-w-xl">
              Your vital trends are stable today. You have {activeMeds.length} active medicine reminders and{' '}
              {upcomingAppt ? '1 upcoming consultation.' : 'no appointments today.'}
            </p>
          </div>

          {/* Health Score Pill */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 self-start md:self-auto">
            <div className="w-14 h-14 rounded-xl bg-white text-brand-700 flex flex-col items-center justify-center font-black shadow-md">
              <span className="text-xl leading-none">{data?.healthScore || 85}</span>
              <span className="text-[9px] uppercase font-bold text-brand-500">/ 100</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-200">Health Index</p>
              <p className="text-sm font-semibold text-white">Optimal Condition</p>
              <p className="text-[11px] text-brand-100">Profile {data?.profileCompletion || 80}% complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Quick Health Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/patient/symptoms"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Check Symptoms</span>
            <span className="text-[10px] text-slate-400 mt-0.5">3-step triage</span>
          </Link>

          <Link
            to="/patient/ai-assistant"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Ask AI</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Medical Q&A</span>
          </Link>

          <Link
            to="/patient/appointments"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Book Doctor</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Find specialist</span>
          </Link>

          <Link
            to="/patient/health"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Track Health</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Vitals & logs</span>
          </Link>

          <Link
            to="/patient/records"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <FilePlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Add Record</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Lab panels & RX</span>
          </Link>

          <Link
            to="/patient/emergency"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-rose-800">Emergency</span>
            <span className="text-[10px] text-rose-600 mt-0.5">Urgent support</span>
          </Link>
        </div>
      </div>

      {/* Vitals Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Latest Health Measurements
          </h2>
          <Link to="/patient/health" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            <span>View All Vitals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Blood Pressure"
            value={
              latestMetrics.BLOOD_PRESSURE
                ? `${latestMetrics.BLOOD_PRESSURE.value.toFixed(0)}/${latestMetrics.BLOOD_PRESSURE.secondaryValue?.toFixed(0) || '80'}`
                : '120/80'
            }
            subtitle="mmHg"
            icon={Activity}
            color="brand"
            trendLabel="Target: <120/80"
            onClick={() => navigate('/patient/health')}
          />
          <StatCard
            title="Heart Rate"
            value={latestMetrics.HEART_RATE ? `${latestMetrics.HEART_RATE.value.toFixed(0)}` : '72'}
            subtitle="bpm"
            icon={Heart}
            color="rose"
            trendLabel="Normal: 60-100"
            onClick={() => navigate('/patient/health')}
          />
          <StatCard
            title="Blood Glucose"
            value={latestMetrics.BLOOD_GLUCOSE ? `${latestMetrics.BLOOD_GLUCOSE.value.toFixed(0)}` : '95'}
            subtitle="mg/dL"
            icon={Activity}
            color="amber"
            trendLabel="Fasting target"
            onClick={() => navigate('/patient/health')}
          />
          <StatCard
            title="Weight"
            value={latestMetrics.WEIGHT ? `${latestMetrics.WEIGHT.value.toFixed(1)}` : '72.5'}
            subtitle="kg"
            icon={Activity}
            color="indigo"
            trendLabel="BMI: 22.9 (Healthy)"
            onClick={() => navigate('/patient/health')}
          />
          <StatCard
            title="Temperature"
            value={latestMetrics.TEMPERATURE ? `${latestMetrics.TEMPERATURE.value.toFixed(1)}` : '98.4'}
            subtitle="°F"
            icon={Activity}
            color="green"
            trendLabel="Afebrile"
            onClick={() => navigate('/patient/health')}
          />
        </div>
      </div>

      {/* Two Column Grid: Upcoming Appointment & Active Medicines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointment */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Upcoming Appointment</span>
            </h3>
            <Link to="/patient/appointments" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Manage
            </Link>
          </div>

          {upcomingAppt ? (
            <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {upcomingAppt.doctorName?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'DR'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{upcomingAppt.doctorName}</h4>
                    <p className="text-xs text-brand-700 font-medium">{upcomingAppt.doctorSpecialty || 'General Physician'}</p>
                    <p className="text-xs text-slate-500 mt-1">{upcomingAppt.reason}</p>
                  </div>
                </div>
                <Badge variant="green">{upcomingAppt.status}</Badge>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-100/80 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  {formatDate(upcomingAppt.appointmentDate)} at {upcomingAppt.appointmentTime}
                </span>
                <span className="font-semibold text-brand-700 bg-white px-2.5 py-1 rounded-lg border border-brand-200">
                  {upcomingAppt.consultationType || 'In-person'}
                </span>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No upcoming consultations"
              description="Keep your health on track by scheduling an appointment with a verified doctor."
              actionText="Book an Appointment"
              onAction={() => navigate('/patient/appointments')}
            />
          )}
        </div>

        {/* Active Medicines Reminder */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Pill className="w-4 h-4 text-amber-600" />
              <span>Active Medicines Reminder</span>
            </h3>
            <Link to="/patient/medicines" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View All ({activeMeds.length})
            </Link>
          </div>

          {activeMeds.length > 0 ? (
            <div className="space-y-3">
              {activeMeds.slice(0, 3).map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{med.medicineName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {med.dosage} &bull; {med.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200 block">
                      {med.reminderTime || 'Daily'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Pill}
              title="No active medicines logged"
              description="Record prescribed medications so you never miss a dose."
              actionText="Add Medicine"
              onAction={() => navigate('/patient/medicines')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
