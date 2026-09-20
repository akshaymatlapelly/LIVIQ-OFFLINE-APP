import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';

interface RiskBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const styles = {
    LOW: {
      bg: 'bg-lime-100 border-lime-300 text-lime-800',
      icon: CheckCircle2,
      label: 'LOW RISK'
    },
    MEDIUM: {
      bg: 'bg-amber-100 border-amber-300 text-amber-800',
      icon: Info,
      label: 'MEDIUM RISK'
    },
    HIGH: {
      bg: 'bg-rose-100 border-rose-300 text-rose-800',
      icon: AlertTriangle,
      label: 'HIGH RISK'
    },
    CRITICAL: {
      bg: 'bg-red-600 border-red-700 text-white animate-pulse',
      icon: AlertOctagon,
      label: 'CRITICAL HAZARD'
    }
  }[level] || {
    bg: 'bg-slate-100 border-slate-300 text-slate-800',
    icon: Info,
    label: level
  };

  const Icon = styles.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-sm ${styles.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {styles.label}
    </span>
  );
};
