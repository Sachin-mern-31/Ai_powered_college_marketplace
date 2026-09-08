import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle, Trash2, ArrowLeft, Users, AlertTriangle } from 'lucide-react';
import { useListingStore } from '../../stores/useListingStore';
import api from '../../api/axios';

export const AdminPanel = () => {
  const { setActiveView } = useListingStore();
  const [stats, setStats] = useState(null);
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, flaggedRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/flagged-listings'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setFlaggedItems(flaggedRes.data || []);
      setUsersList(usersRes.data || []);
    } catch (e) {
      console.error('Admin data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/listings/${id}/status`, { status: newStatus });
      fetchAdminData();
    } catch (e) {
      alert('Status update failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveView('home')}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white font-brand">Admin & Moderation</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Review flagged items & campus user accounts</p>
        </div>
      </div>

      {/* Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Items</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-brand">{stats.totalListings}</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block">Flagged Items</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-brand">{stats.flaggedCount}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus Users</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-brand">{stats.userCount}</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">AI Filter Rate</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-brand">{stats.aiModerationRate}</span>
          </div>
        </div>
      )}

      {/* Flagged Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-brand">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Flagged Content Queue ({flaggedItems.length})</span>
        </h2>

        {flaggedItems.length > 0 ? (
          <div className="space-y-3">
            {flaggedItems.map((item) => (
              <div key={item._id} className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-amber-200 dark:border-amber-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                      Score: {item.moderationScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'active')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'removed')}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            No flagged content currently in queue.
          </div>
        )}
      </div>

      {/* Users List Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-brand">
          <Users className="w-4 h-4 text-indigo-500" />
          <span>Registered Campus Accounts</span>
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">College</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {usersList.map((u) => (
                <tr key={u.id || u._id}>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{u.name} ({u.email})</td>
                  <td className="p-3 text-blue-600 dark:text-blue-400">{u.college}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">Verified</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
