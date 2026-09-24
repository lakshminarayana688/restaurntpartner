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

import { Plus, Zap, Bike } from 'lucide-react';

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

      default:
        return <DashboardScreen />;
    }
  };

  const appView = isPreAuth ? (
    <div className="min-h-screen bg-slate-50">{renderCurrentScreen()}</div>
  ) : (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto pb-24 md:pb-12 bg-slate-50/70">
          {renderCurrentScreen()}
        </main>
      </div>
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
