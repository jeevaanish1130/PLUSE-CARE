import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  FileCheck,
  Building,
  User,
  Upload
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Badge from '../components/Badge';
import { medicalRecordService } from '../services/medicalRecordService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const CATEGORIES = [
  { key: '', label: 'All Records' },
  { key: 'CONSULTATION', label: 'Consultations' },
  { key: 'PRESCRIPTION', label: 'Prescriptions' },
  { key: 'LAB_REPORT', label: 'Lab Reports' },
  { key: 'SCAN', label: 'Imaging & Scans' },
  { key: 'OTHER', label: 'Other Documents' }
];

const MedicalRecords = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('LAB_REPORT');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins');
  const [institution, setInstitution] = useState('Metro Health Medical Center');
  const [notes, setNotes] = useState('');
  const [mockFileName, setMockFileName] = useState('Lab_Diagnostic_Report.pdf');
  const [mockFileSize, setMockFileSize] = useState('1.2 MB');
  const [saving, setSaving] = useState(false);

  // View Details Modal
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadRecords();
  }, [activeCategory]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await medicalRecordService.getRecords(activeCategory);
      setRecords(data);
    } catch (err) {
      showToast('Failed to load medical records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Record title is required', 'warning');
      return;
    }

    setSaving(true);
    try {
      await medicalRecordService.addRecord({
        title,
        category,
        recordDate,
        doctorName,
        institution,
        notes,
        fileName: mockFileName,
        fileSize: mockFileSize,
        fileUrl: '/mock-files/' + mockFileName
      });
      showToast('Medical record attached to your profile', 'success');
      setAddModalOpen(false);
      setTitle('');
      setNotes('');
      loadRecords();
    } catch (err) {
      showToast('Failed to save record', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await medicalRecordService.deleteRecord(deleteId);
      showToast('Medical record deleted', 'success');
      setDeleteOpen(false);
      loadRecords();
    } catch (err) {
      showToast('Failed to delete medical record', 'error');
    }
  };

  const filteredRecords = records.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(query) ||
      (r.doctorName && r.doctorName.toLowerCase().includes(query)) ||
      (r.institution && r.institution.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical Records & Documents"
        description="Securely store, organize, and inspect your lab reports, imaging scans, and prescriptions."
      >
        <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
          Upload Record
        </Button>
      </PageHeader>

      {/* Category filter tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 sm:border-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Records Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-44 w-full" count={3} />
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge variant="slate">{r.category?.replace('_', ' ')}</Badge>
                </div>

                <h4 className="text-base font-bold text-slate-900 line-clamp-1">{r.title}</h4>

                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(r.recordDate)}</span>
                  </div>
                  {r.doctorName && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.doctorName}</span>
                    </div>
                  )}
                  {r.institution && (
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.institution}</span>
                    </div>
                  )}
                </div>

                {r.notes && (
                  <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl line-clamp-2 italic">
                    "{r.notes}"
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {r.fileName} ({r.fileSize})
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedRecord(r)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-50"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(r.id);
                      setDeleteOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No medical records found"
          description="Keep your clinical documents organized in one place for rapid doctor review."
          actionText="Upload First Record"
          onAction={() => setAddModalOpen(true)}
        />
      )}

      {/* Add Record Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Medical Record"
        description="Log clinical report metadata and simulate document attachment."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count (CBC) Panel"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="LAB_REPORT">Lab Report</option>
                <option value="SCAN">Imaging & Scan</option>
                <option value="PRESCRIPTION">Prescription</option>
                <option value="CONSULTATION">Consultation Summary</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Record Date</label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor / Specialist</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Dr. Sarah Jenkins"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Lab</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Quest Diagnostics"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Polished Mock Upload UI */}
          <div className="p-4 rounded-2xl border border-dashed border-brand-300 bg-brand-50/30 text-center">
            <Upload className="w-6 h-6 text-brand-600 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-brand-900">Attachment Ready</p>
            <p className="text-[11px] text-slate-500">{mockFileName} ({mockFileSize})</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Findings / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key diagnostic observations, doctor recommendations..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              Save Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record View Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={selectedRecord.title}
          description={`${selectedRecord.category?.replace('_', ' ')} • ${formatDate(selectedRecord.recordDate)}`}
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Doctor:</span>
                <span className="font-semibold text-slate-800">{selectedRecord.doctorName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Facility:</span>
                <span className="font-semibold text-slate-800">{selectedRecord.institution || '—'}</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Clinical Notes</h5>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 text-xs">
                {selectedRecord.notes || 'No specific notes recorded with this file.'}
              </p>
            </div>

            <div className="p-3 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-brand-900 font-semibold">
                <FileCheck className="w-4 h-4 text-brand-600" />
                <span>{selectedRecord.fileName || 'Report.pdf'}</span>
              </div>
              <button
                onClick={() => showToast('Opening secure document viewer...', 'info')}
                className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Medical Record"
        message="Are you sure you want to delete this document from your profile? This cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default MedicalRecords;
