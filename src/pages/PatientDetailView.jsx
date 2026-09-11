import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Activity,
  Heart,
  Calendar,
  FileText,
  Stethoscope,
  Plus,
  ShieldAlert,
  Phone,
  ArrowLeft,
  Clock,
  ClipboardList
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import Badge from '../components/Badge';
import RiskIndicator from '../components/RiskIndicator';
import { doctorService } from '../services/doctorService';
import { consultationService } from '../services/consultationService';
import { useToast } from '../context/ToastContext';
import { formatDate, formatDateTime } from '../utils/formatters';

const PatientDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vitals'); // 'vitals' | 'symptoms' | 'records' | 'consultations'

  // Consultation Note Modal
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [visitReason, setVisitReason] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [comments, setComments] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getPatientDetails(id);
      setData(res);
    } catch (err) {
      showToast('Failed to load patient medical chart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!visitReason.trim() || !diagnosisNotes.trim()) {
      showToast('Please provide both reason and clinical notes', 'warning');
      return;
    }

    setSavingNote(true);
    try {
      await consultationService.createConsultationNote({
        patientId: parseInt(id),
        visitReason,
        diagnosisNotes,
        treatmentPlan,
        followUpDate: followUpDate || null,
        comments
      });
      showToast('Consultation note attached to patient chart', 'success');
      setNoteModalOpen(false);
      setVisitReason('');
      setDiagnosisNotes('');
      setTreatmentPlan('');
      loadDetails();
    } catch (err) {
      showToast('Failed to save consultation note', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const patient = data?.patient;
  const profile = data?.profile;
  const vitals = data?.healthMetrics || [];
  const symptoms = data?.symptomAssessments || [];
  const records = data?.medicalRecords || [];
  const notes = data?.consultationNotes || [];

  return (
    <div className="space-y-6">
      {/* Back button and page header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/doctor/patients')}>
          Back to Directory
        </Button>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {patient?.fullName?.split(' ').map((n) => n[0]).join('') || 'PT'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">{patient?.fullName}</h1>
                <Badge variant="brand">{profile?.bloodGroup || 'O+'}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {patient?.email} &bull; {profile?.gender || 'Male'} &bull; DOB: {profile?.dateOfBirth || '1994-06-15'}
              </p>
              {profile?.emergencyContactPhone && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  Emergency: {profile.emergencyContactName} ({profile.emergencyContactRelation}) - {profile.emergencyContactPhone}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setNoteModalOpen(true)}
          >
            Add Consultation Note
          </Button>
        </div>

        {/* Clinical alerts banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
            <span className="font-bold text-rose-900 block mb-0.5">Critical Allergies:</span>
            <span className="text-slate-700">{profile?.allergies || 'None reported'}</span>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <span className="font-bold text-amber-900 block mb-0.5">Pre-existing Conditions:</span>
            <span className="text-slate-700">{profile?.existingConditions || 'None reported'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('vitals')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'vitals'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Recorded Vitals ({vitals.length})
        </button>
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'symptoms'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Symptom Assessments ({symptoms.length})
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'records'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Medical Records ({records.length})
        </button>
        <button
          onClick={() => setActiveTab('consultations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'consultations'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Consultation Notes ({notes.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'vitals' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Vitals & Physiological Metrics</h3>
          {vitals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Metric Type</th>
                    <th className="px-4 py-3">Reading Value</th>
                    <th className="px-4 py-3">Recorded At</th>
                    <th className="px-4 py-3">Patient Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {vitals.map((v) => (
                    <tr key={v.id}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{v.metricType?.replace('_', ' ')}</td>
                      <td className="px-4 py-3 font-bold text-brand-700">
                        {v.value} {v.secondaryValue ? `/ ${v.secondaryValue}` : ''} {v.unit}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatDateTime(v.recordedAt)}</td>
                      <td className="px-4 py-3 text-slate-600">{v.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No vitals logged yet.</p>
          )}
        </div>
      )}

      {activeTab === 'symptoms' && (
        <div className="space-y-4">
          {symptoms.length > 0 ? (
            symptoms.map((s) => (
              <div key={s.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">{formatDate(s.createdAt)}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs font-semibold text-slate-700">Severity: {s.severity}</span>
                  </div>
                  <RiskIndicator riskLevel={s.riskLevel} showDescription={false} />
                </div>
                <p className="text-xs text-slate-700"><strong>Symptoms:</strong> {s.symptomsList}</p>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">{s.summary}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No symptom assessments recorded.</p>
          )}
        </div>
      )}

      {activeTab === 'records' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {records.length > 0 ? (
            records.map((r) => (
              <div key={r.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="slate">{r.category?.replace('_', ' ')}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(r.recordDate)}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{r.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{r.institution || r.doctorName}</p>
                {r.notes && <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded-lg">{r.notes}</p>}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No uploaded records found.</p>
          )}
        </div>
      )}

      {activeTab === 'consultations' && (
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((n) => (
              <div key={n.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">{n.visitReason}</h4>
                  <span className="text-xs text-slate-400">{formatDate(n.createdAt)}</span>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="font-bold text-slate-700 block">Diagnosis Notes:</span>
                    <p className="text-slate-600 leading-relaxed">{n.diagnosisNotes}</p>
                  </div>
                  {n.treatmentPlan && (
                    <div>
                      <span className="font-bold text-slate-700 block">Treatment Plan:</span>
                      <p className="text-slate-600 leading-relaxed">{n.treatmentPlan}</p>
                    </div>
                  )}
                  {n.followUpDate && (
                    <div className="text-brand-600 font-semibold">
                      Follow-up recommended on: {formatDate(n.followUpDate)}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No past consultation notes.</p>
          )}
        </div>
      )}

      {/* Add Consultation Modal */}
      <Modal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="Add Clinical Consultation Note"
        description="Filing official visit findings and non-prescriptive lifestyle recommendations."
      >
        <form onSubmit={handleSaveConsultation} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit</label>
            <input
              type="text"
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              placeholder="e.g. Hypertension review, ECG evaluation..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Diagnosis & Clinical Examination Notes</label>
            <textarea
              rows={3}
              value={diagnosisNotes}
              onChange={(e) => setDiagnosisNotes(e.target.value)}
              placeholder="Record clinical impressions, observations, and physical exam findings..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Recommended Treatment / Management Plan</label>
            <textarea
              rows={3}
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              placeholder="Dietary interventions, exercise regimens, specialist referrals..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Date (Optional)</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Private Comments</label>
              <input
                type="text"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Internal patient compliance notes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={savingNote}>
              Save Consultation Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientDetailView;
