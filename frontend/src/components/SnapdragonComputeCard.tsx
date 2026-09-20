import React, { useState } from 'react';
import {
  snapdragonAIRuntime
} from '../services/snapdragonAIRuntime';
import {
  Cpu,
  Zap,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Eye,
  Camera,
  Sparkles,
  Mic,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export const SnapdragonComputeCard: React.FC = () => {
  const workloads = snapdragonAIRuntime.getWorkloadDistribution();
  const statement = snapdragonAIRuntime.getProductStatement();
  const [activeTab, setActiveTab] = useState<'NPU' | 'CPU' | 'GPU'>('NPU');

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <Cpu className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>SNAPDRAGON SoC HETEROGENEOUS COMPUTE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            On-Device NPU Acceleration Architecture
          </h2>
        </div>

        <div className="bg-slate-800 border border-slate-700 font-mono text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 text-[#A3E635] shrink-0">
          <Zap className="w-4 h-4 text-[#A3E635]" />
          <span>38 TOPS NPU CAPACITY</span>
        </div>
      </div>

      {/* OFFICIAL PRODUCT STATEMENT BOX */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-2">
        <span className="text-[10px] font-mono font-bold text-[#A3E635] uppercase tracking-wider block">
          OFFICIAL ARCHITECTURE STATEMENT
        </span>
        <blockquote className="text-sm font-sans font-bold text-slate-200 leading-relaxed italic">
          "{statement}"
        </blockquote>
      </div>

      {/* HETEROGENEOUS COMPUTE TAB MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            SNAPDRAGON SoC CORE WORKLOAD MAPPING
          </span>

          {/* Core Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-full border border-slate-700 font-mono text-xs font-bold">
            <button
              onClick={() => setActiveTab('NPU')}
              className={`px-3.5 py-1.5 rounded-full transition ${activeTab === 'NPU' ? 'bg-[#A3E635] text-black font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              NPU (AI Inference)
            </button>
            <button
              onClick={() => setActiveTab('CPU')}
              className={`px-3.5 py-1.5 rounded-full transition ${activeTab === 'CPU' ? 'bg-blue-500 text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              CPU (Logic & DB)
            </button>
            <button
              onClick={() => setActiveTab('GPU')}
              className={`px-3.5 py-1.5 rounded-full transition ${activeTab === 'GPU' ? 'bg-purple-500 text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              GPU (Graphics)
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'NPU' && (
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-[#A3E635]/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-[#A3E635]">
              <span className="font-bold uppercase">QUALCOMM HEXAGON NPU DIRECT INFERENCE</span>
              <span>SUB-15ms LATENCY</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 font-sans">
              {workloads.npuWorkloads.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0 mt-0.5" />
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'CPU' && (
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-blue-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-blue-400">
              <span className="font-bold uppercase">KRYO CPU ORCHESTRATION & STORAGE</span>
              <span>OFFLINE LOCAL STORAGE</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 font-sans">
              {workloads.cpuWorkloads.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'GPU' && (
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-purple-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-purple-400">
              <span className="font-bold uppercase">ADRENO GPU SHADER RENDERING</span>
              <span>60 FPS SHADERS</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 font-sans">
              {workloads.gpuWorkloads.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* HONESTY & TRANSPARENCY NOTICE */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-[#A3E635] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Transparent Heterogeneous Allocation:</span> LIVIQ explicitly maps tasks to the optimal hardware engine: application logic runs on CPU, UI graphics on GPU, and computer vision / OCR / pose estimation models on NPU cores.
        </div>
      </div>
    </div>
  );
};

export default SnapdragonComputeCard;
