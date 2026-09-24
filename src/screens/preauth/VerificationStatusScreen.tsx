import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  FileCheck,
  ShieldCheck,
  Store,
  ArrowRight,
} from 'lucide-react';

export const VerificationStatusScreen: React.FC = () => {
  const { restaurant, simulateApproval, setScreen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10 text-center">
        {/* Animated Badge */}
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-amber-500/10 animate-bounce-slow">
          <Clock className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Under FEEDO Review
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8">
          Your restaurant application for <strong className="text-slate-800">{restaurant.restaurantName}</strong> is currently being verified by the FEEDO partner onboarding team.
        </p>

        {/* Verification Timeline Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-4 mb-8">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Restaurant Registration</h4>
              <p className="text-[11px] text-slate-500">Completed with owner & address details</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Documents Submitted</h4>
              <p className="text-[11px] text-slate-500">FSSAI, PAN, Bank Proof uploaded</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 animate-pulse">
              ●
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-amber-700">FEEDO Verification</h4>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                  Under Review
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Quality check and hygiene audit in progress</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              ○
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400">Restaurant Approval & Launch</h4>
              <p className="text-[11px] text-slate-400">Pending verification completion</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setScreen('documents')}
            className="w-full py-3 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
          >
            View Submitted Documents
          </button>

          {/* Prototype Demo Fast-Forward Button */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Prototype Admin Demo Shortcut:</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              In real production, this takes 24 hours. For this prototype review, click below to instantly simulate FEEDO approval!
            </p>
            <button
              onClick={simulateApproval}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>[ Simulate Approval ] → Approve Restaurant Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
