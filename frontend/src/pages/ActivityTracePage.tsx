import React, { useState, useEffect } from 'react';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import {
  healTraceSubModulesService,
  ActivityRecord
} from '../services/healTraceSubModulesService';
import {
  Flame,
  Activity,
  Smartphone,
  Cpu,
  Radio,
  Clock,
  Layers,
  CheckCircle2,
  TrendingUp,
  Plus,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActivityTracePage: React.FC = () => {
  const [activity, setActivity] = useState<ActivityRecord>(healTraceSubModulesService.getActivityRecord());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSimulateSteps = (steps: number) => {
    const updated = healTraceSubModulesService.updateActivitySteps(steps);
    setActivity(updated);
    showToast(`Added +${steps} steps! Today's total: ${updated.stepsCount} steps (${updated.distanceKm} km)`);
  };

  const stepGoal = 10000;
  const progressPercent = Math.min(100, Math.round((activity.stepsCount / stepGoal) * 100));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
          <span className="text-xs font-sans font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-lime-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-lime-900/40 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-500/20 border border-lime-400/40 text-lime-300 font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>HEALTRACE SUB-MODULE • ACTIVITYTRACE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              ACTIVITYTRACE
              <span className="text-xs font-mono font-normal text-[#A3E635] border border-[#A3E635]/30 px-2.5 py-1 rounded-full">
                Hardware Sensor Fusion
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Real-time movement tracking, step cadence, and active vs sedentary ratio telemetry ingested directly from your smartphone hardware sensors.
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

      {/* EXPLICIT DATA-SOURCE AVAILABILITY BANNER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-black flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#84CC16]" />
            <span>Explicit Data-Source Telemetry Status</span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-400">ON-DEVICE SENSOR MESH</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-lime-50 border border-lime-200 text-lime-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#84CC16]" />
              <span>iQOO Accelerometer</span>
            </div>
            <span className="font-bold text-[10px] bg-[#84CC16] text-black px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>PDR Dead Reckoning</span>
            </div>
            <span className="font-bold text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-slate-400" />
              <span>BLE Smartwatch Sync</span>
            </div>
            <span className="font-bold text-[10px] bg-slate-300 text-slate-700 px-2 py-0.5 rounded-full">OPTIONAL</span>
          </div>
        </div>
      </div>

      {/* MOVEMENT & STEP METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>STEP COUNT</span>
            <Flame className="w-4 h-4 text-[#84CC16]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {activity.stepsCount.toLocaleString()}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">/ {stepGoal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-[#84CC16] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>DISTANCE WALKED</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {activity.distanceKm} <span className="text-xs text-slate-400 font-sans font-normal">km</span>
          </div>
          <div className="text-xs text-slate-500">PDR sensor stride tracking</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>ACTIVE MINUTES</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {activity.activeMinutes} <span className="text-xs text-slate-400 font-sans font-normal">min</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold font-mono">100% OF DAILY GOAL</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>SEDENTARY HOURS</span>
            <Info className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {activity.sedentaryHours} <span className="text-xs text-slate-400 font-sans font-normal">hrs</span>
          </div>
          <div className="text-xs text-slate-500">Stationary posture window</div>
        </div>
      </div>

      {/* SIMULATE STEPS ACTION CARD */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#A3E635]">ACCELEROMETER SIMULATION</span>
          <h3 className="text-xl font-extrabold text-white">Simulate Device Movement</h3>
          <p className="text-xs text-slate-400">Trigger hardware motion sensor interrupts for step counting</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSimulateSteps(1000)}
            className="bg-[#A3E635] text-black font-extrabold text-xs px-5 py-3 rounded-full hover:bg-[#84CC16] transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+1,000 STEPS</span>
          </button>
        </div>
      </div>

      {/* PATTERN INSIGHT */}
      <PatternInsightBanner
        title="Activity Telemetry Observation"
        observation="Your movement distribution shows peak walking cadence between 10:00 and 11:30. A total of 4.5 sedentary hours were recorded today."
        disclaimer="Hardware sensor telemetry. Non-medical guidance."
        actionText="Replay Activity Pattern"
        onAction={() => {}}
      />
    </div>
  );
};

export default ActivityTracePage;
