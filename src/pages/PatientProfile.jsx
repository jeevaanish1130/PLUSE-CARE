import React, { useState, useEffect } from 'react';
import { User, Phone, AlertCircle, Heart, Shield, Save, CheckCircle2, Award } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import Badge from '../components/Badge';
import { patientService } from '../services/patientService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    height: '',
    weight: '',
    allergies: '',
    existingConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    importantHealthInfo: '',
    completionPercentage: 50,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { updateCurrentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await patientService.getProfile();
        setProfile({
          fullName: data.fullName || '',
          email: data.email || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || 'Male',
          bloodGroup: data.bloodGroup || 'O+',
          height: data.height || '',
          weight: data.weight || '',
          allergies: data.allergies || '',
          existingConditions: data.existingConditions || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || '',
          emergencyContactRelation: data.emergencyContactRelation || '',
          importantHealthInfo: data.importantHealthInfo || '',
          completionPercentage: data.completionPercentage || 50,
        });
      } catch (err) {
        showToast('Unable to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await patientService.updateProfile(profile);
      setProfile((prev) => ({
        ...prev,
        ...updated,
        completionPercentage: updated.completionPercentage,
      }));
      updateCurrentUser({ fullName: profile.fullName });
      showToast('Health profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to save profile changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const completion = profile.completionPercentage || 60;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Health Profile"
        description="Keep your clinical details, vital metrics, and emergency contacts up to date for doctors."
        badge={
          <Badge variant={completion >= 80 ? 'green' : 'amber'} dot>
            {completion}% Profile Complete
          </Badge>
        }
      />

      {/* Completion Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-brand-600" />
            <span>Profile Completion Status</span>
          </span>
          <span className="text-brand-600">{completion}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          A completed medical profile ensures physicians can provide safer, faster, and more accurate recommendations during consultations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal & Demographics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <span>Basic Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Account)</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                name="height"
                value={profile.height}
                onChange={handleChange}
                placeholder="175"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
                placeholder="70"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Clinical Allergies & Conditions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Medical History & Allergies</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Known Allergies</label>
              <textarea
                name="allergies"
                rows={3}
                value={profile.allergies}
                onChange={handleChange}
                placeholder="e.g. Penicillin, Peanuts, Latex..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Include drug, food, or environmental allergies.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Existing / Chronic Conditions</label>
              <textarea
                name="existingConditions"
                rows={3}
                value={profile.existingConditions}
                onChange={handleChange}
                placeholder="e.g. Asthma, Hypertension, Type 2 Diabetes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Pre-existing diagnoses help doctors prescribe safely.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Important Health Information / Notes</label>
            <textarea
              name="importantHealthInfo"
              rows={2}
              value={profile.importantHealthInfo}
              onChange={handleChange}
              placeholder="e.g. History of cardiac surgery, contact lens wearer, dietary restrictions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Emergency Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={profile.emergencyContactName}
                onChange={handleChange}
                placeholder="Jane Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={profile.emergencyContactPhone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                name="emergencyContactRelation"
                value={profile.emergencyContactRelation}
                onChange={handleChange}
                placeholder="Spouse / Parent / Sibling"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" loading={saving} icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;
