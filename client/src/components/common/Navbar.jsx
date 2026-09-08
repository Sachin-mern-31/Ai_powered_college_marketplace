import React from 'react';
import { 
  Home, 
  Compass, 
  Heart, 
  Store, 
  ShoppingCart, 
  MessageSquare, 
  Sun, 
  Moon, 
  ShieldAlert, 
  LogOut,
  Search,
  Info
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useListingStore } from '../../stores/useListingStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useChatStore } from '../../stores/useChatStore';
import { useThemeStore } from '../../stores/useThemeStore';

export const Navbar = () => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { openCreateModal, openAISearchModal, activeView, setActiveView } = useListingStore();
  const { wishlistIds } = useWishlistStore();
  const { openChatDrawer, conversations } = useChatStore();
  const { theme, toggleTheme } = useThemeStore();

  const unreadChatCount = conversations.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0b1120] border-b border-slate-200/90 dark:border-slate-800/90 transition-colors duration-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LEFT SIDE: Brand Logo & Handcrafted Title (Matching Screenshot) */}
        <div 
          onClick={() => setActiveView('home')} 
          className="flex items-center space-x-3 cursor-pointer shrink-0 group select-none"
        >
          {/* Authentic Circular Shopping Cart Emblem */}
          <div className="w-11 h-11 rounded-full border-2 border-[#001E3C] dark:border-blue-400 flex items-center justify-center p-1 relative bg-white dark:bg-[#0b1120] transition-transform duration-200 group-hover:scale-105">
            <div className="w-full h-full rounded-full border border-dashed border-[#001E3C]/60 dark:border-blue-400/60 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#001E3C] dark:text-blue-400" strokeWidth={1.75} />
            </div>
          </div>

          {/* Title & Tagline Stack */}
          <div className="flex flex-col justify-center">
            <div className="font-brand font-black text-lg tracking-tight text-[#001E3C] dark:text-white leading-none uppercase">
              CAMPUS
            </div>
            <div className="font-brand font-black text-lg tracking-tight text-[#001E3C] dark:text-blue-400 leading-none uppercase mt-0.5">
              EXCHANGE
            </div>
            {/* Fine divider line */}
            <div className="h-[1px] w-full bg-[#001E3C]/25 dark:bg-blue-400/25 my-0.5"></div>
            <span className="text-[8px] font-extrabold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
              FOR STUDENTS. BY STUDENTS.
            </span>
          </div>
        </div>

        {/* CENTER: Navigation Links (Vertical Icon-above-Text Stack) */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setActiveView('home')}
            className={`flex flex-col items-center justify-center text-[11px] font-semibold transition px-2 py-1 group ${
              activeView === 'home' 
                ? 'text-blue-600 dark:text-blue-400 font-bold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform duration-150" strokeWidth={1.75} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveView('about')}
            className={`flex flex-col items-center justify-center text-[11px] font-semibold transition px-2 py-1 group ${
              activeView === 'about' 
                ? 'text-blue-600 dark:text-blue-400 font-bold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Info className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform duration-150" strokeWidth={1.75} />
            <span>About</span>
          </button>

          <button
            onClick={() => setActiveView('products')}
            className={`flex flex-col items-center justify-center text-[11px] font-semibold transition px-2 py-1 group ${
              activeView === 'products' 
                ? 'text-blue-600 dark:text-blue-400 font-bold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform duration-150" strokeWidth={1.75} />
            <span>Buy</span>
          </button>

          <button
            onClick={() => setActiveView('wishlist')}
            className={`relative flex flex-col items-center justify-center text-[11px] font-semibold transition px-2 py-1 group ${
              activeView === 'wishlist' 
                ? 'text-blue-600 dark:text-blue-400 font-bold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Heart className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform duration-150" strokeWidth={1.75} />
            <span>Wishlist</span>
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
                {wishlistIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) openAuthModal('login');
              else openCreateModal();
            }}
            className="flex flex-col items-center justify-center text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition px-2 py-1 group"
          >
            <Store className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform duration-150" strokeWidth={1.75} />
            <span>Sell</span>
          </button>
        </nav>

        {/* RIGHT SIDE: Controls & Sign In Pill Button */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Search Trigger */}
          <button
            onClick={openAISearchModal}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            title="Search Marketplace"
          >
            <Search className="w-5 h-5" strokeWidth={1.75} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" strokeWidth={1.75} /> : <Moon className="w-5 h-5 text-slate-700" strokeWidth={1.75} />}
          </button>

          {/* Chat Messages Icon */}
          {isAuthenticated && (
            <button
              onClick={openChatDrawer}
              className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 transition"
              title="Campus Messages"
            >
              <MessageSquare className="w-5 h-5" strokeWidth={1.75} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>
          )}

          {/* Shopping Cart / Wishlist Icon */}
          <button
            onClick={() => setActiveView('wishlist')}
            className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 transition"
            title="Wishlist Cart"
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Pill Sign In / User Profile Button */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-3">
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                <img 
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-600"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden xl:inline line-clamp-1">{user?.name}</span>
              </button>

              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveView('admin')}
                  className={`p-2 rounded-full transition ${
                    activeView === 'admin' 
                      ? 'text-amber-500' 
                      : 'text-slate-400 hover:text-amber-500'
                  }`}
                  title="Admin Portal"
                >
                  <ShieldAlert className="w-5 h-5" strokeWidth={1.75} />
                </button>
              )}

              <button
                onClick={logout}
                className="p-2 rounded-full text-slate-400 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 ml-1"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
