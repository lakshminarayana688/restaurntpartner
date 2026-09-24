import React from 'react';
import { useApp, ScreenName, UserRole } from '../../context/AppContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  TrendingUp,
  Tag,
  Boxes,
  IndianRupee,
  Star,
  Store,
  Users,
  Settings,
  LifeBuoy,
  Flame,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface NavItem {
  id: ScreenName;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string | number;
  allowedRoles?: UserRole[];
}

export const Sidebar: React.FC = () => {
  const { currentScreen, setScreen, orders, restaurant, notifications, currentUserRole } = useApp();

  const activeOrdersCount = orders.filter((o) =>
    ['PAYMENT_CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'RIDER_ARRIVED', 'PLACED'].includes(
      o.status
    )
  ).length;

  // 1. MAIN OPERATIONS
  const mainNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
    {
      id: 'orders',
      label: 'Live Orders',
      icon: UtensilsCrossed,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF', 'KITCHEN', 'CASHIER'],
    },
    {
      id: 'menu',
      label: 'Menu Manager',
      icon: BookOpen,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF', 'KITCHEN'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
    {
      id: 'offers',
      label: 'Promotions',
      icon: Tag,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
  ];

  // 2. BUSINESS TOOLS
  const businessToolsItems: NavItem[] = [
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF', 'KITCHEN'],
    },
    {
      id: 'earnings',
      label: 'Finance',
      icon: IndianRupee,
      allowedRoles: ['OWNER'], // Strictly Owner
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      badge: `${restaurant.rating}★`,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
  ];

  // 3. ACCOUNT
  const accountItems: NavItem[] = [
    {
      id: 'profile',
      label: 'Restaurant Profile',
      icon: Store,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF'],
    },
    {
      id: 'staff',
      label: 'Staff & Permissions',
      icon: Users,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      allowedRoles: ['OWNER', 'MANAGER'],
    },
  ];

  // 4. HELP
  const helpItems: NavItem[] = [
    {
      id: 'support',
      label: 'Help & Support',
      icon: LifeBuoy,
      allowedRoles: ['OWNER', 'MANAGER', 'STAFF', 'KITCHEN', 'CASHIER'],
    },
  ];

  const filterByRole = (items: NavItem[]) => {
    return items.filter(
      (item) => !item.allowedRoles || item.allowedRoles.includes(currentUserRole)
    );
  };

  const visibleMain = filterByRole(mainNavItems);
  const visibleBusiness = filterByRole(businessToolsItems);
  const visibleAccount = filterByRole(accountItems);
  const visibleHelp = filterByRole(helpItems);

  return (
    <aside className="w-64 bg-slate-900 text-white border-r border-slate-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-feedo-600 via-feedo-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-feedo-500/25">
            <Flame className="w-5 h-5 fill-current text-white" />
          </div>
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-white block">
              FEEDO PARTNER
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Role: <strong className="text-feedo-400">{currentUserRole}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-6">
        {/* Main Operations */}
        {visibleMain.length > 0 && (
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Main Operations
            </span>
            <div className="space-y-1">
              {visibleMain.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
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
        )}

        {/* Business Tools */}
        {visibleBusiness.length > 0 && (
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Business Tools
            </span>
            <div className="space-y-1">
              {visibleBusiness.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
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
        )}

        {/* Account */}
        {visibleAccount.length > 0 && (
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Account
            </span>
            <div className="space-y-1">
              {visibleAccount.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
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
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Help & Support */}
        {visibleHelp.length > 0 && (
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Help
            </span>
            <div className="space-y-1">
              {visibleHelp.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
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
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Verified Card & Session Switch */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/60">
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
