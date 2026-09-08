import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2, Tag, DollarSign } from 'lucide-react';
import { useListingStore } from '../../stores/useListingStore';
import api from '../../api/axios';

export const AISearchModal = () => {
  const { isAISearchModalOpen, closeAISearchModal, setCategory, setSearchQuery, setMaxPrice, fetchListings } = useListingStore();
  
  const [nlQuery, setNlQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  if (!isAISearchModalOpen) return null;

  const handleParseAndApply = async (e) => {
    e?.preventDefault();
    if (!nlQuery.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/ai/parse-search-query', { query: nlQuery });
      setParsedResult(res.data);
    } catch (err) {
      console.error('Parse search query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    if (!parsedResult) return;

    if (parsedResult.category && parsedResult.category !== 'All') {
      setCategory(parsedResult.category);
    }
    if (parsedResult.keywords) {
      setSearchQuery(parsedResult.keywords);
    }
    if (parsedResult.maxPrice) {
      setMaxPrice(parsedResult.maxPrice);
    }

    fetchListings();
    closeAISearchModal();
  };

  const sampleQueries = [
    "Cheap physics book under ₹400",
    "Dell monitor for coding in hostel",
    "Comfortable desk chair under ₹1500",
    "Roommate available for Spring semester"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Natural Search</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Describe what you need in natural English</p>
            </div>
          </div>
          <button onClick={closeAISearchModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleParseAndApply} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 'Organic chemistry lab coat and goggles under 25 dollars'"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl clean-input text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              {loading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Sample Prompts */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Try these examples:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNlQuery(q)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Parsed Result */}
          {parsedResult && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Extracted Filters
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 text-xs">
                    <Tag className="w-3 h-3 text-indigo-500" /> {parsedResult.category || 'All'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Max Price</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-xs">
                    <DollarSign className="w-3 h-3 text-emerald-500" /> {parsedResult.maxPrice ? `₹${parsedResult.maxPrice}` : 'Any'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply to Marketplace</span>
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
