import React, { useRef, useState } from 'react';
import {
  Settings,
  Search,
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
  ExternalLink,
  Globe,
  Sparkles,
  Key,
  Server,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfileDraft,
    exportJsonBackup,
    importJsonBackup,
    resetToDefaults,
    setShowSupabaseModal,
    setShowShareModal,
    isSupabaseOnline,
  } = useApp();

  const { user, signOut, loginAsRaja, isDemoUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportStatus(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importJsonBackup(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(null), 3500);
      } else {
        setImportStatus('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const publicUrl = `${window.location.origin}/u/${profile.username || 'rajabagdi'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings & SEO
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Optimize search engine metadata, manage Supabase database connections, and back up your profile.
        </p>
      </div>

      {/* SEO & Social Sharing Metadata */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Search className="w-4 h-4 text-purple-600" />
          Search Engine Optimization (SEO)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Custom Meta Title
            </label>
            <input
              type="text"
              value={profile.seo_title || ''}
              onChange={(e) => updateProfileDraft({ seo_title: e.target.value })}
              placeholder={`${profile.full_name || 'Raja Bagdi'} | Official Links & Portfolio`}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Recommended length: 50-60 characters</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Custom Meta Description
            </label>
            <textarea
              rows={2}
              value={profile.seo_description || ''}
              onChange={(e) => updateProfileDraft({ seo_description: e.target.value })}
              placeholder="Connect with Raja Bagdi. Explore recent software projects, YouTube channel, portfolio, and social media."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">Recommended length: 120-160 characters</p>
          </div>
        </div>

        {/* Live Google Search Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Google Search Snippet Preview
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[11px]">{publicUrl}</span>
          </div>
          <h4 className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer">
            {profile.seo_title || `${profile.full_name || 'Raja Bagdi'} | Official Links & Portfolio`}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {profile.seo_description ||
              profile.bio ||
              'Connect with Raja Bagdi. Explore recent software projects, YouTube channel, portfolio, and social media.'}
          </p>
        </div>
      </div>

      {/* Supabase Database Connection */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            Supabase PostgreSQL Connection
          </h3>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isSupabaseOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {isSupabaseOnline ? 'Connected to Supabase' : 'Offline / Local Engine'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          HeyLink Studio supports both instant offline sandbox mode and full cloud persistence with Supabase PostgreSQL, Authentication, and Row Level Security.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowSupabaseModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <Key className="w-3.5 h-3.5" />
            Configure Supabase Credentials
          </button>
        </div>
      </div>

      {/* Vercel Production Deployment & Edge Optimizations */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-600" />
            Vercel Deployment & Edge Optimizations
          </h3>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Vercel Ready
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Pre-configured with <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-purple-700 font-semibold">vercel.json</code> rewrites, 1-year immutable Edge CDN caching (<code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px]">max-age=31536000</code>), modular vendor chunk splitting, and security headers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-600" />
              Required Vercel Env Vars
            </p>
            <div className="space-y-1 text-[11px] font-mono text-slate-600">
              <p>• VITE_SUPABASE_URL</p>
              <p>• VITE_SUPABASE_ANON_KEY</p>
              <p>• VITE_APP_URL</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              Build & Cache Config
            </p>
            <div className="space-y-1 text-[11px] font-mono text-slate-600">
              <p>• Framework: Vite (auto-detected)</p>
              <p>• Command: npm run build</p>
              <p>• Edge CDN: Immutable Cache Active</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex-1 min-w-[220px] p-2 bg-slate-900 text-white rounded-xl font-mono text-xs flex items-center justify-between">
            <span className="truncate">vercel --prod</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('vercel --prod');
              }}
              className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-purple-300 ml-2 shrink-0"
              title="Copy deploy command"
            >
              Copy CLI
            </button>
          </div>
        </div>
      </div>

      {/* Backup, Export & Restore */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Download className="w-4 h-4 text-purple-600" />
          Data Backup & Recovery
        </h3>

        {importStatus && (
          <div
            className={`p-3 text-xs rounded-xl border ${
              importStatus.includes('success')
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {importStatus}
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed">
          Export your entire profile configuration, themes, custom links, and social accounts as a standalone JSON backup file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Export JSON */}
          <button
            type="button"
            onClick={exportJsonBackup}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Download JSON Backup
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-2 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            Restore from JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Reset Demo */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset back to Raja Bagdi demo template? Any unsaved edits will be replaced.')) {
                resetToDefaults();
              }
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold inline-flex items-center gap-2 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Sample Template
          </button>
        </div>
      </div>

      {/* Account & Profile Ownership */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          Active Account
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
          <div>
            <p className="text-xs font-bold text-slate-900">{profile.full_name || 'Raja Bagdi'}</p>
            <p className="text-xs text-slate-500 font-mono">{user?.email || 'bagdiraja427@gmail.com'}</p>
            <p className="text-[11px] text-purple-700 mt-1 font-semibold">
              Authenticated Owner with Row Level Security permissions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loginAsRaja}
              className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              Reload Raja Bagdi
            </button>
            <button
              type="button"
              onClick={signOut}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
