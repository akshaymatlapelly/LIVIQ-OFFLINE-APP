import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  Pill,
  HeartPulse,
  Clock,
  Mic,
  PlayCircle,
  Layers,
  X,
  ExternalLink,
  Film,
  Maximize,
  Minimize
} from 'lucide-react';

interface CapabilityModule {
  num: string;
  title: string;
  layer: string;
  subtitle: string;
  icon: any;
  path: string;
  sensor: string;
  workflow: string;
  badgeColor: string;
  videoUrl: string;
}

export const HowItWorksPage: React.FC = () => {
  const [activeVideoModule, setActiveVideoModule] = useState<CapabilityModule | null>(null);
  const [videoFitMode, setVideoFitMode] = useState<'cover' | 'contain'>('cover');
  const [useDirectVideo, setUseDirectVideo] = useState<boolean>(true);

  const capabilities: CapabilityModule[] = [
    {
      num: '01',
      title: 'INSIGHT',
      layer: 'Layer 1',
      subtitle: 'Emergency Response Intelligence',
      icon: AlertTriangle,
      path: '/insight',
      sensor: 'Camera Vision + Thermal Color Framing',
      workflow: 'Frames acute physical trauma, injury severity, and tissue inflammation. Evaluates depth & outputs immediate emergency protocols.',
      badgeColor: 'bg-rose-50 text-rose-900 border-rose-200',
      videoUrl: '/INSIGHT-VIDEO.mp4'
    },
    {
      num: '02',
      title: 'MEDSURE',
      layer: 'Layer 2',
      subtitle: 'Medicine Understanding & Safety',
      icon: Pill,
      path: '/medsure',
      sensor: 'Macro Strobe Lens + OCR Micro-Kerning',
      workflow: 'Screens blister packaging micro-printing, anti-tamper seals, dosage schedules, and allergen conflict warnings.',
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      videoUrl: '/MEDSURE-VIDEO.mp4'
    },
    {
      num: '03',
      title: 'HEALTRACE',
      layer: 'Layer 3',
      subtitle: 'Everyday Health Intelligence',
      icon: HeartPulse,
      path: '/healtrace',
      sensor: 'Document OCR + Vital Signal Ingestion',
      workflow: 'Transforms medical lab report prints, clinical summaries, and routine vital checks into a continuous health trajectory.',
      badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
      videoUrl: '/HEALTRACE-VIDEO.mp4'
    }
  ];

  const pipelineSteps = [
    { step: '01', name: 'POINT', desc: 'Frame physical symptom, pill blister, or lab report with smartphone camera' },
    { step: '02', name: 'SENSE', desc: 'Capture high-resolution optical frames & ambient lighting' },
    { step: '03', name: 'UNDERSTAND', desc: 'Run on-device NPU neural network inference for instant classification' },
    { step: '04', name: 'DECIDE', desc: 'Assess risk levels, packaging authenticity, and biomarker bounds' },
    { step: '05', name: 'ACT', desc: 'Trigger emergency triage protocol, dosage log, or timeline entry' }
  ];

  const getGoogleDriveId = (url: string) => {
    if (!url) return null;
    const match = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const getDirectVideoUrl = (url: string) => {
    const fileId = getGoogleDriveId(url);
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return url;
  };

  const getEmbedUrl = (url: string) => {
    const fileId = getGoogleDriveId(url);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>LIVIQ HEALTH ARCHITECTURE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            HOW LIVIQ WORKS
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Discover how LIVIQ combines phone-first optical sensing, 38 TOPS local NPU processing, and multi-lingual voice intelligence into three continuous health layers.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs font-extrabold text-[#A3E635]">
            <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-white">
              CORE PIPELINE:
            </span>
            <span className="bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              POINT → SENSE → UNDERSTAND → DECIDE → ACT
            </span>
          </div>
        </div>
      </div>

      {/* Core Intelligence Pipeline Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-black" />
            <h2 className="text-lg font-extrabold text-black">The 5-Step Health Intelligence Pipeline</h2>
          </div>
          <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#ECFDF5] text-emerald-800 border border-emerald-200">
            LOCAL NPU PROCESSED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pipelineSteps.map((p) => (
            <div key={p.step} className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold text-[#84CC16]">STEP {p.step}</span>
                <span className="w-2 h-2 rounded-full bg-black" />
              </div>
              <div className="font-extrabold text-sm text-black font-mono">{p.name}</div>
              <p className="text-[11px] text-slate-600 font-sans leading-snug">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Primary Modules */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-extrabold text-black">Three Primary Health Modules</h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Emergency Triage, Medication Safety, and Everyday Health Tracing</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">3 CORE MODULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.num}
                className="w-full rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-black text-[#A3E635] flex items-center justify-center shadow-md group-hover:bg-[#A3E635] group-hover:text-black transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-slate-400">
                      {item.layer}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xl text-black group-hover:text-slate-900 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                      {item.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {item.workflow}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-[10px] font-mono text-slate-400 font-medium truncate">
                    <strong className="text-slate-700">Sensors:</strong> {item.sensor}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVideoModule(item);
                      setUseDirectVideo(true);
                    }}
                    className="w-full bg-black hover:bg-slate-800 text-white font-sans font-extrabold text-xs py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition transform group-hover:scale-[1.02] border border-slate-800"
                  >
                    <PlayCircle className="w-4.5 h-4.5 text-[#A3E635]" />
                    <span>Watch the Video</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideoModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-5 shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => {
                setActiveVideoModule(null);
                setUseDirectVideo(true);
              }}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition z-10"
              title="Close Video"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between pr-12">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#A3E635]" />
                  <span className="text-xs font-mono font-bold text-[#A3E635] uppercase">FEATURE DEMO VIDEO</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">{activeVideoModule.title}</h2>
                <p className="text-xs text-slate-400 font-sans">{activeVideoModule.subtitle}</p>
              </div>
            </div>

            <div className="relative w-full h-[60vh] min-h-[380px] max-h-[580px] rounded-2xl bg-black overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner group">
              {activeVideoModule.videoUrl ? (
                useDirectVideo ? (
                  <video
                    src={getDirectVideoUrl(activeVideoModule.videoUrl)}
                    controls
                    autoPlay
                    loop
                    playsInline
                    onError={() => setUseDirectVideo(false)}
                    className={`w-full h-full rounded-2xl transition-all duration-300 ${
                      videoFitMode === 'cover' ? 'object-cover' : 'object-contain'
                    }`}
                  />
                ) : (
                  <iframe
                    src={getEmbedUrl(activeVideoModule.videoUrl) || ''}
                    title={`${activeVideoModule.title} Demo Video`}
                    className="w-full h-full rounded-2xl border-0 scale-100"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="p-8 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center mx-auto border border-[#A3E635]/30">
                    <PlayCircle className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base text-white font-sans">
                      {activeVideoModule.title} Feature Video
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-1.5 leading-relaxed">
                      Video demonstration for {activeVideoModule.title} ({activeVideoModule.subtitle}) will play here once uploaded.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-[#A3E635]">
                    <span>READY FOR VIDEO URL / FILE UPLOAD</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
