import React from 'react';
import { getRiskBadgeClass } from '../utils/formatters';

const RiskIndicator = ({ riskLevel, showDescription = true }) => {
  const info = getRiskBadgeClass(riskLevel);

  return (
    <div className={`p-4 rounded-2xl border ${info.bg}`}>
      <div className="flex items-center gap-2.5">
        <span className={`w-3 h-3 rounded-full animate-soft-pulse ${info.dot}`} />
        <span className="font-semibold text-sm tracking-wide uppercase">{info.label}</span>
      </div>
      {showDescription && (
        <p className="mt-2 text-xs opacity-90 leading-relaxed">
          {riskLevel === 'HIGH'
            ? 'Potentially serious symptoms detected. Immediate professional medical care or emergency service is recommended.'
            : riskLevel === 'MODERATE'
            ? 'Symptoms warrant medical attention from a physician within the next 24-48 hours.'
            : 'Mild symptoms. Monitor closely, maintain hydration, and consult a doctor if they persist.'}
        </p>
      )}
    </div>
  );
};

export default RiskIndicator;
