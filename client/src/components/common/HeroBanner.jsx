import React from 'react';
import { 
  BookOpen, 
  Laptop, 
  Armchair, 
  Coffee, 
  FlaskConical, 
  Users, 
  Zap, 
  Search,
  Bike,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useListingStore } from '../../stores/useListingStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const HeroBanner = () => {
  const { selectedCategory, setCategory, openAISearchModal, searchQuery, setSearchQuery, setActiveView, openCreateModal } = useListingStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const categories = [
    { name: 'All', icon: Zap },
    { name: 'Books & Notes', icon: BookOpen },
    { name: 'Electronics', icon: Laptop },
    { name: 'Furniture', icon: Armchair },
    { name: 'Hostel Essentials', icon: Coffee },
    { name: 'Lab & Course Gear', icon: FlaskConical },
    { name: 'Roommate Finder', icon: Users },
    { name: 'Cycles & Vehicles', icon: Bike },
  ];

  return (
    <section className="pt-14 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b1120] transition-colors duration-200">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Verified Network Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={2} />
          <span>Verified Campus Network • 0% Commission</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] font-brand max-w-3xl mx-auto">
          Everything Students Need. <br />
          <span className="text-blue-600 dark:text-blue-400">In One Place.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Buy, sell, and exchange course gear, electronics, and hostel essentials directly with verified students on your campus.
        </p>

        {/* 3 Blue Action Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveView('products')}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95"
          >
            Buy Items
          </button>
          
          <button
            onClick={() => {
              if (!isAuthenticated) openAuthModal('login');
              else openCreateModal();
            }}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95"
          >
            Sell Items
          </button>

          <button
            onClick={openAISearchModal}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Request Item</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 flex items-center space-x-3 px-3.5 py-2 w-full">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search textbooks, calculators, dorm furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
              />
            </div>
            
            <button
              onClick={openAISearchModal}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition shrink-0 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Smart Search</span>
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mt-14 mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-brand">
            Browse Categories
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setCategory(cat.name);
                  setActiveView('products');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                  isSelected
                    ? 'bg-[#001E3C] text-white border-[#001E3C] shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} strokeWidth={1.75} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
