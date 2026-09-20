import React, { useState, useEffect, useRef } from 'react';
import { Radio, Play, Square, Compass, Volume2, Activity } from 'lucide-react';
import { api } from '../services/api';
import { RadarSimulationResult } from '../types';

export const RadarPage: React.FC = () => {
  const [isSensing, setIsSensing] = useState(false);
  const [result, setResult] = useState<RadarSimulationResult | null>(null);
  const [sweepAngle, setSweepAngle] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let animId: number;
    if (isSensing) {
      const animate = () => {
        setSweepAngle((prev) => (prev + 2) % 360);
        animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animId);
  }, [isSensing]);

  const playUltrasonicChirp = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio context fallback
    }
  };

  const handleStartSensing = async () => {
    setIsSensing(true);
    playUltrasonicChirp();

    await new Promise((r) => setTimeout(r, 1000));

    try {
      const res = await api.simulateRadar();
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopSensing = () => {
    setIsSensing(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>CAPABILITY 04: ACOUSTIC SPATIAL SENSING PROTOTYPE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            ECHOSENSE
          </h1>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Beyond-Vision Sensing
          </p>
        </div>
      </div>

      {/* Main Radar Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Canvas Visualization */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col items-center justify-center space-y-6">
          <div className="relative w-full max-w-xs aspect-square rounded-full border-2 border-black bg-slate-950 overflow-hidden shadow-xl flex items-center justify-center">
            {/* Concentric Circles */}
            <div className="absolute inset-[15%] rounded-full border border-slate-800 border-dashed" />
            <div className="absolute inset-[35%] rounded-full border border-slate-800" />
            <div className="absolute inset-[55%] rounded-full border border-slate-800 border-dashed" />
            <div className="absolute inset-[75%] rounded-full border border-slate-800" />

            {/* Axes */}
            <div className="absolute inset-x-0 h-px bg-slate-800" />
            <div className="absolute inset-y-0 w-px bg-slate-800" />

            {/* Rotating Radar Sweep Line */}
            {isSensing && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ transform: `rotate(${sweepAngle}deg)` }}
              >
                <div className="w-1/2 h-1/2 bg-gradient-to-tr from-transparent via-[#A3E635]/30 to-[#A3E635] border-r border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.8)] origin-bottom-right" />
              </div>
            )}

            {/* Detected Echo Points */}
            {result?.pointsDetected.map((pt) => {
              const rad = (pt.bearingDegree * Math.PI) / 180;
              const rPercent = Math.min((pt.distanceMeter / 5) * 40, 45);
              const x = 50 + rPercent * Math.sin(rad);
              const y = 50 - rPercent * Math.cos(rad);

              return (
                <div
                  key={pt.id}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#A3E635] border-2 border-black shadow-[0_0_10px_#A3E635]"></span>
                  </span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black border border-[#A3E635] text-[10px] font-mono text-white p-2.5 rounded-xl whitespace-nowrap z-30 shadow-xl">
                    <div className="font-bold text-[#A3E635]">{pt.classifiedObject}</div>
                    <div>Distance: {pt.distanceMeter}m | Motion: {pt.motionStatus}</div>
                  </div>
                </div>
              );
            })}

            {/* Center Origin */}
            <div className="w-3.5 h-3.5 rounded-full bg-[#A3E635] shadow-[0_0_12px_#A3E635] z-10" />
          </div>

          {/* Controls */}
          <div className="w-full pt-2">
            {!isSensing ? (
              <button
                onClick={handleStartSensing}
                className="w-full py-4 rounded-full font-sans font-extrabold text-xs text-black bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center justify-center gap-2 transition transform hover:scale-[1.01]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START ACOUSTIC SENSING</span>
              </button>
            ) : (
              <button
                onClick={handleStopSensing}
                className="w-full py-4 rounded-full font-sans font-extrabold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>STOP SENSING</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Telemetry & Object List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-xs text-black uppercase tracking-wider">SPATIAL ECHO READINGS</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">21.5 kHz CHIRP</span>
            </div>

            {result ? (
              <div className="space-y-3">
                {result.pointsDetected.map((pt, idx) => (
                  <div key={pt.id} className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1 font-sans text-xs">
                    <div className="flex justify-between font-extrabold text-black">
                      <span>OBJECT {idx + 1}: {pt.classifiedObject}</span>
                      <span className="text-black font-mono">{pt.distanceMeter} m</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>Bearing: {pt.bearingDegree}°</span>
                      <span className="text-emerald-700 font-bold">{pt.motionStatus}</span>
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs font-sans">
                  <strong className="font-mono text-[10px] block text-[#A3E635] uppercase tracking-wider mb-1">
                    ENVIRONMENT MAP SUMMARY:
                  </strong>
                  {result.environmentMapSummary}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-slate-400 font-sans text-xs">
                Press "START ACOUSTIC SENSING" to emit high-frequency sound chirps.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
