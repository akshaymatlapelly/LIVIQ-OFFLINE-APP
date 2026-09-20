import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Pill,
  HeartPulse,
  Clock,
  Mic,
  ArrowUpRight,
  Shield,
  Sparkles,
  Activity,
  CheckCircle2,
  ChevronRight,
  Flame,
  Droplets,
  Moon,
  Dumbbell,
  Utensils,
  MapPin,
  UserCheck,
  Plus,
  Play,
  RotateCcw,
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { activateAgent, handleUserUtterance } = useVoiceAgent();

  // Dynamic Greeting Based on Time of Day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Akshay';

  // Interactive Local State for Demo Action Feedback
  const [waterLogged, setWaterLogged] = useState<number>(1750);
  const [workoutActive, setWorkoutActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddWater = (amount: number) => {
    setWaterLogged((prev) => Math.min(prev + amount, 3000));
    showToast(`Logged +${amount} ml water! Today's total: ${waterLogged + amount} ml`);
  };

  const timelineEvents = [
    { time: '06:45 AM', type: 'Wake', desc: 'Sleep Quality 88% (7h 45m logged)', icon: Moon, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { time: '08:15 AM', type: 'Breakfast', desc: 'Balanced Protein Meal (450 kcal)', icon: Utensils, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { time: '10:30 AM', type: 'Water', desc: '+500 ml Hydration logged', icon: Droplets, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { time: '12:45 PM', type: 'Activity', desc: '4,200 steps lunch walk', icon: Flame, color: 'text-[#84CC16] bg-lime-50 border-lime-200' },
    { time: '05:30 PM', type: 'Workout', desc: '45 min Cardio session completed', icon: Dumbbell, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { time: '07:00 PM', type: 'Medicine', desc: 'Amoxicillin 500mg verified & taken', icon: Pill, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { time: '08:30 PM', type: 'Dinner', desc: 'Light evening meal logged', icon: Utensils, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { time: '10:45 PM', type: 'Sleep', desc: 'Wind-down mode activated', icon: Moon, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' }
  ];

  return (
    <div className="space-y-8 font-sans pb-20 animate-fadeIn max-w-6xl mx-auto">
      {/* Toast Notification Notification Callout */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
          <span className="text-xs font-sans font-bold">{toastMessage}</span>
        </div>
      )}

      {/* TOP SECTION: Dynamic Greeting & Header Banner */}
      <div className="bg-gradient-to-r from-[#A3E635] via-[#84CC16] to-[#A3E635] p-6 sm:p-8 rounded-3xl text-black shadow-xl shadow-[#A3E635]/20 border border-[#84CC16] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Decorative Ambient Background Highlights */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-black/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/90 text-white text-xs font-mono font-extrabold shadow-sm border border-black">
            <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
            <span>LIVIQ • HEALTH COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-tight">
            {getGreeting()}, <span className="text-black">{userName}</span>
          </h1>
          <p className="text-xs sm:text-sm font-sans font-extrabold text-black/80 max-w-xl">
            Here's what's happening with your health today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link
            to="/insight"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-extrabold px-6 py-3.5 rounded-full shadow-lg border border-rose-700 transition transform hover:scale-105 active:scale-95"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>EMERGENCY INCIDENT SCAN</span>
          </Link>
        </div>
      </div>

      {/* MAIN THREE MODULE CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-black tracking-tight">
            Three Primary Health Intelligence Layers
          </h2>
          <span className="text-xs font-mono font-bold text-slate-500">CORE MODULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. INSIGHT CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-black text-rose-400 flex items-center justify-center shadow-md group-hover:bg-rose-600 group-hover:text-white transition duration-300">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  LAYER 1
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-xl text-black">INSIGHT</h3>
                <p className="text-xs font-bold text-rose-600 font-sans mt-0.5">
                  "When something goes wrong."
                </p>
              </div>

              {/* Status List */}
              <div className="space-y-2 pt-1 font-sans text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-medium">Emergency Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Normal (No Incidents)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-medium">Trusted Contact:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    1 Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-medium">Location GPS:</span>
                  <span className="font-mono text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Active (GPS Fixed)
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/insight"
              className="w-full bg-black hover:bg-slate-800 text-white font-sans text-xs font-extrabold py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm transition transform group-hover:scale-[1.02]"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Launch Emergency Scan</span>
            </Link>
          </div>

          {/* 2. MEDSURE CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-black text-[#A3E635] flex items-center justify-center shadow-md group-hover:bg-[#A3E635] group-hover:text-black transition duration-300">
                  <Pill className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                  LAYER 2
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-xl text-black">MEDSURE</h3>
                <p className="text-xs font-bold text-emerald-700 font-sans mt-0.5">
                  "Before / when you take something."
                </p>
              </div>

              {/* Status List */}
              <div className="space-y-2 pt-1 font-sans text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-medium">Medicines Tracked:</span>
                  <span className="font-extrabold text-black">2 Active Medications</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-0.5">
                  <div className="text-[10px] font-mono font-bold text-emerald-900 uppercase">Upcoming Reminder:</div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center justify-between">
                    <span>Amoxicillin 500mg</span>
                    <span className="font-mono text-[11px] bg-emerald-200/80 px-2 py-0.5 rounded">09:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/medsure"
              className="w-full bg-black hover:bg-slate-800 text-white font-sans text-xs font-extrabold py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm transition transform group-hover:scale-[1.02]"
            >
              <Pill className="w-4 h-4 text-[#A3E635]" />
              <span>Scan Medicine Packaging</span>
            </Link>
          </div>

          {/* 3. HEALTRACE CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-black text-blue-400 flex items-center justify-center shadow-md group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                  LAYER 3
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-xl text-black">HEALTRACE</h3>
                <p className="text-xs font-bold text-blue-700 font-sans mt-0.5">
                  "Every day you live."
                </p>
              </div>

              {/* Status List */}
              <div className="space-y-2 pt-1 font-sans text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-medium">Daily Activity:</span>
                  <span className="font-bold text-black font-mono">8,420 / 10,000 steps</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-medium">Hydration Log:</span>
                  <span className="font-bold text-blue-800 font-mono">{waterLogged} / 2,500 ml</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-medium">Health Trend:</span>
                  <span className="font-bold text-emerald-700">Stable Baseline</span>
                </div>
              </div>
            </div>

            <Link
              to="/healtrace"
              className="w-full bg-black hover:bg-slate-800 text-white font-sans text-xs font-extrabold py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm transition transform group-hover:scale-[1.02]"
            >
              <HeartPulse className="w-4 h-4 text-blue-400" />
              <span>Trace Everyday Health</span>
            </Link>
          </div>
        </div>
      </div>

      {/* PROMINENT UNIVERSAL AI ACTION AREA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A3E635] text-[11px] font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UNIVERSAL AI ASSISTANT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What do you want to do?
            </h2>
            <p className="text-xs text-slate-300 font-sans">
              Speak or tap any prompt below for instant AI execution across all three health layers.
            </p>
          </div>

          <button
            type="button"
            onClick={activateAgent}
            className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-extrabold text-xs px-6 py-3.5 rounded-full flex items-center gap-2 shadow-lg transition transform hover:scale-105 shrink-0"
          >
            <Mic className="w-4 h-4 text-black" />
            <span>Speak Voice Command</span>
          </button>
        </div>

        {/* Example Voice Commands Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
          <button
            type="button"
            onClick={() => handleUserUtterance('Scan this medicine')}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-bold transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Pill className="w-4 h-4 text-[#A3E635]" />
              <span>"Scan this medicine"</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>

          <button
            type="button"
            onClick={() => {
              setWorkoutActive(true);
              showToast('Started Outdoor Workout session timer!');
            }}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-bold transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Dumbbell className="w-4 h-4 text-[#A3E635]" />
              <span>"Start my workout"</span>
            </div>
            <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          </button>

          <button
            type="button"
            onClick={() => handleAddWater(500)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-bold transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-[#A3E635]" />
              <span>"I drank 500 ml water"</span>
            </div>
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>

          <button
            type="button"
            onClick={() => handleUserUtterance('Show timeline')}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-bold transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#A3E635]" />
              <span>"Replay my last 7 days"</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>
        </div>
      </div>

      {/* TODAY'S HEALTH SNAPSHOT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">
              Today's Health Snapshot
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Real-time daily physiological indicators</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">5 VITAL SIGNALS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Sleep */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Moon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                88% SCORE
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 font-sans">Sleep Rest</div>
              <div className="text-xl font-extrabold text-black font-mono">7h 45m</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Deep sleep 2h 15m</div>
            </div>
          </div>

          {/* Hydration */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900">
                70% GOAL
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 font-sans">Hydration</div>
              <div className="text-xl font-extrabold text-black font-mono">{waterLogged} ml</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Target: 2,500 ml</div>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-lime-50 text-[#84CC16] flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-lime-100 text-lime-900">
                84% GOAL
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 font-sans">Activity Steps</div>
              <div className="text-xl font-extrabold text-black font-mono">8,420</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">6.2 km • 380 kcal</div>
            </div>
          </div>

          {/* Workout */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                {workoutActive ? 'ACTIVE' : 'COMPLETED'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 font-sans">Workout</div>
              <div className="text-xl font-extrabold text-black font-mono">45 min</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Outdoor Cardio (Avg 128 bpm)</div>
            </div>
          </div>

          {/* Meals */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                3 LOGGED
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 font-sans">Meals & Nutrition</div>
              <div className="text-xl font-extrabold text-black font-mono">1,850 kcal</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Balanced macronutrients</div>
            </div>
          </div>
        </div>
      </div>

      {/* HEALTH INTELLIGENCE & PATTERN OBSERVATION SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-black" />
          <h2 className="text-lg font-extrabold text-black tracking-tight">Your Recent Pattern</h2>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            NPU HEALTH ANALYTICS
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-black font-sans">Activity Baseline Observation</div>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                "Your activity was lower than your usual baseline over the last 3 days."
              </p>
            </div>
          </div>

          <Link
            to="/replay"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-black hover:text-slate-700 font-sans shrink-0"
          >
            <span>Explore Pattern Replay</span>
            <ChevronRight className="w-4 h-4 text-[#84CC16]" />
          </Link>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-sans pt-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>This is an automated physiological observation derived from your sensor timeline signals, NOT a medical diagnosis.</span>
        </div>
      </div>

      {/* HEALTH TIMELINE PREVIEW */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-black" />
            <h2 className="text-lg font-extrabold text-black tracking-tight">Today's Health Summary</h2>
          </div>
          <Link
            to="/replay"
            className="text-xs font-bold text-black hover:underline flex items-center gap-1 font-sans"
          >
            <span>View Pattern Replay</span>
            <ChevronRight className="w-4 h-4 text-[#84CC16]" />
          </Link>
        </div>

        {/* Horizontal Scrollable Timeline Stream */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {timelineEvents.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-2.5 flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400">{evt.time}</span>
                  <div className={`p-1.5 rounded-lg border text-xs font-bold ${evt.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-extrabold text-sm text-black font-sans">{evt.type}</div>
                  <p className="text-[11px] text-slate-600 font-sans leading-snug">{evt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-black tracking-tight">
            Quick Actions
          </h2>
          <span className="text-xs font-mono font-bold text-slate-500">INSTANT HEALTH CONTROLS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/medsure"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-black text-[#A3E635] flex items-center justify-center group-hover:scale-110 transition">
              <Pill className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-black font-sans">SCAN MEDICINE</div>
          </Link>

          <Link
            to="/insight"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-600 transition text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-black font-sans">SCAN INCIDENT</div>
          </Link>

          <button
            type="button"
            onClick={() => handleAddWater(250)}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-cyan-600 transition text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center group-hover:scale-110 transition">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-black font-sans">LOG WATER</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setWorkoutActive(true);
              showToast('Started Cardio Workout tracking!');
            }}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-600 transition text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-black font-sans">START WORKOUT</div>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('Started 20-min Guided Mindfulness Yoga session!');
            }}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-600 transition text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-black font-sans">START YOGA</div>
          </button>

          <Link
            to="/replay"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition">
              <RotateCcw className="w-5 h-5 text-[#A3E635]" />
            </div>
            <div className="text-xs font-extrabold text-black font-sans">VIEW REPLAY</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
