import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, UtensilsCrossed, Bike, ArrowRight, Check } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { setScreen } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'Grow Your Restaurant',
      subtitle: 'Reach more customers with FEEDO.',
      description: 'Expand your reach across the city, increase table turnover and boost online orders with high-visibility FEEDO promotions.',
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500',
      badge: 'Revenue Growth',
    },
    {
      title: 'Manage Orders Easily',
      subtitle: 'Receive, accept and manage orders from one place.',
      description: 'Real-time kitchen order tracking, instant prep timers, item level customization, and seamless packaging checklists.',
      icon: UtensilsCrossed,
      color: 'from-feedo-500 to-rose-500',
      badge: 'Order Management',
    },
    {
      title: 'Deliver More',
      subtitle: 'Connect with FEEDO delivery partners and grow your business.',
      description: 'Automated rider assignment within seconds, live map tracking, secure 4-digit OTP handover and lightning fast deliveries.',
      icon: Bike,
      color: 'from-indigo-500 to-feedo-600',
      badge: 'Express Delivery',
    },
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      setScreen('login');
    }
  };

  const current = slides[activeSlide];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 sm:p-10 max-w-lg mx-auto">
      {/* Top Header with Skip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-feedo-500 flex items-center justify-center text-white font-black text-sm">
            F
          </div>
          <span className="font-bold text-slate-900 text-sm">FEEDO Partner</span>
        </div>
        <button
          onClick={() => setScreen('login')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1.5 px-3 rounded-lg hover:bg-slate-200/60 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="py-8 flex flex-col items-center text-center">
        {/* Animated Icon Card */}
        <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr ${current.color} flex items-center justify-center text-white shadow-xl mb-8 transform transition-all duration-500`}>
          <Icon className="w-18 h-18 sm:w-22 sm:h-22 stroke-[1.8]" />
        </div>

        <span className="inline-block px-3 py-1 bg-feedo-50 text-feedo-700 text-xs font-bold rounded-full mb-3 border border-feedo-200">
          {current.badge}
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          {current.title}
        </h2>
        <p className="text-sm font-semibold text-feedo-600 mb-3">
          {current.subtitle}
        </p>
        <p className="text-xs text-slate-600 max-w-xs sm:max-w-sm leading-relaxed">
          {current.description}
        </p>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center gap-2 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === idx ? 'w-8 bg-feedo-500' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-feedo-500 to-feedo-600 hover:from-feedo-600 hover:to-feedo-700 text-white font-bold text-sm shadow-lg shadow-feedo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{activeSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {activeSlide === slides.length - 1 && (
          <button
            onClick={() => setScreen('register')}
            className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-feedo-600 transition-colors"
          >
            New Restaurant? <span className="text-feedo-600 font-bold underline">Register Here</span>
          </button>
        )}
      </div>
    </div>
  );
};
