export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
    case 'ACTIVE':
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const getRiskBadgeClass = (riskLevel) => {
  switch (riskLevel?.toUpperCase()) {
    case 'LOW':
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Low concern'
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        dot: 'bg-amber-500',
        label: 'Needs attention'
      };
    case 'HIGH':
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-800',
        dot: 'bg-rose-500',
        label: 'Urgent medical attention'
      };
    default:
      return {
        bg: 'bg-slate-50 border-slate-200 text-slate-800',
        dot: 'bg-slate-400',
        label: 'Assessment in progress'
      };
  }
};
