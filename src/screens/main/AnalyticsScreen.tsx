import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Clock,
  Users,
  Award,
  Calendar,
  Star,
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { menuItems, orders } = useApp();
  const [filter, setFilter] = useState<'today' | '7days' | '30days'>('7days');

  const validOrders = orders.filter(
    (o) => o.status !== 'RESTAURANT_REJECTED' && o.status !== 'CUSTOMER_CANCELLED'
  );
  const totalOrdersCount = orders.length;
  const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const avgPrepTime = '15.2 min';

  const topItems = menuItems.slice(0, 5).map((item, idx) => {
    const counts = [42, 35, 28, 20, 15];
    const count = counts[idx] || 10;
    const revenue = count * item.price;
    return {
      name: item.name,
      count,
      revenue,
      share: `${Math.max(10, Math.round(35 - idx * 6))}%`,
    };
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Header with Time Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Business Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational metrics, sales volume, peak hours, and customer retention metrics.
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          {(['today', '7days', '30days'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                filter === period
                  ? 'bg-feedo-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period === 'today' ? 'Today' : period === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
          <h3 className="text-2xl font-black text-slate-900">{totalOrdersCount}</h3>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Synced
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
          <h3 className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Net Sales
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Order Value</span>
          <h3 className="text-2xl font-black text-slate-900">₹{avgOrderValue}</h3>
          <span className="text-[11px] text-slate-400">Calculated per checkout</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Prep Time</span>
          <h3 className="text-2xl font-black text-slate-900">{avgPrepTime}</h3>
          <span className="text-[11px] font-bold text-emerald-600">⚡ Dispatch ready</span>
        </div>
      </div>

      {/* Charts & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Volume Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Weekly Order Cadence</h3>
            <p className="text-xs text-slate-500">Order count across days of the week</p>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { day: 'Mon', count: 120, height: '50%' },
              { day: 'Tue', count: 145, height: '60%' },
              { day: 'Wed', count: 160, height: '65%' },
              { day: 'Thu', count: 180, height: '75%' },
              { day: 'Fri', count: 240, height: '90%' },
              { day: 'Sat', count: 280, height: '100%' },
              { day: 'Sun', count: 265, height: '95%' },
            ].map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.count} orders
                </span>
                <div
                  style={{ height: d.height }}
                  className="w-full max-w-[44px] bg-gradient-to-t from-feedo-500 to-amber-400 rounded-t-xl group-hover:from-feedo-600 group-hover:to-amber-500 transition-all shadow-xs"
                />
                <span className="text-xs font-bold text-slate-600">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Products Ranking (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Products</h3>
              <p className="text-xs text-slate-500">By volume & revenue</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3.5">
            {topItems.map((item, idx) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 truncate">
                    {idx + 1}. {item.name}
                  </span>
                  <span className="font-mono font-bold text-slate-900">₹{item.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: item.share }}
                    className="bg-feedo-500 h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{item.count} orders</span>
                  <span>{item.share} of sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
