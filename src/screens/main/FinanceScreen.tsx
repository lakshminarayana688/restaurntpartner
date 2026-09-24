import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndianRupee,
  TrendingUp,
  Download,
  CreditCard,
  Building,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const FinanceScreen: React.FC = () => {
  const { restaurant, settlements, showToast, currentUserRole, setScreen } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Role Gate: Finance is strictly OWNER only
  if (currentUserRole !== 'OWNER') {
    return (
      <div className="p-6 sm:p-12 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 text-slate-500 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Finance & Banking Restricted</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Access to bank accounts, statutory tax reports, and financial settlement ledgers is restricted strictly to the <strong>Restaurant Owner</strong>.
        </p>
        <button
          onClick={() => setScreen('dashboard')}
          className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const grossRevenue = settlements.reduce((sum, s) => sum + s.grossAmount, 0);
  const totalCommission = settlements.reduce((sum, s) => sum + s.commission, 0);
  const totalTaxes = settlements.reduce((sum, s) => sum + s.taxes, 0);
  const netSettled = settlements.reduce((sum, s) => sum + s.netPayout, 0);

  // Bank masking: display only last 4 digits
  const bankLast4 = restaurant.bankAccount.slice(-4) || '9921';
  const maskedAccount = `•••• •••• •••• ${bankLast4}`;
  const maskedIfsc = `${restaurant.ifscCode.slice(0, 4)}•••••••`;

  const handleRequestPayout = () => {
    showToast('Direct bank settlement for today’s balance initiated! Funds clearing via NEFT.', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              Merchant ID: FD-BLR-{bankLast4}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Settlement Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Finance & Settlements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated daily bank payouts, commission deductions, GST tax invoices, and bank account settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('Financial settlement ledger exported to PDF', 'info')}
            className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Gross Orders
          </span>
          <h3 className="text-3xl font-black text-slate-900">
            ₹{grossRevenue.toLocaleString('en-IN')}
          </h3>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Verified by Payment Gateway
          </span>
        </div>

        {/* Card 2: Platform Commission & GST */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Commission & Platform GST
          </span>
          <h3 className="text-3xl font-black text-slate-700">
            ₹{(totalCommission + totalTaxes).toLocaleString('en-IN')}
          </h3>
          <span className="text-xs text-slate-400">18% Commission + 18% GST on Fee</span>
        </div>

        {/* Card 3: Net Settled Amount */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Net Paid Out to Bank
          </span>
          <h3 className="text-3xl font-black text-emerald-600">
            ₹{netSettled.toLocaleString('en-IN')}
          </h3>
          <span className="text-xs text-slate-500">Transferred directly to {restaurant.bankName.split(' ')[0]}</span>
        </div>

        {/* Card 4: Next Expected Payout */}
        <div className="bg-gradient-to-br from-feedo-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg shadow-feedo-500/20 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-feedo-100">
              Next Daily Settlement
            </span>
            <h3 className="text-3xl font-black">₹14,207</h3>
            <span className="text-[11px] text-amber-100">Scheduled: Tomorrow 10:00 AM</span>
          </div>
          <button
            onClick={handleRequestPayout}
            className="w-full py-2 px-3 bg-white text-feedo-700 hover:bg-feedo-50 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Request Instant Payout →
          </button>
        </div>
      </div>

      {/* Verified Bank Account Panel & Q1 Tax Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Account Details (Masked) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Settlement Bank Account</h3>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  ✓ Verified for Automated Daily NEFT Clearing
                </p>
              </div>
            </div>
            <button
              onClick={() => showToast('Bank modifications require KYC re-verification with OTP', 'info')}
              className="text-xs font-bold text-feedo-600 hover:underline cursor-pointer"
            >
              Update Bank
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span>
              <span className="font-bold text-slate-900">{restaurant.bankName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Account (Masked)</span>
              <span className="font-mono font-bold text-slate-900">{maskedAccount}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">IFSC Code</span>
              <span className="font-mono font-bold text-slate-700">{maskedIfsc}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Payout Cadence</span>
              <span className="font-bold text-emerald-700">Daily by 10:00 AM</span>
            </div>
          </div>
        </div>

        {/* GST & Tax Compliance */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-feedo-950 rounded-3xl p-6 text-white shadow-lg space-y-3 flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black">Statutory GST & TCS Summary</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              TCS (Tax Collected at Source under GST Section 52) certificates and monthly GSTR-8 input tax credit filings are generated automatically.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-300">
              GSTIN: {restaurant.gstNumber || '29AABCL9921D1Z8'}
            </span>
            <button
              onClick={() => showToast('GSTR-8 monthly report downloaded', 'success')}
              className="px-4 py-2 bg-feedo-500 hover:bg-feedo-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Download GSTR-8 →
            </button>
          </div>
        </div>
      </div>

      {/* Settlement Records Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Settlement Ledger & Bank Reference IDs</h3>
            <p className="text-xs text-slate-500">Immutable financial payout transaction records with UTR clearing numbers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Settlement Ref</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Gross Sales</th>
                <th className="pb-3 px-3">Commission (18%)</th>
                <th className="pb-3 px-3">Taxes</th>
                <th className="pb-3 px-3">Net Payout</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlements.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    {record.payoutRef}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">{record.date}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    ₹{record.grossAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    -₹{record.commission.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    -₹{record.taxes.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-black text-emerald-600">
                    ₹{record.netPayout.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        record.status === 'SETTLED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {record.status === 'SETTLED' ? '✓ Settled' : '⏳ Processing'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => showToast(`Settlement receipt ${record.payoutRef} downloaded`, 'success')}
                      className="text-xs font-bold text-feedo-600 hover:underline cursor-pointer"
                    >
                      View Receipt →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
