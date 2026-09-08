import React, { useEffect } from 'react';
import { useListingStore } from '../../stores/useListingStore';
import { ListingCard } from './ListingCard';
import { Sparkles, PackageSearch, RefreshCw, LayoutGrid, List, ArrowUpDown } from 'lucide-react';

export const ListingGrid = () => {
  const { 
    listings, 
    loading, 
    fetchListings, 
    selectedCategory, 
    searchQuery, 
    openAISearchModal,
    sortBy,
    setSortBy,
    viewLayout,
    setViewLayout
  } = useListingStore();

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery]);

  // Sort Listings
  const sortedListings = [...listings].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-brand">
            <span>{selectedCategory === 'All' ? 'Campus Products & Marketplace' : selectedCategory}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
              {listings.length} items
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover active campus deals verified by student college network.
          </p>
        </div>

        {/* View Controls & Sort */}
        <div className="flex items-center space-x-2">
          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-2xs"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Sort: Price Low to High</option>
              <option value="price_desc">Sort: Price High to Low</option>
            </select>
          </div>

          {/* Grid/List Toggle */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1 rounded-lg transition ${viewLayout === 'grid' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1 rounded-lg transition ${viewLayout === 'list' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={fetchListings}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition shadow-2xs"
            title="Refresh Listings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content View */}
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
      ) : sortedListings.length > 0 ? (
        <div className={viewLayout === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" : "flex flex-col gap-4"}>
          {sortedListings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-10 text-center max-w-md mx-auto my-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200 dark:border-blue-800 mx-auto flex items-center justify-center mb-3">
            <PackageSearch className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No products available</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            No items matching your query "{searchQuery || selectedCategory}".
          </p>
          <div className="flex justify-center">
            <button
              onClick={openAISearchModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Smart AI Search</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
