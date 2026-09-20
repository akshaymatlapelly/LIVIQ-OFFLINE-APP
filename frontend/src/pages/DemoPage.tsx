import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  liviqDemoService,
  DEMO_STEPS,
  DemoStep
} from '../services/liviqDemoService';
import {
  PlayCircle,
  Pause,
  RotateCcw,
  WifiOff,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  Pill,
  HeartPulse,
  Clock,
  Mic,
  Volume2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Cpu,
  Layers,
  FileText,
  Navigation,
  Download,
  Activity,
  Droplets,
  Zap,
  Info
} from 'lucide-react';

export const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isOffline, setIsOffline] = useState(liviqDemoService.getForcedOffline());
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [activeVoiceIntent, setActiveVoiceIntent] = useState<string>('');
  
  // HEALTRACE specific demo state
  const [holdTimer, setHoldTimer] = useState<number>(10);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [waterLevel, setWaterLevel] = useState<number>(1.6);
  const [teluguAudioPlaying, setTeluguAudioPlaying] = useState<boolean>(false);

  const insightData = liviqDemoService.getInsightData();
  const medSureData = liviqDemoService.getMedSureData();
  const healTraceData = liviqDemoService.getHealTraceData();
  const replayData = liviqDemoService.getReplayData();

  const currentStep: DemoStep = DEMO_STEPS[currentStepIdx];

  // Auto-play timer loop for presentation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAuto) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < DEMO_STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsPlayingAuto(false);
            return prev;
          }
        });
      }, 12000); // 12 seconds per step in auto mode
    }
    return () => clearInterval(interval);
  }, [isPlayingAuto]);

  // Hold timer countdown for Yoga pose demo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && holdTimer > 0) {
      timer = setInterval(() => setHoldTimer((prev) => prev - 1), 1000);
    } else if (holdTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, holdTimer]);

  const toggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    liviqDemoService.setForcedOffline(next);
  };

  const handleVoiceCommandTrigger = (cmd: string, intent: string, targetStepIdx: number) => {
    setTranscript(`"${cmd}"`);
    setActiveVoiceIntent(intent);
    setCurrentStepIdx(targetStepIdx);

    // Speak audio feedback if Web Speech API is supported
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Voice command recognized: ${cmd}`);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakTelugu = () => {
    setTeluguAudioPlaying(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(medSureData.teluguExplanationText);
      utterance.lang = 'te-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setTeluguAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setTeluguAudioPlaying(false), 4000);
    }
  };

  const handleLogWater = () => {
    setWaterLevel(2.1);
    setTranscript('"I drank 500 ml water."');
    setActiveVoiceIntent('ADD_WATER_500ML');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24 animate-fadeIn font-sans">
      {/* HACKATHON DEMO HEADER & WOW MOMENT OFFLINE CONTROL */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
              <PlayCircle className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>HACKATHON PRESENTATION DEMO MODE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              LIVIQ DEMO ENVIRONMENT
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Demonstrate LIVIQ's complete on-device health intelligence stack in a 5–7 minute presentation. Preloaded with realistic datasets and interactive offline simulation.
            </p>
          </div>

          {/* WOW MOMENT: OFFLINE MODE CONTROL CARD */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl space-y-3 shadow-lg min-w-[300px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300">
                {isOffline ? (
                  <WifiOff className="w-4 h-4 text-amber-400" />
                ) : (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                )}
                <span>INTERNET STATUS</span>
              </div>

              <button
                onClick={toggleOffline}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isOffline ? 'bg-amber-500' : 'bg-slate-700'
                }`}
                title="Toggle Offline Mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isOffline ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-1 border-t border-slate-800 flex items-center justify-between font-mono text-[11px]">
              <span className={isOffline ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                {isOffline ? 'OFFLINE MODE (ACTIVE)' : 'ONLINE BOOST'}
              </span>
              <span className="text-[10px] text-slate-400">SNAPDRAGON 38 TOPS</span>
            </div>

            {isOffline && (
              <div className="text-[10px] text-amber-300/90 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40 flex items-start gap-1.5 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">WOW MOMENT ACTIVE:</strong> Core LIVIQ vision, OCR, pose, & voice intelligence are running 100% on-device!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CONTROLS BAR: AUTO PLAY & DEMO CHIPS */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlayingAuto(!isPlayingAuto)}
              className={`px-5 py-2.5 rounded-full font-sans text-xs font-extrabold flex items-center gap-2 transition ${
                isPlayingAuto
                  ? 'bg-amber-400 text-black hover:bg-amber-500'
                  : 'bg-[#A3E635] text-black hover:bg-[#84CC16]'
              }`}
            >
              {isPlayingAuto ? <Pause className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              <span>{isPlayingAuto ? 'PAUSE GUIDED TOUR' : 'START GUIDED TOUR (5 MIN)'}</span>
            </button>

            <button
              onClick={() => setCurrentStepIdx(0)}
              className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET DEMO</span>
            </button>
          </div>

          {/* VOICE TRIGGER PRESETS */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 text-[11px]">VOICE TRIGGERS:</span>
            <button
              onClick={() => handleVoiceCommandTrigger('Scan this accident.', 'INSIGHT_SCAN', 0)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[#A3E635] border border-slate-700 transition"
            >
              "Scan accident"
            </button>
            <button
              onClick={() => handleVoiceCommandTrigger('Scan this medicine and explain it in Telugu.', 'MEDSURE_TELUGU', 1)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[#A3E635] border border-slate-700 transition"
            >
              "Scan medicine (Telugu)"
            </button>
            <button
              onClick={() => handleVoiceCommandTrigger('Start yoga.', 'START_YOGA', 2)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[#A3E635] border border-slate-700 transition"
            >
              "Start yoga"
            </button>
            <button
              onClick={() => handleVoiceCommandTrigger('Replay my last 7 days.', 'HEALTH_REPLAY', 3)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[#A3E635] border border-slate-700 transition"
            >
              "Replay 7 days"
            </button>
          </div>
        </div>
      </div>

      {/* LIVE VOICE TRANSCRIPT FEEDBACK BAR (IF TRIGGERED) */}
      {transcript && (
        <div className="bg-black text-white p-4 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between animate-fadeIn text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#A3E635]/20 text-[#A3E635] flex items-center justify-center animate-pulse">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">UNIVERSAL VOICE ENGINE:</span>
              <div className="text-white font-bold">{transcript}</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#A3E635] text-black font-extrabold text-[10px]">
            INTENT: {activeVoiceIntent}
          </div>
        </div>
      )}

      {/* DEMO PROGRESS INDICATOR STEPPER */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {DEMO_STEPS.map((s, idx) => {
          const isActive = currentStepIdx === idx;
          const isCompleted = idx < currentStepIdx;

          return (
            <button
              key={s.id}
              onClick={() => setCurrentStepIdx(idx)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? 'bg-black text-white border-black shadow-lg ring-2 ring-[#A3E635]'
                  : isCompleted
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isActive ? 'bg-[#A3E635] text-black' : isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'
                }`}>
                  {s.badge}
                </span>
                <span className="text-[10px] text-slate-400">{s.duration}</span>
              </div>

              <div className="text-xs font-extrabold truncate text-slate-900 font-sans" style={{ color: isActive ? '#FFFFFF' : undefined }}>
                {s.key}
              </div>

              <div className="text-[10px] opacity-75 truncate mt-0.5">
                {s.voiceTrigger}
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#A3E635] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* ACTIVE DEMO DISPLAY CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-8 font-sans">
        {/* STEP TITLE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black text-[#A3E635]">
                ACTIVE SCENARIO: STEP 0{currentStep.id} OF 04
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                {currentStep.key}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-black tracking-tight">{currentStep.title}</h2>
            <p className="text-xs text-slate-600">{currentStep.subtitle}</p>
          </div>

          <button
            onClick={() => {
              if (currentStep.key === 'INSIGHT') navigate('/insight');
              else if (currentStep.key === 'MEDSURE') navigate('/medsure');
              else if (currentStep.key === 'HEALTRACE') navigate('/healtrace');
              else navigate('/replay');
            }}
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans font-extrabold text-xs flex items-center gap-2 border border-slate-200 transition"
          >
            <span>OPEN FULL MODULE</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        {/* ---------------- DEMO 1: INSIGHT SCENARIO ---------------- */}
        {currentStep.key === 'INSIGHT' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Simulated Camera Viewport */}
              <div className="relative rounded-2xl bg-black overflow-hidden aspect-video border border-slate-800 shadow-inner flex flex-col justify-between p-4 text-white">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                
                {/* Visual Bounding Box Scanner Beam */}
                <div className="absolute inset-x-8 top-1/4 bottom-1/4 border-2 border-dashed border-[#A3E635] rounded-xl flex items-center justify-center animate-pulse">
                  <span className="bg-black/80 text-[#A3E635] text-[10px] font-mono px-3 py-1 rounded-md font-bold">
                    IMPACT DEFORMATION DETECTED (98.2%)
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2.5 py-1 rounded bg-red-600 text-white font-bold flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    LIVE NPU VISION STREAM
                  </span>
                  <span className="px-2 py-1 rounded bg-black/60 text-emerald-400 border border-emerald-500/40">
                    38 TOPS • LOCAL INFERENCE
                  </span>
                </div>

                <div className="relative z-10 space-y-1 font-mono text-xs">
                  <div className="text-white font-bold">SCENARIO: "Scan this accident."</div>
                  <div className="text-slate-300 text-[11px]">Location: Cyber Towers Junction, HITEC City</div>
                </div>
              </div>

              {/* Structured Incident Triage Results */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">INCIDENT TRIAGE</span>
                    <span className="text-xs font-mono font-extrabold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                      {insightData.severity}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-black">{insightData.incidentType}</h3>

                  <div className="space-y-1 text-xs text-slate-700 font-sans">
                    <div className="font-bold text-slate-900">Visible Observations:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                      {insightData.observations.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Location Lock & Facility Auto-Selection */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#A3E635] font-bold">
                      <MapPin className="w-4 h-4" />
                      <span>GPS LOCATION LOCK</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{insightData.location.lat}° N, {insightData.location.lng}° E</span>
                  </div>
                  <div className="text-xs text-slate-300">{insightData.location.address}</div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{insightData.facility.name}</div>
                      <div className="text-[11px] text-slate-400">{insightData.facility.distance} • {insightData.facility.eta}</div>
                    </div>
                    <button className="px-3.5 py-2 rounded-full bg-[#A3E635] text-black font-extrabold text-xs hover:bg-[#84CC16]">
                      CONNECT 108
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Speak for Me Card */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-900 uppercase">EMERGENCY "SPEAK FOR ME" CARD</span>
                <div className="text-xs text-amber-950 font-medium">"{insightData.speakForMeText.en}"</div>
              </div>
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance(insightData.speakForMeText.en);
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="px-4 py-2 rounded-full bg-amber-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-amber-950 shrink-0"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>BROADCAST SPEECH</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------- DEMO 2: MEDSURE SCENARIO ---------------- */}
        {currentStep.key === 'MEDSURE' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medicine Scan Card */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 font-sans relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-[#A3E635]" />
                    <span className="font-mono text-xs font-bold text-[#A3E635]">MEDICINE SCANNER</span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    OCR CONFIDENCE {medSureData.confidence}%
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-white">{medSureData.medicineName}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{medSureData.dosage} • {medSureData.manufacturer}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400">BATCH / LOT</div>
                    <div className="text-white font-bold">{medSureData.batchNo}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">EXPIRY DATE</div>
                    <div className="text-emerald-400 font-bold">{medSureData.expiryDate}</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-xs font-bold text-slate-200">Warnings & Usage Rules:</div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {medSureData.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Telugu Voice Explanation Output Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 font-sans flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">TELUGU VOICE EXPLANATION</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold">
                      te-IN NPU SYNTHESIS
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FBFBF8] border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-900">తెలుగు వివరణ (Telugu Script):</div>
                    <p className="text-sm font-sans text-slate-800 leading-relaxed font-semibold">
                      "{medSureData.teluguExplanationText}"
                    </p>
                  </div>

                  <p className="text-xs text-slate-600">
                    LIVIQ translates clinical drug profiles into local vernacular speech on-device, empowering patients who prefer non-English audio explanations.
                  </p>
                </div>

                <button
                  onClick={handleSpeakTelugu}
                  disabled={teluguAudioPlaying}
                  className={`w-full py-3 rounded-full font-sans font-extrabold text-xs flex items-center justify-center gap-2 transition ${
                    teluguAudioPlaying
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-black text-[#A3E635] hover:bg-slate-900'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-[#A3E635]" />
                  <span>{teluguAudioPlaying ? 'PLAYING TELUGU VOICE...' : 'PLAY TELUGU VOICE EXPLANATION'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- DEMO 3: HEALTRACE SCENARIO ---------------- */}
        {currentStep.key === 'HEALTRACE' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MediaPipe Pose Estimation Viewport */}
              <div className="relative rounded-2xl bg-slate-950 overflow-hidden aspect-video border border-slate-800 shadow-inner p-4 text-white flex flex-col justify-between">
                {/* Visual Skeleton Keypoints Overlay Simulation */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                  <div className="w-32 h-64 border-2 border-emerald-400 rounded-full relative flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#A3E635] absolute top-2" />
                    <div className="w-1 h-32 bg-[#A3E635]" />
                    <div className="w-16 h-1 bg-[#A3E635] absolute top-12" />
                    <div className="w-12 h-1 bg-[#A3E635] absolute bottom-12 -rotate-45" />
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2.5 py-1 rounded bg-black/80 text-[#A3E635] font-bold border border-emerald-500/40">
                    MEDIAPIPE POSE CANVAS
                  </span>
                  <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300">
                    HIP: {healTraceData.jointAngles.hipAngle}° • KNEE: {healTraceData.jointAngles.kneeAngle}°
                  </span>
                </div>

                <div className="relative z-10 space-y-2 text-center my-auto">
                  <div className="text-xs font-mono text-slate-300">TARGET POSE:</div>
                  <div className="text-2xl font-extrabold text-white">{healTraceData.poseName}</div>

                  {/* Hold Timer Countdown */}
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-black/90 border border-slate-700">
                    <span className="text-3xl font-extrabold font-mono text-[#A3E635]">{holdTimer}s</span>
                    <button
                      onClick={() => {
                        setHoldTimer(10);
                        setIsTimerRunning(true);
                      }}
                      className="px-3 py-1 rounded-full bg-[#A3E635] text-black font-extrabold text-xs hover:bg-[#84CC16]"
                    >
                      {isTimerRunning ? 'RESTART' : 'START HOLD'}
                    </button>
                  </div>
                </div>

                <div className="relative z-10 font-mono text-[11px] text-emerald-400 bg-black/60 p-2 rounded-lg text-center">
                  VOICE FORM FEEDBACK: "Keep hips square. Excellent posture alignment!"
                </div>
              </div>

              {/* Hydration Logging & Voice Action Panel */}
              <div className="p-6 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-5 font-sans">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <span className="font-mono text-xs font-bold text-black">HYDRATETRACE LOGGING</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    VOICE LOGGED
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">DAILY WATER INTAKE PROGRESS:</span>
                    <span className="text-black font-extrabold">{waterLevel.toFixed(1)}L / 2.5L</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(waterLevel / 2.5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">Simulate Voice Input:</div>
                  <button
                    onClick={handleLogWater}
                    className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>SPEAK: "I drank 500 ml water"</span>
                  </button>
                </div>

                <button
                  onClick={() => handleVoiceCommandTrigger('Replay my last 7 days.', 'HEALTH_REPLAY', 3)}
                  className="w-full py-3 rounded-full bg-black text-[#A3E635] hover:bg-slate-900 font-sans font-extrabold text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>PROCEED TO STEP 4: HEALTH REPLAY</span>
                  <ArrowRight className="w-4 h-4 text-[#A3E635]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- DEMO 4: HEALTH REPLAY SCENARIO ---------------- */}
        {currentStep.key === 'HEALTH_REPLAY' && (
          <div className="space-y-6">
            {/* Personal Baseline & Health Drift Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <div className="p-5 rounded-2xl bg-black text-white space-y-3">
                <span className="text-[10px] font-mono font-bold text-[#A3E635] uppercase">MY USUAL PATTERN (PERSONAL BASELINE)</span>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <div className="text-slate-400">TYPICAL SLEEP</div>
                    <div className="text-white font-bold text-sm">{replayData.personalBaseline.sleep}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">TYPICAL WATER</div>
                    <div className="text-white font-bold text-sm">{replayData.personalBaseline.water}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">TYPICAL ACTIVITY</div>
                    <div className="text-white font-bold text-sm">{replayData.personalBaseline.activity}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">TYPICAL WORKOUT</div>
                    <div className="text-white font-bold text-sm">{replayData.personalBaseline.workout}</div>
                  </div>
                </div>
              </div>

              {/* Health Drift Alert */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-900 uppercase">HEALTH DRIFT OBSERVATION</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    NON-DIAGNOSTIC
                  </span>
                </div>

                <div className="text-sm font-extrabold text-amber-950">
                  "Sleep & activity have been below your recent pattern."
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {replayData.healthDrift.description}
                </p>
              </div>
            </div>

            {/* 7-Day Interactive Timeline Reconstruction */}
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-black">7-Day Health Replay Timeline</h3>
                <span className="text-xs font-mono text-slate-500">CHRONOLOGICAL EVENT RECONSTRUCTION</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 font-mono text-xs">
                {replayData.weeklyReplay.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl border ${
                      i >= 3 ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="font-extrabold text-black flex justify-between">
                      <span>{d.day}</span>
                      <span className="text-[9px] text-slate-400">{d.energy}</span>
                    </div>
                    <div className="text-[11px] mt-1 space-y-0.5">
                      <div>💤 {d.sleep}</div>
                      <div>🏃 {d.activity}</div>
                      <div>💧 {d.water}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What You Could Try Card */}
            <div className="p-5 rounded-2xl bg-emerald-950 text-white space-y-2 font-sans border border-emerald-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#A3E635]">
                <Sparkles className="w-4 h-4 text-[#A3E635]" />
                <span>WHAT YOU COULD TRY</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                "{replayData.suggestedAction}"
              </p>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 font-sans">
          <button
            onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>PREVIOUS DEMO STEP</span>
          </button>

          <div className="text-xs font-mono text-slate-500">
            DEMO STEP {currentStepIdx + 1} OF 4
          </div>

          <button
            onClick={() => setCurrentStepIdx((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1))}
            disabled={currentStepIdx === DEMO_STEPS.length - 1}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#A3E635] hover:bg-[#84CC16] text-black font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-30 transition transform hover:scale-105"
          >
            <span>NEXT DEMO STEP</span>
            <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
