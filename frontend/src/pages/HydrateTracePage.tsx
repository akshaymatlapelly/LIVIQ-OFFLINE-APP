import React, { useState, useEffect } from 'react';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';
import {
  healTraceSubModulesService,
  WaterLogEntry
} from '../services/healTraceSubModulesService';
import {
  Droplets,
  Plus,
  Mic,
  Clock,
  CheckCircle2,
  Bell,
  Layers,
  Sparkles,
  GlassWater,
  CupSoda,
  Bot as BottleIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HydrateTracePage: React.FC = () => {
  const { activateAgent, handleUserUtterance } = useVoiceAgent();

  const [waterHistory, setWaterHistory] = useState<WaterLogEntry[]>([]);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [dailyGoal, setDailyGoal] = useState<number>(2500); // ml
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const refreshHydration = () => {
    setWaterHistory(healTraceSubModulesService.getHydrateHistory());
    setTodayTotal(healTraceSubModulesService.getTodayWaterTotal());
  };

  useEffect(() => {
    refreshHydration();
    const handleLog = () => refreshHydration();
    window.addEventListener('hydratetrace-logged', handleLog);
    return () => window.removeEventListener('hydratetrace-logged', handleLog);
  }, []);

  const handleAddWater = (amountMl: number, containerType: WaterLogEntry['containerType']) => {
    healTraceSubModulesService.addWaterIntake(amountMl, containerType);
    showToast(`Logged +${amountMl} ml (${containerType})!`);
  };

  const progressPercent = Math.min(100, Math.round((todayTotal / dailyGoal) * 100));

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
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-cyan-900/40 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold">
              <Droplets className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>HEALTRACE SUB-MODULE • HYDRATETRACE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              HYDRATETRACE
              <span className="text-xs font-mono font-normal text-cyan-400 border border-cyan-400/30 px-2.5 py-1 rounded-full">
                Fluid Intake Telemetry
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Track daily hydration progress, log water via voice commands or quick-add buttons, and configure smart hydration reminders.
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

      {/* DAILY PROGRESS CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-black tracking-tight">Today's Water Progress</h2>
            <p className="text-xs text-slate-500 mt-0.5">Hydration target calculated based on activity & climate</p>
          </div>

          <div className="text-right font-mono">
            <div className="text-3xl font-extrabold text-cyan-600">{todayTotal} <span className="text-sm text-slate-400 font-sans">/ {dailyGoal} ml</span></div>
            <div className="text-xs text-slate-500 font-bold">{progressPercent}% OF GOAL REACHED</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 h-full rounded-full transition-all duration-700 shadow-md"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* QUICK ADD BUTTONS */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            QUICK ADD CONTAINERS
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleAddWater(150, 'Glass')}
              className="p-4 rounded-2xl bg-[#FBFBF8] hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left space-y-1 transition group"
            >
              <div className="flex items-center justify-between">
                <GlassWater className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition" />
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-cyan-600" />
              </div>
              <div className="font-extrabold text-sm text-black">+150 ml</div>
              <div className="text-[10px] font-mono text-slate-400">GLASS</div>
            </button>

            <button
              onClick={() => handleAddWater(250, 'Cup')}
              className="p-4 rounded-2xl bg-[#FBFBF8] hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left space-y-1 transition group"
            >
              <div className="flex items-center justify-between">
                <CupSoda className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition" />
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-cyan-600" />
              </div>
              <div className="font-extrabold text-sm text-black">+250 ml</div>
              <div className="text-[10px] font-mono text-slate-400">CUP</div>
            </button>

            <button
              onClick={() => handleAddWater(500, 'Bottle')}
              className="p-4 rounded-2xl bg-[#FBFBF8] hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left space-y-1 transition group"
            >
              <div className="flex items-center justify-between">
                <Droplets className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition" />
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-cyan-600" />
              </div>
              <div className="font-extrabold text-sm text-black">+500 ml</div>
              <div className="text-[10px] font-mono text-slate-400">BOTTLE</div>
            </button>

            <button
              onClick={() => handleAddWater(750, 'Sports Flask')}
              className="p-4 rounded-2xl bg-[#FBFBF8] hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left space-y-1 transition group"
            >
              <div className="flex items-center justify-between">
                <Droplets className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
              <div className="font-extrabold text-sm text-black">+750 ml</div>
              <div className="text-[10px] font-mono text-slate-400">FLASK</div>
            </button>
          </div>
        </div>
      </div>

      {/* VOICE COMMAND BOX: "I drank 500 ml water" */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Voice Action Logging</h3>
              <p className="text-xs text-slate-400">Say your water intake naturally</p>
            </div>
          </div>

          <button
            onClick={() => {
              handleAddWater(500, 'Voice Command');
            }}
            className="bg-[#A3E635] text-black font-extrabold text-xs px-5 py-2.5 rounded-full hover:bg-[#84CC16] transition flex items-center gap-2"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>TRIGGER: "I drank 500 ml water"</span>
          </button>
        </div>
      </div>

      {/* INTAKE HISTORY */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 font-sans">
        <h3 className="font-extrabold text-base text-black">Today's Hydration Log History</h3>

        <div className="space-y-2.5">
          {waterHistory.map((entry) => (
            <div
              key={entry.id}
              className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-slate-200 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-black">{entry.amountMl} ml</span>
                  <span className="text-slate-400 ml-2">({entry.containerType})</span>
                </div>
              </div>

              <span className="font-mono text-slate-500">{entry.timeFormatted}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HydrateTracePage;
