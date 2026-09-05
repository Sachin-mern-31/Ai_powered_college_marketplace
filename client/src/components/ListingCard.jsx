import React from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  Tag 
} from 'lucide-react';
import { useListingStore } from '../store/useListingStore';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

export const ListingCard = ({ listing }) => {
  const { wishlist, toggleWishlist, openListingDetail } = useListingStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { startOrOpenChat } = useChatStore();

  const isSaved = wishlist.includes(listing._id);

  const discountPercent = listing.originalPrice && listing.originalPrice > listing.price
    ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
    : 0;

  const handleChat = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    startOrOpenChat({
      sellerId: listing.sellerId,
      listingId: listing._id,
      listingTitle: listing.title
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(listing._id);
  };

  return (
    <div 
      onClick={() => openListingDetail(listing)}
      className="group relative rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img 
          src={listing.images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Condition Tag & AI Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold flex items-center gap-1 shadow-xs">
            <Tag className="w-3 h-3 text-slate-500" />
            {listing.condition}
          </span>
          
          {listing.aiGenerated?.descriptionByAI && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-50/90 dark:bg-indigo-950/90 backdrop-blur-xs border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              AI Verified
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-xs border transition duration-150 z-10 ${
            isSaved 
              ? 'bg-pink-50 dark:bg-pink-950/80 border-pink-200 dark:border-pink-800 text-pink-500' 
              : 'bg-white/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-pink-500'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-pink-500' : ''}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-950/95 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold text-sm flex items-baseline gap-1 shadow-xs">
            <span>${listing.price}</span>
            {listing.originalPrice > listing.price && (
              <span className="text-[10px] text-slate-400 line-through font-normal">${listing.originalPrice}</span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{listing.category}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> {listing.location || 'Main Campus'}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-normal leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Seller Info & Chat Trigger */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold flex items-center justify-center">
              {listing.sellerName ? listing.sellerName.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{listing.sellerName || 'Student'}</span>
                <ShieldCheck className="w-3 h-3 text-indigo-500 shrink-0" />
              </div>
            </div>
          </div>

          <button
            onClick={handleChat}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition duration-150 flex items-center gap-1 text-[11px] font-semibold"
            title="Chat seller"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
