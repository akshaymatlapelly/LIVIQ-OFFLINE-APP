import React, { useState, useEffect } from 'react';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';
import {
  healTraceSubModulesService,
  SleepRecord
} from '../services/healTraceSubModulesService';
import {
  Moon,
  Clock,
  Sparkles,
  TrendingUp,
  Info,
  CheckCircle2,
  Calendar,
  Zap,
  RotateCcw,
  Layers,
  ChevronRight,
  Sliders,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SleepTracePage: React.FC = () => {
  const [sleepLogs, setSleepLogs] = useState<SleepRecord[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Manual Log Input State
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [bedtimeInput, setBedtimeInput] = useState<string>('23:15');
  const [wakeInput, setWakeInput] = useState<string>('07:00');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    setSleepLogs(healTraceSubModulesService.getSleepHistory());
  }, []);

  const latestSleep = sleepLogs[0] || {
    sleepStart: '23:15',
    wakeTime: '07:00',
    durationMinutes: 465,
    efficiencyPercent: 88,
    deepSleepPercent: 24,
    remSleepPercent: 26,
    lightSleepPercent: 42,
    awakeMinutes: 35,
    consistencyScore: 92
  };

  const handleManualLogSleep = () => {
    const newRecord = healTraceSubModulesService.logSleepSession({
      sleepStart: bedtimeInput,
      wakeTime: wakeInput,
      durationMinutes: 465, // 7h 45m
      efficiencyPercent: 89,
      deepSleepPercent: 25,
      remSleepPercent: 25,
      lightSleepPercent: 42,
      awakeMinutes: 30,
      consistencyScore: 94,
      dateFormatted: new Date().toISOString().split('T')[0]
    });

    setSleepLogs(healTraceSubModulesService.getSleepHistory());
    setShowLogModal(false);
    showToast(`Logged sleep session: ${bedtimeInput} to ${wakeInput} (7h 45m)`);
  };

  const hours = Math.floor(latestSleep.durationMinutes / 60);
  const mins = latestSleep.durationMinutes % 60;

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
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold">
              <Moon className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>HEALTRACE SUB-MODULE • SLEEPTRACE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              SLEEPTRACE
              <span className="text-xs font-mono font-normal text-indigo-400 border border-indigo-400/30 px-2.5 py-1 rounded-full">
                Sleep Consistency & Rest Telemetry
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Track sleep duration, bedtime consistency, and deep rest stages. Synchronized directly to your continuous HEALTRACE health timeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowLogModal(true)}
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans text-xs font-extrabold px-5 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              <Moon className="w-4 h-4" />
              <span>LOG SLEEP SESSION</span>
            </button>

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

      {/* Non-Medical Disclaimer */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3 text-indigo-900 text-xs font-sans">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Sleep Telemetry Notice:</span> SleepTrace provides automated lifestyle sleep duration and rest pattern telemetry derived from device sensors. It does <span className="underline font-bold">NOT</span> diagnose sleep apnea, clinical insomnia, or medical sleep disorders.
        </div>
      </div>

      {/* SLEEP METRICS OVERVIEW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>SLEEP DURATION</span>
            <Moon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {hours}h {mins}m
          </div>
          <div className="text-xs font-mono text-emerald-600 font-bold">
            +25m vs 7-day average
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>BEDTIME & WAKE</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-black">
            {latestSleep.sleepStart} <span className="text-slate-400 text-xs">to</span> {latestSleep.wakeTime}
          </div>
          <div className="text-xs text-slate-500 font-sans">Regular circadian window</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>CONSISTENCY SCORE</span>
            <Sparkles className="w-4 h-4 text-[#84CC16]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {latestSleep.consistencyScore}%
          </div>
          <div className="text-xs font-mono text-[#84CC16] font-bold">HIGH CIRCADIAN ALIGNMENT</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>RECOVERY INDEX</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {latestSleep.efficiencyPercent}%
          </div>
          <div className="text-xs text-slate-500 font-sans">Optimal physiological readiness</div>
        </div>
      </div>

      {/* SLEEP STAGES & TREND VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sleep Stages Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 font-sans">
          <h3 className="font-extrabold text-base text-black">Sleep Stage Distribution</h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Deep Sleep (Restorative)</span>
                <span className="font-mono text-indigo-600">{latestSleep.deepSleepPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${latestSleep.deepSleepPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>REM Sleep (Cognitive)</span>
                <span className="font-mono text-purple-600">{latestSleep.remSleepPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${latestSleep.remSleepPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Light Sleep</span>
                <span className="font-mono text-blue-500">{latestSleep.lightSleepPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${latestSleep.lightSleepPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Personal 7-Day Sleep Trend Chart */}
        <div className="lg:col-span-2">
          <PatternInsightBanner
            title="Sleep Pattern Trend"
            observation="Your sleep bedtime has been consistent within a 20-minute window over the last 7 days. Your high deep sleep duration (24%) correlates with improved muscle recovery following evening workouts."
            disclaimer="Automated sleep pattern observation. Non-medical guidance."
            actionText="Explore 7-Day Sleep Timeline"
            onAction={() => {}}
          />
        </div>
      </div>

      {/* MANUAL LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-black">Log Sleep Session</h3>
            <p className="text-xs text-slate-500">Record your bedtime and wake times to update sleep telemetry.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600">Bedtime</label>
                <input
                  type="time"
                  value={bedtimeInput}
                  onChange={(e) => setBedtimeInput(e.target.value)}
                  className="w-full mt-1 bg-[#FBFBF8] text-black font-mono font-bold text-sm p-3 rounded-2xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600">Wake Time</label>
                <input
                  type="time"
                  value={wakeInput}
                  onChange={(e) => setWakeInput(e.target.value)}
                  className="w-full mt-1 bg-[#FBFBF8] text-black font-mono font-bold text-sm p-3 rounded-2xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                CANCEL
              </button>
              <button
                onClick={handleManualLogSleep}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-black text-white hover:bg-slate-800"
              >
                SAVE SLEEP LOG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepTracePage;
