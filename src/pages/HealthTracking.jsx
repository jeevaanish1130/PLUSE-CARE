import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { healthService } from '../services/healthService';
import { useToast } from '../context/ToastContext';
import { formatDateTime } from '../utils/formatters';

const METRIC_TABS = [
  { type: 'BLOOD_PRESSURE', label: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: 'brand' },
  { type: 'HEART_RATE', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: 'rose' },
  { type: 'BLOOD_GLUCOSE', label: 'Blood Glucose', unit: 'mg/dL', icon: Activity, color: 'amber' },
  { type: 'WEIGHT', label: 'Weight', unit: 'kg', icon: Activity, color: 'indigo' },
  { type: 'TEMPERATURE', label: 'Temperature', unit: '°F', icon: Activity, color: 'emerald' },
];

const HealthTracking = () => {
  const [activeType, setActiveType] = useState('BLOOD_PRESSURE');
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formMetricType, setFormMetricType] = useState('BLOOD_PRESSURE');
  const [formValue, setFormValue] = useState('');
  const [formSecondaryValue, setFormSecondaryValue] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadMetrics();
  }, [activeType]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await healthService.getMetrics(activeType);
      setMetrics(data);
    } catch (err) {
      showToast('Failed to load health metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormMetricType(activeType);
    setFormValue('');
    setFormSecondaryValue('');
    setFormNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingId(m.id);
    setFormMetricType(m.metricType);
    setFormValue(m.value);
    setFormSecondaryValue(m.secondaryValue || '');
    setFormNotes(m.notes || '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formValue) {
      showToast('Please enter a measurement value', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        metricType: formMetricType,
        value: parseFloat(formValue),
        secondaryValue: formSecondaryValue ? parseFloat(formSecondaryValue) : null,
        notes: formNotes
      };

      if (editingId) {
        await healthService.updateMetric(editingId, payload);
        showToast('Measurement updated successfully', 'success');
      } else {
        await healthService.addMetric(payload);
        showToast('Measurement recorded successfully', 'success');
      }

      setModalOpen(false);
      loadMetrics();
    } catch (err) {
      showToast('Failed to save measurement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await healthService.deleteMetric(selectedDeleteId);
      showToast('Measurement deleted', 'success');
      setDeleteConfirmOpen(false);
      loadMetrics();
    } catch (err) {
      showToast('Failed to delete measurement', 'error');
    }
  };

  const currentTabInfo = METRIC_TABS.find((t) => t.type === activeType) || METRIC_TABS[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Tracking & Vitals"
        description="Monitor physiological trends over time and share accurate records with your physician."
      >
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
          Log Measurement
        </Button>
      </PageHeader>

      {/* Metric Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {METRIC_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.type === activeType;
          return (
            <button
              key={tab.type}
              onClick={() => setActiveType(tab.type)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Metric Summary & Trend Sparkline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Category</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <span>{currentTabInfo.label}</span>
              <span className="text-sm font-normal text-slate-400">({currentTabInfo.unit})</span>
            </h2>
          </div>

          {metrics.length > 0 && (
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Latest Recorded</span>
                <p className="text-xl font-bold text-slate-900">
                  {metrics[0].value}
                  {metrics[0].secondaryValue ? ` / ${metrics[0].secondaryValue}` : ''}{' '}
                  <span className="text-xs text-slate-500 font-normal">{currentTabInfo.unit}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Visual Trend Chart (SVG sparkline representation) */}
        {metrics.length > 1 && (
          <div className="mt-6 p-4 rounded-2xl bg-brand-50/30 border border-brand-100/60">
            <span className="text-xs font-semibold text-brand-900 flex items-center gap-1 mb-3">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span>Historical Trend Curve</span>
            </span>
            <div className="h-28 w-full flex items-end gap-2 sm:gap-4 pt-4 px-2">
              {metrics.slice(0, 10).reverse().map((m, idx) => {
                const maxVal = Math.max(...metrics.map((x) => x.value)) || 100;
                const minVal = Math.min(...metrics.map((x) => x.value)) || 0;
                const range = maxVal - minVal || 1;
                const heightPercent = Math.max(20, Math.min(100, ((m.value - minVal) / range) * 80 + 20));

                return (
                  <div key={m.id || idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] text-brand-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      {m.value}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-lg transition-all hover:bg-brand-600 cursor-pointer"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[40px]">
                      {new Date(m.recordedAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Measurements Table / History */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Measurement Logs</h3>
          <span className="text-xs text-slate-400">{metrics.length} total entries</span>
        </div>

        {loading ? (
          <div className="p-6">
            <Skeleton className="h-12 w-full" count={4} />
          </div>
        ) : metrics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Reading Value</th>
                  <th className="px-6 py-3.5">Recorded Time</th>
                  <th className="px-6 py-3.5">Clinical Notes</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {m.value} {m.secondaryValue ? `/ ${m.secondaryValue}` : ''}{' '}
                      <span className="text-xs font-normal text-slate-500">{m.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{formatDateTime(m.recordedAt)}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                      {m.notes || '—'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="text-slate-400 hover:text-brand-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDeleteId(m.id);
                          setDeleteConfirmOpen(true);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={Activity}
              title={`No ${currentTabInfo.label} readings recorded`}
              description="Keep an accurate record to help your doctor spot health trends early."
              actionText="Add First Reading"
              onAction={handleOpenAdd}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Measurement' : 'Record New Measurement'}
        description="Ensure your home monitoring device is calibrated before reading."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Metric Type</label>
            <select
              value={formMetricType}
              onChange={(e) => setFormMetricType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {METRIC_TABS.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label} ({t.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {formMetricType === 'BLOOD_PRESSURE' ? 'Systolic (mmHg)' : 'Value'}
              </label>
              <input
                type="number"
                step="0.1"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="120"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {formMetricType === 'BLOOD_PRESSURE' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formSecondaryValue}
                  onChange={(e) => setFormSecondaryValue(e.target.value)}
                  placeholder="80"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Notes</label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. Resting morning reading before breakfast..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingId ? 'Update Log' : 'Save Measurement'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Measurement"
        message="Are you sure you want to delete this recorded vital reading? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default HealthTracking;
