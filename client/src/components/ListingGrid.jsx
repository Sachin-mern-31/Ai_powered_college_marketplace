import React, { useEffect } from 'react';
import { useListingStore } from '../store/useListingStore';
import { ListingCard } from './ListingCard';
import { Sparkles, PackageSearch, RefreshCw } from 'lucide-react';

export const ListingGrid = () => {
  const { 
    listings, 
    loading, 
    fetchListings, 
    selectedCategory, 
    searchQuery, 
    openAISearchModal 
  } = useListingStore();

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{selectedCategory === 'All' ? 'Campus Listings' : selectedCategory}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium border border-slate-200/80 dark:border-slate-700">
              {listings.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified items for sale & exchange across partner colleges.
          </p>
        </div>

        <button
          onClick={fetchListings}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 text-xs font-medium shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 h-72 animate-pulse p-4 flex flex-col justify-between">
              <div className="w-full h-36 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              <div className="space-y-2">
                <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="w-full h-7 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-10 text-center max-w-md mx-auto my-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mx-auto flex items-center justify-center mb-3">
            <PackageSearch className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No listings found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            No items matching your filter "{searchQuery || selectedCategory}".
          </p>
          <div className="flex justify-center">
            <button
              onClick={openAISearchModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
