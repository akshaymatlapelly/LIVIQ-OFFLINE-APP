import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HealthMetricBlockProps {
  label: string;
  value: string;
  subtext: string;
  badgeText: string;
  badgeColor?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  progressPercent?: number;
}

export const HealthMetricBlock: React.FC<HealthMetricBlockProps> = ({
  label,
  value,
  subtext,
  badgeText,
  badgeColor = 'bg-slate-100 text-slate-900',
  icon: Icon,
  iconBgColor = 'bg-slate-100',
  iconTextColor = 'text-black',
  progressPercent
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-2xl ${iconBgColor} ${iconTextColor} flex items-center justify-center font-bold`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200/80 ${badgeColor}`}>
          {badgeText}
        </span>
      </div>

      <div className="space-y-0.5">
        <div className="text-xs font-bold text-slate-500 font-sans">{label}</div>
        <div className="text-2xl font-extrabold text-black font-mono tracking-tight">{value}</div>
        <div className="text-[11px] text-slate-500 font-sans">{subtext}</div>
      </div>

      {progressPercent !== undefined && (
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-black h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
