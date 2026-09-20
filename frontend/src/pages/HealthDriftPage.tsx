import React, { useState, useEffect } from 'react';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import {
  healthDriftService,
  HealthDriftItem
} from '../services/healthDriftService';
import {
  TrendingDown,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Moon,
  Flame,
  Droplets,
  Utensils,
  ChevronRight,
  AlertCircle,
  Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const HealthDriftPage: React.FC = () => {
  const navigate = useNavigate();
  const [driftItems, setDriftItems] = useState<HealthDriftItem[]>([]);

  useEffect(() => {
    setDriftItems(healthDriftService.getDriftItems());
  }, []);

  const getSignalIcon = (category: string) => {
    switch (category) {
      case 'Sleep':
        return Moon;
      case 'Activity':
        return Flame;
      case 'Hydration':
        return Droplets;
      case 'Nutrition':
        return Utensils;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-900/40 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
              <TrendingDown className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>LIVIQ INTELLIGENCE • HEALTH DRIFT TELEMETRY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              HEALTH DRIFT
              <span className="text-xs font-mono font-normal text-amber-400 border border-amber-400/30 px-2.5 py-1 rounded-full">
                Baseline Deviation Telemetry
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Identifies meaningful shifts from your <span className="underline font-bold text-white">OWN</span> recent personal baseline. Health Drift is non-diagnostic lifestyle pattern tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/baseline"
              className="bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold px-4 py-3.5 rounded-full border border-white/20 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-[#A3E635]" />
              <span>MY USUAL PATTERN</span>
            </Link>

            <Link
              to="/healtrace"
              className="bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold px-4 py-3.5 rounded-full border border-white/20 flex items-center gap-2 transition"
            >
              <Layers className="w-4 h-4 text-[#A3E635]" />
              <span>HEALTRACE MAIN</span>
            </Link>
          </div>
        </div>
      </div>

      {/* STRICT NON-DIAGNOSTIC DISCLAIMER BANNER */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs font-sans">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Non-Diagnostic Notice:</span> Health Drift identifies when tracked signals (sleep duration, steps, meal times) shift from your own recent baseline. It is <span className="underline font-bold">NOT</span> a medical diagnosis, does not diagnose disorders, and does not claim causation for symptoms.
        </div>
      </div>

      {/* HEALTH DRIFT ITEMS LIST */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">Active Baseline Drift Observations</h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Identified deviations over recent 2 to 4 day rolling windows</p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-600 font-bold">{driftItems.length} DRIFTS DETECTED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {driftItems.map((item) => {
            const IconComponent = getSignalIcon(item.category);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-5 hover:border-slate-300 transition font-sans"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">
                          {item.category} SIGNAL DRIFT
                        </span>
                        <h3 className="font-extrabold text-lg text-black">{item.signalName}</h3>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      {item.durationText.toUpperCase()}
                    </span>
                  </div>

                  {/* Observation Message */}
                  <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-amber-200/60 font-sans text-xs font-extrabold text-black leading-relaxed">
                    "{item.observationMessage}"
                  </div>

                  {/* Baseline vs Current Metric Comparison */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] text-slate-400 uppercase">CURRENT PATTERN</div>
                      <div className="text-base font-extrabold text-black mt-0.5">{item.currentPatternText}</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] text-slate-400 uppercase">PERSONAL BASELINE</div>
                      <div className="text-base font-extrabold text-slate-600 mt-0.5">{item.personalBaselineText}</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                      <div className="text-[9px] text-amber-700 uppercase">DIFFERENCE</div>
                      <div className="text-xs font-extrabold text-amber-800 mt-1">{item.differenceText}</div>
                    </div>
                  </div>

                  {/* Related Tracked Signals */}
                  <div className="space-y-1.5 font-sans">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      RELATED TRACKED SIGNALS
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {item.relatedSignals.map((sig, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* "What changed?" Button → HEALTH REPLAY */}
                <button
                  type="button"
                  onClick={() => navigate('/replay')}
                  className="w-full bg-black hover:bg-slate-800 text-white font-sans text-xs font-extrabold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm transition transform hover:scale-[1.02]"
                >
                  <RotateCcw className="w-4 h-4 text-[#A3E635]" />
                  <span>WHAT CHANGED? → HEALTH REPLAY</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HealthDriftPage;
