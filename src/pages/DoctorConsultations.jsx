import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Calendar, User, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { consultationService } from '../services/consultationService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const DoctorConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const data = await consultationService.getConsultations();
      setConsultations(data);
    } catch (err) {
      showToast('Failed to load consultations', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical Consultations History"
        description="Review all clinical evaluations, diagnosis notes, and follow-up recommendations filed."
      />

      {loading ? (
        <Skeleton className="h-32 w-full" count={3} />
      ) : consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{c.visitReason}</h4>
                  <span className="text-xs text-brand-600 font-semibold">({c.patientName})</span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-700 block">Diagnosis Notes:</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    {c.diagnosisNotes}
                  </p>
                </div>
                {c.treatmentPlan && (
                  <div>
                    <span className="font-bold text-slate-700 block">Treatment & Lifestyle Plan:</span>
                    <p className="text-slate-600 leading-relaxed bg-brand-50/40 p-3 rounded-xl border border-brand-100">
                      {c.treatmentPlan}
                    </p>
                  </div>
                )}
                {c.followUpDate && (
                  <p className="text-xs font-semibold text-teal-700">
                    Next follow-up recommended: {formatDate(c.followUpDate)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No past consultation notes"
          description="Select a patient from your directory to add a consultation note."
        />
      )}
    </div>
  );
};

export default DoctorConsultations;
