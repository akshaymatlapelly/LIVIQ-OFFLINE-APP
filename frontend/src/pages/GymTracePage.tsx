import React, { useState, useEffect, useRef } from 'react';
import { CameraScanner } from '../components/CameraScanner';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';
import {
  gymTraceService,
  SUPPORTED_EXERCISES,
  GymExercise,
  GymWorkoutRecord
} from '../services/gymTraceService';
import {
  Dumbbell,
  Play,
  Pause,
  SkipForward,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Mic,
  Activity,
  Flame,
  Clock,
  RotateCcw,
  Volume2,
  ChevronRight,
  TrendingUp,
  Layers,
  Award,
  Info,
  Check,
  Zap,
  Plus,
  BarChart3,
  Sliders,
  Dumbbell as DumbbellIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipForward as SkipForwardIcon,
  CheckCircle2 as CheckCircle2Icon,
  Mic as MicIcon,
  Activity as ActivityIcon,
  Flame as FlameIcon,
  Clock as ClockIcon,
  RotateCcw as RotateCcwIcon,
  Volume2 as Volume2Icon,
  ChevronRight as ChevronRightIcon,
  TrendingUp as TrendingUpIcon,
  Layers as LayersIcon,
  Award as AwardIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Zap as ZapIcon,
  Plus as PlusIcon,
  BarChart3 as BarChart3Icon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const GymTracePage: React.FC = () => {
  const navigate = useNavigate();
  const { activateAgent, handleUserUtterance } = useVoiceAgent();

  // Exercise & Mode Selection State
  const [selectedExercise, setSelectedExercise] = useState<GymExercise>(SUPPORTED_EXERCISES[0]);
  const [isVisionMode, setIsVisionMode] = useState<boolean>(true);
  const [sessionPhase, setSessionPhase] = useState<'SELECT' | 'PRACTICE' | 'SUMMARY'>('SELECT');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Manual Inputs
  const [inputWeightKg, setInputWeightKg] = useState<number>(SUPPORTED_EXERCISES[0].defaultWeightKg);
  const [targetSets, setTargetSets] = useState<number>(SUPPORTED_EXERCISES[0].defaultTargetSets);
  const [targetReps, setTargetReps] = useState<number>(SUPPORTED_EXERCISES[0].defaultTargetReps);

  // Practice Session State
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [currentReps, setCurrentReps] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [movementState, setMovementState] = useState<string>('START POSITION');
  const [formScore, setFormScore] = useState<number>(94);
  const [liveFeedback, setLiveFeedback] = useState<string>('Ready. Maintain proper knee alignment.');
  const [feedbackLog, setFeedbackLog] = useState<string[]>([]);

  // History & Summary State
  const [workoutHistory, setWorkoutHistory] = useState<GymWorkoutRecord[]>([]);
  const [lastSummary, setLastSummary] = useState<GymWorkoutRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Canvas Reference for Pose & Trajectory Overlay
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    setWorkoutHistory(gymTraceService.getHistory());
  }, []);

  // Timer loop & simulated rep counting when in PRACTICE phase
  useEffect(() => {
    let interval: any = null;
    if (sessionPhase === 'PRACTICE' && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const nextSec = prev + 1;

          // Simulate rep repetition cycle every 3.5 seconds
          if (nextSec % 4 === 0) {
            setCurrentReps((r) => {
              const newReps = r + 1;

              // Dynamic state and form feedback messages
              if (newReps === 3) {
                setMovementState('FULL DEPTH REACHED');
                setLiveFeedback('“Good range of motion!”');
                setFeedbackLog((prevLog) => [...prevLog, 'Good range of motion']);
              } else if (newReps === 6) {
                setMovementState('ASCENDING POWER');
                setLiveFeedback('“Keep your knees aligned over toes.”');
                setFeedbackLog((prevLog) => [...prevLog, 'Keep knees aligned']);
              } else if (newReps === 8) {
                setMovementState('REP 8 COUNTED');
                setLiveFeedback('“Rep 8! Controlled eccentric pace.”');
                setFeedbackLog((prevLog) => [...prevLog, 'Rep 8 counted - controlled pace']);
              }

              // Auto advance set if target reps reached
              if (newReps >= targetReps) {
                if (currentSet < targetSets) {
                  setCurrentSet((s) => s + 1);
                  showToast(`Completed Set ${currentSet}! Take a 45s rest.`);
                  return 0; // Reset rep counter for next set
                } else {
                  // Workout complete!
                  handleEndWorkout(true);
                }
              }

              return newReps;
            });
          }

          return nextSec;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionPhase, isPaused, targetReps, targetSets, currentSet]);

  // Draw Skeletal Landmarks & Movement Vector Rays
  useEffect(() => {
    if (sessionPhase !== 'PRACTICE' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simulated skeletal landmarks for Squat / Movement
    const landmarks = [
      { name: 'Head', x: 320, y: 120, color: '#3B82F6' },
      { name: 'Shoulders', x: 320, y: 180, color: '#A3E635' },
      { name: 'Hip Center', x: 320, y: 280, color: '#A3E635' },
      { name: 'Left Knee', x: 260, y: 370, color: '#A3E635' },
      { name: 'Right Knee', x: 380, y: 370, color: '#A3E635' },
      { name: 'Left Ankle', x: 250, y: 440, color: '#A3E635' },
      { name: 'Right Ankle', x: 390, y: 440, color: '#A3E635' }
    ];

    // Draw Vector Movement Rays
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#A3E635';
    ctx.shadowColor = '#A3E635';
    ctx.shadowBlur = 8;

    // Draw center spine line
    ctx.beginPath();
    ctx.moveTo(320, 120);
    ctx.lineTo(320, 280);
    ctx.stroke();

    // Draw legs
    ctx.beginPath();
    ctx.moveTo(320, 280);
    ctx.lineTo(260, 370);
    ctx.lineTo(250, 440);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(320, 280);
    ctx.lineTo(380, 370);
    ctx.lineTo(390, 440);
    ctx.stroke();

    // Draw landmark keypoint nodes
    landmarks.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw HUD Rep Badge Overlay on Canvas
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(20, 20, 140, 50);
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#A3E635';
    ctx.fillText(`REP: ${currentReps}/${targetReps}`, 35, 52);
  }, [sessionPhase, currentReps, targetReps]);

  // Start Workout CTA
  const handleStartWorkout = () => {
    setSessionPhase('PRACTICE');
    setIsPaused(false);
    setElapsedSeconds(0);
    setCurrentSet(1);
    setCurrentReps(0);
    setFeedbackLog([]);
    showToast(`Started ${selectedExercise.name} workout tracking!`);
  };

  // End Workout CTA
  const handleEndWorkout = (autoCompleted = false) => {
    const dur = elapsedSeconds || 120;
    const totalVolume = inputWeightKg * targetReps * (currentSet || 1);

    const record: Omit<GymWorkoutRecord, 'id'> = {
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      setsCompleted: currentSet,
      repsPerSet: targetReps,
      weightKg: inputWeightKg,
      totalVolumeKg: totalVolume,
      durationSeconds: dur,
      formAccuracyScore: formScore,
      sessionDate: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      caloriesBurned: Math.round(dur * 0.4),
      formFeedbackNotes: feedbackLog.length > 0 ? feedbackLog : ['Good depth reached', 'Knee alignment stable'],
      isVisionTracked: isVisionMode
    };

    const saved = gymTraceService.saveWorkout(record);
    setLastSummary(saved);
    setWorkoutHistory(gymTraceService.getHistory());
    setSessionPhase('SUMMARY');
  };

  const stats = gymTraceService.getStats();

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2Icon className="w-4 h-4 text-[#A3E635]" />
          <span className="text-xs font-sans font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-900/40 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
              <DumbbellIcon className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>HEALTRACE SUB-MODULE • GYMTRACE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              GYMTRACE
              <span className="text-xs font-mono font-normal text-emerald-400 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                AI Vision Rep Counter
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Camera-based movement trajectory analysis, automated rep counting, and load volume tracking synchronized directly to your continuous HEALTRACE timeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/healtrace"
              className="bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold px-4 py-3.5 rounded-full border border-white/20 flex items-center gap-2 transition"
            >
              <LayersIcon className="w-4 h-4 text-[#A3E635]" />
              <span>HEALTRACE MAIN</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Non-Medical Safety Disclaimer Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 text-emerald-900 text-xs font-sans">
        <InfoIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Biomechanical Notice:</span> GymTrace provides automated camera vision rep counting and motion trajectory feedback. It does <span className="underline font-bold">NOT</span> claim clinical biomechanical diagnosis or replace a certified trainer. Stop exercising if you feel joint pain or acute muscle strain.
        </div>
      </div>

      {/* WORKOUT START STEP 1: EXERCISE SELECTION & INPUTS */}
      {sessionPhase === 'SELECT' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-black tracking-tight">Select Workout Exercise</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Camera rep tracking configured for core compound movements</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">WORKOUT CONFIG</span>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SUPPORTED_EXERCISES.map((ex) => (
              <div
                key={ex.id}
                onClick={() => {
                  setSelectedExercise(ex);
                  setInputWeightKg(ex.defaultWeightKg);
                  setTargetSets(ex.defaultTargetSets);
                  setTargetReps(ex.defaultTargetReps);
                }}
                className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 space-y-3 flex flex-col justify-between group font-sans ${
                  selectedExercise.id === ex.id
                    ? 'bg-white border-[#84CC16] shadow-xl ring-2 ring-[#A3E635]/50 scale-[1.02]'
                    : 'bg-white border-slate-200/80 hover:border-slate-400 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {ex.category}
                  </span>
                  <h3 className="text-base font-extrabold text-black group-hover:text-slate-900 leading-snug">
                    {ex.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans leading-tight">
                    {ex.targetMuscleGroup}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-bold text-slate-600">
                  <span>{ex.defaultTargetSets} Sets</span>
                  <span>{ex.defaultTargetReps} Reps</span>
                </div>
              </div>
            ))}
          </div>

          {/* Manual Input Configuration Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 font-sans">
            <h3 className="font-extrabold text-base text-black flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Exercise Load & Target Rep Configuration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600">Weight Load (kg)</label>
                <input
                  type="number"
                  value={inputWeightKg}
                  onChange={(e) => setInputWeightKg(Number(e.target.value))}
                  className="w-full mt-1 bg-[#FBFBF8] text-black font-mono font-extrabold text-base px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600">Target Sets</label>
                <input
                  type="number"
                  value={targetSets}
                  onChange={(e) => setTargetSets(Number(e.target.value))}
                  className="w-full mt-1 bg-[#FBFBF8] text-black font-mono font-extrabold text-base px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600">Target Reps per Set</label>
                <input
                  type="number"
                  value={targetReps}
                  onChange={(e) => setTargetReps(Number(e.target.value))}
                  className="w-full mt-1 bg-[#FBFBF8] text-black font-mono font-extrabold text-base px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                />
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#A3E635] uppercase tracking-wider">
                EXERCISE: {selectedExercise.name.toUpperCase()} • TOTAL TARGET VOLUME: {inputWeightKg * targetReps * targetSets} KG
              </span>
              <h3 className="text-2xl font-extrabold text-white">Ready for Movement Tracking</h3>
              <p className="text-xs text-slate-300">
                Camera vision will track rep repetitions, posture depth, and movement cadence in real time.
              </p>
            </div>

            <button
              onClick={handleStartWorkout}
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-extrabold text-sm px-8 py-4 rounded-full shadow-lg flex items-center justify-center gap-2 transition transform hover:scale-105 shrink-0"
            >
              <PlayIcon className="w-5 h-5 fill-current" />
              <span>START WORKOUT</span>
            </button>
          </div>
        </div>
      )}

      {/* WORKOUT PRACTICE STEP 2: CAMERA & REP COUNTING HUD */}
      {sessionPhase === 'PRACTICE' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top HUD Control Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#A3E635] animate-ping" />
              <div>
                <span className="text-[#A3E635] font-bold">{selectedExercise.name}</span>
                <span className="text-slate-400 ml-2">• Set {currentSet} of {targetSets}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              >
                {isPaused ? <PlayIcon className="w-3.5 h-3.5 text-[#A3E635]" /> : <PauseIcon className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
              </button>

              <button
                onClick={() => handleEndWorkout(false)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3.5 py-2 rounded-xl border border-red-500/40 font-bold transition"
              >
                END WORKOUT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Live Camera View + Skeletal Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video flex items-center justify-center">
                <CameraScanner
                  isScanning={true}
                  onCapture={() => {}}
                  placeholderText="Position body in camera view for rep tracking"
                  badgeLabel="GYM VISION REPETITION STREAM"
                />

                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                />

                {/* Floating Rep Counter Overlay Badge */}
                <div className="absolute top-4 left-4 z-30 bg-black/85 backdrop-blur border border-emerald-500/40 px-4 py-2.5 rounded-2xl text-white font-mono flex items-center gap-3">
                  <div className="text-[10px] text-slate-400 uppercase">REP COUNT</div>
                  <div className="text-3xl font-extrabold text-[#A3E635]">{currentReps} <span className="text-xs text-slate-400">/ {targetReps}</span></div>
                </div>

                {/* Form Accuracy Badge */}
                <div className="absolute top-4 right-4 z-30 bg-black/85 backdrop-blur border border-[#A3E635]/40 px-3.5 py-2 rounded-full text-white text-[11px] font-mono flex items-center gap-2">
                  <ZapIcon className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span className="font-bold text-[#A3E635]">{formScore}% FORM SCORE</span>
                </div>
              </div>

              {/* LIVE FORM FEEDBACK BANNER */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex items-center gap-4 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[#A3E635] shrink-0">
                  <Volume2Icon className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-bold text-[#A3E635] uppercase">
                    AI MOVEMENT FEEDBACK
                  </div>
                  <div className="text-sm font-extrabold text-white font-sans">
                    {liveFeedback}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Workout Metrics & Voice Commands */}
            <div className="space-y-6">
              {/* Metric Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 font-sans">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  LIVE WORKOUT TELEMETRY
                </span>

                <div className="grid grid-cols-2 gap-3 text-center font-mono">
                  <div className="bg-[#FBFBF8] p-3 rounded-2xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">CURRENT SET</div>
                    <div className="text-2xl font-extrabold text-black">{currentSet} <span className="text-xs text-slate-400">/ {targetSets}</span></div>
                  </div>

                  <div className="bg-[#FBFBF8] p-3 rounded-2xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">ELAPSED TIME</div>
                    <div className="text-2xl font-extrabold text-emerald-600">
                      {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
                    </div>
                  </div>

                  <div className="bg-[#FBFBF8] p-3 rounded-2xl border border-slate-200 col-span-2">
                    <div className="text-[10px] text-slate-400">TOTAL VOLUME LIFTED</div>
                    <div className="text-2xl font-extrabold text-black">
                      {inputWeightKg * currentReps * currentSet} <span className="text-xs text-slate-400">kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VOICE CONTROLS CONSOLE */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#A3E635]">VOICE CONTROL ACTION</span>
                  <MicIcon className="w-4 h-4 text-[#A3E635]" />
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs font-sans">
                  <button
                    onClick={() => handleUserUtterance('Start my workout')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left font-bold text-slate-200 transition"
                  >
                    “Start my workout”
                  </button>
                  <button
                    onClick={() => showToast('Switched to next exercise in queue.')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left font-bold text-slate-200 transition"
                  >
                    “Next exercise”
                  </button>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left font-bold text-slate-200 transition"
                  >
                    “Pause”
                  </button>
                  <button
                    onClick={() => handleEndWorkout(false)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left font-bold text-slate-200 transition"
                  >
                    “End workout”
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WORKOUT SUMMARY STEP 3 */}
      {sessionPhase === 'SUMMARY' && lastSummary && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-900/40 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
              <AwardIcon className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>WORKOUT COMPLETED & TIMELINE SYNCHRONIZED</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">
                {lastSummary.exerciseName} Summary
              </h2>
              <p className="text-xs text-slate-300 font-sans">
                Workout session saved to local storage and connected to continuous HEALTRACE timeline.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 font-mono">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-[10px] text-slate-400 uppercase">TOTAL VOLUME</div>
                <div className="text-2xl font-extrabold text-[#A3E635]">{lastSummary.totalVolumeKg} kg</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-[10px] text-slate-400 uppercase">SETS / REPS</div>
                <div className="text-2xl font-extrabold text-blue-400">{lastSummary.setsCompleted}x{lastSummary.repsPerSet}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-[10px] text-slate-400 uppercase">FORM SCORE</div>
                <div className="text-2xl font-extrabold text-amber-400">{lastSummary.formAccuracyScore}%</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-[10px] text-slate-400 uppercase">CALORIES BURNED</div>
                <div className="text-2xl font-extrabold text-emerald-400">{lastSummary.caloriesBurned} kcal</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSessionPhase('SELECT')}
                className="bg-[#A3E635] text-black font-extrabold text-xs px-6 py-3.5 rounded-full shadow transition hover:bg-[#84CC16]"
              >
                START ANOTHER WORKOUT
              </button>

              <Link
                to="/healtrace"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-full border border-white/20 transition"
              >
                RETURN TO HEALTRACE
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* WORKOUT HISTORY & VOLUME PROGRESS VISUALIZATION */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">
              Workout History & Load Volume
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Integrated directly into your continuous HEALTRACE health timeline
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              {stats.totalWorkouts} WORKOUTS
            </span>
            <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">
              {stats.totalVolumeKg} KG VOLUME
            </span>
          </div>
        </div>

        <div className="space-y-3 font-sans">
          {workoutHistory.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
              No workouts logged yet. Select an exercise above to begin!
            </div>
          ) : (
            workoutHistory.map((record) => (
              <div
                key={record.id}
                className="bg-[#FBFBF8] rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <DumbbellIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-black">{record.exerciseName}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-sans mt-0.5">
                      <span>{record.timeFormatted}</span>
                      <span>•</span>
                      <span>{record.setsCompleted} sets x {record.repsPerSet} reps ({record.weightKg} kg)</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-700 font-bold">Form: {record.formAccuracyScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    {record.totalVolumeKg} kg volume
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                    {record.caloriesBurned} kcal
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GymTracePage;
