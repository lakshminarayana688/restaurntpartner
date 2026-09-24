import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, ArrowRight, ShieldCheck, Store, UtensilsCrossed } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setScreen, restaurant, updateRestaurant, showToast } = useApp();
  const [mobileNumber, setMobileNumber] = useState('9876543210');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    updateRestaurant({ ownerPhone: `+91 ${mobileNumber.slice(0, 5)} ${mobileNumber.slice(5)}` });
    showToast('OTP sent successfully (Use demo code 123456)', 'info');
    setScreen('otp');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-feedo-600 to-feedo-400 flex items-center justify-center text-white shadow-lg shadow-feedo-500/25 mb-4">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">FEEDO Partner</h1>
          <p className="text-xs text-slate-500 mt-1">Login to your restaurant dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleContinue} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-600 text-sm font-bold border-r border-slate-200 pr-2.5">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit number"
                className="w-full pl-24 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-sm tracking-wider focus:outline-hidden focus:border-feedo-500 focus:bg-white transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              We will send a 6-digit verification code to this number.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-feedo-500 to-feedo-600 hover:from-feedo-600 hover:to-feedo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-feedo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400">
            or
          </span>
        </div>

        {/* Register Restaurant CTA */}
        <div className="text-center space-y-3">
          <button
            type="button"
            onClick={() => setScreen('register')}
            className="w-full py-3 px-4 rounded-2xl border border-feedo-200 bg-feedo-50/50 hover:bg-feedo-50 text-feedo-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>Register New Restaurant</span>
          </button>

          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Official FEEDO Partner Portal
          </p>
        </div>
      </div>
    </div>
  );
};
