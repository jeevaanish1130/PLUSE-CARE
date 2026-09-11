import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Calendar,
  History,
  Plus,
  X,
  AlertOctagon
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import RiskIndicator from '../components/RiskIndicator';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { symptomService } from '../services/symptomService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const COMMON_SYMPTOMS = [
  'Fever',
  'Headache',
  'Cough',
  'Sore throat',
  'Fatigue',
  'Nausea',
  'Vomiting',
  'Dizziness',
  'Chest discomfort',
  'Breathing difficulty',
  'Abdominal pain',
  'Body pain',
  'Runny nose',
  'Loss of appetite',
  'Joint stiffness'
];

const SymptomChecker = () => {
  const [activeTab, setActiveTab] = useState('checker'); // 'checker' | 'history'
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('1 to 2 days');
  const [severity, setSeverity] = useState('Mild');
  const [age, setAge] = useState(30);
  const [existingConditions, setExistingConditions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await symptomService.getHistory();
      setHistory(data);
    } catch (err) {
      showToast('Failed to load past assessments', 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleNextStep1 = () => {
    if (selectedSymptoms.length === 0) {
      showToast('Please select or enter at least one symptom', 'warning');
      return;
    }
    setStep(2);
  };

  const handleAssess = async () => {
    setSubmitting(true);
    try {
      const res = await symptomService.assess({
        symptoms: selectedSymptoms,
        duration,
        severity,
        age: parseInt(age) || 30,
        existingConditions
      });
      setAssessmentResult(res);
      setStep(3);
      showToast('Symptom assessment calculated', 'success');
    } catch (err) {
      showToast('Error generating assessment. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetChecker = () => {
    setSelectedSymptoms([]);
    setCustomSymptom('');
    setDuration('1 to 2 days');
    setSeverity('Mild');
    setAge(30);
    setExistingConditions('');
    setAssessmentResult(null);
    setStep(1);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Smart Symptom Assessment"
        description="Structured clinical triage guidance to help you understand symptoms and take the right next step."
      >
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'checker' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('checker')}
          >
            New Assessment
          </Button>
          <Button
            variant={activeTab === 'history' ? 'primary' : 'secondary'}
            size="sm"
            icon={History}
            onClick={() => setActiveTab('history')}
          >
            History ({history.length || 0})
          </Button>
        </div>
      </PageHeader>

      {/* Mandatory Clinical Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Important Safety Disclaimer:</strong> This is an informational health assessment and <strong>not a medical diagnosis</strong>. If you are experiencing severe chest pain, sudden numbness, or shortness of breath, please call emergency services or seek immediate hospital care.
        </div>
      </div>

      {activeTab === 'checker' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="w-full absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-slate-100 z-0"></div>
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-brand-600 z-0 transition-all duration-300"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            ></div>

            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1">Select Symptoms</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1">Duration & Context</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 3 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1">Assessment Result</span>
            </div>
          </div>

          {/* STEP 1: Select Symptoms */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">What symptoms are you experiencing?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select all that apply, or type your own custom symptom below.
                </p>
              </div>

              {/* Symptom Tags */}
              <div className="flex flex-wrap gap-2.5">
                {COMMON_SYMPTOMS.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  const isUrgentTag = symptom.includes('Chest') || symptom.includes('Breathing');
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 border flex items-center gap-1.5 ${
                        isSelected
                          ? isUrgentTag
                            ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                            : 'bg-brand-600 border-brand-600 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{symptom}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Symptom */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Add another symptom (custom):
                </label>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
                    placeholder="e.g. Skin rash, ear ringing, insomnia..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={addCustomSymptom}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Selected summary */}
              {selectedSymptoms.length > 0 && (
                <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-semibold text-brand-900">
                    Selected ({selectedSymptoms.length}): {selectedSymptoms.join(', ')}
                  </span>
                  <button
                    onClick={() => setSelectedSymptoms([])}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button variant="primary" size="md" icon={ArrowRight} onClick={handleNextStep1}>
                  Continue to Step 2
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Questions */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tell us a bit more about the symptoms</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Contextual details help calibrate the risk stratification accurately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    How long have you had these symptoms?
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Less than 24 hours">Less than 24 hours</option>
                    <option value="1 to 2 days">1 to 2 days</option>
                    <option value="3 to 7 days">3 to 7 days</option>
                    <option value="1 to 2 weeks">1 to 2 weeks</option>
                    <option value="More than 2 weeks">More than 2 weeks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Severity level:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Mild', 'Moderate', 'Severe'].map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          severity === sev
                            ? sev === 'Severe'
                              ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                              : sev === 'Moderate'
                              ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500/20'
                              : 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min={1}
                    max={120}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pre-existing conditions (if any)
                  </label>
                  <input
                    type="text"
                    value={existingConditions}
                    onChange={(e) => setExistingConditions(e.target.value)}
                    placeholder="e.g. Asthma, diabetes, hypertension..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="secondary" size="md" icon={ArrowLeft} onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="md" loading={submitting} icon={ArrowRight} onClick={handleAssess}>
                  Generate Risk Assessment
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Assessment Result */}
          {step === 3 && assessmentResult && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Personalized Risk Assessment</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated based on reported symptoms, duration ({assessmentResult.duration}), and severity ({assessmentResult.severity}).
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={resetChecker}>
                  Start New
                </Button>
              </div>

              {/* Risk Banner */}
              <RiskIndicator riskLevel={assessmentResult.riskLevel} />

              {/* Summary */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Assessment Summary</h4>
                <p className="text-sm text-slate-800 leading-relaxed">{assessmentResult.summary}</p>
              </div>

              {/* Recommendations */}
              <div className="p-5 rounded-2xl bg-brand-50/40 border border-brand-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">Recommended Next Steps</h4>
                <p className="text-sm text-slate-800 leading-relaxed">{assessmentResult.recommendations}</p>
              </div>

              {/* Warning Signs */}
              <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Warning Signs to Watch For</span>
                </h4>
                <p className="text-sm text-rose-950 leading-relaxed">{assessmentResult.warningSigns}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="md"
                  icon={Calendar}
                  onClick={() => navigate('/patient/appointments')}
                  className="w-full sm:w-auto"
                >
                  Book Doctor Consultation
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/patient/ai-assistant')}
                  className="w-full sm:w-auto"
                >
                  Ask AI Follow-up Questions
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-4">
          {loadingHistory ? (
            <Skeleton className="h-48 w-full" count={2} />
          ) : history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs font-semibold text-slate-700">
                      Severity: {item.severity}
                    </span>
                  </div>
                  <RiskIndicator riskLevel={item.riskLevel} showDescription={false} />
                </div>

                <div className="text-xs text-slate-600">
                  <strong>Reported:</strong> {item.symptoms?.join(', ')} ({item.duration})
                </div>

                <p className="text-sm text-slate-800 leading-relaxed">{item.summary}</p>
              </div>
            ))
          ) : (
            <EmptyState
              icon={History}
              title="No previous assessments"
              description="Your completed symptom evaluations will appear here for reference during doctor visits."
              actionText="Take Symptom Assessment"
              onAction={() => setActiveTab('checker')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
