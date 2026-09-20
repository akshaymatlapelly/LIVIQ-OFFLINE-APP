import React, { useState, useEffect } from 'react';
import { History, Trash2, Search, Clock, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { HistoryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async (filterType?: string) => {
    setLoading(true);
    try {
      const res = await api.getHistory(filterType);
      setHistoryItems(res.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(activeFilter === 'ALL' ? undefined : activeFilter);
  }, [activeFilter]);

  const handleDeleteItem = async (id: string) => {
    try {
      await api.deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.clearHistory();
      setHistoryItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = historyItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <History className="w-3.5 h-3.5" />
            <span>ACTIVITY AUDIT TRAIL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            INTELLIGENCE HISTORY
          </h1>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Complete audit log of all physical-world scans, structural hazard inspections, and sensor telemetry analysis.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="relative z-10 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-xs font-mono font-bold text-rose-300 transition shrink-0"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>CLEAR ALL LOGS</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search history by title, type, or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FBFBF8] border border-slate-200 focus:border-black focus:ring-1 focus:ring-black rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 font-sans outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto font-mono text-xs pb-1 sm:pb-0">
            {['ALL', 'INSIGHT', 'MEDSURE', 'ACTIONLENS', 'ECHOSENSE', 'TOUCHTALK', 'LIGHTLINK'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  const filterMap: Record<string, string> = {
                    INSIGHT: 'INSPECTION',
                    MEDSURE: 'MEDICINE',
                    ACTIONLENS: 'AURALENS',
                    ECHOSENSE: 'RADAR',
                    TOUCHTALK: 'HAPTIC',
                    LIGHTLINK: 'OPTICAL'
                  };
                  setActiveFilter(f);
                  fetchHistory(f === 'ALL' ? undefined : (filterMap[f] || f));
                }}
                className={`px-3.5 py-2 rounded-xl text-xs transition font-extrabold whitespace-nowrap ${
                  activeFilter === f
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const displayTypeMap: Record<string, string> = {
              INSPECTION: 'INSIGHT',
              MEDICINE: 'MEDSURE',
              AURALENS: 'ACTIONLENS',
              RADAR: 'ECHOSENSE',
              HAPTIC: 'TOUCHTALK',
              OPTICAL: 'LIGHTLINK'
            };
            const displayType = displayTypeMap[item.type] || item.type;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold bg-black text-[#A3E635] uppercase">
                        {displayType}
                      </span>
                      <h3 className="font-extrabold text-base text-black">{item.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 font-sans leading-relaxed">{item.summary}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right font-mono">
                      <div className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {item.status}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition"
                      title="Delete log entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 text-slate-500 font-sans text-xs space-y-3">
            <History className="w-10 h-10 mx-auto text-slate-400" />
            <div className="font-extrabold text-slate-800 text-sm">NO HISTORY LOGS FOUND</div>
            <p className="text-slate-500">There are no scan or inspection logs matching your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
