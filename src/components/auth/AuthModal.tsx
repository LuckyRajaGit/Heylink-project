import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  AtSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { signIn, signUp, resetPassword, loginAsRaja } = useAuth();
  const { showAuthModal, setShowAuthModal, authModalMode, setAuthModalMode } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    if (authModalMode === 'login') {
      const res = await signIn(email, password);
      setIsSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setShowAuthModal(false);
      }
    } else if (authModalMode === 'signup') {
      const res = await signUp(email, password, fullName, username);
      setIsSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.successMessage || 'Account created successfully!');
        setTimeout(() => setShowAuthModal(false), 2000);
      }
    } else if (authModalMode === 'forgot') {
      const res = await resetPassword(email);
      setIsSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.successMessage || 'Password reset link sent to your email.');
      }
    }
  };

  const handleDemoLogin = () => {
    loginAsRaja();
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {authModalMode === 'login' && 'Sign in to HeyLink Studio'}
            {authModalMode === 'signup' && 'Create your Creator Account'}
            {authModalMode === 'forgot' && 'Reset your Password'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {authModalMode === 'login' && 'Manage your links, themes, and visitor analytics'}
            {authModalMode === 'signup' && 'Claim your unique link-in-bio URL in seconds'}
            {authModalMode === 'forgot' && "Enter your email and we'll send a recovery link"}
          </p>
        </div>

        {/* Tab Switcher */}
        {authModalMode !== 'forgot' && (
          <div className="p-1 bg-slate-100 rounded-xl flex items-center mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                authModalMode === 'login' ? 'bg-white text-purple-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                authModalMode === 'signup' ? 'bg-white text-purple-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Raja Bagdi"
                    required
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unique Username
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="rajabagdi"
                    required
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bagdiraja427@gmail.com"
                required
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-purple-700 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all transform active:scale-95 disabled:opacity-50 mt-4"
          >
            <span>
              {authModalMode === 'login' && (isSubmitting ? 'Signing in...' : 'Sign In')}
              {authModalMode === 'signup' && (isSubmitting ? 'Creating account...' : 'Create Account')}
              {authModalMode === 'forgot' && (isSubmitting ? 'Sending link...' : 'Send Recovery Email')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {authModalMode === 'forgot' && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className="text-xs text-purple-700 font-semibold hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Quick Demo Login Option */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 mb-2">Want to test the platform instantly?</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Access as Raja Bagdi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
