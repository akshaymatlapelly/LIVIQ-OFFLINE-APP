import React from 'react';

interface ConfidenceMeterProps {
  score: number;
  label?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, label = 'AI Confidence' }) => {
  const percent = Math.round(score * 100);

  return (
    <div className="space-y-1.5 font-mono">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="text-black font-bold">{percent}%</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className="h-full bg-black rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
