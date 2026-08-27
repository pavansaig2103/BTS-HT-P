import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const ConfidenceBadge = ({ confidence = 'confirmed', sourceText, className = '' }) => {
  const isConfirmed = confidence === 'confirmed';

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      isConfirmed
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : 'bg-amber-50 text-amber-800 border border-amber-200'
    } ${className}`}
    title={sourceText ? `Source Quote: "${sourceText}"` : undefined}
    >
      {isConfirmed ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
      )}
      <span>{isConfirmed ? 'Verified in Source' : 'Needs Verification'}</span>
    </div>
  );
};

export default ConfidenceBadge;
