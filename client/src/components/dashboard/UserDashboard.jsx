import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useListingStore } from '../../stores/useListingStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { ListingCard } from '../listings/ListingCard';
import { 
  Heart, 
  Package, 
  ShieldCheck, 
  Trash2, 
  ArrowLeft, 
  User as UserIcon,
  Mail,
  Phone,
  Building,
  Home,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Camera
} from 'lucide-react';
import api from '../../api/axios';

export const UserDashboard = () => {
  const { user, updateProfile } = useAuthStore();
  const { listings, setActiveView, fetchListings } = useListingStore();
  const { wishlistIds } = useWishlistStore();
  
  const [tab, setTab] = useState('profile'); // 'profile' | 'my_listings' | 'wishlist'

  // Profile Form States
  const [name, setName] = useState(user?.name || 'Sachin');
  const [email, setEmail] = useState(user?.email || 'sahusachin37382@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '7814881198');
  const [college, setCollege] = useState(user?.college || 'IIT Delhi');
  const [hostel, setHostel] = useState(user?.hostel || 'Karakoram Hostel, Rm 312');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
  const [bio, setBio] = useState(user?.bio || 'CSE Student • Campus Trader & Electronics Enthusiast');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || 'Sachin');
      setEmail(user.email || 'sahusachin37382@gmail.com');
      setPhone(user.phone || '7814881198');
      setCollege(user.college || 'IIT Delhi');
      setHostel(user.hostel || 'Karakoram Hostel, Rm 312');
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
      if (user.bio) setBio(user.bio);
    }
  }, [user]);

  const myListingItems = listings.filter((l) => l.sellerId === (user?.id || user?._id));
  const wishlistItems = listings.filter((l) => wishlistIds.includes(l._id));

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      fetchListings();
    } catch (e) {
      alert('Delete failed.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const res = await updateProfile({
        name,
        email,
        phone,
        college,
        hostel,
        avatarUrl,
        bio
      });

      if (res.success) {
        setSaveSuccess('Profile updated successfully!');
        setTimeout(() => setSaveSuccess(''), 4000);
      } else {
        setSaveError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setSaveError('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoFillSachin = () => {
    setName('Sachin');
    setEmail('sahusachin37382@gmail.com');
    setPhone('7814881198');
    setCollege('IIT Delhi');
    setHostel('Karakoram Hostel, Rm 312');
    setBio('CSE Student • Campus Trader & Electronics Enthusiast');
    setSaveSuccess('Auto-filled Sachin profile details! Click "Save Changes" to save.');
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('home')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition shadow-2xs"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <img
              src={avatarUrl || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-600 dark:ring-blue-500 shadow-sm"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-brand">{name || user?.name}</h1>
              <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {email || user?.email} • {phone ? `+91 ${phone}` : 'No phone set'}
            </p>
          </div>
        </div>

        {/* Tab Switcher Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 self-start md:self-auto shadow-2xs">
          <button
            onClick={() => setTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              tab === 'profile' 
                ? 'bg-blue-600 text-white shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setTab('my_listings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              tab === 'my_listings' 
                ? 'bg-blue-600 text-white shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Items ({myListingItems.length})</span>
          </button>

          <button
            onClick={() => setTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              tab === 'wishlist' 
                ? 'bg-blue-600 text-white shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Wishlist ({wishlistItems.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EDIT PROFILE */}
      {tab === 'profile' && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
                Personal & Campus Contact Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your name, email address, phone number, and campus location.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAutoFillSachin}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition active:scale-95 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Fill Sachin's Info</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{saveSuccess}</span>
            </div>
          )}

          {saveError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="font-semibold">{saveError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sachin"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl clean-input text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sahusachin37382@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl clean-input text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="7814881198"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl clean-input text-xs font-semibold"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Used for buyer/seller campus SMS & chat alerts</span>
              </div>

              {/* College / Institute */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5">
                  University / College Campus
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Delhi"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl clean-input text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Hostel / Residence */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5">
                  Hostel / Residence Block
                </label>
                <div className="relative">
                  <Home className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    placeholder="e.g. Karakoram Hostel, Rm 312"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl clean-input text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5">
                  Profile Photo URL
                </label>
                <div className="relative">
                  <Camera className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl clean-input text-xs"
                  />
                </div>
              </div>

            </div>

            {/* Department & Bio */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5">
                Bio / Department / About You
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your branch, graduation year, or what items you trade on campus..."
                className="w-full px-4 py-2.5 rounded-xl clean-input text-xs leading-relaxed"
              ></textarea>
            </div>

            {/* Form Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: MY LISTINGS */}
      {tab === 'my_listings' && (
        <div>
          {myListingItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {myListingItems.map((item) => (
                <div key={item._id} className="relative group">
                  <ListingCard listing={item} />
                  <button
                    onClick={() => handleDeleteListing(item._id)}
                    className="absolute top-2.5 right-10 z-20 p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 transition"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800">
              <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No items posted yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click 'Sell' in the navigation bar to list an item!</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {tab === 'wishlist' && (
        <div>
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {wishlistItems.map((item) => (
                <ListingCard key={item._id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800">
              <Heart className="w-10 h-10 text-rose-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click the heart icon on any product to save it here.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
