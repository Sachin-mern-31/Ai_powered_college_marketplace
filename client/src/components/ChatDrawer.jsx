import React, { useEffect, useState, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

export const ChatDrawer = () => {
  const { 
    isChatDrawerOpen, 
    closeChatDrawer, 
    conversations, 
    activeConversation, 
    messages, 
    selectConversation, 
    sendMessage,
    fetchConversations,
    initSocket 
  } = useChatStore();

  const { user } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatDrawerOpen) {
      initSocket();
      fetchConversations();
    }
  }, [isChatDrawerOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isChatDrawerOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Campus Direct Messages</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Real-time Socket.io</p>
            </div>
          </div>

          <button onClick={closeChatDrawer} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Conversations List */}
          <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/40 p-2.5 space-y-1.5 shrink-0">
            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider px-2 block mb-1">Active Chats</span>
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const isActive = activeConversation?._id === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full text-left p-2.5 rounded-xl border transition ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-white' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <p className="text-xs font-bold line-clamp-1">{conv.listingTitle || 'Listing Chat'}</p>
                    <span className="text-[10px] text-slate-400 font-medium block">Seller Inquiry</span>
                  </button>
                );
              })
            ) : (
              <p className="text-[11px] text-slate-400 p-3 text-center">No active chats yet. Click 'Chat' on any listing!</p>
            )}
          </div>

          {/* Messages Thread */}
          <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0b0f19]">
            {activeConversation ? (
              <>
                {/* Active Chat Header */}
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{activeConversation.listingTitle}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Socket.io Connected
                    </span>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === (user?.id || user?._id);
                    return (
                      <div
                        key={msg._id || msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[9px] text-slate-400 mb-0.5 px-1">{msg.senderName || 'Student'}</span>
                        <div
                          className={`max-w-xs sm:max-w-md p-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send Input */}
                <form onSubmit={handleSend} className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl clean-input text-xs"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <MessageSquare className="w-8 h-8 text-slate-400 mb-2" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Select or Start a Chat</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Select a conversation from the sidebar.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
