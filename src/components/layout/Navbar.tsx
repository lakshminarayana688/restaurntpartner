import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Power,
  Search,
  Volume2,
  VolumeX,
  Store,
  ChevronDown,
  Smartphone,
  Monitor,
  Zap,
  Download,
  Database,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    restaurant,
    toggleOnlineStatus,
    updateRestaurant,
    notifications,
    setIsNotificationsOpen,
    viewMode,
    setViewMode,
    setScreen,
    simulateNewIncomingOrder,
    setIsRiderSimulatorOpen,
    setIsDatabaseModalOpen,
    setIsDownloadModalOpen,
    isSupabaseLive,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand / Restaurant info on mobile */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-feedo-600 to-feedo-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-feedo-500/25">
                F
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-slate-900 leading-none">
                    {restaurant.restaurantName}
                  </h1>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                    ★ {restaurant.rating}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                  {restaurant.address}
                </p>
              </div>
            </div>
          </div>

          {/* Center / Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Database / Backend Connection Button */}
            <button
              onClick={() => setIsDatabaseModalOpen(true)}
              title="PostgreSQL Database & Realtime Backend Setup"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isSupabaseLive
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseLive ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">
                {isSupabaseLive ? 'Supabase DB' : 'DB Setup'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseLive ? 'bg-emerald-500 live-pulse' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Download APK / App Button */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              title="Download Android Mobile App / APK"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-feedo-400" />
              <span className="hidden sm:inline">App / APK</span>
            </button>

            {/* Quick Simulate Order CTA */}
            <button
              onClick={simulateNewIncomingOrder}
              title="Simulate a customer order"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-feedo-500 text-white shadow-xs hover:from-amber-600 hover:to-feedo-600 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Order</span>
            </button>

            {/* Rider Simulator Toggle */}
            <button
              onClick={() => setIsRiderSimulatorOpen(true)}
              title="Open Rider Simulator"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer"
            >
              <span className="text-sm">🚴</span>
              <span className="hidden sm:inline">Rider</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => updateRestaurant({ newOrderSound: !restaurant.newOrderSound })}
              title={restaurant.newOrderSound ? 'Mute alert sounds' : 'Enable alert sounds'}
              className={`p-2 rounded-xl border transition-colors ${
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

            {/* Online / Offline Switch */}
            <button
              onClick={toggleOnlineStatus}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-2xs ${
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

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setScreen('profile')}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <img
                src={restaurant.logoUrl}
                alt="Restaurant"
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
