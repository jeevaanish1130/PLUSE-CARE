import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({ message = 'Failed to load data', onRetry }) => {
  return (
    <div className="text-center py-10 px-4 rounded-2xl border border-rose-100 bg-rose-50/50">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900">Something went wrong</h3>
      <p className="mt-1 text-xs text-rose-600 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
