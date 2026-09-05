import React from 'react';
import { 
  Sparkles, 
  Plus, 
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Sun, 
  Moon, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useListingStore } from '../store/useListingStore';
import { useChatStore } from '../store/useChatStore';
import { useThemeStore } from '../store/useThemeStore';

export const Navbar = () => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { wishlist, openCreateModal, openAISearchModal, activeView, setActiveView } = useListingStore();
  const { openChatDrawer, conversations } = useChatStore();
  const { theme, toggleTheme } = useThemeStore();

  const unreadChatCount = conversations.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveView('marketplace')}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black shadow-sm transition-transform active:scale-95">
            <Sparkles className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                CampusExchange
              </span>
              <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 text-[10px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-500" /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Search Bar Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <button 
            onClick={openAISearchModal}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-slate-800 dark:hover:text-slate-200 transition duration-150 text-xs font-medium"
          >
            <div className="flex items-center space-x-2.5">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Search items or ask AI assistant...</span>
            </div>
            <kbd className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono font-medium">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* Post Listing Button */}
          <button
            onClick={() => {
              if (!isAuthenticated) openAuthModal('login');
              else openCreateModal();
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-xs shadow-sm transition duration-150 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Item</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setActiveView('dashboard')}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-pink-500 transition"
            title="Saved Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Chat Drawer Trigger */}
          {isAuthenticated && (
            <button
              onClick={openChatDrawer}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition"
              title="Campus Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Auth Trigger */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-2.5 ml-1">
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                <img 
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                  alt={user?.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden lg:inline line-clamp-1">{user?.name}</span>
              </button>

              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveView('admin')}
                  className={`p-2 rounded-xl border transition ${
                    activeView === 'admin' 
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                      : 'bg-slate-100 dark:bg-slate-900 text-amber-500 border-slate-200 dark:border-slate-800'
                  }`}
                  title="Admin Moderation Portal"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-red-500 border border-slate-200/80 dark:border-slate-800 transition"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 border-l border-slate-200 dark:border-slate-800 pl-2.5">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Log in
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition"
              >
                Sign up
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
