import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  AlertTriangle,
  Pill,
  HeartPulse,
  PlayCircle,
  LogOut,
  Plus,
  User,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onOpenSignOutModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSignOutModal }) => {
  const mainNav = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle },
    { name: 'INSIGHT', path: '/insight', icon: AlertTriangle, badge: 'Emergency' },
    { name: 'MEDSURE', path: '/medsure', icon: Pill, badge: 'Medicine' },
    { name: 'HEALTRACE', path: '/healtrace', icon: HeartPulse, badge: 'Health' },
    { name: 'User Profile', path: '/profile', icon: User },
    { name: 'Demo Tour', path: '/demo', icon: PlayCircle },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white h-screen sticky top-0 z-40 p-5 justify-between select-none font-sans">
      <div className="space-y-6">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 px-1">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-xs relative">
            <span className="w-2 h-2 rounded-full bg-[#A3E635] absolute -top-0.5 -right-0.5" />
            LQ
          </div>
          <span className="font-extrabold font-sans text-xl tracking-tight text-black">
            LIVIQ<span className="text-[#84CC16]">.</span>
          </span>
        </Link>

        {/* LIVIQ NPU Engine Telemetry Box */}
        <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            LIVIQ NPU ENGINE
          </div>
          <div className="text-xl font-extrabold text-black font-mono">
            38 TOPS
          </div>
          <div className="text-[11px] font-sans text-slate-500">
            Local health hardware active
          </div>
        </div>

        {/* Navigation List */}
        <div className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-full font-sans text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:text-black hover:bg-stone-100/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 group-hover:bg-slate-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <Link
          to="/insight"
          className="w-full bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 text-black stroke-[3]" />
          <span>New Health Scan</span>
        </Link>

        <button
          type="button"
          onClick={onOpenSignOutModal}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-sans font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>

      </div>
    </aside>
  );
};

