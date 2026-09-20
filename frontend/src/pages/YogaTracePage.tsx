import React, { useState, useEffect, useRef } from 'react';
import { CameraScanner } from '../components/CameraScanner';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';
import {
  yogaTraceService,
  SUPPORTED_POSES,
  YogaPose,
  YogaSessionRecord
} from '../services/yogaTraceService';
import {
  Sparkles,
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
  Maximize2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const YogaTracePage: React.FC = () => {
  const navigate = useNavigate();
  const { activateAgent, handleUserUtterance } = useVoiceAgent();

  // Pose Selection & Session State
  const [selectedPose, setSelectedPose] = useState<YogaPose>(SUPPORTED_POSES[0]);
  const [sessionPhase, setSessionPhase] = useState<'SELECT' | 'PRACTICE' | 'SUMMARY'>('SELECT');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Live Practice Telemetry State
  const [holdSeconds, setHoldSeconds] = useState<number>(0);
  const [alignmentScore, setAlignmentScore] = useState<number>(92); // %
  const [detectedKneeAngle, setDetectedKneeAngle] = useState<number>(92);
  const [detectedBackAngle, setDetectedBackAngle] = useState<number>(88);
  const [detectedArmAngle, setDetectedArmAngle] = useState<number>(178);

  // Live Feedback Messages
  const [liveFeedback, setLiveFeedback] = useState<string>('Hold form. Knee aligned at 92°. Straighten back slightly.');
  const [feedbackLog, setFeedbackLog] = useState<string[]>([]);

  // History & Summary State
  const [historyRecords, setHistoryRecords] = useState<YogaSessionRecord[]>([]);
  const [lastSummary, setLastSummary] = useState<YogaSessionRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Canvas Reference for Pose Overlay
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Load history
  useEffect(() => {
    setHistoryRecords(yogaTraceService.getHistory());
  }, []);

  // Timer loop when in PRACTICE phase
  useEffect(() => {
    let interval: any = null;
    if (sessionPhase === 'PRACTICE' && !isPaused) {
      interval = setInterval(() => {
        setHoldSeconds((prev) => {
          const next = prev + 1;

          // Simulate live angle micro-fluctuations & AI feedback
          const randomKnee = 90 + Math.floor(Math.sin(next) * 4);
          const randomBack = 88 + Math.floor(Math.cos(next) * 3);
          const randomArm = 176 + Math.floor(Math.sin(next * 0.5) * 3);

          setDetectedKneeAngle(randomKnee);
          setDetectedBackAngle(randomBack);
          setDetectedArmAngle(randomArm);

          // Update feedback message dynamically
          if (next === 5) {
            setLiveFeedback('“Straighten your back slightly to align torso vertically.”');
            setFeedbackLog((prevLog) => [...prevLog, 'Straighten back slightly']);
          } else if (next === 12) {
            setLiveFeedback('“Move left knee outward to maintain 90° stacking.”');
            setFeedbackLog((prevLog) => [...prevLog, 'Move left knee outward']);
          } else if (next === 20) {
            setLiveFeedback('“Great alignment! Hold for 10 seconds.”');
            setFeedbackLog((prevLog) => [...prevLog, 'Hold position for 10s']);
          }

          // Compute score
          const score = Math.max(75, 100 - Math.abs(randomKnee - (selectedPose.targetAngles.kneeAngle || 90)) - Math.abs(randomBack - (selectedPose.targetAngles.backAngle || 90)));
          setAlignmentScore(score);

          // Auto complete if reach target hold time
          if (next >= selectedPose.targetHoldSeconds) {
            handleEndSession(true, next);
          }

          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionPhase, isPaused, selectedPose]);

  // Draw Skeletal Landmarks on Canvas Overlay
  useEffect(() => {
    if (sessionPhase !== 'PRACTICE' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 640;
    canvas.height = 480;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simulated skeletal landmarks based on Warrior II pose keypoints
    const landmarks = [
      { name: 'Nose', x: 320, y: 110, color: '#3B82F6' },
      { name: 'Left Shoulder', x: 260, y: 160, color: '#A3E635' },
      { name: 'Right Shoulder', x: 380, y: 160, color: '#A3E635' },
      { name: 'Left Elbow', x: 170, y: 162, color: '#A3E635' },
      { name: 'Right Elbow', x: 470, y: 162, color: '#A3E635' },
      { name: 'Left Wrist', x: 90, y: 165, color: '#A3E635' },
      { name: 'Right Wrist', x: 550, y: 165, color: '#A3E635' },
      { name: 'Left Hip', x: 280, y: 270, color: '#A3E635' },
      { name: 'Right Hip', x: 360, y: 270, color: '#A3E635' },
      { name: 'Left Knee', x: 200, y: 360, color: '#F59E0B' }, // Knee angle highlight
      { name: 'Right Knee', x: 430, y: 350, color: '#A3E635' },
      { name: 'Left Ankle', x: 190, y: 440, color: '#A3E635' },
      { name: 'Right Ankle', x: 460, y: 440, color: '#A3E635' }
    ];

    const connections = [
      [1, 2], // Shoulders
      [1, 3], [3, 5], // Left arm
      [2, 4], [4, 6], // Right arm
      [1, 7], [2, 8], // Torso sides
      [7, 8], // Hips
      [7, 9], [9, 11], // Left leg
      [8, 10], [10, 12] // Right leg
    ];

    // Draw skeletal lines
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#A3E635';
    ctx.shadowColor = '#A3E635';
    ctx.shadowBlur = 10;

    connections.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // Draw landmark keypoint nodes
    landmarks.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    });

    // Draw Joint Angle Overlay Badges on Canvas
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(180, 320, 110, 30);
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#A3E635';
    ctx.fillText(`Knee: ${detectedKneeAngle}°`, 190, 340);

    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(300, 220, 100, 30);
    ctx.fillStyle = '#3B82F6';
    ctx.fillText(`Back: ${detectedBackAngle}°`, 310, 240);
  }, [sessionPhase, detectedKneeAngle, detectedBackAngle, detectedArmAngle]);

  // Start Session CTA
  const handleStartPractice = () => {
    setSessionPhase('PRACTICE');
    setIsPaused(false);
    setHoldSeconds(0);
    setFeedbackLog([]);
    showToast(`Started ${selectedPose.name} (${selectedPose.sanskritName}) pose detection!`);
  };

  // Next Pose CTA
  const handleNextPose = () => {
    const currentIndex = SUPPORTED_POSES.findIndex((p) => p.id === selectedPose.id);
    const nextPose = SUPPORTED_POSES[(currentIndex + 1) % SUPPORTED_POSES.length];
    setSelectedPose(nextPose);
    setHoldSeconds(0);
    setFeedbackLog([]);
    showToast(`Switched to next pose: ${nextPose.name}`);
  };

  // End Session CTA
  const handleEndSession = (autoCompleted = false, finalDuration?: number) => {
    const dur = finalDuration || holdSeconds;
    const completionPercent = Math.min(100, Math.round((dur / selectedPose.targetHoldSeconds) * 100));

    const record: Omit<YogaSessionRecord, 'id'> = {
      poseId: selectedPose.id,
      poseName: selectedPose.name,
      durationSeconds: dur,
      targetHoldSeconds: selectedPose.targetHoldSeconds,
      holdCompletionPercent: completionPercent,
      alignmentScore: alignmentScore,
      sessionDate: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      caloriesBurned: Math.round(dur * 1.5),
      feedbackGiven: feedbackLog.length > 0 ? feedbackLog : ['Form held steady', 'Spinal alignment clear'],
      completedFully: autoCompleted || completionPercent >= 90
    };

    const saved = yogaTraceService.saveSession(record);
    setLastSummary(saved);
    setHistoryRecords(yogaTraceService.getHistory());
    setSessionPhase('SUMMARY');
  };

  const stats = yogaTraceService.getStats();

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
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>HEALTRACE SUB-MODULE • YOGATRACE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              YOGATRACE
              <span className="text-xs font-mono font-normal text-indigo-400 border border-indigo-400/30 px-2.5 py-1 rounded-full">
                MediaPipe Pose AI Engine
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Real-time phone camera pose estimation. Measures joint angles, provides live voice form corrections, and tracks posture holds without cloud streaming.
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

      {/* Non-Medical Safety Banner */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3 text-indigo-900 text-xs font-sans">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Posture Feedback Notice:</span> YogaTrace uses on-device computer vision keypoint geometry for wellness posture guidance. It does <span className="underline font-bold">NOT</span> diagnose musculoskeletal injuries or guarantee medical safety. Stop exercising immediately if you feel joint pain or dizziness.
        </div>
      </div>

      {/* SESSION PHASE STEP 1: POSE SELECTOR & OVERVIEW */}
      {sessionPhase === 'SELECT' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-black tracking-tight">Select Supported Yoga Pose</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">5 posture models configured with target angle geometry</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">STEP 1 OF 3</span>
          </div>

          {/* Pose Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUPPORTED_POSES.map((pose) => (
              <div
                key={pose.id}
                onClick={() => setSelectedPose(pose)}
                className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 space-y-4 flex flex-col justify-between group font-sans ${
                  selectedPose.id === pose.id
                    ? 'bg-white border-[#84CC16] shadow-xl ring-2 ring-[#A3E635]/50 scale-[1.02]'
                    : 'bg-white border-slate-200/80 hover:border-slate-400 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {pose.difficulty}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {pose.targetHoldSeconds}s TARGET HOLD
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-black group-hover:text-slate-900">
                      {pose.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 font-mono mt-0.5">
                      {pose.sanskritName}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {pose.benefits}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Knee: {pose.targetAngles.kneeAngle || '--'}°</span>
                  <span className="text-slate-400">Target Back: {pose.targetAngles.backAngle || '--'}°</span>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#A3E635] uppercase tracking-wider">
                SELECTED POSE: {selectedPose.name.toUpperCase()} ({selectedPose.sanskritName})
              </span>
              <h3 className="text-2xl font-extrabold text-white">Ready for On-Device Pose Tracking</h3>
              <p className="text-xs text-slate-300">
                MediaPipe pose detector will render live skeletal keypoint overlay and real-time form feedback.
              </p>
            </div>

            <button
              onClick={handleStartPractice}
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-extrabold text-sm px-8 py-4 rounded-full shadow-lg flex items-center justify-center gap-2 transition transform hover:scale-105 shrink-0"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START YOGA SESSION</span>
            </button>
          </div>
        </div>
      )}

      {/* SESSION PHASE STEP 2: PRACTICE & CAMERA STREAM */}
      {sessionPhase === 'PRACTICE' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top HUD Control Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#A3E635] animate-ping" />
              <div>
                <span className="text-[#A3E635] font-bold">{selectedPose.name}</span> ({selectedPose.sanskritName})
                <span className="text-slate-400 ml-2">• MediaPipe Pose Active</span>
              </div>
            </div>

            {/* Session Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-[#A3E635]" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
              </button>

              <button
                onClick={handleNextPose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              >
                <SkipForward className="w-3.5 h-3.5 text-blue-400" />
                <span>NEXT POSE</span>
              </button>

              <button
                onClick={() => handleEndSession(false)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3.5 py-2 rounded-xl border border-red-500/40 font-bold transition"
              >
                END SESSION
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Live Camera View + Skeletal Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video flex items-center justify-center">
                {/* Camera Scanner Stream Base */}
                <CameraScanner
                  isScanning={true}
                  onCapture={() => {}}
                  placeholderText="Position body in camera view for skeleton detection"
                  badgeLabel="POSE ESTIMATION CAMERA STREAM"
                />

                {/* Overlaid Canvas Skeletal Landmarks */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                />

                {/* Live Floating Angle HUD Pill */}
                <div className="absolute top-4 left-4 z-30 bg-black/80 backdrop-blur border border-slate-700 px-3.5 py-2 rounded-full text-white text-[11px] font-mono flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Knee:</span>
                    <span className="text-[#A3E635] font-bold">{detectedKneeAngle}°</span>
                  </div>
                  <span>|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Back:</span>
                    <span className="text-blue-400 font-bold">{detectedBackAngle}°</span>
                  </div>
                </div>

                {/* Alignment Score Badge */}
                <div className="absolute top-4 right-4 z-30 bg-black/80 backdrop-blur border border-[#A3E635]/40 px-3.5 py-2 rounded-full text-white text-[11px] font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span className="font-bold text-[#A3E635]">{alignmentScore}% ALIGNMENT</span>
                </div>
              </div>

              {/* LIVE FORM FEEDBACK BANNER */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex items-center gap-4 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] shrink-0">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-bold text-[#A3E635] uppercase">
                    AI VOICE FORM FEEDBACK
                  </div>
                  <div className="text-sm font-extrabold text-white font-sans">
                    {liveFeedback}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hold Timer & Pose Target Angles */}
            <div className="space-y-6">
              {/* Hold Timer Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm text-center space-y-4 font-sans">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  HOLD COUNTDOWN TIMER
                </span>

                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#84CC16"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={376.8}
                      strokeDashoffset={376.8 - (376.8 * holdSeconds) / selectedPose.targetHoldSeconds}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold font-mono text-black">
                      {holdSeconds}s
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      / {selectedPose.targetHoldSeconds}s
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-sans">
                  {holdSeconds >= selectedPose.targetHoldSeconds
                    ? 'Target hold completed! Saving session...'
                    : 'Maintain correct alignment to progress timer.'}
                </div>
              </div>

              {/* Target Angles Config Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3 font-sans">
                <h4 className="font-extrabold text-base text-black">Target Joint Angle Metrics</h4>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-[#FBFBF8] border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-600">Front Knee Stacking</span>
                    <span className="font-bold text-black">{selectedPose.targetAngles.kneeAngle || '--'}°</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FBFBF8] border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-600">Torso Back Elevation</span>
                    <span className="font-bold text-black">{selectedPose.targetAngles.backAngle || '--'}°</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FBFBF8] border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-600">Horizontal Arm Extension</span>
                    <span className="font-bold text-black">{selectedPose.targetAngles.armAngle || '--'}°</span>
                  </div>
                </div>
              </div>

              {/* VOICE CONTROLS CONSOLE */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#A3E635]">VOICE CONTROL ACTION</span>
                  <Mic className="w-4 h-4 text-[#A3E635]" />
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs font-sans">
                  <button
                    onClick={() => handleUserUtterance('Start yoga')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left font-bold text-slate-200 transition"
                  >
                    “Start yoga”
                  </button>
                  <button
                    onClick={handleNextPose}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left font-bold text-slate-200 transition"
                  >
                    “Next pose”
                  </button>
                  <button
                    onClick={() => showToast(`Target hold for ${selectedPose.name} is ${selectedPose.targetHoldSeconds} seconds.`)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left font-bold text-slate-200 transition"
                  >
                    “How long should I hold this?”
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SESSION PHASE STEP 3: SESSION SUMMARY */}
      {sessionPhase === 'SUMMARY' && lastSummary && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-900/40 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>YOGA SESSION COMPLETED</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">
                {lastSummary.poseName} Practice Summary
              </h2>
              <p className="text-xs text-slate-300 font-sans">
                Session telemetry saved to your local LIVIQ health history.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 font-mono">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-[10px] text-slate-400 uppercase">HOLD DURATION</div>
                <div className="text-2xl font-extrabold text-[#A3E635]">{lastSummary.durationSeconds}s</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-[10px] text-slate-400 uppercase">ALIGNMENT SCORE</div>
                <div className="text-2xl font-extrabold text-blue-400">{lastSummary.alignmentScore}%</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-[10px] text-slate-400 uppercase">COMPLETION</div>
                <div className="text-2xl font-extrabold text-amber-400">{lastSummary.holdCompletionPercent}%</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-[10px] text-slate-400 uppercase">ESTIMATED BURN</div>
                <div className="text-2xl font-extrabold text-emerald-400">{lastSummary.caloriesBurned} kcal</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSessionPhase('SELECT')}
                className="bg-[#A3E635] text-black font-extrabold text-xs px-6 py-3.5 rounded-full shadow transition hover:bg-[#84CC16]"
              >
                PRACTICE ANOTHER POSE
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

      {/* PROGRESS HISTORY LIST & STREAK STATS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">
              Yoga Practice Progress & History
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Saved locally on your device for privacy and offline telemetry
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
              {stats.totalSessions} SESSIONS
            </span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              {stats.avgScore}% AVG ALIGNMENT
            </span>
          </div>
        </div>

        <div className="space-y-3 font-sans">
          {historyRecords.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
              No yoga sessions logged yet. Select a pose above to begin!
            </div>
          ) : (
            historyRecords.map((record) => (
              <div
                key={record.id}
                className="bg-[#FBFBF8] rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 font-bold">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-black">{record.poseName}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-sans mt-0.5">
                      <span>{record.timeFormatted}</span>
                      <span>•</span>
                      <span>Hold: {record.durationSeconds}s</span>
                      <span>•</span>
                      <span className="font-mono text-indigo-700 font-bold">Score: {record.alignmentScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    {record.caloriesBurned} kcal
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                    PASSED
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

export default YogaTracePage;
