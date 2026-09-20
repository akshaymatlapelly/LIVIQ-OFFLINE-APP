import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, AlertTriangle, Pill, HeartPulse } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Insight', path: '/insight', icon: AlertTriangle },
    { name: 'MedSure', path: '/medsure', icon: Pill, isCenter: true },
    { name: 'HealTrace', path: '/healtrace', icon: HeartPulse },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isCenter) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative -top-4 flex flex-col items-center justify-center"
              >
                <div className="w-13 h-13 rounded-full bg-black text-white flex items-center justify-center shadow-lg border-2 border-[#A3E635]">
                  <Icon className="w-6 h-6 text-[#A3E635]" />
                </div>
                <span className="text-[9px] font-mono font-bold text-black mt-1">SCAN</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-1 text-[10px] font-sans font-medium transition-colors ${
                  isActive ? 'text-black font-bold' : 'text-slate-400 hover:text-slate-700'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
