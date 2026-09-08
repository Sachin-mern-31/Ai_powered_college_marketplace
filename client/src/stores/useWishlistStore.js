import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistIds: [],

      toggleWishlist: (listingId) => {
        const current = get().wishlistIds;
        if (current.includes(listingId)) {
          set({ wishlistIds: current.filter(id => id !== listingId) });
        } else {
          set({ wishlistIds: [...current, listingId] });
        }
      },

      isInWishlist: (listingId) => {
        return get().wishlistIds.includes(listingId);
      },

      clearWishlist: () => set({ wishlistIds: [] })
    }),
    {
      name: 'campus_circle_wishlist'
    }
  )
);
