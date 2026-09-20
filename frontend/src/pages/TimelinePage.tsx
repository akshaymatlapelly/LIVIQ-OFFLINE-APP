import React, { useState, useEffect } from 'react';
import {
  unifiedTimelineService,
  UnifiedTimelineEvent,
  EventCategoryFilter
} from '../services/unifiedTimelineService';
import {
  Clock,
  Search,
  Filter,
  AlertTriangle,
  Pill,
  HeartPulse,
  RotateCcw,
  ShieldCheck,
  Lock,
  Info,
  ChevronRight,
  Moon,
  Utensils,
  Flame,
  Droplets,
  Dumbbell,
  Sparkles,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TimelinePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<EventCategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [events, setEvents] = useState<UnifiedTimelineEvent[]>([]);

  const refreshTimeline = () => {
    setEvents(unifiedTimelineService.getEvents(activeFilter, searchQuery));
  };

  useEffect(() => {
    refreshTimeline();
    const handleUpdate = () => refreshTimeline();
    window.addEventListener('liviq-timeline-updated', handleUpdate);
    return () => window.removeEventListener('liviq-timeline-updated', handleUpdate);
  }, [activeFilter, searchQuery]);

  const getSourceIcon = (source: string, type: string) => {
    if (source === 'INSIGHT') return AlertTriangle;
    if (source === 'MEDSURE') return Pill;
    switch (type) {
      case 'SLEEP': return Moon;
      case 'FOOD': return Utensils;
      case 'ACTIVITY': return Flame;
      case 'HYDRATION': return Droplets;
      case 'WORKOUT':
      case 'GYM':
      case 'YOGA': return Dumbbell;
      default: return HeartPulse;
    }
  };

  const filterCategories: EventCategoryFilter[] = [
    'ALL',
    'FOOD',
    'ACTIVITY',
    'WORKOUT',
    'MEDICINE',
    'SLEEP',
    'HYDRATION',
    'INCIDENT'
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>UNIFIED PERMISSION-BASED STREAM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              CONTINUOUS HEALTH TIMELINE
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Uniting emergency response triage (INSIGHT), medication verification (MEDSURE), and everyday health telemetry (HEALTRACE) into one permission-gated stream.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/replay"
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans text-xs font-extrabold px-5 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>EXPLORE IN HEALTH REPLAY</span>
            </Link>
          </div>
        </div>
      </div>

      {/* STRICT NON-CAUSATION DISCLAIMER BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-3 text-slate-700 text-xs font-sans shadow-sm">
        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-black">Non-Causation Notice:</span> Timeline events represent chronological self-tracking entries. LIVIQ does <span className="underline font-bold">NOT</span> automatically infer medical causation between events or diagnose conditions.
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY FILTER PILLS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 font-sans">
        {/* Real-Time Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search timeline by event title, medicine, food, or notes..."
            className="w-full pl-12 pr-4 py-3 bg-[#FBFBF8] rounded-2xl border border-slate-200 text-sm font-sans text-black focus:outline-none focus:border-[#84CC16]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
          <span className="text-slate-400 font-bold mr-1 shrink-0">FILTER:</span>
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full border font-bold transition shrink-0 ${
                activeFilter === cat
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-[#FBFBF8] border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE EVENT STREAM */}
      <div className="space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-black tracking-tight">Timeline Stream</h2>
          <span className="text-xs font-mono font-bold text-slate-500">{events.length} EVENTS LOADED</span>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            No timeline events match your current filter or search query.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6">
            {events.map((evt) => {
              const IconComp = getSourceIcon(evt.source, evt.type);

              return (
                <div key={evt.id} className="relative group font-sans">
                  {/* Timeline Dot Node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-black group-hover:scale-125 transition" />

                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:border-slate-300 transition space-y-3">
                    {/* Event Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <IconComp className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase">
                              {evt.source} • {evt.type}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${evt.badgeColor}`}>
                              {evt.categoryFilter}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-base text-black mt-0.5">{evt.title}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-black">{evt.timestamp}</span>
                        <span className="text-slate-300">|</span>
                        <span>{evt.dateFormatted}</span>
                      </div>
                    </div>

                    {/* Summary & Notes */}
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{evt.summary}</p>

                    {evt.optionalNotes && (
                      <div className="p-3 rounded-2xl bg-[#FBFBF8] border border-slate-200 text-xs text-slate-600 font-sans italic">
                        "Note: {evt.optionalNotes}"
                      </div>
                    )}

                    {/* Structured Data Payload Details & Privacy Badge */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
                      <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                        <span>DATA:</span>
                        <span className="font-bold text-slate-800">
                          {JSON.stringify(evt.data).replace(/[{""}]/g, ' ')}
                        </span>
                      </div>

                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        evt.privacyPermission === 'PERMITTED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}>
                        {evt.privacyPermission === 'PERMITTED' ? (
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Lock className="w-3 h-3 text-purple-600" />
                        )}
                        <span>{evt.privacyPermission}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
