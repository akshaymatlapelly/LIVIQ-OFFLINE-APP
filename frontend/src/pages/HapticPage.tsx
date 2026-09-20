import React, { useState, useEffect } from 'react';
import { Vibrate, Bluetooth, Smartphone, CheckCircle, Volume2 } from 'lucide-react';
import { api } from '../services/api';
import { HapticCodeItem } from '../types';

export const HapticPage: React.FC = () => {
  const [codebook, setCodebook] = useState<HapticCodeItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState('I NEED HELP');
  const [customInput, setCustomInput] = useState('');
  const [isPaired, setIsPaired] = useState(true);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
  const [activeVibration, setActiveVibration] = useState(false);

  useEffect(() => {
    async function fetchCodebook() {
      try {
        const res = await api.getHapticCodebook();
        setCodebook(res.codebook || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCodebook();
  }, []);

  const triggerPhysicalVibration = (pattern: number[]) => {
    setActiveVibration(true);
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
    setTimeout(() => setActiveVibration(false), pattern.reduce((a, b) => a + b, 0));
  };

  const handleTransmit = async () => {
    const messageToTransmit = customInput.trim() || selectedMessage;
    setIsTransmitting(true);
    setReceivedMessage(null);

    try {
      const encodeRes = await api.encodeHaptic(messageToTransmit);

      triggerPhysicalVibration(encodeRes.encodedPattern);

      await new Promise((r) => setTimeout(r, 1200));

      const decodeRes = await api.decodeHaptic(encodeRes.transmissionPayload);
      setReceivedMessage(decodeRes.message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <Vibrate className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>CAPABILITY 05: TACTILE CODE VIBRATION TRANSMISSION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            TOUCHTALK
          </h1>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Silent Haptic Communication
          </p>
        </div>
      </div>

      {/* Dual Phone Transmission Visualizer */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 font-sans text-xs">
            <Bluetooth className="w-4 h-4 text-slate-900" />
            <span className="font-extrabold text-black">DEVICE-TO-DEVICE LINK:</span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isPaired ? 'VIRTUAL LINK PAIRED' : 'DISCONNECTED'}
            </span>
          </div>
          <button
            onClick={() => setIsPaired(!isPaired)}
            className="text-xs font-mono font-bold text-slate-600 hover:text-black transition"
          >
            {isPaired ? 'Disconnect' : 'Pair Devices'}
          </button>
        </div>

        {/* Dual Device Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* PHONE A: TRANSMITTER */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-[#FBFBF8] border border-slate-200 text-center space-y-3">
            <div className="text-[10px] font-mono font-extrabold text-amber-700 uppercase tracking-wider">
              PHONE A (TRANSMITTER)
            </div>
            <div
              className={`p-5 rounded-2xl bg-white border transition-all ${
                activeVibration ? 'border-amber-500 ring-4 ring-amber-200 animate-bounce' : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <Smartphone className="w-8 h-8 text-black mx-auto mb-2" />
              <div className="font-sans text-xs font-extrabold text-black truncate">
                "{customInput.trim() || selectedMessage}"
              </div>
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-400">HAPTIC ENCODER ONLINE</div>
          </div>

          {/* LINK IN BETWEEN */}
          <div className="md:col-span-3 text-center space-y-2 py-2">
            <div className="text-[10px] font-mono font-bold text-slate-600">BLUETOOTH SIGNAL</div>
            <div className="flex items-center justify-center gap-1.5 px-2">
              <span className={`w-3 h-3 rounded-full ${isTransmitting ? 'bg-amber-500 animate-ping' : 'bg-black'}`} />
              <span className="h-1 w-full bg-gradient-to-r from-black via-amber-400 to-emerald-500 rounded-full" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[10px] font-mono text-slate-400">TACTILE WAVE ENCODED</div>
          </div>

          {/* PHONE B: RECEIVER */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-[#FBFBF8] border border-slate-200 text-center space-y-3">
            <div className="text-[10px] font-mono font-extrabold text-emerald-700 uppercase tracking-wider">
              PHONE B (RECEIVER)
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <Smartphone className="w-8 h-8 text-black mx-auto mb-2" />
              {receivedMessage ? (
                <div className="font-sans text-xs font-extrabold text-emerald-700 truncate">
                  "{receivedMessage}"
                </div>
              ) : (
                <div className="font-sans text-xs text-slate-400 italic">Awaiting tactile signal...</div>
              )}
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-400">HAPTIC DECODER READY</div>
          </div>
        </div>

        {/* Transmission Controls */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Preset Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Preset Codebook Message
              </label>
              <select
                value={selectedMessage}
                onChange={(e) => {
                  setSelectedMessage(e.target.value);
                  setCustomInput('');
                }}
                className="w-full bg-[#FBFBF8] border border-slate-300 focus:border-black focus:ring-1 focus:ring-black rounded-2xl px-4 py-3 text-xs font-sans text-slate-900 font-extrabold outline-none"
              >
                {codebook.map((c) => (
                  <option key={c.symbol} value={c.label} className="bg-white text-slate-900 font-sans">
                    {c.label} ({c.intensity} INTENSITY)
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Or Type Custom Text Message
              </label>
              <input
                type="text"
                placeholder="e.g. CLEAR AREA"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full bg-[#FBFBF8] border border-slate-300 focus:border-black focus:ring-1 focus:ring-black rounded-2xl px-4 py-3 text-xs font-sans text-slate-900 font-bold outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            onClick={handleTransmit}
            disabled={isTransmitting}
            className="w-full py-4 rounded-full font-sans font-extrabold text-xs text-black bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center justify-center gap-2 transition transform hover:scale-[1.01] disabled:opacity-50"
          >
            <Vibrate className="w-4 h-4 text-black stroke-[3]" />
            <span>ENCODE & TRANSMIT HAPTIC PATTERN</span>
          </button>
        </div>
      </div>

      {/* Codebook Reference Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="font-extrabold text-sm text-black uppercase tracking-wider">
          HAPTIC CODEBOOK DICTIONARY
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {codebook.map((item) => (
            <div key={item.symbol} className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="font-extrabold text-black">{item.symbol}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {item.category}
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-900 font-sans">{item.label}</div>
              <div className="text-[10px] font-mono text-slate-500">
                Pattern: [{item.pattern.join('-')}] ms
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
