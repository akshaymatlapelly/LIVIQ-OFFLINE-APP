import React from 'react';
import { Target, Radio, Cpu, Brain, CheckCircle, ArrowRight } from 'lucide-react';

interface ScanAnimationProps {
  currentStep: number;
}

export const ScanAnimation: React.FC<ScanAnimationProps> = ({ currentStep }) => {
  const steps = [
    { label: 'POINT', icon: Target, desc: 'Targeting Real-World Sensor Frame' },
    { label: 'SENSE', icon: Radio, desc: 'Acquiring Multimodal Telemetry' },
    { label: 'ANALYZE', icon: Cpu, desc: 'Executing Neural AI Core Models' },
    { label: 'UNDERSTAND', icon: Brain, desc: 'Classifying Context & Intent' },
    { label: 'DECIDE', icon: CheckCircle, desc: 'Selecting Intelligence Capability' },
    { label: 'ACT', icon: ArrowRight, desc: 'Generating Actionable Results' }
  ];

  return (
    <div className="w-full space-y-4">
      {/* Visual Scanner HUD - Light Theme */}
      <div className="relative h-48 w-full rounded-2xl bg-stone-900 border border-slate-800 overflow-hidden flex items-center justify-center tech-grid text-white">
        {/* Laser Scanning Line */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#A3E635] to-transparent shadow-[0_0_15px_#A3E635] animate-scan-line" />
        
        {/* Corner Reticles */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#A3E635]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#A3E635]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#A3E635]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#A3E635]" />

        {/* Center Target Indicator */}
        <div className="text-center space-y-2 z-10">
          <div className="relative inline-block">
            <div className="absolute -inset-2 rounded-full bg-lime-500/20 blur-md animate-pulse" />
            <Cpu className="w-12 h-12 text-[#A3E635] relative z-10 animate-spin-slow" />
          </div>
          <div className="font-mono text-xs text-[#A3E635] tracking-wider">
            LIVIQ INTELLIGENCE CORE EXECUTION
          </div>
          <div className="font-mono text-sm text-white font-bold tracking-widest uppercase">
            {steps[Math.min(currentStep, 5)].label}: {steps[Math.min(currentStep, 5)].desc}
          </div>
        </div>
      </div>

      {/* Process Pipeline Steps */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;

          return (
            <div
              key={step.label}
              className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
                isActive
                  ? 'bg-black text-white border-black font-bold shadow-md'
                  : isDone
                  ? 'bg-lime-100 border-lime-300 text-lime-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex justify-center mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce text-[#A3E635]' : ''}`} />
              </div>
              <div className="font-mono text-[10px] tracking-wider">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
