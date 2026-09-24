import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndianRupee,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const EarningsScreen: React.FC = () => {
  const { settlements, restaurant, showToast } = useApp();

  const todayEarnings = 12450;
  const weeklyEarnings = 78540;
  const monthlyEarnings = 284650;

  const grossSales = 18450;
  const commission = 3321; // 18%
  const taxes = 922; // 5% GST
  const netPayout = 14207;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Earnings & Settlements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of gross sales, platform commissions, and daily bank payouts.
          </p>
        </div>

        <button
          onClick={() => showToast('Settlement invoice downloaded as PDF', 'success')}
          className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-2 self-start sm:self-auto transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download Statement</span>
        </button>
      </div>

      {/* Top Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today */}
        <div className="bg-gradient-to-br from-feedo-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg shadow-feedo-500/20 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-feedo-100">
            Today's Net Payout
          </span>
          <h2 className="text-3xl font-black">₹{todayEarnings.toLocaleString('en-IN')}</h2>
          <div className="flex items-center gap-1.5 text-xs text-feedo-100">
            <TrendingUp className="w-4 h-4" />
            <span>24 customer orders settled</span>
          </div>
        </div>

        {/* Weekly */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Weekly Net Earnings
          </span>
          <h2 className="text-3xl font-black text-slate-900">₹{weeklyEarnings.toLocaleString('en-IN')}</h2>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+18.4% growth vs last week</span>
          </div>
        </div>

        {/* Monthly */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Monthly Revenue
          </span>
          <h2 className="text-3xl font-black text-slate-900">₹{monthlyEarnings.toLocaleString('en-IN')}</h2>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>All past invoices settled</span>
          </div>
        </div>
      </div>

      {/* Financial Settlement Breakdown & Bank Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settlement Formula breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Daily Payout Calculation (Latest Cycle)</h3>
            <p className="text-xs text-slate-500">Cycle: 18 Sep 2026 • 24 Orders</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="font-semibold text-slate-700">Gross Food Sales</span>
              <span className="font-mono font-bold text-slate-900 text-sm">₹{grossSales.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-rose-700">
              <span>FEEDO Platform Commission (18%)</span>
              <span className="font-mono font-bold">- ₹{commission.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-slate-600">
              <span>GST on Platform Services (5%)</span>
              <span className="font-mono font-bold">- ₹{taxes.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-slate-600">
              <span>Adjustments / Discounts Contribution</span>
              <span className="font-mono font-bold">₹0.00</span>
            </div>

            <div className="flex justify-between items-center py-3 bg-emerald-50 px-4 rounded-2xl border border-emerald-200 text-sm font-black text-emerald-950">
              <span>Net Bank Settlement (NEFT)</span>
              <span className="font-mono text-base text-emerald-700">₹{netPayout.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Bank Account Verification (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Registered Settlement Account</h3>
                <p className="text-[11px] text-emerald-600 font-semibold">✓ Verified for Auto-Payout</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Bank Name</span>
                <span className="font-bold text-slate-800">{restaurant.bankName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Account Number</span>
                <span className="font-mono font-bold text-slate-900">{restaurant.bankAccount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">IFSC Code</span>
                <span className="font-mono font-bold text-slate-700">{restaurant.ifscCode}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            Daily earnings are automatically transferred to this bank account every morning by 10:00 AM.
          </p>
        </div>
      </div>

      {/* Settlement History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Settlement Ledger History</h3>
          <p className="text-xs text-slate-500">Past daily transfers and reference UTRs</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Cycle Period</th>
                <th className="pb-3 px-3">Gross Sales</th>
                <th className="pb-3 px-3">Commission</th>
                <th className="pb-3 px-3">Net Payout</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">UTR Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlements.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{item.date}</td>
                  <td className="py-3 px-3 text-slate-500">{item.period}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">₹{item.grossAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-mono text-rose-600">- ₹{item.commission.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-mono font-black text-emerald-600">
                    ₹{item.netPayout.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ Settled
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{item.payoutRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
