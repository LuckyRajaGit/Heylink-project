import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isDemoUser: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password?: string, fullName?: string, username?: string) => Promise<{ error?: string; successMessage?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; successMessage?: string }>;
  loginAsRaja: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'heylink_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed reading auth cache:', e);
    }
    // Default logged in as Raja Bagdi for immediate usability
    const defaultUser: User = {
      id: 'usr_raja_bagdi_demo',
      email: 'bagdiraja427@gmail.com',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const supabase = getSupabase();
      if (supabase && isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              created_at: session.user.created_at,
            });
            setIsDemoUser(false);
          }
        } catch (err) {
          console.warn('Supabase session error:', err);
        }

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            const newUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              created_at: session.user.created_at,
            };
            setUser(newUser);
            setIsDemoUser(false);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
          } else {
            // Keep local fallback or null
          }
        });

        if (mounted) setIsLoading(false);

        return () => {
          listener.subscription.unsubscribe();
        };
      } else {
        if (mounted) {
          setIsDemoUser(true);
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    const supabase = getSupabase();

    if (supabase && isSupabaseConfigured() && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            created_at: data.user.created_at,
          };
          setUser(newUser);
          setIsDemoUser(false);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
          setIsLoading(false);
          return {};
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const message = err instanceof Error ? err.message : 'Login failed';
        return { error: message };
      }
    }

    // Local / Offline login
    const localUser: User = {
      id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      created_at: new Date().toISOString(),
    };
    setUser(localUser);
    setIsDemoUser(true);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setIsLoading(false);
    return {};
  };

  const signUp = async (
    email: string,
    password?: string,
    fullName?: string,
    username?: string
  ): Promise<{ error?: string; successMessage?: string }> => {
    setIsLoading(true);
    const supabase = getSupabase();

    if (supabase && isSupabaseConfigured() && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username: username,
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            created_at: data.user.created_at,
          };
          setUser(newUser);
          setIsDemoUser(false);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
          setIsLoading(false);
          return { successMessage: 'Account created successfully! Check your email if verification is required.' };
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const message = err instanceof Error ? err.message : 'Sign up failed';
        return { error: message };
      }
    }

    // Local simulated registration
    const localUser: User = {
      id: `usr_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    };
    setUser(localUser);
    setIsDemoUser(true);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setIsLoading(false);
    return { successMessage: 'Demo account registered successfully!' };
  };

  const resetPassword = async (email: string): Promise<{ error?: string; successMessage?: string }> => {
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { error: error.message };
        return { successMessage: 'Password reset link sent to your email.' };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to send reset link';
        return { error: message };
      }
    }

    return {
      successMessage: `Simulation: Password reset email has been dispatched to ${email}.`,
    };
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const loginAsRaja = () => {
    const defaultUser: User = {
      id: 'usr_raja_bagdi_demo',
      email: 'bagdiraja427@gmail.com',
      created_at: new Date().toISOString(),
    };
    setUser(defaultUser);
    setIsDemoUser(true);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemoUser,
        signIn,
        signUp,
        signOut,
        resetPassword,
        loginAsRaja,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
