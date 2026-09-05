import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ListingGrid } from './components/ListingGrid';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { AISearchModal } from './components/AISearchModal';
import { ChatDrawer } from './components/ChatDrawer';
import { AIChatbotWidget } from './components/AIChatbotWidget';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';

import { useAuthStore } from './store/useAuthStore';
import { useListingStore } from './store/useListingStore';
import { useThemeStore } from './store/useThemeStore';

export function App() {
  const { checkAuth } = useAuthStore();
  const { activeView } = useListingStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans transition-colors duration-200">
      
      <div>
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content View Switcher */}
        {activeView === 'marketplace' && (
          <main>
            <HeroBanner />
            <ListingGrid />
          </main>
        )}

        {activeView === 'dashboard' && <UserDashboard />}

        {activeView === 'admin' && <AdminPanel />}
      </div>

      {/* Global Modals & Overlay Drawers */}
      <ListingDetailModal />
      <CreateListingModal />
      <AISearchModal />
      <ChatDrawer />
      <AuthModal />

      {/* Floating AI Assistant */}
      <AIChatbotWidget />

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950/60 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 dark:text-white">CampusExchange</span>
            <span>— Minimalist AI-Powered College Student Marketplace</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Protected by Verified College Domain & Gemini AI Moderation.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
