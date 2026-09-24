import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Utensils,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Zap,
  Bike,
  Plus,
  ChevronRight,
  Star,
  Eye,
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    restaurant,
    orders,
    menuItems,
    setSelectedOrder,
    simulateNewIncomingOrder,
    setScreen,
  } = useApp();

  const [chartPeriod, setChartPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Compute live metrics
  const todayOrders = orders.length + 19; // baseline 24
  const todayRevenue = orders.reduce((sum, o) => sum + (o.status !== 'RESTAURANT_REJECTED' ? o.total : 0), 10560);
  const preparingCount = orders.filter((o) => ['RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status)).length;
  const completedCount = orders.filter((o) => ['DELIVERED', 'PICKED_UP'].includes(o.status)).length + 17;
  const cancelledCount = orders.filter((o) => ['RESTAURANT_REJECTED', 'CUSTOMER_CANCELLED'].includes(o.status)).length + 1;

  // Active kitchen orders
  const activeOrders = orders.filter((o) =>
    ['PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'RIDER_ARRIVED'].includes(
      o.status
    )
  );

  const topItems = menuItems.filter(i => i.isBestSeller).slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. WELCOME BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-feedo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-feedo-400 bg-feedo-500/10 px-2.5 py-0.5 rounded-full border border-feedo-500/20">
              Live Operations Hub
            </span>
            <span className="text-xs text-slate-400">Koramangala 4th Block</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Good Morning, {restaurant.restaurantName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {restaurant.isOnline
              ? '🟢 Kitchen is ONLINE and actively receiving customer orders.'
              : '🔴 Store is OFFLINE. Turn online to accept new orders.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={simulateNewIncomingOrder}
            className="py-3 px-5 bg-gradient-to-r from-amber-500 to-feedo-500 hover:from-amber-600 hover:to-feedo-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-feedo-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>+ SIMULATE NEW ORDER</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Today's Orders */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Today's Orders</span>
            <div className="p-2 bg-feedo-50 text-feedo-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{todayOrders}</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +14% vs yesterday
          </span>
        </div>

        {/* Metric 2: Today's Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Today's Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{todayRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> Net settled daily
          </span>
        </div>

        {/* Metric 3: In Kitchen Preparing */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">In Kitchen</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-orange-600">{preparingCount}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Active cooking</span>
        </div>

        {/* Metric 4: Completed */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Completed</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{completedCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">96% success rate</span>
        </div>

        {/* Metric 5: Cancelled */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Cancelled</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-700">{cancelledCount}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">&lt; 2% defect rate</span>
        </div>
      </div>

      {/* 3. LIVE KITCHEN PIPELINE */}
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-feedo-500 live-pulse" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Live Kitchen Pipeline ({activeOrders.length})
              </h2>
            </div>
            <button
              onClick={() => setScreen('orders')}
              className="text-xs font-bold text-feedo-600 hover:text-feedo-700 flex items-center gap-1"
            >
              <span>View All in Orders Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-2xl p-4 border-2 border-feedo-200 hover:border-feedo-500 shadow-sm transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-mono text-slate-900">
                    #{order.id}
                  </span>
                  <StatusBadge status={order.status} size="sm" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{order.customer.name}</h4>
                  <p className="text-[11px] text-slate-500">{order.customer.area}</p>
                </div>

                {/* Items summary */}
                <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700 space-y-1">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-[11px]">
                      <span>{it.quantity} × {it.name}</span>
                      <span className="font-mono text-slate-500">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="font-mono font-bold text-feedo-600">Total: ₹{order.total}</span>
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Open Details
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SALES TREND & TOP ITEMS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Hourly Sales Overview</h3>
              <p className="text-xs text-slate-500">Real-time revenue cadence across peak dining hours</p>
            </div>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {(['today', 'week', 'month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                    chartPeriod === period
                      ? 'bg-white text-feedo-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Visualization */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2">
            {[
              { label: '11 AM', height: '30%', val: '₹840' },
              { label: '12 PM', height: '65%', val: '₹2,680' },
              { label: '1 PM', height: '95%', val: '₹4,120' },
              { label: '2 PM', height: '60%', val: '₹2,310' },
              { label: '3 PM', height: '20%', val: '₹390' },
              { label: '4 PM', height: '15%', val: '₹0' },
              { label: '5 PM', height: '25%', val: '₹420' },
              { label: '6 PM', height: '40%', val: '₹1,200' },
              { label: '7 PM', height: '80%', val: '₹3,450' },
            ].map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val}
                </span>
                <div
                  style={{ height: bar.height }}
                  className="w-full max-w-[36px] bg-gradient-to-t from-feedo-500 to-amber-400 rounded-t-lg group-hover:from-feedo-600 group-hover:to-amber-500 transition-all shadow-xs"
                />
                <span className="text-[11px] font-bold text-slate-500">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Items (1 column) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Selling Items</h3>
              <p className="text-xs text-slate-500">Diner favorites today</p>
            </div>
            <button
              onClick={() => setScreen('menu')}
              className="text-xs font-bold text-feedo-600 hover:underline"
            >
              Menu →
            </button>
          </div>

          <div className="space-y-3">
            {topItems.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="w-5 text-xs font-black text-slate-400">{idx + 1}.</span>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">₹{item.price}</p>
                </div>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400" /> {item.rating}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECENT ORDERS TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Full order ledger and delivery partner logs</p>
          </div>
          <button
            onClick={() => setScreen('orders')}
            className="text-xs font-bold text-feedo-600 hover:underline"
          >
            See All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Order ID</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Items</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Time</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 6).map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    #{order.id}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{order.customer.name}</span>
                    <span className="text-[10px] text-slate-400">{order.customer.area}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    ₹{order.total}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">
                    {order.createdAt}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button className="text-xs font-bold text-feedo-600 group-hover:underline">
                      Manage →
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
