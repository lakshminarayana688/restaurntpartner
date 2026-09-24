import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, UtensilsCrossed } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setScreen } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('onboarding');
    }, 2800);
    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-feedo-950 flex flex-col items-center justify-between p-8 text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-feedo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full flex justify-end">
        <button
          onClick={() => setScreen('onboarding')}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-full border border-slate-800 hover:border-slate-700 transition-colors"
        >
          Skip Intro →
        </button>
      </div>

      {/* Center FEEDO Brand */}
      <div className="flex flex-col items-center text-center max-w-sm z-10 animate-in fade-in zoom-in duration-700">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-feedo-600 via-feedo-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-feedo-500/40 border border-feedo-400/30">
            <UtensilsCrossed className="w-12 h-12 text-white stroke-[2.2]" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-slate-950 shadow-md">
            PARTNER
          </span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white mb-2">
          FEEDO <span className="text-feedo-400">Partner</span>
        </h1>
        <p className="text-slate-300 text-sm font-medium mb-1">
          Restaurant Partner App
        </p>
        <p className="text-slate-400 text-xs max-w-xs">
          Grow your restaurant business with FEEDO
        </p>

        {/* Loading shimmer bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-10">
          <div className="h-full bg-gradient-to-r from-amber-400 to-feedo-500 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] w-full" />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center z-10">
        <p className="text-[11px] text-slate-500">
          Trusted by 10,000+ top restaurants across India
        </p>
      </div>
    </div>
  );
};
