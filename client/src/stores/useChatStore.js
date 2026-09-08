import { create } from 'zustand';
import api from '../api/axios';
import { io } from 'socket.io-client';

let socket = null;

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isChatDrawerOpen: false,
  loading: false,

  openChatDrawer: () => set({ isChatDrawerOpen: true }),
  closeChatDrawer: () => set({ isChatDrawerOpen: false }),

  initSocket: () => {
    if (!socket) {
      let socketUrl = window.location.origin;
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      const customSocketUrl = import.meta.env.VITE_SOCKET_URL;

      if (customSocketUrl) {
        socketUrl = customSocketUrl;
      } else if (apiBase && apiBase.startsWith('http')) {
        socketUrl = apiBase.replace(/\/api\/?$/, '');
      }

      socket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socket.on('newMessage', (message) => {
        const { activeConversation, messages } = get();
        if (activeConversation && message.conversationId === activeConversation._id) {
          set({ messages: [...messages, message] });
        }
        get().fetchConversations();
      });
    }
  },

  fetchConversations: async () => {
    try {
      const res = await api.get('/chat/conversations');
      set({ conversations: res.data || [] });
    } catch (e) {}
  },

  startOrOpenChat: async ({ sellerId, listingId, listingTitle }) => {
    try {
      set({ isChatDrawerOpen: true, loading: true });
      const res = await api.post('/chat/conversations/start', {
        sellerId,
        listingId,
        listingTitle
      });

      const conv = res.data;
      set({ activeConversation: conv });

      if (socket) {
        socket.emit('joinRoom', conv._id);
      }

      await get().fetchMessages(conv._id);
      set({ loading: false });
    } catch (err) {
      set({ loading: false });
      alert(err.response?.data?.message || 'Could not start conversation');
    }
  },

  selectConversation: async (conv) => {
    set({ activeConversation: conv });
    if (socket) {
      socket.emit('joinRoom', conv._id);
    }
    await get().fetchMessages(conv._id);
  },

  fetchMessages: async (convId) => {
    try {
      const res = await api.get(`/chat/conversations/${convId}/messages`);
      set({ messages: res.data || [] });
    } catch (e) {}
  },

  sendMessage: async (text) => {
    const { activeConversation } = get();
    if (!activeConversation || !text.trim()) return;

    try {
      const res = await api.post(`/chat/conversations/${activeConversation._id}/messages`, { text });
      const newMsg = res.data;

      if (socket) {
        socket.emit('sendMessage', newMsg);
      }

      set((state) => ({ messages: [...state.messages, newMsg] }));
    } catch (e) {}
  }
}));
