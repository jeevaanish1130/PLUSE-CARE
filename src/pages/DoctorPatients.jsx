import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, User, Calendar, Phone, ArrowRight, Eye } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { doctorService } from '../services/doctorService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getPatients();
      setPatients(data);
    } catch (err) {
      showToast('Failed to load patient directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.fullName?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.bloodGroup?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Directory"
        description="Comprehensive clinical records of patients who have consulted or scheduled visits."
      >
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-44 w-full" count={3} />
        </div>
      ) : filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm">
                      {p.fullName?.split(' ').map((n) => n[0]).join('') || 'PT'}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{p.fullName}</h4>
                      <p className="text-xs text-slate-400">{p.email}</p>
                    </div>
                  </div>
                  <Badge variant="brand">{p.bloodGroup || 'O+'}</Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 py-3 border-y border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gender:</span>
                    <span className="font-semibold text-slate-800">{p.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Visit:</span>
                    <span className="font-semibold text-slate-800">{formatDate(p.lastVisit) || 'Recent'}</span>
                  </div>
                  {p.emergencyContact && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Emergency Phone:</span>
                      <span className="font-semibold text-brand-600">{p.emergencyContact}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => navigate(`/doctor/patients/${p.id}`)}
                >
                  Open Medical Chart
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No patients found"
          description="Patients who book an appointment with you will automatically appear in this directory."
        />
      )}
    </div>
  );
};

export default DoctorPatients;
