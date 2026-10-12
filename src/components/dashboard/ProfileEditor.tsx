import React, { useState } from 'react';
import {
  User,
  AtSign,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Share2,
  Sparkles,
  Upload,
  Globe,
  Mail,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IconRenderer } from '../common/IconRenderer';

const PRESET_AVATARS = [
  {
    label: 'Raja Bagdi (Default)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Modern Tech Dev',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Designer / Creator',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Software Architect',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Product Leader',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
];

const SOCIAL_PLATFORMS = [
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username', icon: 'github' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username', icon: 'twitter' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', icon: 'linkedin' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel', icon: 'youtube' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username', icon: 'instagram' },
  { key: 'email', label: 'Contact Email', placeholder: 'hello@example.com', icon: 'mail' },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username', icon: 'telegram' },
  { key: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...', icon: 'music' },
  { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/...', icon: 'message-square' },
];

export const ProfileEditor: React.FC = () => {
  const { profile, updateProfileDraft } = useApp();
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setAvatarUploadError('Avatar image must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProfileDraft({ avatar_url: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const updateSocial = (key: string, value: string) => {
    updateProfileDraft({
      social_links: {
        ...profile.social_links,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Profile Details
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Customize your bio card, personal avatar, verified badge, and connected social media profiles.
        </p>
      </div>

      {/* Basic Identity Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <User className="w-4 h-4 text-purple-600" />
          General Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Display Name *
            </label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => updateProfileDraft({ full_name: e.target.value })}
              placeholder="Raja Bagdi"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username Handle (@) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">
                @
              </span>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  updateProfileDraft({
                    username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                  })
                }
                placeholder="rajabagdi"
                className="w-full pl-8 pr-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Public link:{' '}
              <span className="font-mono text-purple-700">
                heylink.studio/u/{profile.username || 'rajabagdi'}
              </span>
            </p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">Bio Statement</label>
            <span className="text-[11px] text-slate-400 font-mono">
              {(profile.bio || '').length}/160 characters
            </span>
          </div>
          <textarea
            value={profile.bio}
            onChange={(e) => updateProfileDraft({ bio: e.target.value.slice(0, 160) })}
            rows={3}
            placeholder="Product Designer & Full-Stack Engineer. Building delightful digital tools..."
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Verified Profile Checkbox */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Verified Creator Badge</p>
              <p className="text-[11px] text-slate-500">
                Display the blue official verification mark next to your bio name.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={profile.is_verified ?? true}
              onChange={(e) => updateProfileDraft({ is_verified: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
          </label>
        </div>
      </div>

      {/* Avatar Management Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-purple-600" />
          Profile Avatar
        </h3>

        {avatarUploadError && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            {avatarUploadError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar Preview */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full ring-4 ring-purple-100 overflow-hidden bg-purple-50 flex items-center justify-center shrink-0 shadow-sm">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-purple-600" />
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Avatar Image URL
              </label>
              <input
                type="text"
                value={profile.avatar_url}
                onChange={(e) => updateProfileDraft({ avatar_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-purple-600" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400">PNG, JPG, WebP up to 2MB</span>
            </div>
          </div>
        </div>

        {/* Preset Avatars */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-700 mb-2">Or choose a preset portrait:</p>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {PRESET_AVATARS.map((av, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateProfileDraft({ avatar_url: av.url })}
                className={`w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 transition-all transform hover:scale-105 ${
                  profile.avatar_url === av.url ? 'ring-purple-600 ring-offset-2' : 'ring-slate-200'
                }`}
                title={av.label}
              >
                <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Social Accounts Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-purple-600" />
            Social Profiles & Handles
          </h3>

          {/* Social Position Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium self-start sm:self-auto">
            <span className="text-slate-500 px-2 text-[11px]">Position:</span>
            <button
              type="button"
              onClick={() => updateProfileDraft({ social_position: 'top' })}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                profile.social_position !== 'bottom'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top of Bio
            </button>
            <button
              type="button"
              onClick={() => updateProfileDraft({ social_position: 'bottom' })}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                profile.social_position === 'bottom'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bottom of Bio
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SOCIAL_PLATFORMS.map((platform) => {
            const currentValue = (profile.social_links as any)?.[platform.key] || '';

            return (
              <div
                key={platform.key}
                className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-2xl border border-slate-200/70"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-purple-600 border border-slate-200 flex items-center justify-center shrink-0">
                  <IconRenderer name={platform.icon} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => updateSocial(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    className="w-full px-2 py-1 text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 font-mono"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
