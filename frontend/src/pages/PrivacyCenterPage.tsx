import React, { useState, useEffect } from 'react';
import {
  liviqPrivacyService,
  PrivacyPermissions,
  CORE_12_PRINCIPLES
} from '../services/liviqPrivacyService';
import { offlineSyncService } from '../services/offlineSyncService';
import {
  ShieldCheck,
  Lock,
  HardDrive,
  Camera,
  Mic,
  MapPin,
  HeartPulse,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  Sliders,
  Info,
  Layers,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyCenterPage: React.FC = () => {
  const [permissions, setPermissions] = useState<PrivacyPermissions>(liviqPrivacyService.getPermissions());
  const [syncStats, setSyncStats] = useState(offlineSyncService.getSyncStats());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setPermissions(liviqPrivacyService.getPermissions());
      setSyncStats(offlineSyncService.getSyncStats());
    };
    window.addEventListener('liviq-privacy-updated', handleUpdate);
    window.addEventListener('liviq-network-status-changed', handleUpdate);
    return () => {
      window.removeEventListener('liviq-privacy-updated', handleUpdate);
      window.removeEventListener('liviq-network-status-changed', handleUpdate);
    };
  }, []);

  const handleToggle = (key: keyof PrivacyPermissions) => {
    const newVal = !permissions[key];
    const updated = liviqPrivacyService.updatePermission(key, newVal);
    setPermissions(updated);
    showToast(`Updated permission setting: ${key} = ${newVal ? 'ON' : 'OFF'}`);
  };

  const handleExportData = () => {
    liviqPrivacyService.exportUserDataJson();
    showToast('Exported local health telemetry JSON file.');
  };

  const handleWipeData = () => {
    if (window.confirm('Wipe ALL LIVIQ local health data from this device? This action cannot be undone.')) {
      liviqPrivacyService.clearAllLocalData();
      showToast('All local LIVIQ data has been wiped.');
      setPermissions(liviqPrivacyService.getPermissions());
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>PRIVACY & SAFETY GOVERNANCE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              PRIVACY CENTER
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Transparent hardware permission locks, local-first processing policies, and non-diagnostic safety guardrails. You maintain total control over your saved health data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportData}
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans text-xs font-extrabold px-5 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              <Download className="w-4 h-4 text-black" />
              <span>EXPORT DATA JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEVEN CORE STATUS TILES (LOCAL DATA, PERMISSIONS, VOICE, CAMERA, LOCATION, HEALTH DATA, SYNC STATUS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {/* 1. LOCAL DATA */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-black">LOCAL DATA</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              ON-DEVICE
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            All AI model inference, health timeline records, and rolling baselines are stored on-device in browser LocalStorage & IndexedDB.
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-mono">
            <button
              onClick={handleExportData}
              className="text-black font-bold hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleWipeData}
              className="text-red-600 font-bold hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Wipe Data</span>
            </button>
          </div>
        </div>

        {/* 2. PERMISSIONS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-black">PERMISSIONS</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
              GRANULAR
            </span>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBFBF8] border border-slate-200">
              <span>Camera Access</span>
              <input
                type="checkbox"
                checked={permissions.cameraAccess}
                onChange={() => handleToggle('cameraAccess')}
                className="accent-[#84CC16]"
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBFBF8] border border-slate-200">
              <span>Microphone / Voice</span>
              <input
                type="checkbox"
                checked={permissions.microphoneAccess}
                onChange={() => handleToggle('microphoneAccess')}
                className="accent-[#84CC16]"
              />
            </div>
          </div>
        </div>

        {/* 3. VOICE DATA */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-black">VOICE DATA</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              NO AUDIO SAVED
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Speech-to-text processing occurs transiently via Web Speech API. Raw audio is <span className="font-bold text-black">never recorded, stored, or transmitted</span> to cloud servers.
          </p>
        </div>

        {/* 4. CAMERA */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-black">CAMERA</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              TRANSIENT MEMORY
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Camera frames for incident triage, medicine OCR, food scanning, and pose estimation are processed transiently in RAM.
          </p>
        </div>

        {/* 5. LOCATION */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-black">LOCATION</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              EXPLICIT LOCK
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            GPS coordinates are retrieved locally. Explicit multi-step button confirmation is <span className="font-bold text-black">always required</span> before sharing location with contacts.
          </p>
        </div>

        {/* 6. HEALTH DATA */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-black">HEALTH DATA</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              USER CONTROL
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            You hold total authority over health data. Reset baselines, exclude medicine logs, or export complete timeline records at will.
          </p>
        </div>

        {/* 7. SYNC STATUS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center shrink-0">
                {syncStats.isOnline ? <Wifi className="w-5 h-5 text-emerald-600" /> : <WifiOff className="w-5 h-5 text-amber-600" />}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-black">SYNC STATUS</h3>
                <p className="text-xs text-slate-500">
                  {syncStats.isOnline ? 'Connected — data & services updated' : 'Core LIVIQ features available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {syncStats.pendingCount} QUEUED RECORDS
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                LAST SYNC: {syncStats.lastSyncTimestamp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE 12 SAFETY PRINCIPLES MATRIX GRID */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#A3E635] uppercase tracking-wider">
              LIVIQ GOVERNANCE PROTOCOL
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              The 12 Core Privacy & Safety Principles
            </h2>
          </div>

          <span className="text-xs font-mono font-bold text-[#A3E635] bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-full">
            100% ENFORCED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
          {CORE_12_PRINCIPLES.map((p) => (
            <div
              key={p.id}
              className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2 hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#A3E635]">
                  PRINCIPLE #{p.id}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {p.status}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-white">{p.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
              
              <div className="pt-1 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <span>Enforcement:</span>
                <span className="text-slate-200 font-bold">{p.enforcementMechanism}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyCenterPage;
