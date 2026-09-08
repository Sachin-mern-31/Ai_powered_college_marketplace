import React from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  Tag 
} from 'lucide-react';
import { useListingStore } from '../../stores/useListingStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useChatStore } from '../../stores/useChatStore';

export const ListingCard = ({ listing }) => {
  const { openListingDetail } = useListingStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { startOrOpenChat } = useChatStore();

  const isSaved = isInWishlist(listing._id);

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
      className="group relative rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img 
          src={listing.images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Condition Tag & AI Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
            <Tag className="w-3 h-3 text-slate-500" strokeWidth={2} />
            {listing.condition}
          </span>
          
          {listing.aiGenerated?.descriptionByAI && (
            <span className="px-2 py-0.5 rounded-md bg-blue-50/95 dark:bg-blue-950/95 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              Verified
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md border transition duration-150 z-10 shadow-2xs active:scale-90 ${
            isSaved 
              ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-500' 
              : 'bg-white/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-500'
          }`}
          title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} strokeWidth={2} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-[#001E3C]/95 text-white border border-blue-900/60 font-black text-sm flex items-baseline gap-1 shadow-2xs">
            <span>₹{listing.price}</span>
            {listing.originalPrice > listing.price && (
              <span className="text-[10px] text-blue-200/70 line-through font-normal">₹{listing.originalPrice}</span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold shadow-2xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{listing.category}</span>
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-slate-400" strokeWidth={2} /> {listing.location || 'Campus Main'}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-normal leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Seller Info & Chat Trigger */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[9px] font-bold flex items-center justify-center border border-blue-200 dark:border-blue-800">
              {listing.sellerName ? listing.sellerName.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{listing.sellerName || 'Student'}</span>
                <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={2} />
              </div>
            </div>
          </div>

          <button
            onClick={handleChat}
            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition duration-150 flex items-center gap-1 text-[11px] font-semibold shadow-2xs"
            title="Chat seller"
          >
            <MessageSquare className="w-3 h-3" strokeWidth={2} />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
