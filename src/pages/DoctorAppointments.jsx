import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, User, Search, Eye } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { appointmentService } from '../services/appointmentService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentService.updateStatus(id, newStatus);
      showToast(`Appointment marked as ${newStatus}`, 'success');
      loadAppointments();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const filtered = appointments.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Appointment Schedule"
        description="Review scheduled consultations, confirm bookings, or view patient medical charts."
      />

      {/* Filter Tabs */}
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

      {loading ? (
        <Skeleton className="h-20 w-full" count={3} />
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {a.patientName?.split(' ').map((n) => n[0]).join('') || 'PT'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{a.patientName}</h4>
                    <Badge variant={a.status === 'CONFIRMED' || a.status === 'COMPLETED' ? 'green' : a.status === 'PENDING' ? 'amber' : 'rose'}>
                      {a.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{a.patientEmail}</p>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>Reason:</strong> {a.reason}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">{formatDate(a.appointmentDate)}</span>
                  <span className="text-xs text-slate-500 block">{a.appointmentTime} &bull; {a.consultationType}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/doctor/patients/${a.patientId}`)}
                  >
                    Open Chart
                  </Button>
                  {a.status === 'PENDING' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusUpdate(a.id, 'CONFIRMED')}
                    >
                      Confirm
                    </Button>
                  )}
                  {a.status === 'CONFIRMED' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusUpdate(a.id, 'COMPLETED')}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No appointments in this category"
          description="Bookings scheduled by patients will appear here."
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
