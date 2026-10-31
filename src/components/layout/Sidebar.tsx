import React from 'react';
import { useApp, ScreenName, UserRole } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  BookOpen,
  BarChart3,
  Wallet,
  TicketPercent,
  Star,
  Settings,
  LogOut,
  Utensils,
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
    ['PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'RIDER_ARRIVED', 'PLACED'].includes(
      o.status
    )
  ).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF', 'KITCHEN', 'CASHIER'],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF', 'KITCHEN', 'CASHIER'],
    },
    {
      id: 'menu',
      label: 'Menu Editor',
      icon: Utensils,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF', 'KITCHEN'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: Wallet,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
    {
      id: 'offers',
      label: 'Promotions',
      icon: TicketPercent,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      allowedRoles: ['OWNER', 'MANAGER', 'ADMIN'],
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: Users,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
    {
      id: 'notifications_center',
      label: 'Notifications',
      icon: Bell,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF', 'KITCHEN', 'CASHIER'],
    },
    {
      id: 'support',
      label: 'Support',
      icon: Headphones,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF'],
    },
    {
      id: 'profile',
      label: 'Restaurant Profile',
      icon: Store,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
  ];

  const visibleNav = navItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(currentUserRole)
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-30 select-none shrink-0">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs">
          <UtensilsCrossed className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
          Feedo<span className="text-red-500">Partner</span>
        </span>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setScreen(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                isActive
                  ? 'nav-active font-semibold'
                  : 'font-medium text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Settings & Profile */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <button
          id="nav-settings"
          onClick={() => setScreen('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-2 cursor-pointer ${
            currentScreen === 'settings' ? 'nav-active font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>

        {/* User / Restaurant Profile Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden shrink-0 shadow-2xs">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden min-w-0 text-left">
            <p className="text-xs font-bold text-slate-900 truncate font-heading">
              {restaurant.restaurantName || 'The Golden Grill'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {currentUserRole === 'OWNER' ? 'Owner Profile' : 'Manager Profile'}
            </p>
          </div>
          <button
            onClick={() => setScreen('login')}
            title="Log out"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
