import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesOverviewCard } from '../../components/dashboard/SalesOverviewCard';
import {
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Flame,
  Bell,
  Headphones,
  Star,
  CheckCircle2,
  ArrowUpRight,
  Building,
  ChevronRight,
  Zap,
  Clock,
  Package,
} from 'lucide-react';

const STATUS_CATEGORIES = ['All Orders', 'New', 'Preparing', 'Ready', 'Delivered'];

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

  const [statusTab, setStatusTab] = useState('All Orders');
  const unreadCount = notifications.filter((n) => !n.read).length;

  const activeOrders = useMemo(() =>
    orders.filter((o) =>
      ['PLACED', 'PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status)
    ), [orders]);

  const completedSettlements = useMemo(() => settlements.filter((s) => s.status === 'SETTLED'), [settlements]);
  const pendingSettlements   = useMemo(() => settlements.filter((s) => ['PROCESSING', 'UPCOMING'].includes(s.status)), [settlements]);
  const completedAmount = useMemo(() => completedSettlements.reduce((s, r) => s + r.netPayout, 0), [completedSettlements]);
  const pendingAmount   = useMemo(() => pendingSettlements.reduce((s, r) => s + r.netPayout, 0), [pendingSettlements]);
  const totalEarnings   = completedAmount + pendingAmount;
  const availableBalance = pendingAmount > 0 ? pendingAmount : 7041.15;
  const bankLast4 = restaurant.bankAccount.slice(-4) || '9921';
  const maskedAccount = `•••• •••• ${bankLast4}`;

  const todayOrders    = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const cancelledOrders = orders.filter((o) => ['RESTAURANT_REJECTED', 'CUSTOMER_CANCELLED'].includes(o.status)).length;

  const filteredOrders = (() => {
    switch (statusTab) {
      case 'New':       return orders.filter((o) => ['CREATED', 'PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED'].includes(o.status));
      case 'Preparing': return orders.filter((o) => o.status === 'PREPARING');
      case 'Ready':     return orders.filter((o) => ['READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'RIDER_ARRIVED'].includes(o.status));
      case 'Delivered': return orders.filter((o) => o.status === 'DELIVERED');
      default:          return orders;
    }
  })();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top Header ─────────────────────────────────────── */}
      <div className="bg-white px-4 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium">Welcome back 👋</p>
            <h1 className="text-lg font-black text-slate-900 leading-tight">{restaurant.restaurantName || 'Lucky Family Restaurant'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
            <button
              onClick={toggleOnlineStatus}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
                restaurant.isOnline
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${restaurant.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {restaurant.isOnline ? 'Online' : 'Offline'}
            </button>
          </div>
        </div>

        {/* ── Hero promo banner ── */}
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden h-36">
          <img
            src="https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80"
            alt="Today's specials"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 p-4 h-full flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Today's Kitchen</p>
              <h2 className="text-white font-black text-lg leading-tight mt-0.5">
                {activeOrders.length > 0
                  ? `${activeOrders.length} Active Order${activeOrders.length > 1 ? 's' : ''}`
                  : 'Kitchen Ready'}
              </h2>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {activeOrders.length > 0 ? 'Tap to manage live kitchen queue' : 'Simulate a new order to get started'}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <button
                onClick={() => setScreen('orders')}
                className="flex items-center gap-1.5 bg-[#FFC700] text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" /> View Orders
              </button>
              <div className="text-right">
                <p className="text-2xl font-black text-[#FFC700]">₹{availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className="text-[10px] text-slate-400">Available today</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5 pb-28">

        {/* ── KPI Stats Row ───────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Today's Orders", value: todayOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active',  value: activeOrders.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Done',    value: deliveredOrders,     icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Cancelled', value: cancelledOrders,  icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs text-center">
              <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mx-auto mb-1.5`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-base font-black text-slate-900">{value}</p>
              <p className="text-[9px] text-slate-400 font-medium leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Sales Chart ─────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
          <SalesOverviewCard />
        </div>

        {/* ── Live Orders ─────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Live Orders</h2>
            <button
              onClick={() => setScreen('orders')}
              className="text-xs font-bold text-amber-600 flex items-center gap-0.5 hover:underline"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status pills */}
          <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-none">
            {STATUS_CATEGORIES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusTab(s)}
                className={`shrink-0 px-3.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  statusTab === s
                    ? 'bg-[#FFC700] text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Order rows */}
          <div className="divide-y divide-slate-50">
            {filteredOrders.length > 0 ? (
              filteredOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 font-mono">#{order.id}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                    </p>
                  </div>
                  {/* Right */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-slate-900">₹{order.total}</p>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'PREPARING'       ? 'bg-orange-100 text-orange-700' :
                        order.status === 'READY_FOR_PICKUP' ? 'bg-blue-100 text-blue-700'   :
                        order.status === 'DELIVERED'        ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); showToast(`Order #${order.id} verified`, 'success'); }}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl border border-emerald-100 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No orders in this category.
              </div>
            )}
          </div>
        </div>

        {/* ── Earnings Snapshot ────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-slate-900">Earnings Snapshot</h2>
            <button
              onClick={() => setScreen('earnings')}
              className="text-xs font-bold text-amber-600 flex items-center gap-0.5 hover:underline"
            >
              View Full <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, badge: 'Net credited', color: 'text-slate-900' },
              { label: 'Available Now',  value: `₹${availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, badge: 'Clears 10 AM', color: 'text-emerald-600' },
              { label: 'Pending',        value: `₹${pendingAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, badge: `${pendingSettlements.length} batches`, color: 'text-amber-600' },
              { label: 'Completed',      value: `₹${completedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, badge: `To ${restaurant.bankName.split(' ')[0]}`, color: 'text-blue-600' },
            ].map(({ label, value, badge, color }) => (
              <div key={label} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                <p className={`text-lg font-black mt-0.5 ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{badge}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Two column: Reviews + Promotions ─────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recent Review */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black text-slate-900">Top Review</h2>
              <button onClick={() => setScreen('reviews')} className="text-[10px] font-bold text-amber-600 hover:underline">See All</button>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-xs font-black text-slate-900 ml-1">{restaurant.rating}</span>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Authentic dum aroma and succulent meat portions. Packaging was completely spill-proof."
            </p>
            <p className="text-[10px] font-bold text-slate-800 mt-2">— Kavita Sundaram · 2h ago</p>
          </div>

          {/* Active Promo */}
          <div className="bg-slate-900 rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFC700]/20 rounded-full -mr-8 -mt-8" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-black text-white">Active Promo</h2>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 mb-3">
                <p className="text-xs font-bold text-white">Weekend Feast Campaign</p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  20% off · Code: <span className="text-[#FFC700] font-mono font-bold">FEAST20</span>
                </p>
                <span className="inline-block mt-2 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <button
                onClick={() => setScreen('offers')}
                className="w-full py-2 bg-[#FFC700] text-slate-900 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
              >
                Manage Promotions
              </button>
            </div>
          </div>
        </div>

        {/* ── Settlement Bank & Quick Links ─────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-5">
          <h2 className="text-sm font-black text-slate-900 mb-3">Settlement Account</h2>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Building className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900">{restaurant.bankName}</p>
              <p className="text-[10px] text-slate-400 font-mono">{maskedAccount}</p>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600">Verified</span>
            </div>
          </div>
          {/* Quick nav links */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Earnings', screen: 'earnings' as const, icon: TrendingUp },
              { label: 'Support',  screen: 'support' as const,  icon: Headphones },
              { label: 'Staff',    screen: 'staff' as const,    icon: CheckCircle2 },
            ].map(({ label, screen, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setScreen(screen)}
                className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-amber-50 hover:border-amber-200 transition-all"
              >
                <Icon className="w-4 h-4 text-slate-600" />
                <span className="text-[10px] font-bold text-slate-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardScreen;
