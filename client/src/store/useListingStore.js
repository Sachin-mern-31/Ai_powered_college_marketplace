import { create } from 'zustand';
import api from '../api/axios';

export const useListingStore = create((set, get) => ({
  listings: [],
  loading: false,
  error: null,

  // Filters
  selectedCategory: 'All',
  searchQuery: '',
  conditionFilter: 'All',
  maxPrice: null,

  // Wishlist saved listing IDs
  wishlist: ['list_101', 'list_102'],

  // Modals & Panels
  selectedListing: null,
  isCreateModalOpen: false,
  isAISearchModalOpen: false,
  isAdminPanelOpen: false,
  isDashboardOpen: false,
  activeView: 'marketplace', // 'marketplace' | 'dashboard' | 'admin'

  setCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setConditionFilter: (cond) => set({ conditionFilter: cond }),
  setMaxPrice: (price) => set({ maxPrice: price }),

  openListingDetail: (listing) => set({ selectedListing: listing }),
  closeListingDetail: () => set({ selectedListing: null }),

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  openAISearchModal: () => set({ isAISearchModalOpen: true }),
  closeAISearchModal: () => set({ isAISearchModalOpen: false }),

  setActiveView: (view) => set({ activeView: view }),

  toggleWishlist: (listingId) => {
    const { wishlist } = get();
    if (wishlist.includes(listingId)) {
      set({ wishlist: wishlist.filter(id => id !== listingId) });
    } else {
      set({ wishlist: [...wishlist, listingId] });
    }
  },

  fetchListings: async () => {
    set({ loading: true, error: null });
    try {
      const { selectedCategory, searchQuery, conditionFilter, maxPrice } = get();
      const params = {};

      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (conditionFilter && conditionFilter !== 'All') params.condition = conditionFilter;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/listings', { params });
      set({ listings: res.data.listings || [], loading: false });
    } catch (err) {
      set({ error: 'Failed to load marketplace listings.', loading: false });
    }
  },

  createListing: async (listingData) => {
    try {
      const res = await api.post('/listings', listingData);
      get().fetchListings();
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create listing');
    }
  }
}));
