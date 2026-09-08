import React, { useEffect } from 'react';
import { 
  Navbar, 
  HeroBanner, 
  ListingGrid, 
  LandingPage,
  WishlistView, 
  ListingDetailModal, 
  CreateListingModal, 
  AISearchModal, 
  ChatDrawer, 
  AIChatbotWidget, 
  UserDashboard, 
  AdminPanel, 
  AuthModal 
} from './components';

import { useAuthStore, useListingStore, useThemeStore } from './stores';
import { ShieldCheck } from 'lucide-react';

export function App() {
  const { checkAuth } = useAuthStore();
  const { activeView, setActiveView, setCategory, openCreateModal } = useListingStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans transition-colors duration-200">
      
      <div>
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content View Switcher */}
        {activeView === 'home' && (
          <main>
            <HeroBanner />
            <ListingGrid />
            <LandingPage />
          </main>
        )}

        {activeView === 'about' && (
          <main>
            <LandingPage />
          </main>
        )}

        {activeView === 'products' && (
          <main className="pt-4">
            <ListingGrid />
          </main>
        )}

        {activeView === 'wishlist' && <WishlistView />}

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

      {/* Campus Circle Footer */}
      <footer className="mt-20 border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#080d1a] text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Info */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#001E3C] text-white flex items-center justify-center font-bold">
                  <svg viewBox="0 0 100 100" className="w-5 h-5 fill-none stroke-white stroke-[8]">
                    <circle cx="50" cy="50" r="38" strokeDasharray="200" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="24" strokeDasharray="140" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-brand font-black text-lg text-[#001E3C] dark:text-blue-400">CampusExchange</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                CampusExchange is a student marketplace in India where college students buy and sell in campus for books, gadgets, furniture, and hostel essentials at fair prices.
              </p>
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified College Student Network</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveView('home')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Home Page
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('about')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    About & How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('products')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Browse All Products
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('wishlist')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Saved Wishlist
                  </button>
                </li>
                <li>
                  <button onClick={() => openCreateModal()} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Post a Listing & Sell
                  </button>
                </li>
              </ul>
            </div>

            {/* Top Categories */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Popular Categories</h4>
              <ul className="space-y-2 text-xs">
                {['Books & Notes', 'Electronics', 'Furniture', 'Hostel Essentials', 'Lab & Course Gear'].map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => { setCategory(cat); setActiveView('products'); }} 
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety & Trust */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Trust & Safety</h4>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mb-3">
                Transactions are completed safely with direct local pickup inside trusted campus areas, hostel gates, and student centers.
              </p>
              <div className="text-[11px] text-slate-400 dark:text-slate-500">
                © {new Date().getFullYear()} CampusExchange. All rights reserved.
              </div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
