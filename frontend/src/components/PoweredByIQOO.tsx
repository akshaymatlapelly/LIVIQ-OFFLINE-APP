import React, { useState, useEffect } from 'react';

export const PoweredByIQOO: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrolled > 30) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 transition-all duration-300 ease-in-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800/90 hover:border-amber-400/60 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2.5 text-white select-none transition-all duration-300 group cursor-default">
        {/* iQOO Brand Pulse Indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
        </span>

        <div className="flex items-center gap-1.5 font-sans">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
            POWERED BY
          </span>
          <span className="text-xs font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
            iQOO
          </span>
        </div>
      </div>
    </div>
  );
};

export default PoweredByIQOO;
