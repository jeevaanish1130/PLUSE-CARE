import React from 'react';
import { ShieldCheck, Heart, Users, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Our Mission</span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Transforming Everyday Healthcare Usability
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          PulseCare was built to bridge the critical gap between feeling unwell and knowing what to do next. We empower patients with clarity and give healthcare providers streamlined access to vital patient history.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Patient-First Design</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Accessible layouts, clear typography, and stress-free navigation designed for patients of all technical skill levels.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Clinical Safety First</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Rigorous guardrails: we provide risk stratification and health education without prescribing or replacing licensed physicians.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Provider Synergy</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Doctors receive organized vitals trends, previous symptom assessments, and complete history before each consultation begins.
          </p>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16">
        <h2 className="text-2xl font-bold mb-4">Architecture & Engineering Highlights</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-2xl">
          PulseCare is built as an enterprise-grade decoupled full-stack application following industry standard best practices:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Spring Boot 3.2.5 Backend:</strong>
              <p className="text-slate-400 text-xs mt-1">RESTful JSON APIs, Spring Security with stateless JWT authorization, and Bean Validation.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">React + Vite Frontend:</strong>
              <p className="text-slate-400 text-xs mt-1">Modern ES module bundler, Tailwind CSS design system, responsive breakpoints, and Lucide icons.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Spring Data JPA & H2:</strong>
              <p className="text-slate-400 text-xs mt-1">Persistent file-based relational database ensuring demo data survives application reboots.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Centralized Error Handling:</strong>
              <p className="text-slate-400 text-xs mt-1">Standardized REST error schemas, field validation mapping, and friendly UI toast feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
