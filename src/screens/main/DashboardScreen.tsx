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
  Plus,
  ChevronRight,
  Star,
  Eye,
  ArrowUpRight,
  Store,
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    restaurant,
    orders,
    menuItems,
    setSelectedOrder,
    setScreen,
    currentUserRole,
  } = useApp();

  const [chartPeriod, setChartPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Real calculations directly from live orders data (No fake additions or baselines)
  const todayOrdersCount = orders.length;
  const todayRevenue = orders
    .filter((o) => o.status !== 'RESTAURANT_REJECTED' && o.status !== 'CUSTOMER_CANCELLED')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  
  const inKitchenCount = orders.filter((o) =>
    ['RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status)
  ).length;

  const completedOrders = orders.filter((o) => ['DELIVERED', 'PICKED_UP'].includes(o.status));
  const completedCount = completedOrders.length;

  const cancelledOrders = orders.filter((o) =>
    ['RESTAURANT_REJECTED', 'CUSTOMER_CANCELLED'].includes(o.status)
  );
  const cancelledCount = cancelledOrders.length;

  // Real completion rate calculation
  const completionRate =
    todayOrdersCount > 0
      ? Math.round((completedCount / todayOrdersCount) * 100)
      : 100;

  // Real average order value
  const avgOrderValue =
    todayOrdersCount > 0 ? Math.round(todayRevenue / todayOrdersCount) : 0;

  // Active kitchen pipeline orders
  const activeKitchenOrders = orders.filter((o) =>
    [
      'PLACED',
      'PAYMENT_CONFIRMED',
      'RESTAURANT_ACCEPTED',
      'PREPARING',
      'READY_FOR_PICKUP',
      'RIDER_ASSIGNED',
      'RIDER_ARRIVED',
    ].includes(o.status)
  );

  const topItems = menuItems.filter((i) => i.isBestSeller).slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* 1. WELCOME HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-feedo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-feedo-400 bg-feedo-500/10 px-2.5 py-0.5 rounded-full border border-feedo-500/20">
              Kitchen Operations Hub
            </span>
            <span className="text-xs text-slate-400">
              {restaurant.city} • {restaurant.address.split(',')[0]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Good Morning, {restaurant.restaurantName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                restaurant.isOnline ? 'bg-emerald-400 live-pulse' : 'bg-rose-400'
              }`}
            />
            <span>
              {restaurant.isOnline
                ? 'Kitchen is ONLINE and actively receiving customer orders.'
                : 'Kitchen is OFFLINE. Switch status in header to start accepting orders.'}
            </span>
          </p>
        </div>

        {/* Quick Operational CTAs */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setScreen('orders')}
            className="py-2.5 px-4 bg-feedo-500 hover:bg-feedo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-feedo-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Live Orders Hub ({activeKitchenOrders.length})</span>
          </button>
          <button
            onClick={() => setScreen('menu')}
            className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* 2. REAL METRIC KPI CARDS (Calculated from real order records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Today's Orders */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Today's Orders
            </span>
            <div className="p-2 bg-feedo-50 text-feedo-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{todayOrdersCount}</p>
          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
            Avg Order: <strong>₹{avgOrderValue}</strong>
          </span>
        </div>

        {/* Metric 2: Today's Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Today's Revenue
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{todayRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-semibold text-emerald-600 mt-1 block">
            Direct Daily Settlement
          </span>
        </div>

        {/* Metric 3: In Kitchen Preparing */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              In Kitchen
            </span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-orange-600">{inKitchenCount}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {inKitchenCount > 0 ? 'Active on cooktop' : 'No pending queue'}
          </span>
        </div>

        {/* Metric 4: Completed */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{completedCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {todayOrdersCount > 0 ? `${completionRate}% fulfillment rate` : '100% target'}
          </span>
        </div>

        {/* Metric 5: Cancelled */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Cancelled
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-700">{cancelledCount}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {todayOrdersCount > 0 ? `${((cancelledCount / todayOrdersCount) * 100).toFixed(0)}% rejection rate` : '0 rejections'}
          </span>
        </div>
      </div>

      {/* 3. LIVE KITCHEN PIPELINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-feedo-500 live-pulse" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Live Kitchen Pipeline ({activeKitchenOrders.length})
            </h2>
          </div>
          <button
            onClick={() => setScreen('orders')}
            className="text-xs font-bold text-feedo-600 hover:text-feedo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All in Orders Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeKitchenOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Orders in Kitchen Queue</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              New customer orders placed via the FEEDO App will appear here in real time with instant sound alerts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeKitchenOrders.map((order) => (
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

                {/* Customer Info (Privacy-Masked) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {order.customer.name.split(' ')[0]} {order.customer.name.split(' ')[1]?.[0] || ''}.
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Delivery Area: {order.customer.area}
                  </p>
                </div>

                {/* Items Summary */}
                <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700 space-y-1">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-[11px]">
                      <span>
                        {it.quantity} × {it.name}
                      </span>
                      <span className="font-mono text-slate-500">
                        ₹{it.price * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="font-mono font-bold text-feedo-600">
                    Total: ₹{order.total}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Open Details
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. QUICK ACTIONS & POPULAR ITEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setScreen('menu')}
              className="p-3.5 bg-slate-50 hover:bg-feedo-50 hover:text-feedo-700 text-slate-800 rounded-2xl border border-slate-200 text-left transition-colors cursor-pointer group"
            >
              <Plus className="w-5 h-5 text-feedo-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold block">Add Menu Item</span>
              <span className="text-[10px] text-slate-500">Update dishes & prices</span>
            </button>

            <button
              onClick={() => setScreen('orders')}
              className="p-3.5 bg-slate-50 hover:bg-feedo-50 hover:text-feedo-700 text-slate-800 rounded-2xl border border-slate-200 text-left transition-colors cursor-pointer group"
            >
              <Utensils className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold block">View Orders</span>
              <span className="text-[10px] text-slate-500">Kitchen & history</span>
            </button>

            <button
              onClick={() => setScreen('profile')}
              className="p-3.5 bg-slate-50 hover:bg-feedo-50 hover:text-feedo-700 text-slate-800 rounded-2xl border border-slate-200 text-left transition-colors cursor-pointer group"
            >
              <Store className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold block">Manage Store</span>
              <span className="text-[10px] text-slate-500">Hours & branding</span>
            </button>

            <button
              onClick={() => setScreen('earnings')}
              className="p-3.5 bg-slate-50 hover:bg-feedo-50 hover:text-feedo-700 text-slate-800 rounded-2xl border border-slate-200 text-left transition-colors cursor-pointer group"
            >
              <IndianRupee className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold block">View Payouts</span>
              <span className="text-[10px] text-slate-500">Daily bank settlements</span>
            </button>
          </div>
        </div>

        {/* Top Selling Items (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Bestselling Menu Items</h3>
              <p className="text-xs text-slate-500">Customer favorites and high-demand specials</p>
            </div>
            <button
              onClick={() => setScreen('menu')}
              className="text-xs font-bold text-feedo-600 hover:underline cursor-pointer"
            >
              Manage Menu →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-feedo-200 hover:bg-slate-50 transition-colors"
              >
                <span className="w-5 text-xs font-black text-slate-400">{idx + 1}.</span>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">₹{item.price}</p>
                </div>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
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
            <p className="text-xs text-slate-500">Live order audit records and handover status</p>
          </div>
          <button
            onClick={() => setScreen('orders')}
            className="text-xs font-bold text-feedo-600 hover:underline cursor-pointer"
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
                    <span className="font-bold text-slate-900 block">
                      {order.customer.name.split(' ')[0]} {order.customer.name.split(' ')[1]?.[0] || ''}.
                    </span>
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
