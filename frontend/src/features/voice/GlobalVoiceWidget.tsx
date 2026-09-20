import React from 'react';
import { Mic, Volume2, VolumeX, X, Sparkles, ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useVoiceAgent } from './VoiceAgentContext';

export const GlobalVoiceWidget: React.FC = () => {
  const {
    voiceState,
    transcript,
    response,
    detectedIntent,
    pendingIntent,
    isActive,
    isMuted,
    errorMessage,
    suggestions,
    deactivateAgent,
    toggleMute,
    executeSuggestion,
    confirmPendingAction,
    cancelPendingAction
  } = useVoiceAgent();

  if (!isActive) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 font-sans select-none">
      {/* SENSITIVE ACTION CONFIRMATION MODAL OVERLAY */}
      {voiceState === 'CONFIRMATION_REQUIRED' && pendingIntent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-500/40 shadow-2xl space-y-5 text-slate-900 font-sans">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider">
                  SENSITIVE ACTION CONFIRMATION
                </span>
                <h3 className="text-xl font-extrabold text-black">
                  {pendingIntent.confirmationTitle || 'Action Confirmation Required'}
                </h3>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-700 leading-relaxed bg-[#FBFBF8] p-4 rounded-2xl border border-slate-200">
              "{pendingIntent.confirmationPrompt || 'Are you sure you want to execute this sensitive operation?'}"
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={cancelPendingAction}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3.5 rounded-full transition border border-slate-200"
              >
                CANCEL
              </button>

              <button
                onClick={confirmPendingAction}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3.5 rounded-full shadow-lg transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>CONFIRM & EXECUTE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Voice Panel Window */}
      <div className="w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xl p-5 space-y-4 text-slate-900 border-t-4 border-t-[#A3E635]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-xs">
              <Mic className="w-4 h-4 text-[#A3E635]" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-black leading-none">LIVIQ Universal Voice</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Common Interaction Layer</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-black transition"
              title={isMuted ? 'Unmute TTS Voice' : 'Mute TTS Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={deactivateAgent}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-black transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voice State Badge & Soundwave Animation */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FBFBF8] border border-slate-200/60 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              voiceState === 'LISTENING' ? 'bg-rose-500 animate-ping' :
              voiceState === 'SPEAKING' ? 'bg-[#84CC16] animate-pulse' :
              voiceState === 'PROCESSING' ? 'bg-amber-400 animate-spin' :
              voiceState === 'CONFIRMATION_REQUIRED' ? 'bg-red-600 animate-bounce' : 'bg-black'
            }`} />
            <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-black">
              {voiceState === 'LISTENING' ? "Listening to mic..." :
               voiceState === 'PROCESSING' ? "Parsing Intent..." :
               voiceState === 'EXECUTING' ? "Executing Action..." :
               voiceState === 'SPEAKING' ? "LIVIQ Speaking..." :
               voiceState === 'CONFIRMATION_REQUIRED' ? "Confirmation Required" : "Ready"}
            </span>
          </div>

          {(voiceState === 'LISTENING' || voiceState === 'SPEAKING') && (
            <div className="flex items-center gap-1 h-4">
              <span className="w-1 bg-[#84CC16] h-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-black h-3 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-[#84CC16] h-4 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Detected Intent Badge */}
        {detectedIntent && (
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">DETECTED INTENT:</span>
            <span className="font-bold text-black bg-white border border-slate-300 px-2 py-0.5 rounded">
              {detectedIntent.action}
            </span>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
            {errorMessage}
          </div>
        )}

        {/* Conversation Bubble */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
          {transcript && (
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-800 font-sans border border-slate-200/60">
              <strong className="text-black block text-[10px] font-mono uppercase mb-0.5">Live Transcript:</strong>
              "{transcript}"
            </div>
          )}

          {response && (
            <div className="p-3 rounded-2xl bg-black text-white font-sans border border-slate-800 shadow-sm">
              <strong className="text-[#A3E635] block text-[10px] font-mono uppercase mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#A3E635]" /> LIVIQ:
              </strong>
              "{response}"
            </div>
          )}
        </div>

        {/* Contextual Suggestions Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            SAMPLE VOICE COMMANDS
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, 4).map((sug) => (
              <button
                key={sug.text}
                onClick={() => executeSuggestion(sug)}
                className="px-3 py-1.5 rounded-full bg-[#FBFBF8] hover:bg-black hover:text-white border border-slate-200 text-slate-700 text-[11px] font-sans font-semibold transition flex items-center gap-1"
              >
                <span>"{sug.text}"</span>
                <ArrowRight className="w-3 h-3 text-[#84CC16]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalVoiceWidget;
