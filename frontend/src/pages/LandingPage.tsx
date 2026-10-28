import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Pill,
  HeartPulse,
  ArrowUpRight,
  ArrowRight,
  Camera,
  Cpu,
  Brain,
  ShieldAlert,
  Volume2,
  CheckCircle2,
  ScanLine,
  WifiOff
} from 'lucide-react';
import { GlobalVoiceWidget } from '../features/voice/GlobalVoiceWidget';

export const LandingPage: React.FC = () => {
  const capabilities = [
    {
      id: '01',
      title: 'INSIGHT',
      layer: 'Layer 1',
      subtitle: 'Emergency Response Intelligence',
      description: 'On-device optical frame extraction for physical trauma framing, injury evaluation, and instant emergency protocols.',
      icon: AlertTriangle,
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
      path: '/insight',
    },
    {
      id: '02',
      title: 'MEDSURE',
      layer: 'Layer 2',
      subtitle: 'Medicine Understanding & Safety',
      description: 'Macro-lens packaging verification, micro-printing kerning alignment, pill identification, allergen conflict detection, and counterfeit screening.',
      icon: Pill,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      path: '/medsure',
    },
    {
      id: '03',
      title: 'HEALTRACE',
      layer: 'Layer 3',
      subtitle: 'Everyday Health Intelligence',
      description: 'Continuous everyday health signal ingestion, medical lab report OCR parsing, daily vital tracking, and long-term physiological trends.',
      icon: HeartPulse,
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      path: '/healtrace',
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBF8] text-slate-900 selection:bg-lime-200 selection:text-slate-900 font-sans">
      {/* Floating Pill Navigation Header */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4">
        <header className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full px-6 py-3 shadow-md flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-mono font-black text-lg tracking-tight text-slate-950">
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-xs relative">
              <span className="w-2 h-2 rounded-full bg-[#A3E635] absolute -top-0.5 -right-0.5" />
              LQ
            </div>
            <span className="font-extrabold font-sans text-xl tracking-tight text-black">
              LIVIQ<span className="text-[#84CC16]">.</span>
            </span>
          </Link>

          {/* Center Navigation links */}
          <nav className="hidden md:flex items-center gap-7 font-sans text-xs font-semibold text-slate-600">
            <a href="#layers" className="hover:text-black transition">Health Layers</a>
            <a href="#how-it-works" className="hover:text-black transition">How It Works</a>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4">
            <Link to="/signin" className="font-sans text-xs font-bold text-slate-700 hover:text-black transition">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans text-xs font-extrabold px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-[#A3E635]/20 border border-[#84CC16] transition transform hover:scale-105"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-black stroke-[3]" />
            </Link>
          </div>
        </header>
      </div>

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 px-6 text-center relative overflow-hidden">
        {/* Soft Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#A3E635]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A3E635]/15 border border-[#84CC16]/40 text-black font-sans text-xs font-bold shadow-xs">
            <WifiOff className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            <span className="font-mono uppercase tracking-wide text-black">100% OFFLINE-FIRST PLATFORM</span>
            <span className="ml-1 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-black uppercase tracking-wider">
              DEMO WEBSITE
            </span>
          </div>

          {/* Giant Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black leading-[1.08]">
            One Phone. Three Layers of <br />
            <span className="inline-flex items-baseline mt-2">
              <span className="bg-gradient-to-r from-[#84CC16]/30 via-[#A3E635]/50 to-[#84CC16]/30 text-black px-4 py-1.5 rounded-3xl border border-[#84CC16]/40 shadow-sm inline-block">
                Health Intelligence
              </span>
              <span className="w-2.5 h-12 md:h-16 bg-[#84CC16] inline-block ml-2 animate-pulse rounded-sm" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            LIVIQ is a phone-first AI health intelligence platform that runs 100% offline — helping people respond to emergencies, understand medicines, and connect everyday health signals into one continuous health timeline without cloud dependency.
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-extrabold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-[#A3E635]/30 border border-[#84CC16] flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <span>Explore LIVIQ</span>
              <ArrowUpRight className="w-4 h-4 text-black stroke-[3]" />
            </Link>

            <a
              href="#how-it-works"
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-sans font-bold text-sm px-6 py-3.5 rounded-full shadow-xs flex items-center gap-2 transition"
            >
              <span>See how it works</span>
              <ArrowRight className="w-4 h-4 text-[#84CC16] stroke-[3]" />
            </a>
          </div>

          {/* Subtext tag */}
          <div className="text-xs font-sans text-slate-600 font-medium flex items-center justify-center gap-2 flex-wrap pt-1">
            <span className="font-mono font-extrabold text-black bg-[#A3E635]/30 px-3.5 py-1 rounded-full border border-[#84CC16]/40 shadow-2xs flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-black" />
              <span>100% OFFLINE OPERATIONAL</span>
            </span>
            <span>·</span>
            <span className="font-mono font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
              ⚡ DEMO WEBSITE & PROTOTYPE
            </span>
            <span>·</span>
            <span className="font-bold text-slate-800">On-device NPU Local Processing</span>
            <span>·</span>
            <span className="font-bold text-slate-800">8 Multi-Lingual Languages</span>
          </div>
        </div>
      </section>

      {/* SECTION: 100% OFFLINE OPERATIONAL BANNER */}
      <section className="py-14 px-6 bg-gradient-to-r from-slate-950 via-black to-slate-950 text-white border-t border-b border-slate-800 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2.5 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] text-xs font-mono font-bold">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE HARDWARE ENGINE</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Runs 100% Offline — <span className="text-[#A3E635]">No Internet Required</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
              LIVIQ processes vision scans, medicine OCR, posture tracking, and voice intent completely inside your browser and smartphone NPU. Zero cloud servers needed.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 border border-[#A3E635]/30 text-center space-y-1">
              <div className="text-2xl font-extrabold text-[#A3E635] font-mono">0 ms</div>
              <div className="text-[10px] text-slate-300 font-sans font-bold uppercase">Cloud Latency</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-[#A3E635]/30 text-center space-y-1">
              <div className="text-2xl font-extrabold text-[#A3E635] font-mono">100%</div>
              <div className="text-[10px] text-slate-300 font-sans font-bold uppercase">Local Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 3 LAYERS BREAKDOWN */}
      <section id="layers" className="py-24 px-6 border-t border-slate-200/60 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">LIVIQ ARCHITECTURE</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight">
              Three Layers of Continuous Health Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.id} className="bg-[#FBFBF8] rounded-3xl p-7 border border-slate-200/80 hover:border-[#84CC16] shadow-sm flex flex-col justify-between space-y-6 transition group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold text-black bg-[#A3E635]/20 px-2.5 py-0.5 rounded-full border border-[#84CC16]/40">{cap.layer}</span>
                      <div className="p-3 rounded-2xl bg-black text-[#A3E635] shadow-sm group-hover:scale-110 transition">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="font-sans font-extrabold text-xl text-black">
                      {cap.title}
                    </h3>
                    <div className="text-xs font-semibold text-slate-500">{cap.subtitle}</div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {cap.description}
                    </p>
                  </div>

                  <Link
                    to={cap.path}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-full bg-black hover:bg-slate-800 text-[#A3E635] text-xs font-sans font-extrabold transition shadow-sm border border-slate-800"
                  >
                    <span>Launch {cap.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#A3E635] stroke-[3]" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS MECHANISM */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-200/60 bg-[#FBFBF8]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-[#A3E635] font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
              <ScanLine className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>THE LIVIQ MECHANISM</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight leading-tight">
              How LIVIQ Intelligence Works
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-sans leading-relaxed">
              From physical world sensor capture to on-device NPU processing and instant real-world action — understand the 5-step end-to-end AI mechanism.
            </p>
          </div>

          {/* 5-Step Mechanism Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-[#84CC16] shadow-sm space-y-4 flex flex-col justify-between transition group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#A3E635]/20 text-black border border-[#84CC16]/40">
                    STEP 01
                  </span>
                  <div className="p-2.5 rounded-2xl bg-black text-[#A3E635] group-hover:scale-110 transition">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-black font-sans">1. Point & Capture</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Aim your phone camera or speak a command. Captures live optical frames, mic audio, and document OCR.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-500 font-extrabold uppercase">
                SENSOR INGESTION
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-[#84CC16] shadow-sm space-y-4 flex flex-col justify-between transition group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#A3E635]/20 text-black border border-[#84CC16]/40">
                    STEP 02
                  </span>
                  <div className="p-2.5 rounded-2xl bg-black text-[#A3E635] group-hover:scale-110 transition">
                    <Cpu className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-black font-sans">2. On-Device NPU</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  38 TOPS local NPU runs computer vision, MediaPipe pose detection, and text extraction 100% offline.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-500 font-extrabold uppercase">
                38 TOPS COMPUTE
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-[#84CC16] shadow-sm space-y-4 flex flex-col justify-between transition group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#A3E635]/20 text-black border border-[#84CC16]/40">
                    STEP 03
                  </span>
                  <div className="p-2.5 rounded-2xl bg-black text-[#A3E635] group-hover:scale-110 transition">
                    <Brain className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-black font-sans">3. Understand</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Cross-references inputs with medical knowledge graphs, pill databases, and your personal baseline.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-500 font-extrabold uppercase">
                AI REASONING CORE
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-[#84CC16] shadow-sm space-y-4 flex flex-col justify-between transition group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#A3E635]/20 text-black border border-[#84CC16]/40">
                    STEP 04
                  </span>
                  <div className="p-2.5 rounded-2xl bg-black text-[#A3E635] group-hover:scale-110 transition">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-black font-sans">4. Evaluate Risk</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Calculates emergency severity ratings, pill safety badges, and detects health drift flags in real-time.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-500 font-extrabold uppercase">
                RISK TRIAGE MATRIX
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-[#84CC16] shadow-sm space-y-4 flex flex-col justify-between transition group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#A3E635]/20 text-black border border-[#84CC16]/40">
                    STEP 05
                  </span>
                  <div className="p-2.5 rounded-2xl bg-black text-[#A3E635] group-hover:scale-110 transition">
                    <Volume2 className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-black font-sans">5. Act & Direct</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Speaks voice feedback in your language, dials trauma facilities, and logs telemetry to your pattern replay.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-500 font-extrabold uppercase">
                MULTILINGUAL ACTION
              </div>
            </div>
          </div>

          {/* Deep-Dive Mechanism Technical Card */}
          <div className="bg-black rounded-3xl p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#A3E635] uppercase tracking-wider">OFFLINE ARCHITECTURE</span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                  Why LIVIQ Works Completely Offline
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
                <span>100% PRIVATE ON-DEVICE NPU</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 text-xs font-sans">
              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="font-bold text-white text-sm">Zero Cloud Transmission</div>
                <p className="text-slate-400 leading-relaxed">
                  Your medical scans, packaging photos, and voice notes never leave your smartphone hardware.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="font-bold text-white text-sm">Instant Millisecond Response</div>
                <p className="text-slate-400 leading-relaxed">
                  Eliminates network latency delays during time-critical medical triage or workout rep tracking.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="font-bold text-white text-sm">8 Native Voice Languages</div>
                <p className="text-slate-400 leading-relaxed">
                  On-device speech engine recognizes and responds in English, Telugu, Hindi, and 5 additional languages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-white text-center font-sans text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono font-bold text-black text-sm">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
            LIVIQ Health Intelligence Platform
          </div>
          <div className="flex items-center gap-2">
            <span>© 2026 LIVIQ Health Inc.</span>
            <span className="font-mono font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 text-[10px]">
              DEMO WEBSITE
            </span>
          </div>
        </div>
      </footer>

      {/* Global LIVIQ Voice Agent */}
      <GlobalVoiceWidget />
    </div>
  );
};

