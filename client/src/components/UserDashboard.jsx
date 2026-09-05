import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useListingStore } from '../store/useListingStore';
import { ListingCard } from './ListingCard';
import { Heart, Package, ShieldCheck, Trash2, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

export const UserDashboard = () => {
  const { user } = useAuthStore();
  const { listings, wishlist, setActiveView, fetchListings } = useListingStore();
  const [tab, setTab] = useState('my_listings');

  const myListingItems = listings.filter((l) => l.sellerId === (user?.id || user?._id));
  const wishlistItems = listings.filter((l) => wishlist.includes(l._id));

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      fetchListings();
    } catch (e) {
      alert('Delete failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3.5">
          <button
            onClick={() => setActiveView('marketplace')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
              <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-500" /> Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.college} • {user?.hostel || 'Main Campus'}</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setTab('my_listings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              tab === 'my_listings' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Items ({myListingItems.length})</span>
          </button>

          <button
            onClick={() => setTab('wishlist')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              tab === 'wishlist' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-500" />
            <span>Wishlist ({wishlistItems.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {tab === 'my_listings' && (
        <div>
          {myListingItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myListingItems.map((item) => (
                <div key={item._id} className="relative group">
                  <ListingCard listing={item} />
                  <button
                    onClick={() => handleDeleteListing(item._id)}
                    className="absolute top-2.5 right-10 z-20 p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 transition"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No items posted yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click 'Post Item' to list textbooks or campus gear!</p>
            </div>
          )}
        </div>
      )}

      {tab === 'wishlist' && (
        <div>
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlistItems.map((item) => (
                <ListingCard key={item._id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Heart className="w-10 h-10 text-pink-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Heart items in the marketplace to save them here.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
