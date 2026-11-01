import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesOverviewCard } from '../../components/dashboard/SalesOverviewCard';
import {
  IndianRupee,
  TrendingUp,
  Download,
  Building,
  CheckCircle2,
  Lock,
  Clock,
  Search,
  ArrowUpRight,
  ArrowLeft,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

export const FinanceScreen: React.FC = () => {
  const { restaurant, settlements, orders, showToast, currentUserRole, setScreen } = useApp();
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionFilter, setTransactionFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  // Role Gate: Finance & Earnings is strictly OWNER or ADMIN
  if (currentUserRole !== 'OWNER' && currentUserRole !== 'ADMIN') {
    return (
      <div className="p-6 sm:p-12 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 text-slate-500 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-900">Finance & Banking Restricted</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-sans">
          Access to settlement ledgers, bank payout details, and restaurant financial transaction records is restricted strictly to the <strong>Restaurant Owner</strong>.
        </p>
        <button
          onClick={() => setScreen('dashboard')}
          className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculations for Earnings metrics
  const completedSettlementsList = useMemo(() => {
    return settlements.filter((s) => s.status === 'SETTLED');
  }, [settlements]);

  const pendingSettlementsList = useMemo(() => {
    return settlements.filter((s) => s.status === 'PROCESSING' || s.status === 'UPCOMING');
  }, [settlements]);

  const completedAmount = useMemo(() => {
    return completedSettlementsList.reduce((sum, s) => sum + s.netPayout, 0);
  }, [completedSettlementsList]);

  const pendingAmount = useMemo(() => {
    return pendingSettlementsList.reduce((sum, s) => sum + s.netPayout, 0);
  }, [pendingSettlementsList]);

  const totalEarnings = completedAmount + pendingAmount;
  const availableBalance = pendingAmount > 0 ? pendingAmount : 7041.15;

  // Masked bank information
  const bankLast4 = restaurant.bankAccount.slice(-4) || '9921';
  const maskedAccount = `•••• •••• •••• ${bankLast4}`;
  const maskedIfsc = `${restaurant.ifscCode.slice(0, 4)}•••••••`;

  // Filtered order transactions
  const filteredTransactions = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(transactionSearch.toLowerCase());

      if (!matchesSearch) return false;

      if (transactionFilter === 'COMPLETED') {
        return order.status === 'DELIVERED' || order.status === 'PICKED_UP';
      }
      if (transactionFilter === 'IN_PROGRESS') {
        return order.status !== 'DELIVERED' && order.status !== 'PICKED_UP';
      }
      return true;
    });
  }, [orders, transactionSearch, transactionFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in select-none">
      {/* =========================================================
          1. HEADER SECTION
      ========================================================= */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setScreen('dashboard')}
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer shrink-0 mt-0.5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200/80">
                Merchant ID: FD-BLR-{bankLast4}
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Direct Bank Settlement Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
              Earnings & Settlements
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Real-time ledger of order earnings, available balance, clearing schedules, and settled bank transfers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => showToast('Financial statement exported to PDF & CSV', 'success')}
            className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Statement</span>
          </button>
        </div>
      </header>

      {/* =========================================================
          1b. SALES OVERVIEW (moved from Dashboard)
      ========================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <SalesOverviewCard />
      </section>

      {/* =========================================================
          2. FOUR ESSENTIAL EARNINGS METRIC CARDS
      ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric Card 1: Total Earnings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Earnings
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-feedo-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                ₹{totalEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <ArrowUpRight className="w-3 h-3" />
                +18.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Net income after 18% partner fee</p>
          </div>
        </div>

        {/* Metric Card 2: Available Balance */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-600">
                ₹{availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Clearing Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Auto-clearing next day by 10:00 AM</p>
          </div>
        </div>

        {/* Metric Card 3: Pending Settlements */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Settlements
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                ₹{pendingAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {pendingSettlementsList.length} Batch
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">In automated NEFT clearing queue</p>
          </div>
        </div>

        {/* Metric Card 4: Completed Settlements */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completed Settlements
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                ₹{completedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                {completedSettlementsList.length} Batches
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Transferred to {restaurant.bankName.split(' ')[0]}</p>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. SETTLEMENT BANK ACCOUNT & POLICY INFO
      ========================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900">
                Registered Settlement Bank Account
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium">
                ✓ Verified for Automated Daily Bank Clearing (Zero Transfer Fee)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast('Bank account changes require registered mobile OTP verification', 'info')}
            className="text-xs font-bold text-feedo-600 hover:text-feedo-700 hover:underline cursor-pointer self-start sm:self-auto"
          >
            Update Bank Details →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 font-sans">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Bank Name
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">{restaurant.bankName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Account Number
            </span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{maskedAccount}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              IFSC Code
            </span>
            <span className="font-mono font-bold text-slate-700 mt-0.5 block">{maskedIfsc}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Clearing Cadence
            </span>
            <span className="font-bold text-emerald-700 mt-0.5 block">Next day 10:00 AM</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. TRANSACTION HISTORY SECTION
      ========================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-feedo-600" />
              <h3 className="text-base font-bold font-heading text-slate-900">
                Transaction History
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Itemized order payout ledger with gross billings, 18% partner fee, and net credits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
                placeholder="Search by order or customer..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-feedo-500 w-48 sm:w-56"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/80">
              {(['ALL', 'COMPLETED', 'IN_PROGRESS'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setTransactionFilter(filterKey)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    transactionFilter === filterKey
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filterKey === 'ALL'
                    ? 'All'
                    : filterKey === 'COMPLETED'
                    ? 'Completed'
                    : 'In Fulfillment'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3 px-3">Order ID</th>
                <th className="pb-3 px-3">Customer & Location</th>
                <th className="pb-3 px-3">Time</th>
                <th className="pb-3 px-3">Gross Amount</th>
                <th className="pb-3 px-3">Commission (18%)</th>
                <th className="pb-3 px-3">Net Earnings</th>
                <th className="pb-3 px-3">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.slice(0, 8).map((order) => {
                  const gross = Number(order.total) || 0;
                  const commission = Math.round(gross * 0.18 * 100) / 100;
                  const net = gross - commission;
                  const isDelivered = order.status === 'DELIVERED' || order.status === 'PICKED_UP';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-800 block">
                          {order.customer.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{order.customer.area}</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {order.createdAt}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-slate-900">
                        ₹{gross.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-500">
                        -₹{commission.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-extrabold text-emerald-600">
                        ₹{net.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isDelivered ? '✓ Completed' : order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No order transactions found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================
          5. SETTLEMENT HISTORY SECTION
      ========================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-feedo-600" />
              <h3 className="text-base font-bold font-heading text-slate-900">
                Settlement History
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Immutable bank payout transaction records with verified UTR clearing numbers.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3 px-3">Settlement UTR Ref</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Cycle Period</th>
                <th className="pb-3 px-3">Gross Sales</th>
                <th className="pb-3 px-3">Commission (18%)</th>
                <th className="pb-3 px-3">Taxes</th>
                <th className="pb-3 px-3">Net Bank Payout</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Settlement Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlements.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    {record.payoutRef}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">{record.date}</td>
                  <td className="py-3.5 px-3 text-slate-500">{record.period}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    ₹{record.grossAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    -₹{record.commission.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500">
                    -₹{record.taxes.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-black text-emerald-600 text-sm">
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
                      type="button"
                      onClick={() =>
                        showToast(`Settlement receipt ${record.payoutRef} downloaded`, 'success')
                      }
                      className="text-xs font-bold text-feedo-600 hover:text-feedo-700 hover:underline cursor-pointer"
                    >
                      View Receipt →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default FinanceScreen;
