import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Wand2,
  BookOpen,
  Laptop,
  Armchair,
  Coffee,
  FlaskConical,
  Bike,
  Users,
  Image as ImageIcon,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Store,
  Tag,
  Check,
  DollarSign
} from 'lucide-react';
import { useListingStore } from '../../stores/useListingStore';
import api from '../../api/axios';

export const CreateListingModal = () => {
  const { isCreateModalOpen, closeCreateModal, createListing } = useListingStore();

  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Pricing & AI, 3: Photo & Location

  const [rawTitle, setRawTitle] = useState('');
  const [category, setCategory] = useState('Books & Notes');
  const [condition, setCondition] = useState('Like New');
  const [bulletPoints, setBulletPoints] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('Central Library / Student Union');

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPricing, setAiPricing] = useState(false);
  const [aiPriceReasoning, setAiPriceReasoning] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [moderationWarning, setModerationWarning] = useState('');

  if (!isCreateModalOpen) return null;

  const categories = [
    { name: 'Books & Notes', icon: BookOpen, desc: 'Textbooks, Notes, PYQs' },
    { name: 'Electronics', icon: Laptop, desc: 'Laptops, Calculators, Audio' },
    { name: 'Furniture', icon: Armchair, desc: 'Chairs, Tables, Lamp' },
    { name: 'Hostel Essentials', icon: Coffee, desc: 'Kettles, Coolers, Pillows' },
    { name: 'Lab & Course Gear', icon: FlaskConical, desc: 'Lab Coats, Kits, Tools' },
    { name: 'Cycles & Vehicles', icon: Bike, desc: 'Bicycles, Helmets, Gear' },
    { name: 'Roommate Finder', icon: Users, desc: 'Flatmates, Sublets' },
  ];

  const conditionOptions = [
    { name: 'New', label: 'Brand New', desc: 'Unopened / Never used' },
    { name: 'Like New', label: 'Like New', desc: 'Mint condition, barely used' },
    { name: 'Good', label: 'Good Condition', desc: 'Fully functional, minor wear' },
    { name: 'Fair', label: 'Fair / Usable', desc: 'Working with visible marks' },
  ];

  const presetImages = [
    { name: 'Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Laptop', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hostel Kettle', url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=800&q=80' },
    { name: 'Study Desk', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' }
  ];

  const presetLocations = [
    'Central Library Courtyard',
    'Hostel Canteen / Mess Gate',
    'Student Activity Center (SAC)',
    'Main Gate Security Desk',
    'Department Block'
  ];

  const handleAIGenerate = async () => {
    if (!rawTitle) {
      setError('Please type an item title or keywords first.');
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
      setError('AI generation service temporary error. You can type description manually.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAISuggestPrice = async () => {
    setAiPricing(true);
    setError('');
    try {
      const res = await api.post('/ai/suggest-price', {
        title: rawTitle || 'Campus Item',
        category,
        condition,
        originalPrice: originalPrice || 1000,
        description
      });

      if (res.data.suggestedPrice) {
        setPrice(res.data.suggestedPrice);
        setAiPriceReasoning(res.data.reasoning);
      }
    } catch (err) {
      setError('AI valuation calculation failed. Please enter price manually.');
    } finally {
      setAiPricing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawTitle) {
      setError('Please provide an Item Title.');
      setCurrentStep(1);
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Please provide a valid Selling Price in ₹.');
      setCurrentStep(2);
      return;
    }

    setSubmitting(true);
    setError('');
    setModerationWarning('');

    try {
      const finalImage = imageUrl.trim() || presetImages[0].url;
      const listingData = {
        title: rawTitle,
        description: description || `${rawTitle} in ${condition} condition. Available for pickup at ${location}.`,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.35),
        category,
        condition,
        images: [finalImage],
        location,
        aiGenerated: {
          descriptionByAI: true,
          suggestedPrice: Number(price)
        }
      };

      const res = await createListing(listingData);
      if (res.flaggedReason) {
        setModerationWarning(`Moderation Note: ${res.flaggedReason}`);
      } else {
        closeCreateModal();
      }
    } catch (err) {
      setError(err.message || 'Failed to publish listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const discountPercent = originalPrice && price && Number(originalPrice) > Number(price)
    ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl my-6 flex flex-col max-h-[92vh]">
        
        {/* HEADER BAR */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-[#080d1a]/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-brand">
                List Item on CampusExchange
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a student listing with AI valuation & instant campus reach
              </p>
            </div>
          </div>

          <button 
            onClick={closeCreateModal} 
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs shrink-0">
          {[
            { step: 1, name: '1. Basic Details' },
            { step: 2, name: '2. Pricing & AI' },
            { step: 3, name: '3. Photos & Location' }
          ].map((st) => (
            <button
              key={st.step}
              type="button"
              onClick={() => setCurrentStep(st.step)}
              className={`flex items-center space-x-2 font-semibold transition px-3 py-1.5 rounded-xl ${
                currentStep === st.step
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                currentStep === st.step ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {st.step}
              </span>
              <span>{st.name}</span>
            </button>
          ))}
        </div>

        {/* FORM CONTENT BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {moderationWarning && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{moderationWarning}</span>
            </div>
          )}

          {/* STEP 1: BASIC DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Item Title Input with AI Magic Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Item Title <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={aiGenerating}
                    className="text-[11px] px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-2xs disabled:opacity-50 transition active:scale-95"
                  >
                    <Wand2 className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} />
                    <span>{aiGenerating ? 'Writing Description...' : 'AI Auto-Fill Description'}</span>
                  </button>
                </div>
                
                <input
                  type="text"
                  placeholder="e.g. Higher Engineering Mathematics by B.S. Grewal (44th Ed)"
                  value={rawTitle}
                  onChange={(e) => setRawTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl clean-input text-xs sm:text-sm font-semibold"
                />
              </div>

              {/* Category Grid Tiles */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2">
                  Select Category <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between relative group ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 shadow-2xs'
                            : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} strokeWidth={1.75} />
                          {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{cat.name}</div>
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Condition Options Pills */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2">
                  Item Condition <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {conditionOptions.map((cond) => {
                    const isSelected = condition === cond.name;
                    return (
                      <button
                        key={cond.name}
                        type="button"
                        onClick={() => setCondition(cond.name)}
                        className={`p-3 rounded-xl border text-left transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-xs font-bold">{cond.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                          {cond.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Key Highlights */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1">
                  Key Highlights / Features (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unmarked pages, includes lab manual CD, original bill"
                  value={bulletPoints}
                  onChange={(e) => setBulletPoints(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl clean-input text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!rawTitle) {
                      setError('Please enter item title before proceeding.');
                      return;
                    }
                    setError('');
                    setCurrentStep(2);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition"
                >
                  Continue to Pricing & AI →
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: PRICING & AI ESTIMATOR */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* AI Valuation Banner Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-blue-200/80 dark:border-blue-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      AI Market Price Valuation
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Let AI calculate optimal student pricing based on condition & original retail price.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAISuggestPrice}
                  disabled={aiPricing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50 transition active:scale-95"
                >
                  <DollarSign className={`w-4 h-4 ${aiPricing ? 'animate-spin' : ''}`} />
                  <span>{aiPricing ? 'Estimating...' : 'AI Suggest Price'}</span>
                </button>
              </div>

              {/* Price Fields Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1">
                    Original Retail Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="1800"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl clean-input text-xs font-semibold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">What it cost when new</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1">
                    Your Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-emerald-600 dark:text-emerald-400 font-black text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="950"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl clean-input text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{discountPercent}% OFF retail price!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* AI Valuation Reasoning Note */}
              {aiPriceReasoning && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  💡 <strong>AI Price Analysis:</strong> {aiPriceReasoning}
                </div>
              )}

              {/* Full Description TextArea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Full Item Description
                  </label>
                  <span className="text-[10px] text-slate-400">Detailed info helps sell faster</span>
                </div>

                <textarea
                  rows={4}
                  placeholder="Describe the condition, edition, usage duration, reason for selling, and campus pickup details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl clean-input text-xs leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  ← Back to Details
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!price || Number(price) <= 0) {
                      setError('Please enter a valid selling price.');
                      return;
                    }
                    setError('');
                    setCurrentStep(3);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition"
                >
                  Continue to Photo & Location →
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: PHOTO & LOCATION */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Photo Upload & Preview */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2">
                  Item Cover Image
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  
                  {/* Image Preview Box */}
                  <div className="sm:col-span-1 h-36 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden relative group">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="Listing Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = presetImages[0].url; }}
                      />
                    ) : (
                      <div className="text-center p-3">
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1" strokeWidth={1.5} />
                        <span className="text-[10px] text-slate-400 font-semibold block">Photo Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Input & Quick Presets */}
                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mb-1">Direct Image URL</span>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl clean-input text-xs"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Or Choose Sample Student Photo</span>
                      <div className="flex flex-wrap gap-2">
                        {presetImages.map((img) => (
                          <button
                            key={img.name}
                            type="button"
                            onClick={() => setImageUrl(img.url)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                              imageUrl === img.url
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {img.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Campus Pickup Spot */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5">
                  Campus Pickup Location <span className="text-rose-500">*</span>
                </label>

                <div className="relative mb-2">
                  <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <input
                    type="text"
                    placeholder="e.g. Science Library Courtyard / Hostel 4 Canteen"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl clean-input text-xs font-semibold"
                  />
                </div>

                {/* Quick Presets for Location */}
                <div className="flex flex-wrap gap-1.5">
                  {presetLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] font-semibold transition"
                    >
                      + {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification & Trust Footer Note */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-center space-x-2.5 text-xs text-blue-800 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Your listing will be published directly to your campus feed with 0% platform commission.</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  ← Back to Pricing
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-2 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Publishing Item...' : 'Publish Campus Listing'}</span>
                </button>
              </div>

            </div>
          )}

        </form>

        {/* MODAL FOOTER BAR */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#080d1a] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified Student Network</span>
          </div>

          <button
            type="button"
            onClick={closeCreateModal}
            className="hover:text-slate-900 dark:hover:text-white font-semibold transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateListingModal;
