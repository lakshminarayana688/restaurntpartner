import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { DemoToolbar } from './components/demo/DemoToolbar';
import { DatabaseConfigModal } from './components/common/DatabaseConfigModal';
import { DownloadApkModal } from './components/common/DownloadApkModal';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { OfflineModal } from './components/layout/OfflineModal';
import { RiderCompanionModal } from './components/rider/RiderCompanionModal';

// Modals
import { IncomingOrderModal } from './screens/main/IncomingOrderModal';
import { OrderDetailModal } from './screens/main/OrderDetailModal';

// Pre-auth screens
import { SplashScreen } from './screens/preauth/SplashScreen';
import { OnboardingScreen } from './screens/preauth/OnboardingScreen';
import { LoginScreen } from './screens/preauth/LoginScreen';
import { OtpScreen } from './screens/preauth/OtpScreen';
import { RegistrationScreen } from './screens/preauth/RegistrationScreen';
import { DocumentUploadScreen } from './screens/preauth/DocumentUploadScreen';
import { VerificationStatusScreen } from './screens/preauth/VerificationStatusScreen';
import { ApprovalScreen } from './screens/preauth/ApprovalScreen';
import { RestaurantSetupScreen } from './screens/preauth/RestaurantSetupScreen';

// Main screens
import { DashboardScreen } from './screens/main/DashboardScreen';
import { OrdersScreen } from './screens/main/OrdersScreen';
import { MenuScreen } from './screens/main/MenuScreen';
import { FinanceScreen } from './screens/main/FinanceScreen';
import { AnalyticsScreen } from './screens/main/AnalyticsScreen';
import { ReviewsScreen } from './screens/main/ReviewsScreen';
import { OffersScreen } from './screens/main/OffersScreen';
import { ProfileScreen } from './screens/main/ProfileScreen';
import { DocumentsScreen } from './screens/main/DocumentsScreen';
import { StaffScreen } from './screens/main/StaffScreen';
import { NotificationsScreen } from './screens/main/NotificationsScreen';
import { InventoryScreen } from './screens/main/InventoryScreen';
import { SupportScreen } from './screens/main/SupportScreen';
import { SettingsScreen } from './screens/main/SettingsScreen';
import { AdminScreen } from './screens/main/AdminScreen';

import { Plus, Zap, Bike, Volume2, VolumeX } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentScreen,
    viewMode,
    simulateNewIncomingOrder,
    setScreen,
    isDatabaseModalOpen,
    setIsDatabaseModalOpen,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    isPrototypeMode,
    isAudioUnlocked,
    unlockAudio,
    showToast,
  } = useApp();

  const isPreAuth = [
    'splash',
    'onboarding',
    'login',
    'otp',
    'register',
    'documents',
    'verification_status',
    'approval',
    'setup',
  ].includes(currentScreen);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      // Pre-Auth
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'login':
        return <LoginScreen />;
      case 'otp':
        return <OtpScreen />;
      case 'register':
        return <RegistrationScreen />;
      case 'documents':
        return <DocumentUploadScreen />;
      case 'verification_status':
        return <VerificationStatusScreen />;
      case 'approval':
        return <ApprovalScreen />;
      case 'setup':
        return <RestaurantSetupScreen />;

      // Main Section
      case 'dashboard':
        return <DashboardScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'menu':
        return <MenuScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'offers':
        return <OffersScreen />;
      case 'settings':
        return <SettingsScreen />;

      // Business Tools
      case 'inventory':
        return <InventoryScreen />;
      case 'earnings':
        return <FinanceScreen />;
      case 'reviews':
        return <ReviewsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'documents_compliance':
        return <DocumentsScreen />;
      case 'staff':
        return <StaffScreen />;
      case 'notifications_center':
        return <NotificationsScreen />;
      case 'support':
        return <SupportScreen />;
      case 'admin':
        return <AdminScreen />;

      default:
        return <DashboardScreen />;
    }
  };

  const appView = isPreAuth ? (
    <div className="min-h-screen bg-slate-50">{renderCurrentScreen()}</div>
  ) : (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden">
        <Navbar />
      </div>
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 min-w-0 overflow-y-auto pb-24 md:pb-12 bg-slate-50">
        {renderCurrentScreen()}
      </main>
      <MobileBottomNav />

      {/* Floating Action Button only in Prototype Mode */}
      {isPrototypeMode && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-30 flex flex-col gap-2.5">
          <button
            onClick={simulateNewIncomingOrder}
            title="Simulate New Order"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-feedo-600 via-feedo-500 to-amber-400 text-white shadow-xl shadow-feedo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white"
          >
            <Zap className="w-6 h-6 fill-current animate-pulse" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoToolbar />

      {/* Audio Permission Alert Banner (if browser blocked autoplay) */}
      {!isAudioUnlocked && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-feedo-600 text-white px-3 sm:px-4 py-2 text-xs flex items-center justify-between gap-2 shadow-xs sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs">
              <strong>Order Sound Notice:</strong> Click anywhere on screen or tap here to enable loud audio alerts when orders are assigned to your restaurant.
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              const ok = await unlockAudio();
              if (ok) {
                showToast('🔔 Order alert sound enabled!', 'success');
              }
            }}
            className="px-3 py-1 bg-white text-slate-900 font-black rounded-lg hover:bg-amber-100 transition-colors shrink-0 text-[11px] shadow-xs cursor-pointer ml-2"
          >
            Enable Sound
          </button>
        </div>
      )}

      {/* Modals & Slide-overs */}
      <ToastContainer />
      <IncomingOrderModal />
      <OrderDetailModal />
      <RiderCompanionModal />
      <NotificationsDrawer />
      <OfflineModal />
      <DatabaseConfigModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />
      <DownloadApkModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Main Responsive Application */}
      {!isPrototypeMode || viewMode === 'responsive' ? (
        <div className="flex-1">{appView}</div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-900 overflow-y-auto">
          {/* Smartphone Frame Container (Only available in Prototype Mode) */}
          <div className="relative w-full max-w-[420px] h-[860px] bg-black rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800" />
            </div>
            <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden overflow-y-auto relative flex flex-col">
              {appView}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
