import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Zap, 
  MessageSquare, 
  CheckCircle2, 
  Users, 
  Store, 
  ArrowRight, 
  ChevronDown, 
  BadgeIndianRupee, 
  RefreshCw, 
  HeartHandshake, 
  Lock, 
  Search,
  Star,
  Building2,
  GraduationCap,
  Laptop,
  Armchair,
  Coffee,
  FlaskConical,
  Bike
} from 'lucide-react';
import { useListingStore } from '../../stores/useListingStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const LandingPage = () => {
  const { setActiveView, openCreateModal, openAISearchModal, setCategory } = useListingStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [openFaq, setOpenFaq] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Student Identity Verification',
      desc: 'Register using your college domain email (.ac.in / .edu) or upload student ID. Only verified college students can access campus listings.',
      icon: Lock,
      color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    {
      step: '02',
      title: 'Snap, Post or AI Search',
      desc: 'List your textbook, kettle, or laptop in 30 seconds with automatic AI price recommendations, or use smart natural language search to find items.',
      icon: Sparkles,
      color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
    },
    {
      step: '03',
      title: 'Real-Time Campus Chat',
      desc: 'Chat directly inside the platform with fellow buyers/sellers. Discuss price, check extra photos, and coordinate a convenient campus rendezvous spot.',
      icon: MessageSquare,
      color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    },
    {
      step: '04',
      title: 'Campus Handshake & Deal',
      desc: 'Meet safely at your campus library, hostel gate, or canteen. Inspect the item in person, pay via UPI or cash, and save money!',
      icon: HeartHandshake,
      color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI Price Valuator',
      desc: 'Our AI analyzes item condition, original cost, and campus demand to suggest fair market prices so sellers close deals faster.'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Student Network',
      desc: 'Zero anonymous scammers. Every user is authenticated against institutional rosters to ensure trusted student transactions.'
    },
    {
      icon: BadgeIndianRupee,
      title: '0% Platform Commission',
      desc: 'Keep 100% of your earnings. CampusExchange charges zero listing fees, zero middleman cuts, and zero hidden platform costs.'
    },
    {
      icon: MessageSquare,
      title: 'Instant In-App Messenger',
      desc: 'Built-in real-time chat with read receipts, deal negotiation buttons, and quick meeting point suggestions.'
    },
    {
      icon: RefreshCw,
      title: 'Sustainable Campus Reuse',
      desc: 'Every traded textbook, chair, or lab coat prevents unnecessary waste and keeps usable items circulating among peers.'
    },
    {
      icon: Search,
      title: 'AI Natural Language Search',
      desc: 'Type prompts like "engineering graphics tools under ₹500" or "hostel kettle sem 1" to get tailored campus recommendations.'
    }
  ];

  const faqs = [
    {
      question: "Is CampusExchange completely free for college students?",
      answer: "Yes, 100%! CampusExchange is created by students for students. Listing products, searching, chatting, and completing deals carry zero platform fees or transaction commissions."
    },
    {
      question: "How does campus verification work?",
      answer: "When signing up, students provide their official college email address (e.g., student@iitd.ac.in) or upload a picture of their valid College ID card. Only authenticated accounts receive the 'Verified Student' badge."
    },
    {
      question: "How do payments and item collection take place?",
      answer: "Transactions happen in person on campus! Buyers and sellers arrange a meetup at a trusted campus location (e.g., Central Library, Canteen, or Hostel Gate). The buyer inspects the item and pays directly to the seller via UPI or cash."
    },
    {
      question: "What items can I sell or find on CampusExchange?",
      answer: "You can list almost anything student-related: engineering & medical textbooks, exam notes, laptops, scientific calculators, mini fridges, hostel mattresses, cycles, lab coats, draft kits, and hostel room decor."
    },
    {
      question: "Can I trade with students from other nearby colleges?",
      answer: "Yes! While CampusExchange prioritizes listings from your primary campus, you can also browse and filter listings from neighboring colleges in your city."
    }
  ];

  const testimonials = [
    {
      quote: "Bought all my 3rd sem CSE textbooks for less than ₹800 total! Met the seller outside the main library in 10 minutes.",
      name: "Aarav Sharma",
      campus: "IIT Delhi • Computer Science",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "Sold my hostel cooler and study table within 2 hours of posting before graduating. 0% commission meant I kept all my money!",
      name: "Priya Nair",
      campus: "DU North Campus • Economics",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "The AI pricing assistant suggested ₹1,200 for my lab equipment kit and it got bought the same evening. Super smooth experience!",
      name: "Rohan Patel",
      campus: "BITS Pilani • Mechanical",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. HERO LANDING SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-[#0b1120] dark:via-[#0e172a] dark:to-[#080d1a] border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Tag Header Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>CampusExchange Platform • India's #1 Student Marketplace</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#001E3C] dark:text-white font-brand leading-[1.1]">
            The Smartest Way to <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-400">Buy, Sell & Trade</span> inside College.
          </h1>

          {/* Detailed Paragraph */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            CampusExchange connects verified university students to exchange textbooks, electronics, hostel room essentials, and course gear directly on campus. No middleman, zero platform fees, 100% safe.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveView('products')}
              className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center space-x-2"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) openAuthModal('signup');
                else openCreateModal();
              }}
              className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm sm:text-base shadow-xs transition-all duration-200 active:scale-95 flex items-center space-x-2"
            >
              <Store className="w-5 h-5 text-blue-400" />
              <span>List Your Item (Free)</span>
            </button>

            <button
              onClick={openAISearchModal}
              className="px-6 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>AI Smart Search</span>
            </button>
          </div>

          {/* Live Trust Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-sm max-w-4xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-brand">50+</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Verified Colleges</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-brand">15,000+</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Student Deals</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-brand">₹0</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Platform Commission</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-brand">100%</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Student Verified</div>
            </div>
          </div>

        </div>
      </section>


      {/* 2. ABOUT US SECTION: STORY & PURPOSE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>About CampusExchange</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-[#001E3C] dark:text-white font-brand leading-tight">
              Eliminating Campus Waste & Helping Students Save Money.
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              Every academic semester in Indian universities, thousands of graduating senior students discard valuable textbooks, study desks, scientific calculators, mini fans, and electric kettles. Meanwhile, incoming juniors spend thousands buying brand new items at inflated retail prices.
            </p>

            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <strong>CampusExchange</strong> solves this exact problem. We created a hyper-local, student-verified peer-to-peer ecosystem where buying, selling, and reusing items inside campus boundaries is effortless, safe, and transparent.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hyper-Local Campus Safety</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">All meetups happen inside recognized campus areas—hostel canteens, libraries, or main gates.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instant Student-to-Student Deals</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">No courier waiting times or shipping fees. Handshake and payment take place on the spot.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Powered by Smart AI Assistance</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Automated price valuation and intelligent search algorithms make listing and discovery instant.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Decorative Feature Display Card */}
          <div className="relative">
            <div className="rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-[#001E3C] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    Verified Campus Badge
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black font-brand">Campus-Wide Student Trust</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    "CampusExchange has completely transformed how our hostel trades books and electronics. It feels as safe as selling to your roommate!"
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-700/60 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 uppercase font-semibold">Average Savings</div>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5">65% Off Retail</div>
                  </div>
                  <div>
                    <div className="text-slate-400 uppercase font-semibold">Deal Closing Time</div>
                    <div className="text-xl font-bold text-blue-400 mt-0.5">&lt; 4 Hours</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 3. WORKING OF THE SITE (HOW IT WORKS STEP-BY-STEP ACCORDION) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#080d1a] border-y border-slate-200/90 dark:border-slate-800/90">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>Simple 4-Step Process</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#001E3C] dark:text-white font-brand">
              How CampusExchange Works
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Hover over any step to explore how student transactions take less than 2 minutes on campus.
            </p>
          </div>

          {/* Interactive Expanding Accordion Flex Cards Container */}
          <div className="flex flex-col lg:flex-row gap-5 w-full min-h-[380px]">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isExpanded = activeStep === idx;

              return (
                <div 
                  key={s.step} 
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`p-6 sm:p-7 rounded-3xl border transition-all duration-500 ease-in-out cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isExpanded 
                      ? 'lg:flex-[3] bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-xl ring-2 ring-blue-500/20' 
                      : 'lg:flex-[1.2] bg-white/70 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800/90 hover:bg-white dark:hover:bg-slate-900 shadow-2xs'
                  }`}
                >
                  {/* Subtle Background Radial Glow for Expanded Card */}
                  {isExpanded && (
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-blue-600/10 dark:bg-blue-500/15 blur-3xl pointer-events-none"></div>
                  )}

                  {/* Header: Icon & Step Badge */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${s.color} ${isExpanded ? 'scale-110 shadow-xs' : ''}`}>
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    
                    <span className={`text-3xl sm:text-4xl font-black font-brand transition-colors duration-300 ${
                      isExpanded ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-700'
                    }`}>
                      {s.step}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="my-6 relative z-10 flex-1 flex flex-col justify-center">
                    <h3 className={`text-lg sm:text-xl font-bold font-brand transition-colors duration-300 ${
                      isExpanded ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {s.title}
                    </h3>
                    
                    <p className={`text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-all duration-300 ${
                      isExpanded 
                        ? 'opacity-100 max-h-40 mt-3' 
                        : 'lg:opacity-80 lg:line-clamp-2 mt-2'
                    }`}>
                      {s.desc}
                    </p>
                  </div>

                  {/* Footer Detail Indicator */}
                  <div className={`pt-4 border-t transition-colors duration-300 flex items-center justify-between text-xs font-bold relative z-10 ${
                    isExpanded 
                      ? 'border-slate-200/90 dark:border-slate-800 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-slate-400 dark:text-slate-500'
                  }`}>
                    <span>Step {s.step} Details</span>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'translate-x-1' : ''}`} />
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 4. KEY FEATURES SHOWCASE GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Designed for Campus Life</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#001E3C] dark:text-white font-brand">
            Everything You Need to Buy & Sell
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Modern, student-centric tools crafted to make campus commerce effortless and safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:border-blue-500/50 hover:shadow-md transition duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-brand">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>


      {/* 5. POPULAR CATEGORIES DISCOVERY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#080d1a] border-t border-slate-200/90 dark:border-slate-800/90">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-brand mb-8">
            Browse Popular Campus Categories
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Books & Notes', icon: BookOpen, count: '4,200+ items' },
              { name: 'Electronics', icon: Laptop, count: '3,100+ items' },
              { name: 'Furniture', icon: Armchair, count: '1,800+ items' },
              { name: 'Hostel Essentials', icon: Coffee, count: '2,900+ items' },
              { name: 'Lab & Course Gear', icon: FlaskConical, count: '1,400+ items' },
              { name: 'Cycles & Vehicles', icon: Bike, count: '950+ items' }
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setCategory(cat.name);
                    setActiveView('products');
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center hover:border-blue-600 dark:hover:border-blue-400 transition group shadow-2xs"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{cat.name}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{cat.count}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>


      {/* 6. STUDENT TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Loved by Students Across India</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#001E3C] dark:text-white font-brand">
            What Campus Traders Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{t.campus}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#080d1a] border-t border-slate-200/90 dark:border-slate-800/90">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-[#001E3C] dark:text-white font-brand">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
              Everything you need to know about trading safely on CampusExchange.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-brand pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 8. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#001E3C] via-blue-900 to-indigo-900 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black font-brand leading-tight">
              Ready to Clear Your Hostel Room or Save Money on Course Gear?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Join thousands of verified students today. Create your free student account in 30 seconds and start trading on your campus!
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  if (!isAuthenticated) openAuthModal('signup');
                  else openCreateModal();
                }}
                className="px-8 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg transition active:scale-95"
              >
                Get Started Now
              </button>

              <button
                onClick={() => setActiveView('products')}
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base transition active:scale-95"
              >
                Browse All Items
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
