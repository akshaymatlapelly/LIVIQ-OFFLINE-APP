import React, { useState, useEffect } from 'react';
import {
  offlineSyncService
} from '../services/offlineSyncService';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  Cloud,
  HardDrive,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const OfflineStatusIndicator: React.FC = () => {
  const [syncStats, setSyncStats] = useState(offlineSyncService.getSyncStats());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showArchModal, setShowArchModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const refreshStats = () => {
    setSyncStats(offlineSyncService.getSyncStats());
  };

  useEffect(() => {
    refreshStats();
    const handleStatusChange = () => refreshStats();
    const handleCompleted = (e: any) => {
      refreshStats();
      if (e.detail?.syncedCount > 0) {
        showToast(`Synced ${e.detail.syncedCount} pending offline records to cloud backup.`);
      }
    };

    window.addEventListener('liviq-network-status-changed', handleStatusChange);
    window.addEventListener('liviq-sync-completed', handleCompleted);

    return () => {
      window.removeEventListener('liviq-network-status-changed', handleStatusChange);
      window.removeEventListener('liviq-sync-completed', handleCompleted);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    const result = await offlineSyncService.processQueue();
    setIsSyncing(false);
    if (result.syncedCount === 0) {
      showToast('All offline records are up to date.');
    }
  };

  return (
    <div className="font-sans select-none">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER STATUS PILL */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowArchModal(true)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-extrabold transition shadow-sm ${
            syncStats.isOnline
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
          }`}
          title="Click to view LIVIQ Offline-First Architecture & Sync Queue"
        >
          {syncStats.isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">ONLINE</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span>OFFLINE</span>
            </>
          )}

          <span className="text-[10px] text-slate-500 font-normal border-l border-slate-300 pl-1.5 hidden md:inline">
            {syncStats.isOnline ? 'Connected — data & services updated' : 'Core LIVIQ features available'}
          </span>

          {syncStats.pendingCount > 0 && (
            <span className="bg-amber-500 text-black px-1.5 py-0.2 text-[10px] rounded-full font-bold">
              {syncStats.pendingCount} QUEUED
            </span>
          )}
        </button>

        {syncStats.pendingCount > 0 && syncStats.isOnline && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-1.5 bg-black hover:bg-slate-800 text-white rounded-full transition"
            title="Sync offline queue now"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#A3E635] ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* TECHNICAL ARCHITECTURE MODAL */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-slate-200/90 shadow-2xl space-y-6 text-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono font-bold">
                  <HardDrive className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>OFFLINE = CORE • ONLINE = BOOST</span>
                </div>
                <h3 className="text-2xl font-extrabold text-black">LIVIQ Offline-First Technical Architecture</h3>
                <p className="text-xs text-slate-500">
                  LIVIQ never breaks when internet is unavailable. Core AI models & storage run 100% on-device.
                </p>
              </div>

              <button
                onClick={() => setShowArchModal(false)}
                className="text-xs font-mono font-bold text-slate-400 hover:text-black p-1"
              >
                CLOSE
              </button>
            </div>

            {/* Status & Sync Queue Summary Card */}
            <div className="bg-[#FBFBF8] p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400">NETWORK STATUS</span>
                <div className="font-extrabold text-black mt-0.5">{syncStats.isOnline ? 'ONLINE' : 'OFFLINE'}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">PENDING QUEUE</span>
                <div className="font-extrabold text-amber-600 mt-0.5">{syncStats.pendingCount} RECORDS</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">TOTAL SYNCED</span>
                <div className="font-extrabold text-emerald-600 mt-0.5">{syncStats.totalSyncedRecords} RECORDS</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">LAST CLOUD SYNC</span>
                <div className="font-extrabold text-slate-700 mt-0.5">{syncStats.lastSyncTimestamp}</div>
              </div>
            </div>

            {/* ARCHITECTURE MATRIX GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              {/* OFFLINE CORE */}
              <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-[#A3E635] font-mono font-bold text-sm border-b border-slate-800 pb-2">
                  <HardDrive className="w-4 h-4" />
                  <span>OFFLINE CORE (100% ON-DEVICE)</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-mono text-amber-400 font-bold block text-[11px]">INSIGHT (Emergency Response):</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px] pl-1">
                      <li>Local incident vision inference</li>
                      <li>HTML5 GPS coordinates</li>
                      <li>Local emergency facility database</li>
                      <li>Incident report local storage</li>
                    </ul>
                  </div>

                  <div>
                    <span className="font-mono text-blue-400 font-bold block text-[11px]">MEDSURE (Medication Safety):</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px] pl-1">
                      <li>OCR packaging text extraction</li>
                      <li>Local medicine database lookup</li>
                      <li>Local explanation templates</li>
                      <li>Offline voice interaction engine</li>
                    </ul>
                  </div>

                  <div>
                    <span className="font-mono text-[#A3E635] font-bold block text-[11px]">HEALTRACE (Health Intelligence):</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px] pl-1">
                      <li>Food vision model & local nutrition DB</li>
                      <li>MediaPipe pose estimation</li>
                      <li>Workout analysis & hydration logging</li>
                      <li>Health timeline, baseline, Drift & Replay</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ONLINE BOOST */}
              <div className="bg-emerald-950 text-white p-5 rounded-3xl border border-emerald-900 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm border-b border-emerald-900 pb-2">
                  <Wifi className="w-4 h-4" />
                  <span>ONLINE BOOST (CLOUD ENHANCEMENTS)</span>
                </div>

                <div className="space-y-3 text-[11px] text-emerald-100">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Fresh Facility Data:</strong> Live emergency hospital bed availability & traffic routing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Medicine DB Updates:</strong> Fresh pharmaceutical batch safety recalls.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Nutrition DB Updates:</strong> Expanded USDA food item database synchronization.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Cloud Backup & Sync:</strong> Encrypted backup of health timeline records across devices.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500 font-mono">LIVIQ Architecture Protocol v1.0</span>
              <button
                onClick={() => setShowArchModal(false)}
                className="bg-black text-white font-extrabold text-xs px-6 py-2.5 rounded-full hover:bg-slate-800"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineStatusIndicator;
