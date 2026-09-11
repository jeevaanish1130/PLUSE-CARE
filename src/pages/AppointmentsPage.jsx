import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Star,
  Plus,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Badge from '../components/Badge';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const TIME_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM'
];

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'cancelled' | 'doctors'
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingType, setBookingType] = useState('In-person');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Cancel dialog
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appts, docs] = await Promise.all([
        appointmentService.getAppointments(),
        doctorService.getAllDoctors()
      ]);
      setAppointments(appts);
      setDoctors(docs);
    } catch (err) {
      showToast('Failed to load appointments data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      showToast('Please select a doctor', 'warning');
      return;
    }
    if (!bookingReason.trim()) {
      showToast('Please state a reason for the consultation', 'warning');
      return;
    }

    setBookingSubmitting(true);
    try {
      await appointmentService.bookAppointment({
        doctorId: selectedDoctor.userId || selectedDoctor.id,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime,
        reason: bookingReason,
        consultationType: bookingType,
        notes: bookingNotes
      });
      showToast('Appointment booked successfully!', 'success');
      setBookingOpen(false);
      setSelectedDoctor(null);
      setBookingReason('');
      setActiveTab('upcoming');
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment';
      showToast(msg, 'error');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancellingId) return;
    try {
      await appointmentService.cancelAppointment(cancellingId);
      showToast('Appointment cancelled', 'success');
      setCancelOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to cancel appointment', 'error');
    }
  };

  const openBookingForDoctor = (doc) => {
    setSelectedDoctor(doc);
    setBookingOpen(true);
  };

  const upcomingAppts = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );
  const completedAppts = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelledAppts = appointments.filter((a) => a.status === 'CANCELLED');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Appointments & Consultations"
        description="Schedule in-person or video consultations with board-certified medical specialists."
      >
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setSelectedDoctor(doctors[0] || null);
            setBookingOpen(true);
          }}
        >
          Book Appointment
        </Button>
      </PageHeader>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'upcoming'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Upcoming ({upcomingAppts.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'completed'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Completed ({completedAppts.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'cancelled'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Cancelled ({cancelledAppts.length})
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'doctors'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Browse Doctors Directory ({doctors.length})
        </button>
      </div>

      {/* Main Tab Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 w-full" count={2} />
        </div>
      ) : activeTab === 'doctors' ? (
        /* Doctors Directory Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white font-black text-base flex items-center justify-center shadow-sm flex-shrink-0">
                    {doc.fullName?.replace('Dr. ', '').split(' ').map((n) => n[0]).join('') || 'DR'}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{doc.fullName}</h4>
                    <p className="text-xs text-brand-600 font-semibold">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doc.qualification}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 py-3 border-y border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hospital:</span>
                    <span className="font-semibold text-slate-800">{doc.hospitalAffiliation || 'Metro Health'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-semibold text-slate-800">{doc.experienceYears || 10}+ years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Consultation:</span>
                    <span className="font-semibold text-emerald-700">${doc.consultationFee || 90}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Available:</span>
                    <span className="font-medium text-slate-700">{doc.availableDays || 'Mon - Fri'}</span>
                  </div>
                </div>

                {doc.bio && (
                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{doc.rating || 4.9}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({doc.totalReviews || 80})</span>
                </div>
                <Button variant="primary" size="sm" onClick={() => openBookingForDoctor(doc)}>
                  Schedule Visit
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Appointments List */
        <div className="space-y-4">
          {(activeTab === 'upcoming'
            ? upcomingAppts
            : activeTab === 'completed'
            ? completedAppts
            : cancelledAppts
          ).length > 0 ? (
            (activeTab === 'upcoming'
              ? upcomingAppts
              : activeTab === 'completed'
              ? completedAppts
              : cancelledAppts
            ).map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                    {a.doctorName?.replace('Dr. ', '').slice(0, 2) || 'DR'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{a.doctorName}</h4>
                      <Badge variant={a.status === 'CONFIRMED' || a.status === 'COMPLETED' ? 'green' : a.status === 'PENDING' ? 'amber' : 'rose'}>
                        {a.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-600 font-semibold">{a.doctorSpecialty || 'General Physician'}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Reason:</strong> {a.reason}
                    </p>
                    {a.notes && (
                      <p className="text-xs text-slate-500 italic">Notes: {a.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      <span>{formatDate(a.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{a.appointmentTime}</span>
                    </div>
                  </div>

                  {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                    <button
                      onClick={() => {
                        setCancellingId(a.id);
                        setCancelOpen(true);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 mt-2 hover:underline"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Calendar}
              title={`No ${activeTab} appointments`}
              description="Keep your preventive care routine up to date with regular checkups."
              actionText="Book New Consultation"
              onAction={() => {
                setSelectedDoctor(doctors[0] || null);
                setBookingOpen(true);
              }}
            />
          )}
        </div>
      )}

      {/* Appointment Booking Flow Modal */}
      <Modal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title="Schedule a Doctor Consultation"
        description="Select date, time slot, and reason for your appointment."
      >
        <form onSubmit={handleBookSubmit} className="space-y-4">
          {/* Select Doctor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Specialist</label>
            <select
              value={selectedDoctor?.userId || selectedDoctor?.id || ''}
              onChange={(e) => {
                const doc = doctors.find((d) => (d.userId || d.id) === parseInt(e.target.value));
                setSelectedDoctor(doc);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.userId || d.id}>
                  {d.fullName} — {d.specialty} (${d.consultationFee || 80})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Type</label>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="In-person">In-person Clinic</option>
                <option value="Video">Video Telehealth</option>
              </select>
            </div>
          </div>

          {/* Time slot pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Available Time Slot</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setBookingTime(slot)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    bookingTime === slot
                      ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit</label>
            <input
              type="text"
              value={bookingReason}
              onChange={(e) => setBookingReason(e.target.value)}
              placeholder="e.g. Annual cardiac review, chronic fatigue, blood pressure check..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Notes (Optional)</label>
            <textarea
              rows={2}
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              placeholder="Any specific symptoms or questions to discuss..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setBookingOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={bookingSubmitting}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel dialog */}
      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this scheduled appointment? You can rebook at any time."
        confirmText="Cancel Appointment"
        confirmVariant="danger"
      />
    </div>
  );
};

export default AppointmentsPage;
