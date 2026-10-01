import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Volume2,
  VolumeX,
  Zap,
  Shield,
  KeyRound,
  Store,
  LogOut,
  Smartphone,
  CheckCircle2,
  Bell,
  Lock,
  Database,
  Download,
  Copy,
  ExternalLink,
  Radio,
  Sparkles,
} from 'lucide-react';
import { SQL_SCHEMA_DDL } from '../../utils/supabase';

export const SettingsScreen: React.FC = () => {
  const {
    restaurant,
    updateRestaurant,
    orderSoundSettings,
    updateOrderSoundSettings,
    isAudioUnlocked,
    unlockAudio,
    testOrderSound,
    setScreen,
    showToast,
    isSupabaseLive,
    setIsDatabaseModalOpen,
    setIsDownloadModalOpen,
  } = useApp();


  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_DDL);
    showToast('PostgreSQL SQL Schema copied to clipboard!', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Partner Settings & Integrations
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure cloud database synchronization, mobile app downloads, kitchen automation, and device security.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. CLOUD BACKEND & POSTGRESQL REALTIME DB */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Cloud Backend & PostgreSQL Real-time DB (Supabase / Free Tier)</span>
            </h3>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                isSupabaseLive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isSupabaseLive ? '🟢 Connected to Supabase' : '🟡 In-Memory Local Simulation'}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Connect a 100% free Supabase cloud database to enable multi-device sync, real-time customer order streaming, and automatic PostgreSQL order updates.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsDatabaseModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isSupabaseLive ? 'Manage Database Credentials' : 'Connect Free Supabase Database'}</span>
              </button>

              <button
                onClick={handleCopySql}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL DDL Schema</span>
              </button>

              <a
                href="https://supabase.com/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 text-feedo-600 hover:text-feedo-700 hover:bg-feedo-50 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <span>Supabase Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 2. ANDROID MOBILE APP & APK */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-feedo-600" />
              <span>Android Mobile App & Native APK Build</span>
            </h3>
            <span className="text-[10px] font-bold bg-feedo-100 text-feedo-800 px-2.5 py-0.5 rounded-full border border-feedo-200">
              Android 8.0+ Ready
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Install the FEEDO Restaurant Partner app as a standalone Progressive Web App or build a native Android <code>.apk</code> using Capacitor & GitHub Actions.
            </p>

            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-feedo-400" />
              <span>Open APK & App Download Center</span>
            </button>
          </div>
        </div>

        {/* 3. ORDER NOTIFICATIONS & ALERT SOUND */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-feedo-500" />
              <span>Order Notifications & Alert Sound</span>
            </h3>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                restaurant.newOrderSound
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {restaurant.newOrderSound ? '🔊 Audio Alerts ON' : '🔇 Muted'}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Browser Autoplay Permission Status / Enable Order Sound */}
            {!isAudioUnlocked && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-900">
                  <VolumeX className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold">Browser Audio Permission Required</p>
                    <p className="text-[11px] text-amber-700">Click below to allow FEEDO order arrival chimes to play in the background.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await unlockAudio();
                    if (ok) {
                      showToast('Browser audio successfully enabled for order alerts!', 'success');
                    }
                  }}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs shrink-0 cursor-pointer transition-colors"
                >
                  Enable Order Sound
                </button>
              </div>
            )}

            {/* New Order Sound ON/OFF */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <span>New Order Sound Alert</span>
                  {restaurant.newOrderSound ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Play distinct, crystal-clear 2.5s chime when a new customer order is assigned
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !restaurant.newOrderSound;
                  updateRestaurant({ newOrderSound: next });
                  updateOrderSoundSettings({ enabled: next });
                  showToast(`New order sound alert ${next ? 'ENABLED' : 'MUTED'}`, next ? 'success' : 'info');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  restaurant.newOrderSound ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    restaurant.newOrderSound ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Notification Sound Profile & Test Sound Button */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-800">Notification Sound Profile</h4>
                <p className="text-[11px] text-slate-500">
                  FEEDO Harmonic Chime (4-Tone Acoustic Bell — E5/G5/C6/E6)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={testOrderSound}
                  className="px-4 py-2 bg-gradient-to-r from-feedo-500 to-amber-500 hover:from-feedo-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102 active:scale-98"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test Sound</span>
                </button>
              </div>
            </div>

            {/* Volume and Repeat Options */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Alert Volume</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={orderSoundSettings.volume}
                    onChange={(e) => {
                      const vol = parseFloat(e.target.value);
                      updateOrderSoundSettings({ volume: vol });
                    }}
                    className="w-full accent-feedo-500 cursor-pointer"
                  />
                  <span className="font-mono text-[11px] font-bold text-slate-600 w-10 text-right">
                    {Math.round(orderSoundSettings.volume * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Chime Repeats (if unacknowledged)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => updateOrderSoundSettings({ repeatCount: count })}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        orderSoundSettings.repeatCount === count
                          ? 'bg-feedo-500 border-feedo-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {count}x {count === 1 ? '(Default)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto Accept */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <h4 className="font-bold text-slate-800">Auto-Accept Customer Orders</h4>
                <p className="text-[11px] text-slate-500">
                  Automatically accept incoming orders without waiting for manual kitchen confirmation
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !restaurant.autoAcceptOrders;
                  updateRestaurant({ autoAcceptOrders: next });
                  showToast(`Auto-accept is now ${next ? 'ENABLED' : 'DISABLED'}`, next ? 'success' : 'info');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  restaurant.autoAcceptOrders ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    restaurant.autoAcceptOrders ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>


        {/* 4. SECURITY & ACCESS PIN */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-feedo-500" />
            <span>App Lock & Financial Security</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800">Require PIN for Payout Withdrawals</h4>
                <p className="text-[11px] text-slate-500">Require 4-digit security PIN before modifying bank or requesting early settlements</p>
              </div>
              <span className="text-emerald-700 bg-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <h4 className="font-bold text-slate-800">Mask Customer Contact Numbers</h4>
                <p className="text-[11px] text-slate-500">Protect diner privacy by displaying masked phone numbers (+91 98*** **234)</p>
              </div>
              <span className="text-emerald-700 bg-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Always Active
              </span>
            </div>
          </div>
        </div>

        {/* 5. SWITCH ACCOUNT / LOGOUT */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-feedo-500" />
            <span>Store Session Management</span>
          </h3>

          <div className="flex items-center justify-between text-xs">
            <div>
              <h4 className="font-bold text-slate-800">Logged in as: {restaurant.restaurantName}</h4>
              <p className="text-[11px] text-slate-400 font-mono">Owner Mobile: {restaurant.ownerPhone}</p>
            </div>
            <button
              onClick={() => {
                showToast('Logged out of partner session', 'info');
                setScreen('login');
              }}
              className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
