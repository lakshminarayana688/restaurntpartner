import React from 'react';
import { useApp, ScreenName } from '../../context/AppContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  TrendingUp,
  Tag,
  Settings,
  Boxes,
  IndianRupee,
  Star,
  Store,
  FileCheck2,
  Users,
  Bell,
  LifeBuoy,
  Flame,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  id: ScreenName;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { currentScreen, setScreen, orders, restaurant, notifications } = useApp();

  const activeOrdersCount = orders.filter((o) =>
    ['PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'RIDER_ARRIVED'].includes(
      o.status
    )
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Live Orders',
      icon: UtensilsCrossed,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    { id: 'menu', label: 'Menu Manager', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'offers', label: 'Promotions', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const businessToolsItems: NavItem[] = [
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'earnings', label: 'Finance', icon: IndianRupee },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: '4.8★' },
    { id: 'profile', label: 'Restaurant Profile', icon: Store },
    { id: 'documents_compliance', label: 'Documents & Verification', icon: FileCheck2 },
    { id: 'staff', label: 'Staff Management', icon: Users },
    {
      id: 'notifications_center',
      label: 'Notifications Center',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : 24,
    },
    { id: 'support', label: 'FEEDO Support', icon: LifeBuoy },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white border-r border-slate-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-feedo-600 via-feedo-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-feedo-500/30">
            <Flame className="w-6 h-6 fill-current text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-wider uppercase text-white">
                FEEDO Partner
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
              {restaurant.restaurantName}
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-4 space-y-6">
        {/* Main Section */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Main Operations
          </span>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-feedo-500 text-white shadow-md shadow-feedo-500/25 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-feedo-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-feedo-500/20 text-feedo-400 border border-feedo-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Business Tools Section */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Business Tools
          </span>
          <div className="space-y-1">
            {businessToolsItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-feedo-500 text-white shadow-md shadow-feedo-500/25 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-feedo-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Verified Card & Session Switch */}
      <div className="p-4 border-t border-slate-800 space-y-2.5 bg-slate-950/60">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-200 leading-tight">Verified SuperPartner</p>
            <p className="text-[10px] text-slate-400">KYC Status: Approved</p>
          </div>
        </div>

        <button
          onClick={() => setScreen('login')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch / Logout</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
