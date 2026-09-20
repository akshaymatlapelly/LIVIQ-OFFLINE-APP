import React from 'react';
import { Cpu } from 'lucide-react';

interface AIStatusProps {
  status?: 'ACTIVE' | 'PROCESSING' | 'STANDBY';
  mode?: string;
}

export const AIStatus: React.FC<AIStatusProps> = ({ status = 'ACTIVE', mode = 'NPU Core 1' }) => {
  return (
    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200/80 text-xs font-mono text-slate-800 shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
      </span>
      <Cpu className="w-3.5 h-3.5 text-slate-700" />
      <span>LIVIQ CORE: <strong className="text-black tracking-wider">{status}</strong> ({mode})</span>
    </div>
  );
};
