import React, { useState, useEffect } from 'react';
import { Calendar, Search, Clock, User, Stethoscope } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Skeleton from '../components/Skeleton';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { showToast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAppointments();
      setAppointments(data);
    } catch (err) {
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = appointments.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Appointments Oversight"
        description="Monitor all patient consultations, scheduled bookings, and historical completions."
      />

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === st
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6">
            <Skeleton className="h-12 w-full" count={4} />
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Patient</th>
                  <th className="px-6 py-3.5">Doctor</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Reason</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{a.patientName}</td>
                    <td className="px-6 py-4 text-slate-700">{a.doctorName}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(a.appointmentDate)} &bull; {a.appointmentTime}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{a.reason}</td>
                    <td className="px-6 py-4">
                      <Badge variant={a.status === 'COMPLETED' ? 'green' : a.status === 'CONFIRMED' ? 'brand' : a.status === 'PENDING' ? 'amber' : 'rose'}>
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No appointments match filter"
            description="Platform appointments will appear here."
          />
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
