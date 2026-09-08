import React, { useState } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import api from '../../api/axios';

export const AIChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm CampusBot 🎓. Need help pricing an item, writing a listing description, or staying safe during campus meetups?"
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e, textToSend) => {
    e?.preventDefault();
    const queryText = textToSend || inputMsg;
    if (!queryText.trim()) return;

    const userMsgObj = { id: Date.now(), sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsgObj]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: queryText });
      const botReplyObj = { id: Date.now() + 1, sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botReplyObj]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: "I'm having a little trouble connecting right now, but always remember to meet in public campus zones like the Library or Student Center!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickChips = [
    "What is fair price for CLRS textbook?",
    "Campus safety tips for exchange",
    "Help me write a bike description"
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md flex items-center space-x-2 transition duration-200 hover:scale-105"
        >
          <div className="relative">
            <Bot className="w-5 h-5" strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <span className="font-bold text-xs pr-1">CampusBot AI</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-96 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
          
          {/* Widget Header */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">CampusBot AI Assistant</h4>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">24/7 Campus Resale Advisor</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-slate-950/80">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none font-medium'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-1.5 bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={(e) => handleSend(e, chip)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition"
              >
                💡 {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask pricing or safety tips..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl clean-input text-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
