import React, { useState } from 'react';
import { useApp, ScreenName } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Wallet,
  Menu,
  BarChart3,
  Star,
  TicketPercent,
  Users,
  Settings,
  Headphones,
  Bell,
  Store,
  X,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentScreen, setScreen, orders } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);

  const activeOrdersCount = orders.filter((o) =>
    ['PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'RIDER_ARRIVED', 'PLACED'].includes(
      o.status
    )
  ).length;

  const primaryTabs: {
    id: ScreenName;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
  ];

  const moreItems: { id: ScreenName; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'analytics',           label: 'Analytics',        icon: BarChart3 },
    { id: 'reviews',             label: 'Reviews',          icon: Star },
    { id: 'offers',              label: 'Promotions',       icon: TicketPercent },
    { id: 'staff',               label: 'Staff',            icon: Users },
    { id: 'settings',            label: 'Settings',         icon: Settings },
    { id: 'support',             label: 'Support',          icon: Headphones },
    { id: 'notifications_center',label: 'Notifications',    icon: Bell },
    { id: 'profile',             label: 'Profile',          icon: Store },
  ];

  const isMoreActive = moreItems.some((item) => item.id === currentScreen);

  const handleMoreNav = (id: ScreenName) => {
    setScreen(id);
    setMoreOpen(false);
  };

  return (
    <>
      {/* Bottom Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
        <div className="flex items-center justify-around">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setMoreOpen(false); setScreen(tab.id); }}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                  isActive ? 'text-feedo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-feedo-500 rounded-full" />
                )}
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen((o) => !o)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              isMoreActive || moreOpen ? 'text-feedo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Menu className={`w-5 h-5 ${isMoreActive || moreOpen ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">More</span>
            {(isMoreActive || moreOpen) && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-feedo-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* More Bottom Sheet Overlay */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />

          {/* Sheet */}
          <div className="md:hidden fixed bottom-[60px] left-0 right-0 z-50 bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-bold text-slate-900">More Options</h3>
              <button
                onClick={() => setMoreOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMoreNav(item.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-feedo-50 text-feedo-600 border border-feedo-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold leading-tight text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};
