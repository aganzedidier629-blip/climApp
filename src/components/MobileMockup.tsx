import React, { useState, useEffect } from 'react';
import { Battery, Wifi, ShieldAlert } from 'lucide-react';

interface MobileMockupProps {
  children: React.ReactNode;
  title?: string;
}

export default function MobileMockup({ children }: MobileMockupProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-8 overflow-hidden font-sans select-none">
      {/* Decorative ambient background blur lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Smartphone Outer Shell (only active on md+ screens) */}
      <div className="relative w-full max-w-md h-full md:h-[840px] md:max-w-[412px] md:rounded-[48px] md:border-[10px] md:border-slate-800 md:shadow-2xl md:shadow-teal-950/40 bg-slate-900 flex flex-col overflow-hidden transition-all duration-300 md:ring-4 md:ring-slate-700/30">
        
        {/* Notch - Speaker/Camera representation */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-slate-800 rounded-b-2xl z-50 items-center justify-center">
          <div className="w-12 h-1 bg-slate-900 rounded-full mb-1" />
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute right-8 top-1.5 border border-slate-800" />
        </div>

        {/* Mobile Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-[11px] text-teal-300 bg-slate-950/70 border-b border-slate-800/40 backdrop-blur-md z-40 shrink-0 select-none">
          <span className="font-semibold tracking-wide">{time || '12:00'}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-medium uppercase tracking-wider text-teal-400 bg-teal-950/50 px-1.5 py-0.5 rounded border border-teal-800/30">5G</span>
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <div className="flex items-center gap-0.5">
              <Battery className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Dynamic App Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900 text-white relative">
          {children}
        </div>

        {/* Home Indicator Bar (for mobile feel) */}
        <div className="hidden md:flex justify-center items-center py-2 bg-slate-950 shrink-0 border-t border-slate-900 z-40 select-none">
          <div className="w-32 h-1 bg-slate-700 rounded-full hover:bg-teal-500 transition-colors duration-200" />
        </div>
      </div>
    </div>
  );
}
