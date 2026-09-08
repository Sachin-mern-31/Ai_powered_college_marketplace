import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  Heart, 
  AlertTriangle,
  Tag
} from 'lucide-react';
import { useListingStore } from '../../stores/useListingStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useChatStore } from '../../stores/useChatStore';
import { useWishlistStore } from '../../stores/useWishlistStore';

export const ListingDetailModal = () => {
  const { selectedListing, closeListingDetail } = useListingStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { startOrOpenChat } = useChatStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  if (!selectedListing) return null;

  const isSaved = isInWishlist(selectedListing._id);

  const handleStartChat = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    startOrOpenChat({
      sellerId: selectedListing.sellerId,
      listingId: selectedListing._id,
      listingTitle: selectedListing.title
    });
    closeListingDetail();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={closeListingDetail}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Gallery */}
          <div className="relative bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <img 
              src={selectedListing.images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'} 
              alt={selectedListing.title}
              className="max-h-80 w-full object-contain rounded-2xl"
            />
            
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-500" />
                {selectedListing.condition}
              </span>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="p-6 flex flex-col justify-between space-y-5 max-h-[80vh] overflow-y-auto">
            <div>
              {/* Category & Location */}
              <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                <span>{selectedListing.category}</span>
                <span className="flex items-center gap-1 text-slate-400 font-normal">
                  <MapPin className="w-3.5 h-3.5" /> {selectedListing.location}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {selectedListing.title}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-2xl font-black text-slate-900 dark:text-white">₹{selectedListing.price}</span>
                {selectedListing.originalPrice > selectedListing.price && (
                  <span className="text-xs text-slate-400 line-through">₹{selectedListing.originalPrice} retail</span>
                )}
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                  Great Campus Deal
                </span>
              </div>

              {/* AI Valuation */}
              {selectedListing.aiGenerated && (
                <div className="mt-3 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">AI Valuation & Safety Status</h4>
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                      Suggested price roughly ₹{selectedListing.aiGenerated.suggestedPrice || selectedListing.price}. Content policy verified.
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedListing.description}
                </p>
              </div>

              {/* Seller Profile */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                    {selectedListing.sellerName ? selectedListing.sellerName.charAt(0) : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedListing.sellerName || 'Verified Student'}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{selectedListing.sellerCollege} • {selectedListing.sellerHostel}</p>
                  </div>
                </div>
              </div>

              {/* Campus Safety Banner */}
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 flex items-center space-x-2 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span>Meet in public campus areas (Library / Student Union).</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => toggleWishlist(selectedListing._id)}
                className={`p-2.5 rounded-xl border transition ${
                  isSaved 
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-500' 
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-rose-500'
                }`}
                title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                onClick={handleStartChat}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Direct with Seller</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
