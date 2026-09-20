import React, { useState, useEffect } from 'react';
import { Cpu, Eye, Radio, Compass, MapPin, Zap, Smartphone, Vibrate, Volume2, CheckCircle2, Activity } from 'lucide-react';
import { SnapdragonComputeCard } from '../components/SnapdragonComputeCard';
import { api } from '../services/api';
import { HardwareStatus } from '../types';

export const HardwarePage: React.FC = () => {
  const [hardwareList, setHardwareList] = useState<HardwareStatus[]>([]);
  const [selectedHw, setSelectedHw] = useState<HardwareStatus | null>(null);

  useEffect(() => {
    async function loadHw() {
      try {
        const res = await api.getHardwareStatus();
        const hw = res.hardware || [];
        setHardwareList(hw);
        if (hw.length > 0) setSelectedHw(hw[0]);
      } catch (err) {
        console.error(err);
      }
    }
    loadHw();
  }, []);

  const sensorIcons: Record<string, any> = {
    'hw_cam': Eye,
    'hw_mic': Radio,
    'hw_imu': Compass,
    'hw_npu': Cpu,
    'hw_speaker': Volume2,
    'hw_flash': Zap,
    'hw_haptics': Vibrate,
    'hw_gps': MapPin
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* SNAPDRAGON HETEROGENEOUS COMPUTE CARD */}
      <SnapdragonComputeCard />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>SMARTPHONE SENSOR TELEMETRY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            HARDWARE INTELLIGENCE MAP
          </h1>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Real-time interactive map of smartphone sensors and capability routing linkages across all 6 LIVIQ modules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hardware Component Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {hardwareList.map((hw) => {
            const Icon = sensorIcons[hw.id] || Smartphone;
            const isSelected = selectedHw?.id === hw.id;

            return (
              <button
                key={hw.id}
                onClick={() => setSelectedHw(hw)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-md ring-2 ring-[#A3E635]'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/10 text-[#A3E635]' : 'bg-slate-100 text-black'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-pulse" />
                </div>
                <div className="text-xs font-extrabold truncate">{hw.name}</div>
                <div className={`text-[10px] font-mono mt-1 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {hw.telemetry}
                </div>
              </button>
            );
          })}
        </div>

        {/* Component Detail Inspector */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          {selectedHw ? (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    HARDWARE COMPONENT DETAIL
                  </span>
                  <h2 className="text-xl font-extrabold text-black mt-1">{selectedHw.name}</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold uppercase">
                  {selectedHw.status}
                </span>
              </div>

              <div className="space-y-5 text-xs font-sans">
                <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] font-mono font-bold uppercase block mb-1">
                    TELEMETRY STATS
                  </span>
                  <span className="text-black font-extrabold font-mono text-base">{selectedHw.telemetry}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] font-mono font-bold uppercase block mb-1">
                    WHAT IT DOES
                  </span>
                  <p className="text-slate-700 font-sans text-xs leading-relaxed">{selectedHw.description}</p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] font-mono font-bold uppercase block mb-2">
                    CAPABILITIES UTILIZING THIS SENSOR
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedHw.capabilitiesUsed.map((cap) => {
                      const capDisplayMap: Record<string, string> = {
                        INSPECTION: 'INSIGHT',
                        MEDICINE: 'MEDSURE',
                        AURALENS: 'ACTIONLENS',
                        RADAR: 'ECHOSENSE',
                        HAPTIC: 'TOUCHTALK',
                        OPTICAL: 'LIGHTLINK'
                      };
                      return (
                        <span key={cap} className="px-3 py-1.5 rounded-xl bg-black text-white font-mono font-bold text-[10px]">
                          {capDisplayMap[cap] || cap}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-slate-500 font-sans text-xs">
              Select a hardware component to view telemetry and capability linkages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
