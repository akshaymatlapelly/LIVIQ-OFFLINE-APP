import React, { useState, useEffect } from 'react';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import {
  healthReplayService,
  ReplayTimeframeData,
  DailyReplaySnapshot
} from '../services/healthReplayService';
import {
  RotateCcw,
  Sparkles,
  Clock,
  Calendar,
  Layers,
  Info,
  CheckCircle2,
  TrendingDown,
  Moon,
  Flame,
  Droplets,
  Utensils,
  Dumbbell,
  Pill,
  Zap,
  ArrowRight,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HealthReplayPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7 DAYS' | '14 DAYS' | '30 DAYS'>('7 DAYS');
  const [replayData, setReplayData] = useState<ReplayTimeframeData>(healthReplayService.getReplayData('7 DAYS'));
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  useEffect(() => {
    setReplayData(healthReplayService.getReplayData(selectedTimeframe));
  }, [selectedTimeframe]);

  const pipelineSteps = [
    'LOCAL HEALTH DATA',
    'PERSONAL BASELINE',
    'PATTERN ENGINE',
    'HEALTH DRIFT',
    'HEALTH REPLAY'
  ];

  const currentSnapshot = replayData.dailySnapshots[selectedDayIndex] || replayData.dailySnapshots[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>SIGNATURE FEATURE • HEALTH REPLAY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              HEALTH REPLAY
              <span className="text-xs font-mono font-normal text-[#A3E635] border border-[#A3E635]/30 px-2.5 py-1 rounded-full">
                Timeline Reconstruction Engine
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Explore co-occurring signal patterns across time. Answers <span className="underline font-bold text-white">What changed?</span>, <span className="underline font-bold text-white">When did it change?</span>, and <span className="underline font-bold text-white">What can I try next?</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/drift"
              className="bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold px-4 py-3.5 rounded-full border border-white/20 flex items-center gap-2 transition"
            >
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <span>HEALTH DRIFT</span>
            </Link>

            <Link
              to="/baseline"
              className="bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold px-4 py-3.5 rounded-full border border-white/20 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-[#A3E635]" />
              <span>MY BASELINE</span>
            </Link>
          </div>
        </div>

        {/* PIPELINE RECONSTRUCTION STEPPER */}
        <div className="relative z-10 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[10px] font-mono">
          <span className="text-slate-400 font-bold mr-1">REPLAY PIPELINE:</span>
          {pipelineSteps.map((step, idx) => (
            <div key={step} className="flex items-center gap-1.5">
              <span className={`px-2.5 py-0.5 rounded-full border ${idx === 4 ? 'bg-[#A3E635] text-black border-[#A3E635] font-extrabold' : 'bg-white/10 text-slate-300 border-white/15'}`}>
                {step}
              </span>
              {idx < pipelineSteps.length - 1 && <span className="text-slate-600">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* TIMEFRAME SELECTOR TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm font-sans">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-black" />
          <span className="font-extrabold text-sm text-black">Replay Window:</span>
          <span className="text-xs font-mono font-bold text-slate-500">{replayData.dateRangeText}</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 shrink-0 font-mono text-xs font-bold">
          {(['7 DAYS', '14 DAYS', '30 DAYS'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-4 py-2 rounded-full transition ${
                selectedTimeframe === tf ? 'bg-black text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* NON-DIAGNOSTIC & NON-CAUSATION DISCLAIMER BANNER */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-xs font-sans">
        <Info className="w-5 h-5 text-[#A3E635] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Pattern Exploration Notice:</span> Health Replay provides automated signal pattern exploration over time. Co-occurring signals represent pattern correlations for personal self-tracking, <span className="underline font-bold">NOT</span> clinical causation or medical diagnosis.
        </div>
      </div>

      {/* LIVIQ PATTERN EXPLORATION SYNTHESIS BOX (WHAT CHANGED? WHEN? WHAT NEXT?) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-black" />
            <h2 className="text-xl font-extrabold text-black tracking-tight">LIVIQ Pattern Exploration Synthesis</h2>
          </div>
          <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            INTELLIGENCE SUMMARY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. What Changed? */}
          <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">1. WHAT CHANGED?</span>
            <p className="text-xs font-extrabold text-black leading-relaxed">
              {replayData.patternSynthesis.whatChanged}
            </p>
          </div>

          {/* 2. When Did It Change? */}
          <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">2. WHEN DID IT CHANGE?</span>
            <p className="text-xs font-extrabold text-black leading-relaxed">
              {replayData.patternSynthesis.whenItChanged}
            </p>
          </div>

          {/* 3. What Patterns Appear Together? */}
          <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">3. WHAT PATTERNS APPEAR TOGETHER?</span>
            <p className="text-xs font-extrabold text-black leading-relaxed">
              {replayData.patternSynthesis.cooccurringPatterns}
            </p>
          </div>

          {/* 4. What You Could Try */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">4. WHAT YOU COULD TRY</span>
            <p className="text-xs font-extrabold text-emerald-950 leading-relaxed">
              "{replayData.patternSynthesis.whatYouCouldTry}"
            </p>
          </div>
        </div>
      </div>

      {/* CHRONOLOGICAL DAY SCRUBBER & EVENT REPLAY STREAM */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">Interactive Daily Replay Feed</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a day to inspect unified cross-signal telemetry</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">7-DAY REPLAY SNAPSHOTS</span>
        </div>

        {/* Day Scrubber Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {replayData.dailySnapshots.map((snap, idx) => (
            <button
              key={snap.dayName}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-4 py-3 rounded-2xl border font-bold transition shrink-0 flex flex-col items-center gap-0.5 ${
                selectedDayIndex === idx
                  ? 'bg-black text-white border-black shadow-md'
                  : snap.hasDrift
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:border-amber-500'
                  : 'bg-[#FBFBF8] border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              <span className="text-[10px]">{snap.dayName}</span>
              <span className="text-xs">{snap.dateFormatted.split(' ')[0]}</span>
              {snap.hasDrift && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
            </button>
          ))}
        </div>

        {/* SELECTED DAY DETAILED SNAPSHOT CARD */}
        {currentSnapshot && (
          <div className="bg-[#FBFBF8] rounded-3xl border border-slate-200/80 p-6 space-y-6 animate-fadeIn font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-black">{currentSnapshot.dayName}</h3>
                  <span className="text-xs font-mono text-slate-500 font-bold">({currentSnapshot.dateFormatted})</span>
                  {currentSnapshot.isToday && (
                    <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#A3E635] text-black">
                      TODAY
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{currentSnapshot.summaryNote}</p>
              </div>

              {currentSnapshot.hasDrift && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-extrabold shrink-0">
                  <TrendingDown className="w-4 h-4 text-amber-700" />
                  <span>BASELINE SHIFT DETECTED</span>
                </span>
              )}
            </div>

            {/* Daily Signal Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-sans">
              {/* Sleep */}
              <div className={`p-3.5 rounded-2xl border ${currentSnapshot.sleep.isBelowBaseline ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>SLEEP</span>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="text-lg font-extrabold font-mono text-black mt-1">{currentSnapshot.sleep.durationText}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{currentSnapshot.sleep.efficiencyPercent}% Score</div>
              </div>

              {/* Activity */}
              <div className={`p-3.5 rounded-2xl border ${currentSnapshot.activity.isBelowBaseline ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>STEPS</span>
                  <Flame className="w-3.5 h-3.5 text-[#84CC16]" />
                </div>
                <div className="text-lg font-extrabold font-mono text-black mt-1">{currentSnapshot.activity.stepsCount.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{currentSnapshot.activity.distanceKm}</div>
              </div>

              {/* Hydration */}
              <div className={`p-3.5 rounded-2xl border ${currentSnapshot.hydration.isBelowBaseline ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>WATER</span>
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                <div className="text-lg font-extrabold font-mono text-black mt-1">{currentSnapshot.hydration.waterMl} ml</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Hydration log</div>
              </div>

              {/* Nutrition */}
              <div className={`p-3.5 rounded-2xl border ${currentSnapshot.nutrition.isShifted ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>DINNER</span>
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-lg font-extrabold font-mono text-black mt-1">{currentSnapshot.nutrition.dinnerTime}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{currentSnapshot.nutrition.calories} kcal</div>
              </div>

              {/* Workout */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>WORKOUT</span>
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xs font-extrabold text-black mt-1 truncate">{currentSnapshot.workout.type}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{currentSnapshot.workout.duration}</div>
              </div>

              {/* Energy */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>ENERGY</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-extrabold font-mono text-black mt-1">{currentSnapshot.energy.level}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{currentSnapshot.energy.score} / 10</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthReplayPage;
