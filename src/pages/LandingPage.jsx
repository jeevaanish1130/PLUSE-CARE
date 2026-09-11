import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  Bot,
  Heart,
  Calendar,
  Pill,
  FileText,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

const LandingPage = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-brand-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold mb-8 animate-soft-pulse">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Modern Digital Healthcare Experience</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight sm:leading-tight">
            Smarter Healthcare. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-teal-600">
              Simpler for Everyone.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A unified digital healthcare platform designed to help people manage health information, understand symptoms and take the right next step.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-lg shadow-brand-600/25">
                Get Started Free
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </a>
          </div>

          {/* Quick Demo Credentials pill */}
          <div className="mt-6 inline-flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-xs">
            <span className="font-semibold text-slate-700">Event Demo Access:</span>
            <span>patient@demo.com</span>
            <span className="text-slate-300">|</span>
            <span>doctor@demo.com</span>
            <span className="text-slate-300">|</span>
            <span className="text-brand-600 font-mono">password123</span>
          </div>

          {/* Polished Dashboard Preview Card */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xl shadow-slate-200/60 text-left">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="ml-3 text-xs font-semibold text-slate-400">PulseCare Unified Patient Dashboard</span>
                </div>
                <Badge variant="green" dot>Live System Connected</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric 1 */}
                <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100/80">
                  <div className="flex justify-between items-center text-xs font-semibold text-brand-700">
                    <span>Blood Pressure</span>
                    <Activity className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">120/80 <span className="text-xs font-normal text-slate-500">mmHg</span></div>
                  <div className="mt-1 text-xs text-emerald-600 font-medium">Optimal resting baseline</div>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80">
                  <div className="flex justify-between items-center text-xs font-semibold text-emerald-700">
                    <span>Resting Heart Rate</span>
                    <Heart className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">72 <span className="text-xs font-normal text-slate-500">bpm</span></div>
                  <div className="mt-1 text-xs text-emerald-600 font-medium">Regular sinus rhythm</div>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/80">
                  <div className="flex justify-between items-center text-xs font-semibold text-amber-700">
                    <span>Active Medicines</span>
                    <Pill className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">3 <span className="text-xs font-normal text-slate-500">prescriptions</span></div>
                  <div className="mt-1 text-xs text-amber-600 font-medium">Next dose: 01:00 PM</div>
                </div>
              </div>

              {/* Sample Upcoming appointment card */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    SJ
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Upcoming Visit: Dr. Sarah Jenkins (Cardiologist)</h4>
                    <p className="text-xs text-slate-500">Routine cardiovascular checkup & blood pressure review</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="brand">In-person</Badge>
                  <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    10:30 AM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Safety Disclaimer Banner */}
      <section className="bg-amber-50 border-y border-amber-200/80 py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-3 text-amber-900 text-xs sm:text-sm font-medium leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p>
            <strong>Healthcare Safety Notice:</strong> This platform provides general health information and symptom education. It does not replace professional medical diagnosis, personalized physician advice, or emergency treatment.
          </p>
        </div>
      </section>

      {/* Why Healthcare Matters Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">The Problem & The Vision</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Healthcare is complex. Managing it shouldn't be.
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Patients often face fragmented health records, confusing symptoms, forgotten dosages, and stressful decisions when they feel unwell. PulseCare unifies your complete health ecosystem into one clear, intelligent interface.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Fragmented Information</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Vital measurements, lab reports, and doctor prescriptions are usually scattered across paper slips and portals. PulseCare brings everything into one unified profile.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Uncertain Next Steps</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Wondering whether a symptom requires immediate emergency care or a regular clinic visit? Our guided 3-step risk assessment helps you make an informed decision.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Medical Clarity</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Our safe AI assistant breaks down complicated medical jargon, prepares you for doctor visits, and helps you ask the right questions during consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Feature Suite</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need for comprehensive health management
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Designed from the ground up for speed, clinical clarity, and effortless usability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Smart Symptom Assessment</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Step-by-step triage evaluating symptom patterns, severity, and red flags into Green, Orange, and Red risk categories.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-base">AI Health Assistant</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Conversational health educator with prompt suggestions, doctor appointment preparation, and medical term simplification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Health Tracking</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Monitor Blood Pressure, Heart Rate, Blood Glucose, Weight, and Temperature with interactive charts and trend lines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Doctor Appointments</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Browse certified specialists, check ratings and availability, and schedule in-person or video consultations in seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Pill className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Medicine Tracker</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Log prescribed medications, dosage schedules, frequency, and custom reminder alarms so you never miss a dose.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Medical Records</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Categorized digital vault for lab panels, imaging scans, prescriptions, and physician consultation summaries.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Emergency Support</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Rapid one-tap access to emergency contacts, vital allergies, blood group, and clear clinical urgent care guidance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Role-Based Portals</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Dedicated dashboards and specialized workflows for Patients, Doctors, and System Administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Simple Workflow</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">How PulseCare Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-brand-500/20 mb-4">
                1
              </div>
              <h4 className="font-semibold text-slate-900">Create Profile</h4>
              <p className="mt-2 text-xs text-slate-500">
                Register with your health basics, emergency contacts, and active medications.
              </p>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
                2
              </div>
              <h4 className="font-semibold text-slate-900">Track & Check</h4>
              <p className="mt-2 text-xs text-slate-500">
                Log daily vitals and use our 3-step symptom triage whenever you feel under the weather.
              </p>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
                3
              </div>
              <h4 className="font-semibold text-slate-900">Consult AI & Doctors</h4>
              <p className="mt-2 text-xs text-slate-500">
                Get educational answers from AI and book instant appointments with board-certified physicians.
              </p>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                4
              </div>
              <h4 className="font-semibold text-slate-900">Stay Healthy</h4>
              <p className="mt-2 text-xs text-slate-500">
                Receive proactive medicine reminders, access consultation notes, and stay on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience the future of healthcare management?
          </h2>
          <p className="mt-4 text-brand-100 max-w-xl mx-auto text-sm sm:text-base">
            Test all features right now with pre-populated realistic demo accounts or register your own profile.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <button className="px-6 py-3 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition-all shadow-md">
                Register New Account
              </button>
            </Link>
            <Link to="/login">
              <button className="px-6 py-3 rounded-xl bg-brand-800 text-white font-semibold hover:bg-brand-900 border border-brand-500/50 transition-all">
                Sign In with Demo Accounts
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
