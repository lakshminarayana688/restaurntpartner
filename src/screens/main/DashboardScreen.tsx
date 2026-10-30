import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesOverviewCard } from '../../components/dashboard/SalesOverviewCard';
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Truck,
  Flame,
  FileText,
  Bell,
  Headphones,
  Star,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Building,
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    restaurant,
    toggleOnlineStatus,
    orders,
    settlements,
    setSelectedOrder,
    setScreen,
    notifications,
    setIsNotificationsOpen,
    showToast,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Active kitchen pipeline orders
  const activeOrders = useMemo(() => {
    return orders.filter((o) =>
      ['PLACED', 'PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'].includes(
        o.status
      )
    );
  }, [orders]);

  // Financial calculations for Dashboard Earnings Snapshot
  const completedSettlements = useMemo(() => {
    return settlements.filter((s) => s.status === 'SETTLED');
  }, [settlements]);

  const pendingSettlements = useMemo(() => {
    return settlements.filter((s) => s.status === 'PROCESSING' || s.status === 'UPCOMING');
  }, [settlements]);

  const completedAmount = useMemo(() => {
    return completedSettlements.reduce((sum, s) => sum + s.netPayout, 0);
  }, [completedSettlements]);

  const pendingAmount = useMemo(() => {
    return pendingSettlements.reduce((sum, s) => sum + s.netPayout, 0);
  }, [pendingSettlements]);

  const totalEarnings = completedAmount + pendingAmount;
  const availableBalance = pendingAmount > 0 ? pendingAmount : 7041.15;

  const bankLast4 = restaurant.bankAccount.slice(-4) || '9921';
  const maskedAccount = `•••• •••• •••• ${bankLast4}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in select-none">
      {/* =========================================================
          1. TOP HEADER SECTION
      ========================================================= */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div id="header-title">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Welcome back, Chef!
          </h1>
          <p className="text-slate-500 text-sm mt-0.5 font-sans">
            Here's what's happening with <strong className="text-slate-800">{restaurant.restaurantName || 'Lucky Family Restaurant'}</strong> today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Status Pulse Badge */}
          <button
            type="button"
            onClick={toggleOnlineStatus}
            title="Click to toggle kitchen operational status"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all cursor-pointer shadow-2xs ${
              restaurant.isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/70'
                : 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100/70'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                restaurant.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-bold">
              {restaurant.isOnline ? 'Kitchen Online' : 'Kitchen Offline'}
            </span>
          </button>

          {/* Notifications Button */}
          <button
            id="btn-notifications"
            onClick={() => setIsNotificationsOpen(true)}
            title="Notifications"
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative transition-colors cursor-pointer shadow-2xs"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-feedo-500 rounded-full" />
            )}
          </button>

          {/* Help Center Button */}
          <button
            id="btn-support"
            onClick={() => setScreen('support')}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            <Headphones className="w-4 h-4 text-slate-200" />
            <span>Help Center</span>
          </button>
        </div>
      </header>

      {/* =========================================================
          2. REDESIGNED SALES OVERVIEW & ANALYTICS SECTION
             (Full SaaS bar chart, peak day highlight, tooltips,
              Week/Month/Year filters, 4 compact metric cards)
      ========================================================= */}
      <SalesOverviewCard />

      {/* =========================================================
          3. DASHBOARD EARNINGS & SETTLEMENTS SNAPSHOT
             (Essential financial info: Total Earnings, Available
              Balance, Pending Settlements, Completed Settlements)
             NO Request Instant Payout, NO GST Summary, NO TCS Summary
      ========================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-feedo-600" />
              <h2 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
                Earnings & Settlements Snapshot
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Summary of total net earnings, available balance ready for NEFT clearing, and pending batch payouts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setScreen('earnings')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Full Settlement Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          {/* Card 1: Total Earnings */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/70 p-4 hover:bg-slate-50 transition-colors">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Earnings
            </span>
            <span className="text-2xl font-extrabold font-heading text-slate-900 mt-1 block">
              ₹{totalEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> Net credited to merchant
            </span>
          </div>

          {/* Card 2: Available Balance */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/70 p-4 hover:bg-slate-50 transition-colors">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Available Balance
            </span>
            <span className="text-2xl font-extrabold font-heading text-emerald-600 mt-1 block">
              ₹{availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Clearing tomorrow at 10:00 AM
            </span>
          </div>

          {/* Card 3: Pending Settlements */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/70 p-4 hover:bg-slate-50 transition-colors">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pending Settlements
            </span>
            <span className="text-2xl font-extrabold font-heading text-slate-900 mt-1 block">
              ₹{pendingAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-amber-700 mt-1 block">
              {pendingSettlements.length} batch in NEFT queue
            </span>
          </div>

          {/* Card 4: Completed Settlements */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/70 p-4 hover:bg-slate-50 transition-colors">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Completed Settlements
            </span>
            <span className="text-2xl font-extrabold font-heading text-slate-900 mt-1 block">
              ₹{completedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-blue-600 mt-1 block">
              Settled to HDFC Bank (••• {bankLast4})
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. TWO-COLUMN OPERATIONAL & SECONDARY WIDGETS
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 2/3 Width Kitchen Orders */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">Live Kitchen Orders</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time orders awaiting preparation and handover</p>
              </div>
              <button
                type="button"
                onClick={() => setScreen('orders')}
                className="text-feedo-600 text-xs font-bold hover:underline cursor-pointer"
              >
                View All Orders →
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {activeOrders.length > 0 ? (
                activeOrders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          #{order.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            order.status === 'PREPARING'
                              ? 'bg-orange-100 text-orange-600'
                              : order.status === 'READY_FOR_PICKUP'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900 font-heading">
                        ₹{order.total}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {order.pickupCode ? `PIN: ${order.pickupCode}` : 'Awaiting confirmation'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Order #${order.id} verified for kitchen dispatch`, 'success');
                        }}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100 cursor-pointer"
                        title="Accept / Verify"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Order #${order.id} rejected`, 'info');
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-slate-100 cursor-pointer"
                        title="Reject / Cancel"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No active orders right now. Kitchen queue is clear.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: 1/3 Width Secondary Widgets */}
        <div className="space-y-6">
          {/* Widget 1: Settlement Bank Info (Clean, No GST/TCS) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 font-heading">Settlement Account</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 font-heading">KYC & FSSAI Active</p>
                  <p className="text-[10px] text-slate-500">License #21223004000891</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                  <Building className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 font-heading">{restaurant.bankName}</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{maskedAccount}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setScreen('earnings')}
                  className="text-[10px] text-feedo-600 font-bold hover:underline cursor-pointer shrink-0"
                >
                  Manage
                </button>
              </div>
            </div>
          </section>

          {/* Widget 2: Recent Reviews */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 font-heading">Recent Customer Reviews</h2>
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                ★ {restaurant.rating}
              </span>
            </div>
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-100">
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span className="text-[10px] text-slate-400">2h ago</span>
                </div>
                <p className="text-xs text-slate-700 italic font-sans leading-relaxed">
                  "Authentic dum aroma and succulent meat portions. Packaging was completely spill-proof."
                </p>
                <p className="text-[10px] font-bold text-slate-900 mt-1.5 font-heading">
                  — Kavita Sundaram
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setScreen('reviews')}
              className="block w-full text-center text-xs font-bold text-slate-600 hover:text-feedo-600 mt-4 transition-colors cursor-pointer"
            >
              Read All Reviews →
            </button>
          </section>

          {/* Widget 3: Active Promotions */}
          <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              <h2 className="text-base font-bold font-heading">Active Promotions</h2>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 mb-4 backdrop-blur-xs border border-white/5">
              <h3 className="text-xs font-bold font-heading text-white mb-1">Weekend Feast Campaign</h3>
              <p className="text-[10px] text-slate-300 mb-3 font-sans">
                20% off on all main courses with code <span className="font-mono text-amber-300 font-bold">FEAST20</span>
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ACTIVE
                </span>
                <button
                  type="button"
                  onClick={() => setScreen('offers')}
                  className="text-[10px] font-bold underline hover:text-white cursor-pointer"
                >
                  Manage Offers
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setScreen('offers')}
              className="w-full py-2 border border-white/20 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
            >
              + Create Promotion
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
export default DashboardScreen;
