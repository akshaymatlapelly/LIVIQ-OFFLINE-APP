import React from 'react';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';
import { Mic, Volume2, Globe, Sparkles, Shield, CheckCircle2, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VoicePage: React.FC = () => {
  const { activateAgent, isActive, voiceState, transcript, response, suggestions, executeSuggestion } = useVoiceAgent();
  const { user } = useAuth();

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'te-IN', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada (కన్నడ)', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
            <Mic className="w-3.5 h-3.5" />
            <span>LIVIQ VOICE INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Hands-Free Health Assistant
          </h1>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Multi-lingual voice command intent engine for hands-free navigation across INSIGHT emergency triage, MEDSURE medication checks, and HEALTRACE document logs.
          </p>

          <button
            type="button"
            onClick={activateAgent}
            className="mt-2 bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-extrabold text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-lg transition transform hover:scale-105"
          >
            <Mic className="w-4 h-4 text-black" />
            <span>Activate LIVIQ Voice Now</span>
          </button>
        </div>
      </div>

      {/* Grid: Voice Status & Language Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Voice Command Console */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              <h2 className="text-sm font-extrabold text-black font-sans">Voice Intent Console</h2>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              STATE: {voiceState}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Live Speech Transcript:</div>
            <div className="text-xs font-mono font-bold text-black min-h-[32px]">
              {transcript || 'Say "Open INSIGHT", "Check medicine", or "Show health timeline"...'}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-black">Try Saying (Quick Action Chips):</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 4).map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => executeSuggestion(sug)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-800 font-sans text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>"{sug.text}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Supported Voice Languages */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-black" />
            <h2 className="text-sm font-extrabold text-black">Supported Voice Languages</h2>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            LIVIQ Voice dynamically parses intent and speaks responses in your preferred language set in your User Profile.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            {supportedLanguages.map((lang) => (
              <div
                key={lang.code}
                className={`p-2.5 rounded-2xl border flex items-center justify-between ${
                  (user?.preferredLanguage || 'en-US') === lang.code
                    ? 'bg-[#ECFDF5] border-[#84CC16] font-bold text-slate-900'
                    : 'bg-[#FBFBF8] border-slate-200 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span className="text-[11px]">{lang.name}</span>
                </span>
                {(user?.preferredLanguage || 'en-US') === lang.code && (
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
