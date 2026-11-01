import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Volume2,
  VolumeX,
  User,
  ShieldCheck,
  ChevronDown,
  Menu,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    restaurant,
    toggleOnlineStatus,
    updateRestaurant,
    updateOrderSoundSettings,
    testOrderSound,
    notifications,
    setIsNotificationsOpen,
    setScreen,
    currentUserRole,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger Button + Brand & Restaurant Information */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              id="hamburger-nav-btn"
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              title={isMobileDrawerOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
            <img
              src="/feedo-logo.png"
              alt="FEEDO"
              className="w-10 h-10 rounded-2xl object-cover shadow-md shadow-amber-500/20 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                  {restaurant.restaurantName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  ★ {restaurant.rating}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md mt-0.5">
                {restaurant.address}
              </p>
            </div>
          </div>

          {/* Right: Operational Controls & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio Alert Chime Toggle */}
            <button
              onClick={() => {
                const next = !restaurant.newOrderSound;
                updateRestaurant({ newOrderSound: next });
                updateOrderSoundSettings({ enabled: next });
              }}
              title={restaurant.newOrderSound ? 'Mute order notification chimes' : 'Enable order notification chimes'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                restaurant.newOrderSound
                  ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}
            >
              {restaurant.newOrderSound ? (
                <Volume2 className="w-4 h-4 text-feedo-600" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Test Order Sound Button */}
            <button
              onClick={testOrderSound}
              title="Test Order Assignment Notification Sound"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Test Order Sound</span>
            </button>


            {/* Live Kitchen Status (ONLINE / OFFLINE) */}
            <button
              onClick={toggleOnlineStatus}
              title="Toggle restaurant online/offline status"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                restaurant.isOnline
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  restaurant.isOnline ? 'bg-emerald-500 live-pulse' : 'bg-rose-500'
                }`}
              />
              <span>{restaurant.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

            {/* Real Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              title="Notifications"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar / Role */}
            <button
              onClick={() => setScreen('profile')}
              title="Restaurant Profile & Settings"
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            >
              <img
                src={restaurant.logoUrl}
                alt="Restaurant"
                className="w-7 h-7 rounded-xl object-cover border border-slate-200"
              />
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {restaurant.ownerName.split(' ')[0]}
                </span>
                <span className="text-[10px] font-semibold text-feedo-600 block uppercase">
                  {currentUserRole}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
