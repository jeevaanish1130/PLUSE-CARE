import React from 'react';
import {
  Stethoscope,
  Bot,
  Activity,
  Calendar,
  Pill,
  FileText,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const FeaturesPage = () => {
  const features = [
    {
      title: 'Smart Symptom Assessment',
      icon: Stethoscope,
      color: 'brand',
      tag: 'Clinical Triage',
      desc: '3-stage guided questionnaire analyzing symptoms, duration, and severity to categorize into Green (Low concern), Orange (Needs attention), or Red (Urgent medical attention).',
      bullets: ['Common & custom symptom selection', 'Red-flag emergency detection', 'Tailored recommendations & warning signs', 'Automatic doctor booking suggestion']
    },
    {
      title: 'AI Health Assistant',
      icon: Bot,
      color: 'teal',
      tag: 'Safe AI Guidance',
      desc: 'Conversational assistant designed for health education, appointment preparation, and medical jargon translation with strict medical safety boundaries.',
      bullets: ['One-click prompt suggestions', 'Doctor appointment preparation checklists', 'Translates complex medical terminology', 'Clear non-diagnostic safety disclaimer']
    },
    {
      title: 'Health Tracking & Vitals',
      icon: Activity,
      color: 'emerald',
      tag: 'Vitals Management',
      desc: 'Track Blood Pressure, Resting Heart Rate, Blood Glucose, Body Weight, and Temperature with interactive charts and historical records.',
      bullets: ['High blood pressure automatic notifications', 'Visual trends over time', 'Daily, weekly, and monthly views', 'Full add, edit, and delete support']
    },
    {
      title: 'Doctor Appointments',
      icon: Calendar,
      color: 'amber',
      tag: 'Seamless Scheduling',
      desc: 'Comprehensive directory of qualified specialists with ratings, consultation fees, and available hours. Reserve appointments in seconds.',
      bullets: ['In-person and Video consultations', 'Duplicate booking prevention', 'Upcoming, completed, and cancelled tabs', 'Automatic patient and doctor notifications']
    },
    {
      title: 'Medicine Management',
      icon: Pill,
      color: 'rose',
      tag: 'Compliance & Alarms',
      desc: 'Record prescribed medications, custom dosages, frequencies, and reminder schedules. Keep track of current versus completed courses.',
      bullets: ['Schedule daily intake reminders', 'Active vs completed history', 'Custom intake instructions', 'Safe user-logged data policy']
    },
    {
      title: 'Medical Records Vault',
      icon: FileText,
      color: 'indigo',
      tag: 'Organized Health History',
      desc: 'Centralized repository for lab panels, scans, prescriptions, and consultation notes. Easily filter by category or date for quick clinic access.',
      bullets: ['Filter by category & date', 'Instant search capabilities', 'Clean mock document upload UI', 'Doctor consultation attachments']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Platform Capabilities</span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Built for Everyday Patients, Busy Doctors, and Healthcare Administrators
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          Every tool inside PulseCare is thoughtfully engineered to eliminate friction, reduce medical anxiety, and support proactive healthcare decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {f.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-brand-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Experience PulseCare in Action</h2>
        <p className="mt-2 text-sm text-brand-100 max-w-xl mx-auto">
          Start exploring features right away. Try signing in as a Patient, Doctor, or Administrator.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/login">
            <button className="px-6 py-2.5 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition-colors shadow-sm">
              Launch Demo Portal
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
