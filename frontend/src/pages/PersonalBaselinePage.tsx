import React, { useState, useEffect } from 'react';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import {
  personalBaselineService,
  PersonalBaseline
} from '../services/personalBaselineService';
import {
  Sparkles,
  UserCheck,
  Moon,
  Droplets,
  Flame,
  Dumbbell,
  Utensils,
  Pill,
  Clock,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Info,
  Layers,
  Zap,
  Lock,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PersonalBaselinePage: React.FC = () => {
  const [baseline, setBaseline] = useState<PersonalBaseline>(personalBaselineService.getBaseline());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setBaseline(personalBaselineService.getBaseline());
    };
    window.addEventListener('liviq-baseline-updated', handleUpdate);
    return () => window.removeEventListener('liviq-baseline-updated', handleUpdate);
  }, []);

  const handleToggleMedPermission = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = personalBaselineService.toggleMedicinePermission(e.target.checked);
    setBaseline(updated);
    showToast(e.target.checked ? 'Medicine log signals permitted in baseline' : 'Medicine log signals excluded');
  };

  const handleResetBaseline = () => {
    if (window.confirm('Reset your personal health baseline history? This will restart rolling calculations.')) {
      const resetData = personalBaselineService.resetBaseline();
      setBaseline(resetData);
      showToast('Personal baseline data reset successfully.');
    }
  };

  const sleepHours = Math.floor(baseline.typicalSleepMinutes / 60);
  const sleepMins = baseline.typicalSleepMinutes % 60;
  const typicalWaterL = (baseline.typicalWaterMl / 1000).toFixed(1);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
          <span className="text-xs font-sans font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>LIVIQ INTELLIGENCE • PERSONAL HEALTH BASELINE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              MY USUAL PATTERN
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Learned from your <span className="underline font-bold text-white">OWN</span> recent tracking history — not generic population averages. LIVIQ compares today's signals against your personal baseline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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

      {/* EXPLANATION BANNER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3 font-sans">
        <div className="flex items-center gap-2 text-black font-extrabold text-base">
          <Info className="w-5 h-5 text-[#84CC16]" />
          <span>How Your Personal Baseline Works</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Instead of telling you that "everyone should walk 10,000 steps" or "sleep 8 hours," LIVIQ calculates rolling averages over your past <span className="font-bold text-black">{baseline.totalTrackedDays} tracked days</span> across Sleep, Activity, Hydration, Workouts, and Meal Timings. Deviations are measured against <span className="font-bold text-black">your personal baseline</span>.
        </p>
      </div>

      {/* "MY USUAL PATTERN" CORE METRICS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">“My Usual Pattern” Baselines</h2>
            <p className="text-xs text-slate-500 mt-0.5">Calculated from your on-device signal history</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">8 SIGNAL BASELINES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          {/* 1. Typical Sleep */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>TYPICAL SLEEP</span>
              <Moon className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-black">
              {sleepHours}h {sleepMins}m
            </div>
            <div className="text-xs text-slate-500 font-sans">Rolling 14-day bedtime rest</div>
          </div>

          {/* 2. Typical Water */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>TYPICAL WATER</span>
              <Droplets className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-black">
              {typicalWaterL} L
            </div>
            <div className="text-xs text-slate-500 font-sans">Typical fluid intake ({baseline.typicalWaterMl} ml)</div>
          </div>

          {/* 3. Typical Activity */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>TYPICAL ACTIVITY</span>
              <Flame className="w-4 h-4 text-[#84CC16]" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-black">
              {baseline.typicalSteps.toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">steps</span>
            </div>
            <div className="text-xs text-slate-500 font-sans">Rolling daily step baseline</div>
          </div>

          {/* 4. Typical Workout */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>TYPICAL WORKOUT</span>
              <Dumbbell className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-black">
              {baseline.typicalWorkoutsPerWeek} <span className="text-xs text-slate-400 font-sans font-normal">sessions/wk</span>
            </div>
            <div className="text-xs text-slate-500 font-sans">Gym & Cardio training load</div>
          </div>

          {/* 5. Typical Dinner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>TYPICAL DINNER</span>
              <Utensils className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-black">
              {baseline.typicalDinnerTime} <span className="text-xs text-slate-400 font-sans font-normal">PM</span>
            </div>
            <div className="text-xs text-slate-500 font-sans">Evening meal timing window</div>
          </div>

          {/* 6. Typical Yoga */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>TYPICAL YOGA</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-black">
              {baseline.typicalYogaSessionsPerWeek} <span className="text-xs text-slate-400 font-sans font-normal">sessions/wk</span>
            </div>
            <div className="text-xs text-slate-500 font-sans">Mindfulness & posture hold</div>
          </div>

          {/* 7. Typical Gym Volume */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>TYPICAL GYM LOAD</span>
              <Dumbbell className="w-4 h-4 text-[#84CC16]" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-black">
              {baseline.typicalGymVolumeKg.toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">kg</span>
            </div>
            <div className="text-xs text-slate-500 font-sans">Total weight volume per workout</div>
          </div>

          {/* 8. Medicine Log Signal (Gated) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>MEDICINE PERMISSION</span>
              <Pill className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-black">
              {baseline.medicinePermissionGranted ? `${baseline.typicalMedicineAdherencePercent}%` : 'DISABLED'}
            </div>
            <div className="text-xs text-slate-500 font-sans">
              {baseline.medicinePermissionGranted ? `${baseline.trackedMedicineCount} active meds permitted` : 'MedSure integration muted'}
            </div>
          </div>
        </div>
      </div>

      {/* TODAY VS YOUR BASELINE DELTA OBSERVATIONS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
        <h3 className="font-extrabold text-lg text-black tracking-tight">Today vs Your Personal Baseline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1">
            <span className="font-mono font-bold text-indigo-600 text-[10px] uppercase">SLEEP SIGNAL DELTA</span>
            <p className="text-slate-800 font-bold">{baseline.todayVsBaseline.sleepDeltaText}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1">
            <span className="font-mono font-bold text-[#84CC16] text-[10px] uppercase">ACTIVITY SIGNAL DELTA</span>
            <p className="text-slate-800 font-bold">{baseline.todayVsBaseline.activityDeltaText}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1">
            <span className="font-mono font-bold text-cyan-600 text-[10px] uppercase">HYDRATION SIGNAL DELTA</span>
            <p className="text-slate-800 font-bold">{baseline.todayVsBaseline.waterDeltaText}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1">
            <span className="font-mono font-bold text-emerald-600 text-[10px] uppercase">WORKOUT FREQUENCY DELTA</span>
            <p className="text-slate-800 font-bold">{baseline.todayVsBaseline.workoutDeltaText}</p>
          </div>
        </div>
      </div>

      {/* PRIVACY PERMISSIONS & RESET CONTROLS */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6 font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Privacy & Data Control Console</h3>
              <p className="text-xs text-slate-400">Manage permission locks and reset personal baseline data</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-[#A3E635] bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
            100% OFFLINE LOCAL STORAGE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Medicine Log Permission Toggle */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div className="space-y-0.5 max-w-xs">
              <span className="text-xs font-bold text-white">MedSure Medicine Signals Permission</span>
              <p className="text-[11px] text-slate-400">Allow medication schedule compliance signals to blend into health baseline calculations.</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={baseline.medicinePermissionGranted}
                onChange={handleToggleMedPermission}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A3E635]" />
            </label>
          </div>

          {/* Reset Data Button */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div className="space-y-0.5 max-w-xs">
              <span className="text-xs font-bold text-white">Reset Personal Baseline History</span>
              <p className="text-[11px] text-slate-400">Wipe learned rolling averages and restart signal calculation from scratch.</p>
            </div>

            <button
              onClick={handleResetBaseline}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET DATA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalBaselinePage;
