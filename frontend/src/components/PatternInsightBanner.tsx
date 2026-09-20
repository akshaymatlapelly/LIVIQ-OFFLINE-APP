import React from 'react';
import { Sparkles, TrendingDown, Info, ChevronRight } from 'lucide-react';

interface PatternInsightBannerProps {
  title?: string;
  observation: string;
  disclaimer?: string;
  actionText?: string;
  onAction?: () => void;
}

export const PatternInsightBanner: React.FC<PatternInsightBannerProps> = ({
  title = 'Your Recent Pattern',
  observation,
  disclaimer = 'This is an automated physiological observation derived from your sensor timeline signals, NOT a medical diagnosis.',
  actionText = 'Explore Pattern Replay',
  onAction
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-4 font-sans">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Sparkles className="w-5 h-5 text-black" />
        <h2 className="text-lg font-extrabold text-black tracking-tight">{title}</h2>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
          PERSONAL PATTERN INTELLIGENCE
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-black font-sans">Physiological Signal Observation</div>
            <p className="text-xs text-slate-700 font-sans leading-relaxed font-medium">
              "{observation}"
            </p>
          </div>
        </div>

        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-black hover:text-slate-700 font-sans shrink-0 self-start sm:self-center"
          >
            <span>{actionText}</span>
            <ChevronRight className="w-4 h-4 text-[#84CC16]" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-sans pt-1">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{disclaimer}</span>
      </div>
    </div>
  );
};
