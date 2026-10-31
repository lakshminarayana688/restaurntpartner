import React from 'react';
import { useApp, ScreenName, UserRole } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  UtensilsCrossed,
  BarChart3,
  Wallet,
  TicketPercent,
  Star,
  Settings,
  LogOut,
  Users,
  Bell,
  Headphones,
  Store,
} from 'lucide-react';

interface NavItem {
  id: ScreenName;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string | number;
  allowedRoles?: UserRole[];
}

export const Sidebar: React.FC = () => {
  const { currentScreen, setScreen, orders, restaurant, currentUserRole } = useApp();

  const activeOrdersCount = orders.filter((o) =>
    ['PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'RIDER_ARRIVED', 'PLACED'].includes(o.status)
  ).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard',        icon: LayoutDashboard,  allowedRoles: ['OWNER','MANAGER','STAFF','KITCHEN','CASHIER'] },
    { id: 'orders',    label: 'Orders',            icon: ShoppingBag,      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined, allowedRoles: ['OWNER','MANAGER','STAFF','KITCHEN','CASHIER'] },
    { id: 'menu',      label: 'Menu Editor',       icon: Utensils,         allowedRoles: ['OWNER','MANAGER','STAFF','KITCHEN'] },
    { id: 'analytics', label: 'Analytics',         icon: BarChart3,        allowedRoles: ['OWNER','MANAGER'] },
    { id: 'earnings',  label: 'Earnings',          icon: Wallet,           allowedRoles: ['OWNER','MANAGER'] },
    { id: 'offers',    label: 'Promotions',        icon: TicketPercent,    allowedRoles: ['OWNER','MANAGER'] },
    { id: 'reviews',   label: 'Reviews',           icon: Star,             allowedRoles: ['OWNER','MANAGER'] },
    { id: 'staff',     label: 'Staff Management',  icon: Users,            allowedRoles: ['OWNER','MANAGER'] },
    { id: 'notifications_center', label: 'Notifications', icon: Bell,     allowedRoles: ['OWNER','MANAGER','STAFF','KITCHEN','CASHIER'] },
    { id: 'support',   label: 'Support',           icon: Headphones,       allowedRoles: ['OWNER','MANAGER','STAFF'] },
    { id: 'profile',   label: 'Restaurant Profile',icon: Store,            allowedRoles: ['OWNER','MANAGER'] },
  ];

  const visibleNav = navItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(currentUserRole)
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-30 select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-2.5 border-b border-slate-100">
        <img
          src="/feedo-logo.png"
          alt="FEEDO"
          className="w-9 h-9 rounded-2xl object-cover shadow-md shadow-amber-200 shrink-0"
        />
        <div>
          <span className="text-base font-black tracking-tight text-slate-900">
            Feedo<span className="text-amber-500">Partner</span>
          </span>
          <p className="text-[10px] text-slate-400 font-medium">Restaurant Dashboard</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setScreen(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-50 text-amber-700 font-bold border-r-4 border-[#FFC700]'
                  : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                isActive ? 'bg-[#FFC700] shadow-sm' : 'bg-transparent'
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-current'}`} />
              </div>
              <span className="truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100">
        <button
          id="nav-settings"
          onClick={() => setScreen('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all mb-2 cursor-pointer ${
            currentScreen === 'settings'
              ? 'bg-amber-50 text-amber-700 font-bold border-r-4 border-[#FFC700]'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            currentScreen === 'settings' ? 'bg-[#FFC700]' : 'bg-transparent'
          }`}>
            <Settings className="w-4 h-4" />
          </div>
          <span>Settings</span>
        </button>

        {/* User card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-[#FFC700] overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden min-w-0 text-left">
            <p className="text-xs font-bold text-slate-900 truncate">
              {restaurant.restaurantName || 'The Golden Grill'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentUserRole === 'OWNER' ? 'Owner' : 'Manager'}
            </p>
          </div>
          <button
            onClick={() => setScreen('login')}
            title="Log out"
            className="text-slate-400 hover:text-rose-500 p-1 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
