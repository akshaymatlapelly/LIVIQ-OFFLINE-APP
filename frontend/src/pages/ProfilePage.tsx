import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { speechService } from '../features/voice/speechService';
import {
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  Volume2,
  Shield,
  Save,
  CheckCircle,
  Cpu,
  Mic,
  Sparkles,
  Info
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', native: 'English', flag: '🇺🇸', sampleText: 'Hello! I am LIVIQ Voice Agent, ready to assist you.' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', sampleText: 'నమస్కారం! నేను లివిక్ వాయిస్ ఏజెంట్, మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', sampleText: 'नमस्ते! मैं लिविक वॉयस एजेंट हूँ, आपकी सहायता के लिए तैयार हूँ।' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', sampleText: 'வணக்கம்! நான் லிவிக் வாய்ஸ் ஏஜென்ட், உங்களுக்கு உதவ தயாராக உள்ளேன்.' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', sampleText: 'ನಮಸ್ಕಾರ! ನಾನು ಲಿವಿಕ್ ವಾಯ್ಸ್ ಏಜೆಂಟ್, ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧನಾಗಿದ್ದೇನೆ.' },
  { code: 'es-ES', name: 'Spanish', native: 'Español', flag: '🇪🇸', sampleText: '¡Hola! Soy el Agente de Voz LIVIQ, listo para ayudarte.' },
  { code: 'fr-FR', name: 'French', native: 'Français', flag: '🇫🇷', sampleText: 'Bonjour! Je suis l\'agent vocal LIVIQ, prêt à vous aider.' },
  { code: 'de-DE', name: 'German', native: 'Deutsch', flag: '🇩🇪', sampleText: 'Hallo! Ich bin der LIVIQ-Sprachassistent, bereit Ihnen zu helfen.' }
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Akshay Mercer');
  const [email] = useState(user?.email || 'demo@liviq.ai');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [bio, setBio] = useState(user?.bio || 'Senior Field Intelligence Analyst');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en-US');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingVoice, setTestingVoice] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        name,
        phone,
        bio,
        preferredLanguage
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestVoice = () => {
    const selectedLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === preferredLanguage);
    const sampleText = selectedLangObj ? selectedLangObj.sampleText : 'Hello! Voice agent is active.';

    setTestingVoice(true);
    speechService.speak(sampleText, preferredLanguage, () => {
      setTestingVoice(false);
    });
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === preferredLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-3xl p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-[#A3E635] text-black font-extrabold text-3xl flex items-center justify-center border-4 border-white/20 shadow-xl">
            {name ? name.charAt(0).toUpperCase() : 'A'}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{name}</h1>
              <span className="bg-[#A3E635]/20 text-[#A3E635] text-xs font-mono px-3 py-1 rounded-full font-bold border border-[#A3E635]/30">
                PRO OFFICER
              </span>
            </div>
            <p className="text-slate-300 text-sm">{email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#A3E635]" />
                Voice Language: <strong className="text-white">{currentLang.flag} {currentLang.native}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#A3E635]" />
                NPU Voice Engine: <strong className="text-white">Active</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl flex items-center justify-between shadow-sm animate-slideDown">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">Profile updated successfully! Your voice agent preferences have been saved.</span>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Personal Profile Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#A3E635]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-black">Personal Information</h2>
              <p className="text-xs text-slate-500">Update your basic profile details and contact information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none font-sans text-sm text-slate-900 bg-white"
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-sans text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none font-sans text-sm text-slate-900 bg-white"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Role / Bio */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Role & Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none font-sans text-sm text-slate-900 bg-white"
                placeholder="Describe your role or assignment..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Multilingual Voice Agent Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#A3E635]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-black flex items-center gap-2">
                  LIVIQ Voice Agent Language
                  <span className="bg-[#A3E635] text-black text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                    Multilingual Core
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Select the language for voice speech recognition & text-to-speech feedback</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Language Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = preferredLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setPreferredLanguage(lang.code)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-black bg-black text-white shadow-md ring-2 ring-[#A3E635]'
                        : 'border-slate-200 bg-[#FBFBF8] text-slate-800 hover:border-slate-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-2xl">{lang.flag}</span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm leading-tight">{lang.native}</div>
                      <div className={`text-xs font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {lang.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Test Voice Banner */}
            <div className="p-5 rounded-2xl bg-[#FBFBF8] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black">Voice Synthesis Test</div>
                  <div className="text-xs text-slate-500">
                    Test how LIVIQ Voice Agent speaks in <strong>{currentLang.flag} {currentLang.name} ({currentLang.native})</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestVoice}
                disabled={testingVoice}
                className="w-full sm:w-auto bg-black hover:bg-slate-800 text-white font-sans font-bold text-xs px-4 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Sparkles className={`w-4 h-4 text-[#A3E635] ${testingVoice ? 'animate-spin' : ''}`} />
                <span>{testingVoice ? 'Speaking...' : 'Test Voice Output'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Multi-language Note:</strong> Changing your language instantly updates both Speech Recognition (listening) and Speech Synthesis (speaking) for all LIVIQ commands across the app.
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-black hover:bg-slate-800 text-white font-sans font-extrabold text-sm px-8 py-3.5 rounded-full flex items-center gap-2 shadow-md transition transform hover:scale-[1.02] disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#A3E635]" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
