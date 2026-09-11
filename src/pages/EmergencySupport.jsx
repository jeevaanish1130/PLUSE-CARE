import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Phone,
  ShieldAlert,
  Heart,
  User,
  Activity,
  AlertTriangle,
  Info,
  MapPin
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { patientService } from '../services/patientService';

const EmergencySupport = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    patientService.getProfile().then(setProfile).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* High-visibility Urgent Help Banner */}
      <div className="bg-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-600/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <AlertOctagon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need Urgent Help?
            </h1>
            <p className="mt-2 text-sm text-rose-100 leading-relaxed font-medium">
              If you or someone near you is experiencing a life-threatening medical emergency (such as severe chest pain, loss of consciousness, uncontrolled bleeding, or difficulty breathing), contact emergency services immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory safety statement */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          <strong>Safety Clarification:</strong> PulseCare provides quick access to your stored medical profile and emergency contacts. The application <strong>does NOT automatically summon or dial emergency dispatch services</strong> unless you call directly using your device.
        </p>
      </div>

      {/* Direct Dial Emergency Hotlines */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-rose-600" />
          <span>National Emergency Hotlines</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="tel:911"
            className="p-5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors text-center group"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">General Emergency</span>
            <div className="mt-1 text-3xl font-black text-rose-900 group-hover:scale-105 transition-transform">
              911 / 112
            </div>
            <span className="text-[11px] text-rose-600 mt-1 block">Immediate dispatch</span>
          </a>

          <a
            href="tel:18002221222"
            className="p-5 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors text-center group"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Poison Control</span>
            <div className="mt-1 text-2xl font-black text-amber-900 group-hover:scale-105 transition-transform">
              1-800-222-1222
            </div>
            <span className="text-[11px] text-amber-600 mt-1 block">24/7 toxic guidance</span>
          </a>

          <a
            href="tel:988"
            className="p-5 rounded-2xl bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors text-center group"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Crisis Lifeline</span>
            <div className="mt-1 text-3xl font-black text-teal-900 group-hover:scale-105 transition-transform">
              988
            </div>
            <span className="text-[11px] text-teal-600 mt-1 block">Mental health support</span>
          </a>
        </div>
      </div>

      {/* Patient Emergency Information Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-600" />
          <span>Patient Rapid Medical ID Card</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{profile?.fullName || 'Alex Morgan'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Blood Group</span>
            <p className="text-base font-black text-rose-900 mt-1">{profile?.bloodGroup || 'O+'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date of Birth</span>
            <p className="text-sm font-semibold text-slate-800 mt-1">{profile?.dateOfBirth || 'June 15, 1994'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Primary Contact</span>
            <p className="text-xs font-bold text-slate-900 mt-1">
              {profile?.emergencyContactName || 'Sarah Morgan'} ({profile?.emergencyContactRelation || 'Spouse'})
            </p>
            <a
              href={`tel:${profile?.emergencyContactPhone || '+15552345678'}`}
              className="text-xs font-bold text-brand-600 hover:underline mt-0.5 block"
            >
              {profile?.emergencyContactPhone || '+1 (555) 234-5678'}
            </a>
          </div>
        </div>

        {/* Clinical alerts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
            <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Critical Allergies</span>
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {profile?.allergies || 'Penicillin (rash), Shellfish'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
            <span className="text-xs font-bold text-brand-900 flex items-center gap-1.5 mb-1">
              <Activity className="w-4 h-4 text-brand-600" />
              <span>Pre-existing Conditions</span>
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {profile?.existingConditions || 'Mild Seasonal Asthma, Hypertension Stage 1'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySupport;
