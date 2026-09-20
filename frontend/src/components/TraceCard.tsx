import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface TraceCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  value: string;
  metricLabel: string;
  statusText: string;
  badgeColor?: string;
  iconBgColor?: string;
  iconTextColor?: string;
  description: string;
  actionText: string;
  onAction?: () => void;
}

export const TraceCard: React.FC<TraceCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  value,
  metricLabel,
  statusText,
  badgeColor = 'bg-slate-100 text-slate-800 border-slate-200',
  iconBgColor = 'bg-black',
  iconTextColor = 'text-[#A3E635]',
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 group font-sans">
      <div className="space-y-3">
        {/* Top Icon & Badge Header */}
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-2xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shadow-md group-hover:scale-105 transition`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {statusText}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="font-extrabold text-xl text-black tracking-tight group-hover:text-slate-900 transition">
            {title}
          </h3>
          <div className="text-xs font-semibold text-slate-500 font-sans mt-0.5">
            {subtitle}
          </div>
        </div>

        {/* Value Metric Block */}
        <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-slate-200/80 space-y-0.5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {metricLabel}
          </div>
          <div className="text-2xl font-extrabold text-black font-mono tracking-tight">
            {value}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onAction}
        className="w-full bg-black hover:bg-slate-800 text-white font-sans text-xs font-extrabold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm transition transform group-hover:scale-[1.02]"
      >
        <span>{actionText}</span>
        <ArrowUpRight className="w-4 h-4 text-[#A3E635]" />
      </button>
    </div>
  );
};
