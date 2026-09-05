import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Tag, 
  MapPin, 
  Wand2 
} from 'lucide-react';
import { useListingStore } from '../store/useListingStore';
import api from '../api/axios';

export const CreateListingModal = () => {
  const { isCreateModalOpen, closeCreateModal, createListing } = useListingStore();

  const [rawTitle, setRawTitle] = useState('');
  const [category, setCategory] = useState('Books & Notes');
  const [condition, setCondition] = useState('Like New');
  const [bulletPoints, setBulletPoints] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('Wilbur Hall / Student Union');

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPricing, setAiPricing] = useState(false);
  const [aiPriceReasoning, setAiPriceReasoning] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [moderationWarning, setModerationWarning] = useState('');

  if (!isCreateModalOpen) return null;

  const handleAIGenerate = async () => {
    if (!rawTitle) {
      setError('Please provide an item title or bullet points.');
      return;
    }
    setError('');
    setAiGenerating(true);

    try {
      const res = await api.post('/ai/generate-description', {
        rawTitle,
        category,
        condition,
        bulletPoints,
        originalPrice
      });

      if (res.data.title) setRawTitle(res.data.title);
      if (res.data.description) setDescription(res.data.description);
    } catch (err) {
      setError('AI generation service error. Try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAISuggestPrice = async () => {
    setAiPricing(true);
    setError('');
    try {
      const res = await api.post('/ai/suggest-price', {
        title: rawTitle,
        category,
        condition,
        originalPrice,
        description
      });

      if (res.data.suggestedPrice) {
        setPrice(res.data.suggestedPrice);
        setAiPriceReasoning(res.data.reasoning);
      }
    } catch (err) {
      setError('Price estimation failed.');
    } finally {
      setAiPricing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawTitle || !description || !price) {
      setError('Title, description, and price are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setModerationWarning('');

    try {
      const listingData = {
        title: rawTitle,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.4,
        category,
        condition,
        images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
        location,
        aiGenerated: {
          descriptionByAI: true,
          suggestedPrice: Number(price)
        }
      };

      const res = await createListing(listingData);
      if (res.flaggedReason) {
        setModerationWarning(`Note: ${res.flaggedReason}`);
      } else {
        closeCreateModal();
      }
    } catch (err) {
      setError(err.message || 'Failed to publish listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post Campus Item</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">AI auto-writes titles & price estimates</p>
            </div>
          </div>

          <button onClick={closeCreateModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {moderationWarning && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{moderationWarning}</span>
            </div>
          )}

          {/* Title & AI Auto Fill Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Item Title</label>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={aiGenerating}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1 shadow-xs disabled:opacity-50 transition"
              >
                <Wand2 className={`w-3 h-3 ${aiGenerating ? 'animate-spin' : ''}`} />
                <span>{aiGenerating ? 'Writing...' : 'AI Auto-Fill'}</span>
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. Introduction to Algorithms 4th Edition CLRS"
              value={rawTitle}
              onChange={(e) => setRawTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl clean-input text-xs"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl clean-input text-xs"
              >
                <option value="Books & Notes">Books & Notes</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Hostel Essentials">Hostel Essentials</option>
                <option value="Lab & Course Gear">Lab & Course Gear</option>
                <option value="Roommate Finder">Roommate Finder</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl clean-input text-xs"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          {/* Quick Bullets */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Quick Highlights (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Hardcover, clean pages, no highlighting"
              value={bulletPoints}
              onChange={(e) => setBulletPoints(e.target.value)}
              className="w-full px-3 py-2 rounded-xl clean-input text-xs"
            />
          </div>

          {/* Pricing Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Price & AI Estimator</label>
              <button
                type="button"
                onClick={handleAISuggestPrice}
                disabled={aiPricing}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 font-bold flex items-center gap-1 hover:opacity-90 transition"
              >
                <DollarSign className="w-3 h-3" />
                <span>{aiPricing ? 'Estimating...' : 'AI Suggest Price'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Original Retail ($)</span>
                <input
                  type="number"
                  placeholder="110"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl clean-input text-xs"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Selling Price ($)</span>
                <input
                  type="number"
                  placeholder="45"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl clean-input text-xs font-bold text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </div>

            {aiPriceReasoning && (
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 p-2 rounded-xl border border-indigo-200 dark:border-indigo-800/60">
                💡 <strong>AI Valuation:</strong> {aiPriceReasoning}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Description</label>
            <textarea
              rows={3}
              placeholder="Describe condition and pickup location..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl clean-input text-xs"
            ></textarea>
          </div>

          {/* Image & Campus Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl clean-input text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Campus Pickup Spot</label>
              <input
                type="text"
                placeholder="e.g. Science Library Courtyard"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl clean-input text-xs"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeCreateModal}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish Item'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
