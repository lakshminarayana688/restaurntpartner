import React from 'react';
import { useApp, ScreenName } from '../../context/AppContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  IndianRupee,
  Menu,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentScreen, setScreen, orders } = useApp();

  const activeOrdersCount = orders.filter((o) =>
    ['PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'RIDER_ARRIVED'].includes(
      o.status
    )
  ).length;

  const tabs: { id: ScreenName; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: UtensilsCrossed, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined },
    { id: 'menu', label: 'Menu', icon: BookOpen },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'settings', label: 'More', icon: Menu },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
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
      </div>
    </div>
  );
};
