import React, { useState } from 'react';
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { GlobalVoiceWidget } from '../features/voice/GlobalVoiceWidget';
import {
  Home,
  AlertTriangle,
  Pill,
  HeartPulse,
  PlayCircle,
  LogOut,
  Plus,
  User,
  HelpCircle,
  X
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const mainNav = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle },
    { name: 'INSIGHT', path: '/insight', icon: AlertTriangle, badge: 'Emergency' },
    { name: 'MEDSURE', path: '/medsure', icon: Pill, badge: 'Medicine' },
    { name: 'HEALTRACE', path: '/healtrace', icon: HeartPulse, badge: 'Health' },
    { name: 'User Profile', path: '/profile', icon: User },
    { name: 'Demo Tour', path: '/demo', icon: PlayCircle },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBF8] flex flex-col items-center justify-center text-slate-800 font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-black border-t-transparent animate-spin mb-4" />
        <div className="text-xs font-mono tracking-widest uppercase">Initializing LIVIQ Health Intelligence...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBF8] flex flex-col lg:flex-row text-slate-900 font-sans relative">
      <Sidebar onOpenSignOutModal={() => setIsSignOutModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSignOutModal={() => setIsSignOutModalOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <MobileNav />

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85%] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 font-sans">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <Link
                  to="/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-xs relative">
                    <span className="w-2 h-2 rounded-full bg-[#A3E635] absolute -top-0.5 -right-0.5" />
                    LQ
                  </div>
                  <span className="font-extrabold font-sans text-xl tracking-tight text-black">
                    LIVIQ<span className="text-[#84CC16]">.</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* NPU Telemetry Box */}
              <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-slate-200/80 space-y-1">
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  LIVIQ NPU ENGINE
                </div>
                <div className="text-lg font-extrabold text-black font-mono">
                  38 TOPS
                </div>
                <div className="text-[10px] font-sans text-slate-500">
                  Local health hardware active
                </div>
              </div>

              {/* Navigation items */}
              <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
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
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Link
                to="/insight"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4 text-black stroke-[3]" />
                <span>New Health Scan</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSignOutModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-sans font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGN OUT CONFIRMATION POP-UP MODAL */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-slate-200 shadow-2xl space-y-5 transform transition-all scale-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-black font-sans">Sign Out</h3>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">Confirm session end</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Are you sure you want to sign out of your LIVIQ session?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSignOutModalOpen(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-sans font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignOutModalOpen(false);
                  logout();
                  window.location.href = '/';
                }}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-sans font-extrabold shadow-md transition"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global LIVIQ Voice Agent Control Layer */}
      <GlobalVoiceWidget />
    </div>
  );
};
