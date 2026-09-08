import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useListingStore } from '../../stores/useListingStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { ListingCard } from '../listings/ListingCard';

export const WishlistView = () => {
  const { listings, setActiveView } = useListingStore();
  const { wishlistIds, clearWishlist } = useWishlistStore();

  const wishlistedItems = listings.filter(item => wishlistIds.includes(item._id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-brand">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>My Wishlist</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800">
              {wishlistedItems.length} saved
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep track of campus items you want to buy later or chat with sellers.
          </p>
        </div>

        {wishlistedItems.length > 0 && (
          <button
            onClick={clearWishlist}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {/* Content */}
      {wishlistedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistedItems.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-12 text-center max-w-lg mx-auto my-12 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-500 border border-rose-200 dark:border-rose-800 mx-auto flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Your Wishlist is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Save course textbooks, electronics, and hostel gear by clicking the heart icon on any product card!
          </p>
          <button
            onClick={() => setActiveView('products')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center space-x-2 transition shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Campus Products</span>
          </button>
        </div>
      )}
    </div>
  );
};
