import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export const OtpScreen: React.FC = () => {
  const { setScreen, restaurant, showToast } = useApp();
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(28);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) {
      showToast('Please enter complete 6-digit OTP', 'error');
      return;
    }

    soundEffects.playAcceptTone();
    showToast('Mobile verified successfully!', 'success');

    // If restaurant is approved, go to dashboard, else guide to registration / setup
    if (restaurant.regStatus === 'APPROVED' || restaurant.regStatus === 'ACTIVE') {
      setScreen('dashboard');
    } else if (restaurant.regStatus === 'UNDER_REVIEW') {
      setScreen('verification_status');
    } else {
      setScreen('register');
    }
  };

  const fillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    showToast('Demo OTP 123456 auto-filled', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
        {/* Back Button */}
        <button
          onClick={() => setScreen('login')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="inline-flex p-3 bg-feedo-50 text-feedo-600 rounded-2xl mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verify Mobile OTP</h2>
          <p className="text-xs text-slate-500 mt-1">
            OTP sent to <span className="font-bold text-slate-800">{restaurant.ownerPhone || '+91 98765 43210'}</span>
          </p>
        </div>

        {/* Demo Helper Pill */}
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
          <div className="text-xs text-amber-900">
            <span className="font-bold">Prototype Demo Code:</span> <code className="bg-amber-100 px-1.5 py-0.5 rounded font-bold">123456</code>
          </div>
          <button
            type="button"
            onClick={fillDemoOtp}
            className="text-xs font-bold text-feedo-700 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs hover:bg-amber-50 cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* 6-digit Inputs */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 sm:w-13 sm:h-15 text-center text-xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-feedo-500 focus:bg-white focus:outline-hidden transition-all shadow-2xs"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-feedo-500 to-feedo-600 hover:from-feedo-600 hover:to-feedo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-feedo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Continue</span>
          </button>
        </form>

        {/* Resend & Timer */}
        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p className="text-xs text-slate-400">
              Resend OTP in <span className="font-bold text-slate-600">00:{timer < 10 ? `0${timer}` : timer}</span>
            </p>
          ) : (
            <button
              onClick={() => {
                setTimer(30);
                showToast('New OTP sent to your phone', 'info');
              }}
              className="text-xs font-bold text-feedo-600 hover:underline cursor-pointer"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
