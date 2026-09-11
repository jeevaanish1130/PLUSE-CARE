import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-white font-bold text-lg">PulseCare Health</p>
              <p className="text-sm mt-1 text-slate-400">
                A unified digital healthcare platform designed to help people manage health information, understand symptoms and take the right next step.
              </p>
            </div>
            <div className="text-sm text-slate-500 text-center md:text-right">
              &copy; {new Date().getFullYear()} PulseCare Inc. All rights reserved.
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 leading-relaxed">
            Safety Notice: This platform provides general health information and does not replace professional medical diagnosis, advice, or treatment.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
