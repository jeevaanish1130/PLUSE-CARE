import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Bot,
  Activity,
  Calendar,
  Pill,
  FileText,
  Bell,
  AlertOctagon,
  User,
  Settings,
  Users,
  ClipboardList,
  ShieldCheck,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const patientLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Symptom Assessment', path: '/patient/symptoms', icon: Stethoscope },
    { name: 'AI Health Assistant', path: '/patient/ai-assistant', icon: Bot },
    { name: 'Health Tracking', path: '/patient/health', icon: Activity },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Medicines', path: '/patient/medicines', icon: Pill },
    { name: 'Medical Records', path: '/patient/records', icon: FileText },
    { name: 'Notifications', path: '/patient/notifications', icon: Bell },
    { name: 'Emergency Support', path: '/patient/emergency', icon: AlertOctagon, special: true },
    { name: 'Health Profile', path: '/patient/profile', icon: User },
    { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  const doctorLinks = [
    { name: 'Doctor Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Patient Directory', path: '/doctor/patients', icon: Users },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'Consultation Notes', path: '/doctor/consultations', icon: ClipboardList },
    { name: 'Doctor Profile', path: '/patient/profile', icon: User },
    { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Doctor Network', path: '/admin/doctors', icon: Stethoscope },
    { name: 'Appointments Oversight', path: '/admin/appointments', icon: Calendar },
    { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'DOCTOR' ? doctorLinks : patientLinks;

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">PulseCare</span>
            <span className="block text-[9px] uppercase font-bold tracking-wider text-brand-600 -mt-1">
              {role || 'PATIENT'} PORTAL
            </span>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => mobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? link.special
                      ? 'bg-rose-50 text-rose-700 font-semibold'
                      : 'bg-brand-50 text-brand-700 font-semibold shadow-sm'
                    : link.special
                    ? 'text-rose-600 hover:bg-rose-50/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${link.special ? 'text-rose-600' : ''}`} />
              <span>{link.name}</span>
              {link.special && (
                <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User profile card at bottom */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 font-semibold flex items-center justify-center text-sm flex-shrink-0">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.fullName || 'User'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
