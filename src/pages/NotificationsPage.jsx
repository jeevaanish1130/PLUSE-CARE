import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck, Calendar, Pill, FileText, Activity, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';
import { formatDateTime } from '../utils/formatters';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
      showToast('Notification marked as read', 'info', 1500);
    } catch (err) {
      showToast('Failed to update notification', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
      showToast('Notification deleted', 'info', 1500);
    } catch (err) {
      showToast('Failed to delete notification', 'error');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'APPOINTMENT':
        return <Calendar className="w-4 h-4 text-brand-600" />;
      case 'MEDICINE':
        return <Pill className="w-4 h-4 text-amber-600" />;
      case 'RECORD':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'HEALTH_METRIC':
        return <Activity className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications & Alerts"
        description="Stay updated with upcoming visits, medicine reminders, and health alerts."
        badge={
          unreadCount > 0 ? (
            <Badge variant="rose" dot>
              {unreadCount} Unread
            </Badge>
          ) : (
            <Badge variant="green">All Caught Up</Badge>
          )
        }
      >
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" icon={CheckCheck} onClick={handleMarkAllAsRead}>
            Mark All Read
          </Button>
        )}
      </PageHeader>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" count={3} />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                n.read
                  ? 'bg-white border-slate-200/80 shadow-xs'
                  : 'bg-brand-50/40 border-brand-200 shadow-sm ring-1 ring-brand-500/10'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200/60 shadow-2xs flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-slate-400 mt-2 block">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You will receive alerts here when appointments, prescription schedules, or records update."
        />
      )}
    </div>
  );
};

export default NotificationsPage;
