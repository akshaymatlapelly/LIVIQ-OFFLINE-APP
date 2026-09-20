import React from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Pill,
  ScanText,
  Radio,
  Vibrate,
  Zap,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity
} from 'lucide-react';

export const ModesPage: React.FC = () => {
  const modeGroups = [
    {
      category: 'UNDERSTAND THE WORLD',
      tagline: 'Multimodal Vision & Physical Object Interpretation',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      modes: [
        {
          name: 'INSIGHT',
          subtitle: 'Physical World Intelligence',
          path: '/sentrx',
          icon: Eye,
          status: 'ONLINE',
          desc: 'Turn smartphone camera into a real-world inspection assistant for structural defects, electrical wiring hazards, and safety screening.',
          hardware: ['Camera Array', 'IMU Motion', 'NPU AI Core', 'GPS']
        },
        {
          name: 'MEDSURE',
          subtitle: 'Medicine Screening',
          path: '/medicine',
          icon: Pill,
          status: 'ONLINE',
          desc: 'Screen medicine packaging for suspicious visual indicators, dosage authenticity, and anti-tamper seal integrity.',
          hardware: ['Macro Camera', 'LED Flash Strobe', 'NPU AI Core']
        },
        {
          name: 'ACTIONLENS',
          subtitle: 'See → Understand → Act',
          path: '/auralens',
          icon: ScanText,
          status: 'ONLINE',
          desc: 'Instantly transform physical receipts, legal documents, serial labels, and appliance error codes into structured data and actions.',
          hardware: ['Camera Array', 'Document OCR', 'NPU AI Core']
        }
      ]
    },
    {
      category: 'SENSE & COMMUNICATE',
      tagline: 'Acoustic Spatial Sensing & Tactile Vibration Signals',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      modes: [
        {
          name: 'ECHOSENSE',
          subtitle: 'Beyond-Vision Sensing',
          path: '/radar',
          icon: Radio,
          status: 'PROTOTYPE',
          desc: 'Explore surroundings using high-frequency acoustic echo profiling beyond optical line of sight.',
          hardware: ['Speaker Transducer', 'Ultrasonic Mic', 'IMU Motion']
        },
        {
          name: 'TOUCHTALK',
          subtitle: 'Silent Haptic Communication',
          path: '/haptic',
          icon: Vibrate,
          status: 'ONLINE',
          desc: 'Transmit structured tactile messages through linear resonant vibration code patterns.',
          hardware: ['Haptic Vibration Engine', 'Bluetooth Link']
        }
      ]
    },
    {
      category: 'CONNECT',
      tagline: 'Device-to-Device Zero-RF Optical Pulse Transmission',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      modes: [
        {
          name: 'LIGHTLINK',
          subtitle: 'Optical Device Connection',
          path: '/optical',
          icon: Zap,
          status: 'PROTOTYPE',
          desc: 'Demonstrate ultra-secure device-to-device optical data transfer using high-speed screen strobes and camera receiver pulses.',
          hardware: ['LED Flash Engine', 'High-Speed Camera']
        }
      ]
    }
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>INTELLIGENCE MODES CATALOG</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            CAPABILITY MODES MATRIX
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Six official feature capabilities powered by one unified LIVIQ Core: INSIGHT, MEDSURE, ACTIONLENS, ECHOSENSE, TOUCHTALK, and LIGHTLINK.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" /> 6 Official Features
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <Activity className="w-3.5 h-3.5 text-[#A3E635]" /> Local NPU Active
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" /> Zero Cloud Latency
            </span>
          </div>
        </div>
      </div>

      {/* Mode Groups */}
      <div className="space-y-12">
        {modeGroups.map((group) => (
          <div key={group.category} className="space-y-6">
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-extrabold font-mono text-black tracking-wide flex items-center gap-2">
                  [{group.category}]
                </h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5">{group.tagline}</p>
              </div>
              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${group.badgeColor}`}>
                {group.modes.length} ACTIVE {group.modes.length === 1 ? 'MODE' : 'MODES'}
              </span>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.modes.map((mode) => {
                const Icon = mode.icon;
                const isOnline = mode.status === 'ONLINE';

                return (
                  <div
                    key={mode.name}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 group"
                  >
                    <div className="space-y-4">
                      {/* Card Top Row */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-black text-[#A3E635] flex items-center justify-center shadow-md group-hover:bg-[#A3E635] group-hover:text-black transition-colors duration-300">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            isOnline
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {mode.status}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="font-extrabold text-xl text-black group-hover:text-slate-900 transition-colors">
                          {mode.name}
                        </h3>
                        <div className="text-xs font-semibold text-slate-500 font-sans mt-0.5">
                          {mode.subtitle}
                        </div>
                        <p className="text-xs text-slate-600 font-sans mt-2.5 leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      {/* Hardware Badges */}
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Hardware Dependencies:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {mode.hardware.map((h) => (
                            <span
                              key={h}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-[10px] font-mono text-slate-700 font-medium"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Launch Button */}
                      <Link
                        to={mode.path}
                        className="w-full bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-extrabold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm transition transform group-hover:scale-[1.02]"
                      >
                        <span>LAUNCH MODE</span>
                        <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
