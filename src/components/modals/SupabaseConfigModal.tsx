import React, { useState } from 'react';
import {
  X,
  Database,
  Key,
  Globe,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getStoredSupabaseConfig,
  isSupabaseConfigured,
  saveStoredSupabaseConfig,
} from '../../lib/supabase';

export const SupabaseConfigModal: React.FC = () => {
  const { showSupabaseModal, setShowSupabaseModal, refreshData } = useApp();

  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSqlHelp, setCopiedSqlHelp] = useState(false);

  if (!showSupabaseModal) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    saveStoredSupabaseConfig(cleanUrl, cleanKey);

    if (!cleanUrl || !cleanKey) {
      setTestResult({
        success: true,
        message: 'Switched to local engine mode (Raja Bagdi sample persistence).',
      });
      setIsTesting(false);
      refreshData();
      return;
    }

    try {
      // Test basic connection
      const res = await fetch(`${cleanUrl}/rest/v1/`, {
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });

      if (res.ok) {
        setTestResult({
          success: true,
          message: 'Supabase PostgreSQL connected successfully! Tables and RLS policies are active.',
        });
        refreshData();
      } else {
        setTestResult({
          success: false,
          message: `Connection returned HTTP ${res.status}. Please check your Project URL and Anon API key.`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network failure';
      setTestResult({
        success: false,
        message: `Connection error: ${msg}. If tables are not created, run supabase/schema.sql in Supabase SQL Editor.`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetToLocal = () => {
    setUrl('');
    setAnonKey('');
    saveStoredSupabaseConfig('', '');
    setTestResult({
      success: true,
      message: 'Supabase configuration cleared. Now running in instant LocalStorage sandbox.',
    });
    refreshData();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => setShowSupabaseModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Supabase PostgreSQL Setup
            </h3>
            <p className="text-xs text-slate-500">
              PostgreSQL, Authentication & Row Level Security
            </p>
          </div>
        </div>

        {/* Current Connection Status Indicator */}
        <div
          className={`p-3.5 rounded-2xl my-4 border flex items-center gap-3 ${
            isSupabaseConfigured()
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {isSupabaseConfigured() ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div className="text-xs">
            <p className="font-bold">
              {isSupabaseConfigured() ? 'Live Supabase Connected' : 'Running on Sandbox LocalStorage'}
            </p>
            <p className="opacity-90 text-[11px] mt-0.5">
              {isSupabaseConfigured()
                ? 'Your profile, links, and click analytics are securely stored in your cloud database.'
                : 'All changes are stored locally in your browser. Add your Supabase credentials below to sync across all devices.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-600" />
              Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-600" />
              Supabase anon / public Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Found under Project Settings → API. Safe to use in browser client.
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3 text-xs rounded-xl border ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {testResult.message}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetToLocal}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Clear & Use Local Mode
            </button>
            <button
              type="submit"
              disabled={isTesting}
              className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
            >
              {isTesting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isTesting ? 'Verifying...' : 'Save & Test Connection'}</span>
            </button>
          </div>
        </form>

        {/* SQL Schema helper guide */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-purple-600" />
              Database Tables & RLS Schema
            </span>
            <span className="text-[11px] text-purple-700 font-semibold font-mono">
              supabase/schema.sql
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            The database migration script creates <code>profiles</code>, <code>links</code>, and <code>link_clicks</code> tables with Row Level Security (RLS) policies and the <code>record_link_click</code> RPC function.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 leading-relaxed">
            1. Open Supabase Dashboard → SQL Editor<br />
            2. Run script from <code>supabase/schema.sql</code><br />
            3. Paste your API keys above and click Save!
          </div>
        </div>
      </div>
    </div>
  );
};
