import React, { useState, useEffect } from 'react';
import { Pill, Plus, Trash2, Edit2, CheckCircle2, Clock, Calendar, AlertCircle, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Badge from '../components/Badge';
import { medicineService } from '../services/medicineService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const MedicineManagement = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' | 'COMPLETED'
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadMedicines();
  }, [activeTab]);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getMedicines(activeTab);
      setMedicines(data);
    } catch (err) {
      showToast('Failed to load medicines', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setDosage('');
    setFrequency('Once daily');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setReminderTime('08:00 AM');
    setInstructions('');
    setStatus('ACTIVE');
    setModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingId(m.id);
    setName(m.medicineName);
    setDosage(m.dosage);
    setFrequency(m.frequency);
    setStartDate(m.startDate || '');
    setEndDate(m.endDate || '');
    setReminderTime(m.reminderTime || '');
    setInstructions(m.instructions || '');
    setStatus(m.status);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        medicineName: name,
        dosage,
        frequency,
        startDate: startDate || null,
        endDate: endDate || null,
        reminderTime,
        instructions,
        status
      };

      if (editingId) {
        await medicineService.updateMedicine(editingId, payload);
        showToast('Medicine schedule updated', 'success');
      } else {
        await medicineService.addMedicine(payload);
        showToast('Medicine added to your tracker', 'success');
      }

      setModalOpen(false);
      loadMedicines();
    } catch (err) {
      showToast('Error saving medicine record', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await medicineService.deleteMedicine(deleteId);
      showToast('Medicine record deleted', 'success');
      setDeleteConfirmOpen(false);
      loadMedicines();
    } catch (err) {
      showToast('Failed to delete medicine', 'error');
    }
  };

  const handleToggleComplete = async (m) => {
    try {
      const newStatus = m.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE';
      await medicineService.updateMedicine(m.id, { ...m, status: newStatus });
      showToast(`Medicine marked as ${newStatus.toLowerCase()}`, 'success');
      loadMedicines();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicine Tracker & Reminders"
        description="Record your prescribed medications, daily intake reminders, and treatment durations."
      >
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
          Add Medicine
        </Button>
      </PageHeader>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p>
          <strong>Safety Notice:</strong> This application does not prescribe or recommend medications or dosages. You record prescription information provided directly by a licensed healthcare professional.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'ACTIVE'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Active Medications
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Completed Courses
        </button>
      </div>

      {/* Medicines Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 w-full" count={2} />
        </div>
      ) : medicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicines.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{m.medicineName}</h4>
                      <p className="text-xs text-brand-600 font-semibold">{m.dosage}</p>
                    </div>
                  </div>
                  <Badge variant={m.status === 'ACTIVE' ? 'green' : 'slate'}>
                    {m.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Schedule:</strong> {m.frequency}</span>
                    {m.reminderTime && <span className="text-slate-400">({m.reminderTime})</span>}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <strong>Course:</strong> {formatDate(m.startDate)}
                      {m.endDate ? ` to ${formatDate(m.endDate)}` : ' (Ongoing)'}
                    </span>
                  </div>

                  {m.instructions && (
                    <p className="pt-2 text-slate-500 text-xs italic bg-slate-50 p-2 rounded-xl">
                      "{m.instructions}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleComplete(m)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as {m.status === 'ACTIVE' ? 'Completed' : 'Active'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(m.id);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
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
          icon={Pill}
          title={activeTab === 'ACTIVE' ? 'No active medications' : 'No completed medication history'}
          description="Track doctor-prescribed medications to maintain schedule adherence."
          actionText="Add New Medicine"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Medicine Schedule' : 'Add Prescribed Medicine'}
        description="Record exact prescription directions provided by your physician."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Medicine Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lisinopril, Amoxicillin..."
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500 mg, 1 tablet"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g. Twice daily after meals"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Time</label>
              <input
                type="text"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                placeholder="08:00 AM, 08:00 PM"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Special Instructions</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take with a full glass of water. Avoid taking on empty stomach."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingId ? 'Update Medicine' : 'Save Medicine'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Medicine"
        message="Are you sure you want to remove this medicine from your schedule?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default MedicineManagement;
