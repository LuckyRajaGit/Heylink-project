import React, { useState } from 'react';
import {
  Link2,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Share2,
  Save,
  RotateCcw,
  Smartphone,
  Database,
  CloudCheck,
  LogOut,
  User,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { user, signOut, isDemoUser } = useAuth();
  const {
    profile,
    isDirty,
    isSaving,
    saveChanges,
    discardChanges,
    setShowMobilePreviewModal,
    setShowQrModal,
    setShowShareModal,
    setShowSupabaseModal,
    setShowAuthModal,
    setAuthModalMode,
    isSupabaseOnline,
    saveSuccessMessage,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const publicUrl = `${window.location.origin}/u/${profile.username || 'rajabagdi'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPublicPage = () => {
    window.open(`/u/${profile.username || 'rajabagdi'}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Link2 className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                HeyLink <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Studio</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-purple-700 bg-purple-50 rounded-md border border-purple-200/60">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Bio Link Platform for Creators & Developers
            </p>
          </div>
        </div>

        {/* Public URL Box */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200/70 text-xs text-slate-600 transition-colors">
          <span className="text-slate-400 font-mono text-[11px]">heylink.studio/u/</span>
          <span className="font-bold text-purple-700 font-mono text-[11px]">{profile.username || 'rajabagdi'}</span>
          <div className="h-3.5 w-px bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-slate-600 hover:text-purple-700 font-medium transition-colors"
            title="Copy Public Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenPublicPage}
            className="text-slate-400 hover:text-purple-700 p-0.5 transition-colors"
            title="Visit public profile"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Unsaved Changes Banner / Save & Discard Buttons */}
          {isDirty && (
            <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 p-1 rounded-xl animate-fade-in">
              <button
                type="button"
                onClick={discardChanges}
                disabled={isSaving}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors"
                title="Discard uncommitted edits"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Discard</span>
              </button>
              <button
                type="button"
                onClick={saveChanges}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm shadow-purple-500/25 transition-all transform active:scale-95 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Live'}</span>
              </button>
            </div>
          )}

          {/* Toast Notification message */}
          {saveSuccessMessage && !isDirty && (
            <span className="hidden xl:inline-block text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-fade-in">
              {saveSuccessMessage}
            </span>
          )}

          {/* QR Code Button */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-700 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 border border-slate-200 flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
            title="Generate QR Code"
          >
            <QrCode className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">QR Code</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-700 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 border border-slate-200 flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Mobile Live Preview Toggle (visible on screens where preview sidebar is hidden) */}
          <button
            type="button"
            onClick={() => setShowMobilePreviewModal(true)}
            className="xl:hidden p-2 sm:px-3 sm:py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Preview Mobile Screen"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Live Preview</span>
          </button>

          {/* Supabase Status Pill */}
          <button
            type="button"
            onClick={() => setShowSupabaseModal(true)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSupabaseOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Supabase Database Connection"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseOnline ? 'Supabase Live' : 'Supabase Config'}</span>
          </button>

          {/* User Account Menu */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      'R'
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{profile.full_name || 'Raja Bagdi'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {isDemoUser && (
                        <span className="mt-1 inline-block px-1.5 py-0.5 text-[9px] font-semibold bg-purple-100 text-purple-700 rounded">
                          Raja Bagdi Profile
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleOpenPublicPage();
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Public Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        setShowSupabaseModal(true);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 font-medium"
                    >
                      <Database className="w-3.5 h-3.5" />
                      Supabase Setup
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        signOut();
                      }}
                      className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setShowAuthModal(true);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
