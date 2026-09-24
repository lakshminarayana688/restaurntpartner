import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndianRupee,
  TrendingUp,
  DollarSign,
  Download,
  CreditCard,
  Wallet,
  Building,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Sparkles,
  PieChart,
} from 'lucide-react';

export const FinanceScreen: React.FC = () => {
  const { restaurant, showToast } = useApp();
  const [selectedQuarter, setSelectedQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');

  const invoices = [
    { id: 'INV-2026-0841', date: '18 Sep 2026', amount: '₹14,207.00', status: 'Paid', method: 'Direct Bank NEFT' },
    { id: 'INV-2026-0840', date: '17 Sep 2026', amount: '₹11,728.00', status: 'Paid', method: 'Direct Bank NEFT' },
    { id: 'INV-2026-0839', date: '16 Sep 2026', amount: '₹11,396.00', status: 'Paid', method: 'Direct Bank NEFT' },
    { id: 'INV-2026-0838', date: '15 Sep 2026', amount: '₹15,246.00', status: 'Paid', method: 'Direct Bank NEFT' },
    { id: 'INV-2026-0837', date: '14 Sep 2026', amount: '₹12,482.00', status: 'Processing', method: 'Under Clearing' },
  ];

  const handleRequestPayout = () => {
    showToast('Payout request for ₹12,482 initiated! Expected in bank within 2 hours.', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              Partner ID: FD-BLR-9921
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Settlement Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Financial Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ledger, tax reconciliation, payment channel analytics, and instant payout clearing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('Full financial audit statement downloaded (PDF)', 'info')}
            className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Gross Revenue
          </span>
          <h3 className="text-3xl font-black text-slate-900">₹84,250</h3>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.0% this month
          </span>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Commission & Fees
          </span>
          <h3 className="text-3xl font-black text-slate-700">₹22,410</h3>
          <span className="text-xs text-slate-400">Includes 18% FEEDO fee + 5% GST</span>
        </div>

        {/* Card 3: Profit Margin */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Net Profit Margin
          </span>
          <h3 className="text-3xl font-black text-emerald-600">73.4%</h3>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +2.1% efficiency
          </span>
        </div>

        {/* Card 4: Pending Payout with Button */}
        <div className="bg-gradient-to-br from-feedo-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg shadow-feedo-500/20 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-feedo-100">
              Pending Payout
            </span>
            <h3 className="text-3xl font-black">₹12,482</h3>
          </div>
          <button
            onClick={handleRequestPayout}
            className="w-full py-2 px-3 bg-white text-feedo-700 hover:bg-feedo-50 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Request Instant Payout →
          </button>
        </div>
      </div>

      {/* Revenue vs Expenses Quarterly Stacked Bars & Payment Channels Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparison Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue vs Platform Expenses</h3>
              <p className="text-xs text-slate-500">Monthly breakdown of gross earnings against deductions</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-3 h-3 rounded-sm bg-feedo-500 inline-block" /> Net Revenue
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" /> Platform Cost
              </span>
            </div>
          </div>

          <div className="h-60 flex items-end justify-between gap-4 pt-6 px-4">
            {[
              { month: 'Jan', net: '65%', exp: '20%', netVal: '₹62.5k', expVal: '₹14k' },
              { month: 'Feb', net: '72%', exp: '22%', netVal: '₹71.0k', expVal: '₹16k' },
              { month: 'Mar', net: '84%', exp: '25%', netVal: '₹84.2k', expVal: '₹22k' },
              { month: 'Apr (Est)', net: '90%', exp: '26%', netVal: '₹95.0k', expVal: '₹24k' },
            ].map((col) => (
              <div key={col.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.netVal}
                </span>
                <div className="w-full max-w-[56px] flex flex-col items-center">
                  <div
                    style={{ height: col.exp }}
                    className="w-full bg-slate-300 rounded-t-md mb-0.5"
                    title={`Expenses: ${col.expVal}`}
                  />
                  <div
                    style={{ height: col.net }}
                    className="w-full bg-gradient-to-t from-feedo-600 to-feedo-500 rounded-b-md shadow-xs"
                    title={`Net Revenue: ${col.netVal}`}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600">{col.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels Breakdown (1 col Dark Card) */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-feedo-400" />
                <span>Payment Channels</span>
              </h3>
              <span className="text-[10px] text-slate-400 uppercase">Q1 Breakdown</span>
            </div>

            <div className="space-y-4">
              {/* Channel 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Credit / Debit Cards</span>
                  <span className="font-bold text-feedo-400">64%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-feedo-500 h-full w-[64%] rounded-full" />
                </div>
              </div>

              {/* Channel 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">UPI & Mobile Wallets</span>
                  <span className="font-bold text-emerald-400">22%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[22%] rounded-full" />
                </div>
              </div>

              {/* Channel 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Cash on Delivery (COD)</span>
                  <span className="font-bold text-amber-400">14%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[14%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All digital gateway charges waived under FEEDO SuperPartner tier.</span>
          </div>
        </div>
      </div>

      {/* Bank Account Panel & Q1 Tax Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Settlement Bank Account</h3>
                <p className="text-[11px] text-emerald-600 font-semibold">✓ Verified for Automated Daily Clearing</p>
              </div>
            </div>
            <button
              onClick={() => showToast('Bank modification requests require KYC re-verification', 'info')}
              className="text-xs font-bold text-feedo-600 hover:underline"
            >
              Update Details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Bank Entity</span>
              <span className="font-bold text-slate-900">{restaurant.bankName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Account Number</span>
              <span className="font-mono font-bold text-slate-900">{restaurant.bankAccount}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">IFSC Code</span>
              <span className="font-mono font-bold text-slate-700">{restaurant.ifscCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Payout Frequency</span>
              <span className="font-bold text-emerald-700">Daily by 10:00 AM</span>
            </div>
          </div>
        </div>

        {/* Q1 Tax Notice Gradient Card */}
        <div className="bg-gradient-to-br from-amber-500 via-feedo-500 to-rose-500 rounded-3xl p-6 text-white shadow-lg space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-200" />
              <h3 className="text-base font-black">Q1 Statutory Tax Summary Ready</h3>
            </div>
            <p className="text-xs text-amber-100 leading-relaxed">
              Your TCS (Tax Collected at Source under GST Sec 52) certificate and GST input credit report for Jan-Mar 2026 is ready for monthly filing reconciliation.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded-lg">
              GSTIN: {restaurant.gstNumber || '29AABCL9921D1Z5'}
            </span>
            <button
              onClick={() => showToast('TCS GSTR-8 report downloaded (CSV)', 'success')}
              className="px-4 py-2 bg-white text-feedo-700 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Download GSTR-8 File →
            </button>
          </div>
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Settlement Invoices & Transfer Logs</h3>
            <p className="text-xs text-slate-500">Official digital receipts with UTR bank reference IDs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Invoice ID</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Settlement Method</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{inv.id}</td>
                  <td className="py-3.5 px-3 text-slate-500">{inv.date}</td>
                  <td className="py-3.5 px-3 font-mono font-black text-slate-900">{inv.amount}</td>
                  <td className="py-3.5 px-3 text-slate-600">{inv.method}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status === 'Paid' ? '✓ Paid' : '⏳ Processing'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => showToast(`Invoice ${inv.id} downloaded`, 'success')}
                      className="text-xs font-bold text-feedo-600 hover:underline"
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
