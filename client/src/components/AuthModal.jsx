import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, login, register, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('Stanford University');
  const [hostel, setHostel] = useState('Wilbur Hall');

  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [validationMsg, setValidationMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleQuickDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    await login(demoEmail, 'password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationMsg('');

    if (authModalMode === 'login') {
      const res = await login(email, password);
      if (!res.success && res.message) setValidationMsg(res.message);
    } else {
      const isCollegeDomain = email.includes('.edu') || email.includes('.ac.') || email.includes('college') || email.includes('student');
      if (!isCollegeDomain) {
        setValidationMsg('Please enter a valid college email ending in .edu or .ac.in (e.g. alex@stanford.edu)');
        return;
      }

      if (!otpStep) {
        setOtpStep(true);
        return;
      }

      if (otpCode !== '4829' && otpCode !== '1234') {
        setValidationMsg('Invalid OTP. Use demo verification code: 4829');
        return;
      }

      const res = await register({ name, email, password, college, hostel });
      if (!res.success && res.message) setValidationMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {authModalMode === 'login' ? 'College Sign In' : 'Student Verification'}
            </h3>
          </div>
          <button onClick={closeAuthModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Login Preset Bar */}
        <div className="mb-4 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs">
          <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-300 block mb-1">Fast One-Click Demo Login:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('arivera@stanford.edu')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition shadow-xs"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@stanford.edu')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-xs"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {(error || validationMsg) && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error || validationMsg}</span>
            </div>
          )}

          {authModalMode === 'register' && !otpStep && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl clean-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">University</label>
                  <input
                    type="text"
                    placeholder="Stanford University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl clean-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Hostel / Dept</label>
                  <input
                    type="text"
                    placeholder="Wilbur Hall"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl clean-input text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {!otpStep && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">College Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@stanford.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl clean-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl clean-input text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* OTP Verification Step */}
          {otpStep && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Verification Code Sent</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Sent to <strong>{email}</strong></p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter Code (Use demo: 4829)"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl clean-input text-center font-mono font-bold text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? 'Processing...' : authModalMode === 'login' ? 'Sign In' : otpStep ? 'Verify & Create Account' : 'Send College OTP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
          {authModalMode === 'login' ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New student?{' '}
              <button onClick={() => { openAuthModal('register'); setOtpStep(false); }} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Create verified account
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already verified?{' '}
              <button onClick={() => { openAuthModal('login'); setOtpStep(false); }} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
