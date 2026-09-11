import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Bell, AlertOctagon, Shield, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import Badge from '../components/Badge';

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const notifs = await notificationService.getNotifications();
        const unread = notifs.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        // silent fallback
      }
    };
    if (user) {
      fetchNotifs();
    }
  }, [location.pathname, user]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top App Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="text-slate-400">Environment:</span>
              <Badge variant="brand">H2 Persistent Demo</Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Emergency CTA */}
            {role === 'PATIENT' && (
              <Link
                to="/patient/emergency"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                <span>Emergency Help</span>
              </Link>
            )}

            {/* Notifications Bell */}
            <Link
              to="/patient/notifications"
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Role Badge */}
            <Badge variant={role === 'ADMIN' ? 'rose' : role === 'DOCTOR' ? 'green' : 'brand'}>
              {role}
            </Badge>

            {/* User pill */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-semibold text-xs flex items-center justify-center">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                {user?.fullName}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer info & medical disclaimer */}
        <footer className="border-t border-slate-200/60 py-4 px-6 text-center text-xs text-slate-400 bg-white/40">
          <p>
            PulseCare Health System &bull; Informational health platform. Not a replacement for emergency or clinical diagnosis.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
