import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from env or local stored custom config
const ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const STORAGE_KEY_URL = 'heylink_supabase_url';
const STORAGE_KEY_KEY = 'heylink_supabase_key';

export function getStoredSupabaseConfig() {
  const url = localStorage.getItem(STORAGE_KEY_URL) || ENV_SUPABASE_URL;
  const anonKey = localStorage.getItem(STORAGE_KEY_KEY) || ENV_SUPABASE_ANON_KEY;
  return {
    url: url.trim(),
    anonKey: anonKey.trim(),
    isCustom: Boolean(localStorage.getItem(STORAGE_KEY_URL)),
  };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  if (url && anonKey) {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
  // Reinitialize client
  _supabaseClient = null;
}

let _supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getStoredSupabaseConfig();
  return Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('supabase.co') &&
    anonKey.length > 20 &&
    !anonKey.includes('your-anon-public-key')
  );
}

export function getSupabase(): SupabaseClient | null {
  if (_supabaseClient) return _supabaseClient;

  const { url, anonKey } = getStoredSupabaseConfig();
  if (isSupabaseConfigured()) {
    try {
      _supabaseClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return _supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return null;
}
