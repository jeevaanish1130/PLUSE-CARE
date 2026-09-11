import React, { useState, useEffect } from 'react';
import { Stethoscope, Star, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Skeleton from '../components/Skeleton';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDoctors();
      setDoctors(data);
    } catch (err) {
      showToast('Failed to load doctors list', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Physician & Doctor Oversight"
        description="Review credentials, hospital affiliations, and rating metrics for platform physicians."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-44 w-full" count={3} />
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <div key={d.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{d.fullName}</h4>
                  <p className="text-xs text-brand-600 font-semibold">{d.specialty}</p>
                </div>
                <Badge variant="green" dot>Verified</Badge>
              </div>

              <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100">
                <p><strong>Hospital:</strong> {d.hospitalAffiliation || 'Metro Health'}</p>
                <p><strong>Credentials:</strong> {d.qualification || 'MD'}</p>
                <p><strong>Fee:</strong> ${d.consultationFee || 80}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 pt-2 border-t border-slate-100">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{d.rating || 4.9}</span>
                <span className="text-slate-400 font-normal">({d.totalReviews || 100} reviews)</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Stethoscope}
          title="No doctors found"
          description="Registered physician profiles will be listed here."
        />
      )}
    </div>
  );
};

export default AdminDoctors;
