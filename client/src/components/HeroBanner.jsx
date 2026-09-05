import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Laptop, 
  Armchair, 
  Coffee, 
  FlaskConical, 
  Users, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Search
} from 'lucide-react';
import { useListingStore } from '../store/useListingStore';

export const HeroBanner = () => {
  const { selectedCategory, setCategory, openAISearchModal, searchQuery, setSearchQuery } = useListingStore();

  const categories = [
    { name: 'All', icon: Zap },
    { name: 'Books & Notes', icon: BookOpen },
    { name: 'Electronics', icon: Laptop },
    { name: 'Furniture', icon: Armchair },
    { name: 'Hostel Essentials', icon: Coffee },
    { name: 'Lab & Course Gear', icon: FlaskConical },
    { name: 'Roommate Finder', icon: Users },
  ];

  return (
    <div className="pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090d16] transition-colors duration-200">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Verification Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>Exclusive to Verified College Email Accounts</span>
        </div>

        {/* Minimal Clean Headline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Campus Resale & Student Exchange, <br className="hidden sm:inline" />
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Simplified by AI</span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal">
          Buy, sell, and trade course textbooks, dorm essentials, and lab gear directly with verified students on campus.
        </p>

        {/* Minimal Search Input */}
        <div className="mt-7 max-w-2xl mx-auto">
          <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 flex items-center space-x-3 px-3.5 py-2 w-full">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search textbooks, furniture, monitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
              />
            </div>
            
            <button
              onClick={openAISearchModal}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition duration-150 shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>AI Search</span>
            </button>
          </div>
        </div>

        {/* Clean Category Filter Pills */}
        <div className="mt-6 flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400 dark:text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
