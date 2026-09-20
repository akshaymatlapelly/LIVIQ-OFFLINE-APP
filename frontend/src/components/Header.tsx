import { AIStatus } from './AIStatus';
import { useAuth } from '../context/AuthContext';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';
import { Shield, Bell, LogOut, Mic, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenSignOutModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onOpenSignOutModal }) => {
  const { user } = useAuth();
  const { activateAgent } = useVoiceAgent();

  return (
    <header className="sticky top-0 z-30 bg-[#FBFBF8]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between font-sans">
      {/* Left: Mobile 3-Dots Menu Button + Mobile Logo & AI Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 3-Dots Menu Button for Mobile */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-full bg-white border border-slate-200 text-black hover:bg-slate-100 transition shadow-sm"
          title="Open Navigation Menu"
        >
          <MoreVertical className="w-4 h-4 text-black" />
        </button>

        <Link to="/home" className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs relative">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] absolute -top-0.5 -right-0.5" />
            LQ
          </div>
          <span className="font-extrabold font-sans text-lg tracking-tight text-black">
            LIVIQ<span className="text-[#84CC16]">.</span>
          </span>
        </Link>

        <div className="hidden md:block">
          <AIStatus status="ACTIVE" mode="LIVIQ NPU Engine" />
        </div>
      </div>

      {/* Right: LIVIQ.Voice Agent Pill + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* LIVIQ.Voice Button Pill */}
        <button
          onClick={activateAgent}
          className="flex items-center gap-2.5 bg-black hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-full shadow-sm border border-slate-800 transition transform hover:scale-105"
          title="Activate LIVIQ Voice Assistant"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A3E635]" />
          </span>
          <Mic className="w-3.5 h-3.5 text-[#A3E635]" />
          <div className="text-left font-sans leading-tight">
            <div className="text-xs font-extrabold text-white flex items-center">
              LIVIQ<span className="text-[#A3E635]">.Voice</span>
            </div>
            <div className="text-[8px] text-slate-400 font-mono">Say "LIVIQ"</div>
          </div>
        </button>

        {/* Bell Alert Button */}
        <button
          className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-black transition shadow-sm"
          title="Health Alerts & Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User Profile Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition transform hover:scale-[1.02]"
          title="Manage Health Profile & Voice Language Settings"
        >
          <div className="w-7 h-7 rounded-full bg-[#A3E635] text-black flex items-center justify-center font-sans font-black text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <div className="hidden md:block text-left pr-1">
            <div className="text-xs font-bold text-black leading-none">{user?.name ? user.name.split(' ')[0] : 'demo'}</div>
            <div className="text-[10px] font-sans text-slate-500">{user?.email || 'demo@liviq.health'}</div>
          </div>
        </Link>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onOpenSignOutModal}
          className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 transition shadow-sm"
          title="Sign out to landing page"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
