import React, { useState } from 'react';
import { Zap, Radio, ShieldCheck, Play } from 'lucide-react';
import { api } from '../services/api';
import { OpticalTransferResult } from '../types';

export const OpticalPage: React.FC = () => {
  const [payloadText, setPayloadText] = useState('CLASSIFIED_KEY_2026_ZERO_RF.ENC');
  const [isTransferring, setIsTransferring] = useState(false);
  const [stage, setStage] = useState<'IDLE' | 'Preparing' | 'Encoding' | 'Transmitting' | 'Receiving' | 'Decoding' | 'Integrity Verified'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [result, setResult] = useState<OpticalTransferResult | null>(null);

  const handleStartTransfer = async () => {
    setIsTransferring(true);
    setResult(null);
    setProgress(0);

    const stages: ('Preparing' | 'Encoding' | 'Transmitting' | 'Receiving' | 'Decoding' | 'Integrity Verified')[] = [
      'Preparing',
      'Encoding',
      'Transmitting',
      'Receiving',
      'Decoding',
      'Integrity Verified'
    ];

    for (let i = 0; i < stages.length; i++) {
      setStage(stages[i]);
      setProgress(Math.round(((i + 1) / stages.length) * 100));

      if (stages[i] === 'Transmitting') {
        setIsFlashing(true);
        await new Promise((r) => setTimeout(r, 1000));
        setIsFlashing(false);
      } else {
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    try {
      const res = await api.transferOptical(payloadText);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>CAPABILITY 06: OPTICAL LIGHT PULSE DATA TRANSFER</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            LIGHTLINK
          </h1>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Optical Device Connection
          </p>
        </div>
      </div>

      {/* Main Optical Control Console */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-8">
        {/* RF Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 font-sans text-xs">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-rose-400" /> RF STATUS: OFF (AIR-GAPPED)
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600" /> OPTICAL LINK: ACTIVE
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">CHANNEL: HIGH-SPEED FLASH STROBE</span>
        </div>

        {/* Optical Light Frame Strobe Simulation Box */}
        <div className="relative aspect-[21/9] rounded-3xl bg-slate-950 border border-black overflow-hidden flex flex-col items-center justify-center shadow-inner">
          {isFlashing ? (
            <div className="absolute inset-0 bg-white animate-pulse flex items-center justify-center">
              <div className="font-mono text-black font-black text-xl tracking-widest uppercase">
                OPTICAL STROBE BURST ACTIVE [120 FPS]
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2 p-6">
              <Zap className="w-12 h-12 text-[#A3E635] mx-auto animate-pulse" />
              <div className="font-extrabold text-sm text-white tracking-wider">
                OPTICAL AIR-GAP TRANSMISSION PORTAL
              </div>
              <div className="font-mono text-xs text-slate-400">
                {isTransferring ? `STAGE: ${stage.toUpperCase()}` : 'READY TO TRANSMIT SECURE PAYLOAD'}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isTransferring && (
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs text-slate-700">
              <span>STAGE: {stage}</span>
              <span className="text-black font-bold">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
              <div
                className="h-full bg-[#A3E635] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Input & Action */}
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Encrypted Demo Payload String
            </label>
            <input
              type="text"
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="w-full bg-[#FBFBF8] border border-slate-300 focus:border-black focus:ring-1 focus:ring-black rounded-2xl px-4 py-3 text-xs text-slate-900 font-mono font-bold outline-none"
            />
          </div>

          <button
            onClick={handleStartTransfer}
            disabled={isTransferring}
            className="w-full py-4 rounded-full font-sans font-extrabold text-xs text-black bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center justify-center gap-2 transition transform hover:scale-[1.01] disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current text-black" />
            <span>TRANSMIT PAYLOAD OVER OPTICAL AIR-GAP</span>
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-extrabold text-xs text-black">OPTICAL INTEGRITY VERIFIED</span>
            </div>
            <span className="font-mono text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              ERROR RATE: 0.00012%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold">PAYLOAD SIZE</span>
              <span className="text-black font-bold">{result.sizeBytes} Bytes</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold">CHANNEL</span>
              <span className="text-black font-bold">{result.opticalChannel}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold">RF FOOTPRINT</span>
              <span className="text-emerald-700 font-bold">0.00 MHz</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold">CHECKSUM</span>
              <span className="text-emerald-700 font-bold">SHA-256 PASS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
