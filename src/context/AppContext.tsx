import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_LINKS, INITIAL_PROFILE } from '../lib/presets';
import { DataService } from '../lib/storage';
import { isSupabaseConfigured } from '../lib/supabase';
import { CustomTheme, LinkItem, Profile } from '../types';
import { useAuth } from './AuthContext';

type TabType = 'links' | 'profile' | 'appearance' | 'analytics' | 'settings';

interface AppContextType {
  profile: Profile;
  links: LinkItem[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDirty: boolean;
  isSaving: boolean;
  saveSuccessMessage: string | null;
  errorMessage: string | null;
  isSupabaseOnline: boolean;

  // Modals & View States
  showMobilePreviewModal: boolean;
  setShowMobilePreviewModal: (show: boolean) => void;
  showQrModal: boolean;
  setShowQrModal: (show: boolean) => void;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  showSupabaseModal: boolean;
  setShowSupabaseModal: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;

  // Mutations
  updateProfileDraft: (partial: Partial<Profile>) => void;
  updateThemeDraft: (theme: CustomTheme, themeId?: string) => void;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;

  // Link Operations
  addLink: (link: Omit<LinkItem, 'id' | 'clicks_count'>) => Promise<void>;
  updateLink: (link: LinkItem) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  toggleLink: (id: string) => Promise<void>;
  moveLink: (index: number, direction: 'up' | 'down') => Promise<void>;
  reorderLinks: (newLinks: LinkItem[]) => Promise<void>;

  // Backup & Reset
  exportJsonBackup: () => void;
  importJsonBackup: (jsonString: string) => boolean;
  resetToDefaults: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [savedProfile, setSavedProfile] = useState<Profile>(INITIAL_PROFILE);
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);

  const [savedLinks, setSavedLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);

  const [activeTab, setActiveTab] = useState<TabType>('links');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const [isSupabaseOnline, setIsSupabaseOnline] = useState<boolean>(isSupabaseConfigured());

  // Check dirty state
  const isProfileDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);
  const isLinksDirty = JSON.stringify(links) !== JSON.stringify(savedLinks);
  const isDirty = isProfileDirty || isLinksDirty;

  // Load user data on mount or when user changes
  const loadData = async () => {
    try {
      setIsSupabaseOnline(isSupabaseConfigured());
      const loadedProfile = await DataService.getProfile(user?.id);
      const loadedLinks = await DataService.getLinks(user?.id);

      setSavedProfile(loadedProfile);
      setProfile(loadedProfile);
      setSavedLinks(loadedLinks);
      setLinks(loadedLinks);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const updateProfileDraft = (partial: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const updateThemeDraft = (theme: CustomTheme, themeId?: string) => {
    setProfile((prev) => ({
      ...prev,
      custom_theme: theme,
      theme_id: themeId || prev.theme_id,
    }));
  };

  const saveChanges = async (): Promise<boolean> => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const updatedProfile = await DataService.updateProfile(profile);
      await DataService.reorderLinks(links);

      setSavedProfile(updatedProfile);
      setSavedLinks([...links]);
      setIsSaving(false);
      setSaveSuccessMessage('All changes saved and synced live!');

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#8b5cf6', '#a855f7', '#6366f1', '#ec4899'],
        });
      } catch (e) {
        // Confetti non-fatal
      }

      setTimeout(() => setSaveSuccessMessage(null), 3500);
      return true;
    } catch (err: unknown) {
      setIsSaving(false);
      const msg = err instanceof Error ? err.message : 'Failed to save changes';
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
      return false;
    }
  };

  const discardChanges = () => {
    setProfile(savedProfile);
    setLinks(savedLinks);
    setSaveSuccessMessage('Unsaved modifications discarded.');
    setTimeout(() => setSaveSuccessMessage(null), 2500);
  };

  const addLink = async (linkData: Omit<LinkItem, 'id' | 'clicks_count'>) => {
    const created = await DataService.createLink(linkData);
    const updated = [...links, created];
    setLinks(updated);
    setSavedLinks(updated);
  };

  const updateLink = async (updatedLink: LinkItem) => {
    const next = links.map((l) => (l.id === updatedLink.id ? updatedLink : l));
    setLinks(next);
    await DataService.updateLink(updatedLink);
    setSavedLinks(next);
  };

  const deleteLink = async (id: string) => {
    const next = links.filter((l) => l.id !== id);
    setLinks(next);
    await DataService.deleteLink(id);
    setSavedLinks(next);
  };

  const toggleLink = async (id: string) => {
    const target = links.find((l) => l.id === id);
    if (!target) return;
    const updated = { ...target, is_enabled: !target.is_enabled };
    await updateLink(updated);
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);

    const reordered = newLinks.map((item, idx) => ({ ...item, position: idx }));
    setLinks(reordered);
    await DataService.reorderLinks(reordered);
    setSavedLinks(reordered);
  };

  const reorderLinks = async (newLinks: LinkItem[]) => {
    const reordered = newLinks.map((item, idx) => ({ ...item, position: idx }));
    setLinks(reordered);
    await DataService.reorderLinks(reordered);
    setSavedLinks(reordered);
  };

  const exportJsonBackup = () => {
    const payload = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      profile,
      links,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heylink-backup-${profile.username}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importJsonBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.profile || !Array.isArray(data.links)) {
        throw new Error('Invalid HeyLink backup schema');
      }
      setProfile(data.profile);
      setLinks(data.links);
      saveChanges();
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    const { profile: defProfile, links: defLinks } = DataService.resetToDefault();
    setProfile(defProfile);
    setSavedProfile(defProfile);
    setLinks(defLinks);
    setSavedLinks(defLinks);
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        links,
        activeTab,
        setActiveTab,
        isDirty,
        isSaving,
        saveSuccessMessage,
        errorMessage,
        isSupabaseOnline,
        showMobilePreviewModal,
        setShowMobilePreviewModal,
        showQrModal,
        setShowQrModal,
        showShareModal,
        setShowShareModal,
        showSupabaseModal,
        setShowSupabaseModal,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        updateProfileDraft,
        updateThemeDraft,
        saveChanges,
        discardChanges,
        addLink,
        updateLink,
        deleteLink,
        toggleLink,
        moveLink,
        reorderLinks,
        exportJsonBackup,
        importJsonBackup,
        resetToDefaults,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
