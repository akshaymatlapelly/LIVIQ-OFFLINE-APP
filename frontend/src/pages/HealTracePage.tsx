import React, { useState } from 'react';
import { CameraScanner } from '../components/CameraScanner';
import { TraceCard } from '../components/TraceCard';
import { HealthMetricBlock } from '../components/HealthMetricBlock';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';
import {
  HeartPulse,
  Utensils,
  Sparkles,
  Dumbbell,
  Moon,
  Droplets,
  Flame,
  Mic,
  Plus,
  Play,
  RotateCcw,
  Clock,
  ScanLine,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Activity,
  Layers,
  Search,
  Zap,
  FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const HealTracePage: React.FC = () => {
  const navigate = useNavigate();
  const { activateAgent, handleUserUtterance } = useVoiceAgent();

  // Interactive Local State
  const [waterLogged, setWaterLogged] = useState<number>(1750);
  const [workoutSessionActive, setWorkoutSessionActive] = useState<boolean>(false);
  const [yogaSessionActive, setYogaSessionActive] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Lab Document OCR Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAddWater = (amount: number) => {
    setWaterLogged((prev) => Math.min(prev + amount, 3500));
    showToast(`HydrateTrace: Logged +${amount} ml! Today's total: ${waterLogged + amount} ml`);
  };

  const handleCaptureDoc = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        documentTitle: 'Comprehensive Metabolic & Lipid Panel',
        extractedDate: '12 SEP 2026',
        tracedMetrics: [
          { name: 'Fasting Blood Glucose', value: '94 mg/dL', status: 'NORMAL' },
          { name: 'Total Cholesterol', value: '182 mg/dL', status: 'OPTIMAL' },
          { name: 'HbA1c', value: '5.4%', status: 'NORMAL' },
          { name: 'Vitamin D3', value: '38 ng/mL', status: 'ADEQUATE' }
        ],
        summary: 'All core blood biomarkers are within optimal physiological reference ranges.'
      });
    }, 2200);
  };

  const coreLoop = [
    { name: 'EAT', desc: 'Nutritional ingestion' },
    { name: 'MOVE', desc: 'Baseline activity' },
    { name: 'TRAIN', desc: 'Cardio & strength' },
    { name: 'RECOVER', desc: 'Sleep & hydration' },
    { name: 'TRACE', desc: 'Signal aggregation' },
    { name: 'IMPROVE', desc: 'Pattern optimization' }
  ];

  const timelineStream = [
    { time: '08:00', label: 'Wake', details: 'Sleep Rest 88% (7h 45m logged)', icon: Moon, color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { time: '08:30', label: 'Breakfast', details: 'High-protein oatmeal & berries (450 kcal)', icon: Utensils, color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { time: '10:00', label: 'Walk', details: '2,100 steps morning stroll', icon: Flame, color: 'bg-lime-50 border-lime-200 text-[#84CC16]' },
    { time: '12:30', label: 'Water', details: '+500 ml Hydration logged', icon: Droplets, color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
    { time: '14:00', label: 'Lunch', details: 'Grilled chicken salad & quinoa (650 kcal)', icon: Utensils, color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { time: '18:00', label: 'Workout', details: '45 min Outdoor Cardio run', icon: Dumbbell, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { time: '20:00', label: 'Dinner', details: 'Steamed salmon & vegetables (550 kcal)', icon: Utensils, color: 'bg-amber-50 border-amber-200 text-amber-700' }
  ];

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
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-mono text-xs font-bold">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>LAYER 3 • EVERYDAY HEALTH INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            HEALTRACE
          </h1>

          <p className="text-base text-slate-300 font-sans leading-relaxed">
            "Don’t just track what you do. Understand how it affects your health."
          </p>

          {/* Core Loop Stepper Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono text-slate-400 font-bold mr-1">INTELLIGENCE LOOP:</span>
            {coreLoop.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/15 text-[11px] font-mono font-bold text-[#A3E635]">
                  {item.name}
                </span>
                {i < coreLoop.length - 1 && <span className="text-slate-600 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TODAY'S HEALTH SUMMARY GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">
              Today's Health Summary
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Continuous physiological signal telemetry</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">6 VITAL METRICS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <HealthMetricBlock
            label="Sleep Rest"
            value="7h 45m"
            subtext="Deep sleep 2h 15m"
            badgeText="88% SCORE"
            badgeColor="bg-indigo-100 text-indigo-900"
            icon={Moon}
            iconBgColor="bg-indigo-50"
            iconTextColor="text-indigo-600"
            progressPercent={88}
          />

          <HealthMetricBlock
            label="Hydration"
            value={`${waterLogged} ml`}
            subtext="Target: 2,500 ml"
            badgeText="70% GOAL"
            badgeColor="bg-cyan-100 text-cyan-900"
            icon={Droplets}
            iconBgColor="bg-cyan-50"
            iconTextColor="text-cyan-600"
            progressPercent={Math.round((waterLogged / 2500) * 100)}
          />

          <HealthMetricBlock
            label="Activity"
            value="8,420"
            subtext="6.2 km • 380 kcal"
            badgeText="84% GOAL"
            badgeColor="bg-lime-100 text-lime-900"
            icon={Flame}
            iconBgColor="bg-lime-50"
            iconTextColor="text-[#84CC16]"
            progressPercent={84}
          />

          <HealthMetricBlock
            label="Meals & Cal"
            value="1,850 kcal"
            subtext="3 Meals logged"
            badgeText="BALANCED"
            badgeColor="bg-amber-100 text-amber-900"
            icon={Utensils}
            iconBgColor="bg-amber-50"
            iconTextColor="text-amber-600"
            progressPercent={78}
          />

          <HealthMetricBlock
            label="Workout"
            value="45 min"
            subtext="Outdoor Cardio Run"
            badgeText="COMPLETED"
            badgeColor="bg-emerald-100 text-emerald-900"
            icon={Dumbbell}
            iconBgColor="bg-emerald-50"
            iconTextColor="text-emerald-600"
            progressPercent={100}
          />

          <HealthMetricBlock
            label="Recovery"
            value="86%"
            subtext="Optimal readiness"
            badgeText="OPTIMAL"
            badgeColor="bg-blue-100 text-blue-900"
            icon={HeartPulse}
            iconBgColor="bg-blue-50"
            iconTextColor="text-blue-600"
            progressPercent={86}
          />
        </div>
      </div>

      {/* PERSONAL PATTERN BANNER COMPONENT */}
      <PatternInsightBanner
        title="Personal Pattern Insight"
        observation="Your activity today is below your recent average over the last 3 days."
        actionText="Replay 7-Day Pattern"
        onAction={() => navigate('/replay')}
      />

      {/* "ASK LIVIQ" VOICE ACTION BOX */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A3E635] text-[11px] font-mono font-bold">
              <Mic className="w-3.5 h-3.5" />
              <span>LIVIQ VOICE ACTION CONSOLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ask LIVIQ
            </h2>
            <p className="text-xs text-slate-300 font-sans">
              Speak or tap example voice commands to log data or initiate routines instantly.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
          <button
            type="button"
            onClick={() => {
              setYogaSessionActive(true);
              showToast('Started 20-min Guided Yoga session!');
            }}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-bold transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A3E635]" />
              <span>"Start yoga"</span>
            </div>
            <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          </button>

          <button
            type="button"
            onClick={() => {
              setWorkoutSessionActive(true);
              showToast('Started Outdoor Cardio Workout session timer!');
            }}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-bold transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#A3E635]" />
              <span>"I drank 500 ml water"</span>
            </div>
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>

          <button
            type="button"
            onClick={() => handleUserUtterance('Log my breakfast')}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-bold transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#A3E635]" />
              <span>"Log my breakfast"</span>
            </div>
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/replay')}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans text-xs font-bold transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#A3E635]" />
              <span>"Replay my week"</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>
        </div>
      </div>

      {/* SIX SUB-TRACE MODULE CARDS (ONE UNIFIED SYSTEM) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">
              Six Sub-Trace Intelligence Modules
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Unified health signal ingestion components</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">6 SUB-MODULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. FOODTRACE */}
          <TraceCard
            title="FOODTRACE"
            subtitle="Nutritional & Meal Intelligence"
            icon={Utensils}
            value="1,850 kcal"
            metricLabel="TODAY'S INGESTION"
            statusText="BALANCED MACROS"
            badgeColor="bg-amber-100 text-amber-900 border-amber-200"
            iconBgColor="bg-black text-amber-400"
            description="Track meal macro-nutrients, calorie density, and food photo vision telemetry with AI portion estimates."
            actionText="Launch FoodTrace"
            onAction={() => navigate('/foodtrace')}
          />

          {/* 2. YOGATRACE */}
          <TraceCard
            title="YOGATRACE"
            subtitle="Mindfulness & Guided Posture"
            icon={Sparkles}
            value="20 min"
            metricLabel="TODAY'S SESSION"
            statusText="MEDIAPIPE AI ACTIVE"
            badgeColor="bg-indigo-100 text-indigo-900 border-indigo-200"
            iconBgColor="bg-black text-indigo-400"
            description="MediaPipe pose estimation camera engine. Measures joint angles, provides live voice form corrections, and hold timers."
            actionText="Launch YogaTrace"
            onAction={() => navigate('/yogatrace')}
          />

          {/* 3. GYMTRACE */}
          <TraceCard
            title="GYMTRACE"
            subtitle="Strength & Cardio Load"
            icon={Dumbbell}
            value="45 min"
            metricLabel="VISION REP COUNTER"
            statusText="CAMERA AI ACTIVE"
            badgeColor="bg-emerald-100 text-emerald-900 border-emerald-200"
            iconBgColor="bg-black text-emerald-400"
            description="Camera movement trajectory analysis, automated rep counting, and total volume load tracking."
            actionText="Launch GymTrace"
            onAction={() => navigate('/gymtrace')}
          />

          {/* 4. SLEEPTRACE */}
          <TraceCard
            title="SLEEPTRACE"
            subtitle="Sleep Quality & Rest Score"
            icon={Moon}
            value="7h 45m"
            metricLabel="REST DURATION"
            statusText="88% RECOVERY"
            badgeColor="bg-indigo-100 text-indigo-900 border-indigo-200"
            iconBgColor="bg-black text-indigo-400"
            description="Monitor REM sleep, deep sleep cycles, bedtime consistency, and physiological recovery readiness."
            actionText="Launch SleepTrace"
            onAction={() => navigate('/sleeptrace')}
          />

          {/* 5. HYDRATETRACE */}
          <TraceCard
            title="HYDRATETRACE"
            subtitle="Fluid Intake Tracking"
            icon={Droplets}
            value={`${waterLogged} / 2,500 ml`}
            metricLabel="HYDRATION LOGGED"
            statusText="70% GOAL"
            badgeColor="bg-cyan-100 text-cyan-900 border-cyan-200"
            iconBgColor="bg-black text-cyan-400"
            description="Track daily water consumption, quick container additions, voice logging, and hydration reminders."
            actionText="Launch HydrateTrace"
            onAction={() => navigate('/hydratetrace')}
          />

          {/* 6. ACTIVITYTRACE */}
          <TraceCard
            title="ACTIVITYTRACE"
            subtitle="Baseline Movement & Steps"
            icon={Flame}
            value="8,420 steps"
            metricLabel="DAILY MOVEMENT"
            statusText="84% GOAL"
            badgeColor="bg-lime-100 text-lime-900 border-lime-200"
            iconBgColor="bg-black text-[#A3E635]"
            description="Ingest smartphone accelerometer steps, daily walking distance, and active vs sedentary hours telemetry."
            actionText="Launch ActivityTrace"
            onAction={() => navigate('/activitytrace')}
          />
        </div>
      </div>

      {/* LAB REPORT OCR TRACER SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-black" />
            <h2 className="text-lg font-extrabold text-black tracking-tight">Lab Report OCR Biomarker Tracer</h2>
          </div>
          <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
            DOCUMENT OCR ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-[#FBFBF8] rounded-3xl p-6 border border-slate-200 space-y-4">
            <CameraScanner
              onCapture={handleCaptureDoc}
              isScanning={isScanning}
              placeholderText="Align camera reticle with lab report, blood test, or clinical summary"
              badgeLabel="HEALTRACE DOCUMENT OCR STREAM"
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            {scanResult ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-mono font-extrabold text-slate-400">TRACED REPORT</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-mono font-bold">
                    {scanResult.extractedDate}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-black">{scanResult.documentTitle}</h3>
                  <p className="text-xs text-slate-600 font-sans mt-1 leading-relaxed">{scanResult.summary}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
                  {scanResult.tracedMetrics.map((m: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                      <span className="font-sans text-slate-700 font-medium">{m.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black">{m.value}</span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-600 font-sans">
                <div className="font-bold text-black text-sm">Clinical Document Ingestion</div>
                <p className="leading-relaxed">
                  Position any physical diagnostic report inside the reticle above to parse blood glucose, lipid levels, and nutritional biomarkers directly into your health timeline.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TODAY'S TIMELINE STREAM */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-black" />
            <h2 className="text-lg font-extrabold text-black tracking-tight">Today's Health Summary Stream</h2>
          </div>
          <Link
            to="/replay"
            className="text-xs font-bold text-black hover:underline flex items-center gap-1 font-sans"
          >
            <span>View Pattern Replay</span>
            <ChevronRight className="w-4 h-4 text-[#84CC16]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {timelineStream.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400">{item.time}</span>
                  <div className={`p-1.5 rounded-lg border text-xs font-bold ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-sm text-black font-sans">{item.label}</div>
                  <p className="text-[11px] text-slate-600 font-sans leading-snug">{item.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
