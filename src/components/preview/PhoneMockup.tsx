import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Share2,
  QrCode,
  Sparkles,
  Smartphone,
  Eye,
  Check,
  Copy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomTheme, LinkItem, Profile } from '../../types';
import { IconRenderer } from '../common/IconRenderer';

interface PhoneMockupProps {
  customProfile?: Profile;
  customLinks?: LinkItem[];
  interactive?: boolean;
  onLinkClick?: (linkId: string, url: string) => void;
  scale?: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  customProfile,
  customLinks,
  interactive = true,
  onLinkClick,
}) => {
  const { profile: appProfile, links: appLinks, setShowQrModal, setShowShareModal } = useApp();

  const activeProfile = customProfile || appProfile;
  const activeLinks = (customLinks || appLinks).filter((l) => l.is_enabled);
  const theme: CustomTheme = activeProfile.custom_theme || {
    bgType: 'gradient',
    bgColor: '#7c3aed',
    bgGradientStart: '#6366f1',
    bgGradientEnd: '#9333ea',
    bgGradientAngle: '135deg',
    cardBg: '#ffffff',
    cardTextColor: '#0f172a',
    cardBorderColor: 'rgba(255,255,255,0.4)',
    cardShadow: 'md',
    buttonRadius: 'rounded-2xl',
    fontFamily: 'font-sans',
  };

  const [copiedLink, setCopiedLink] = useState(false);
  const [clickNotice, setClickNotice] = useState<string | null>(null);

  // Background style
  const getBackgroundStyle = () => {
    if (theme.bgType === 'solid') {
      return { backgroundColor: theme.bgColor || '#7c3aed' };
    }
    const angle = theme.bgGradientAngle || '135deg';
    const start = theme.bgGradientStart || '#6366f1';
    const end = theme.bgGradientEnd || '#9333ea';
    return {
      background: `linear-gradient(${angle}, ${start} 0%, ${end} 100%)`,
    };
  };

  // Font family class
  const getFontClass = () => {
    switch (theme.fontFamily) {
      case 'font-outfit':
        return 'font-["Outfit",sans-serif]';
      case 'font-inter':
        return 'font-["Inter",sans-serif]';
      case 'font-serif':
        return 'font-["Playfair_Display",serif]';
      case 'font-mono':
        return 'font-mono';
      case 'font-sans':
      default:
        return 'font-["Plus_Jakarta_Sans",sans-serif]';
    }
  };

  // Shadow class
  const getShadowClass = () => {
    switch (theme.cardShadow) {
      case 'sm':
        return 'shadow-sm';
      case 'md':
        return 'shadow-md';
      case 'lg':
        return 'shadow-xl';
      case 'glow':
        return 'shadow-[0_0_20px_rgba(168,85,247,0.35)]';
      case 'none':
      default:
        return '';
    }
  };

  const handleItemClick = (e: React.MouseEvent, link: LinkItem) => {
    if (!interactive) return;
    e.preventDefault();

    if (onLinkClick) {
      onLinkClick(link.id, link.url);
    } else {
      setClickNotice(`Clicked: ${link.title}`);
      setTimeout(() => setClickNotice(null), 2000);
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  // Group links by section
  const sectionedItems: { sectionTitle: string; items: LinkItem[] }[] = [];
  let currentGroup = '';
  let currentItems: LinkItem[] = [];

  activeLinks.forEach((link) => {
    const group = link.group_title?.trim() || '';
    if (group !== currentGroup) {
      if (currentItems.length > 0 || currentGroup) {
        sectionedItems.push({ sectionTitle: currentGroup, items: currentItems });
      }
      currentGroup = group;
      currentItems = [link];
    } else {
      currentItems.push(link);
    }
  });
  if (currentItems.length > 0 || currentGroup) {
    sectionedItems.push({ sectionTitle: currentGroup, items: currentItems });
  }

  // Social icons list
  const socials = activeProfile.social_links || {};
  const activeSocialKeys = Object.entries(socials).filter(([, url]) => Boolean(url && url.trim()));

  const renderSocials = () => {
    if (activeSocialKeys.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center justify-center gap-2.5 py-1">
        {activeSocialKeys.map(([platform, url]) => (
          <a
            key={platform}
            href={interactive ? url : '#'}
            target={interactive ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!interactive) e.preventDefault();
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/30 backdrop-blur-md text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm"
            title={platform}
          >
            <IconRenderer name={platform} className="w-4 h-4" />
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="relative mx-auto select-none">
      {/* Outer Phone Frame */}
      <div className="w-[310px] sm:w-[330px] h-[650px] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(79,70,229,0.35),0_0_0_1px_rgba(255,255,255,0.1),0_0_0_8px_#0f172a] relative border border-slate-800">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1 bg-black rounded-full border border-neutral-800 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
          <div className="w-3 h-3 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="absolute top-5 left-8 right-8 z-20 flex justify-between items-center text-[10px] font-semibold text-white/80 pointer-events-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px]">5G</span>
            <div className="w-4 h-2 rounded-xs border border-white/70 flex items-center p-0.5">
              <div className="w-full h-full bg-white rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div
          className={`w-full h-full rounded-[38px] overflow-y-auto no-scrollbar pt-12 pb-8 px-4 flex flex-col justify-between text-slate-900 transition-all duration-300 ${getFontClass()}`}
          style={getBackgroundStyle()}
        >
          {/* Top Floating Action Bar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-transform active:scale-90"
              title="QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleShareClick}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-transform active:scale-90"
              title="Share Bio"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-3 group">
              <div className="w-20 h-20 rounded-full ring-4 ring-white/30 shadow-xl overflow-hidden bg-purple-100 flex items-center justify-center">
                {activeProfile.avatar_url ? (
                  <img
                    src={activeProfile.avatar_url}
                    alt={activeProfile.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                ) : (
                  <span className="text-2xl font-bold text-purple-700">
                    {activeProfile.full_name?.charAt(0) || 'R'}
                  </span>
                )}
              </div>
              {activeProfile.is_verified && (
                <div
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 shadow-md ring-2 ring-white"
                  title="Verified Profile"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Name & Username */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="text-base font-bold text-white tracking-tight drop-shadow-sm">
                {activeProfile.full_name || 'Raja Bagdi'}
              </h2>
            </div>
            <p className="text-xs font-medium text-white/80 mb-2.5">
              @{activeProfile.username || 'rajabagdi'}
            </p>

            {/* Bio */}
            {activeProfile.bio && (
              <p className="text-xs text-white/90 max-w-[240px] leading-relaxed mb-3 drop-shadow-xs">
                {activeProfile.bio}
              </p>
            )}

            {/* Social Icons (Top placement) */}
            {activeProfile.social_position !== 'bottom' && renderSocials()}
          </div>

          {/* Interactive Click Toast */}
          {clickNotice && (
            <div className="my-2 py-1.5 px-3 bg-black/85 text-white text-[11px] rounded-lg text-center backdrop-blur-md animate-fade-in shadow-lg">
              {clickNotice}
            </div>
          )}

          {/* Links List */}
          <div className="flex-1 mt-4 space-y-3">
            {activeLinks.length === 0 ? (
              <div className="py-8 text-center text-white/70 text-xs bg-white/10 rounded-2xl p-4 backdrop-blur-xs border border-white/10">
                <Sparkles className="w-5 h-5 mx-auto mb-2 opacity-60" />
                No active links yet. Add your links in the dashboard to see them appear here!
              </div>
            ) : (
              sectionedItems.map((group, gIdx) => (
                <div key={`group-${gIdx}`} className="space-y-2.5">
                  {/* Section Title */}
                  {group.sectionTitle && (
                    <div className="pt-2 pb-0.5 px-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white/85 text-center drop-shadow-xs">
                        {group.sectionTitle}
                      </h4>
                    </div>
                  )}

                  {/* Section Links */}
                  {group.items.map((link) => {
                    const isFeatured = link.link_type === 'featured';
                    const animClass =
                      link.animation === 'pulse'
                        ? 'animate-pulse'
                        : link.animation === 'bounce'
                        ? 'animate-bounce'
                        : '';

                    return (
                      <a
                        key={link.id}
                        href={interactive ? link.url : '#'}
                        onClick={(e) => handleItemClick(e, link)}
                        target={interactive ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className={`group block w-full py-3 px-3.5 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                          theme.buttonRadius
                        } ${getShadowClass()} ${animClass}`}
                        style={{
                          backgroundColor: theme.cardBg,
                          color: theme.cardTextColor,
                          border: `1px solid ${theme.cardBorderColor}`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2.5">
                          {/* Icon */}
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-slate-900/5 group-hover:bg-slate-900/10 transition-colors">
                            <IconRenderer
                              name={link.icon || 'globe'}
                              className="w-4 h-4"
                            />
                          </div>

                          {/* Title */}
                          <div className="flex-1 text-center font-semibold text-xs leading-snug line-clamp-2">
                            {link.title}
                          </div>

                          {/* External Arrow / Featured Badge */}
                          <div className="w-7 h-7 flex items-center justify-center shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                            {isFeatured ? (
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            ) : (
                              <ExternalLink className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Social Icons (Bottom placement) */}
          {activeProfile.social_position === 'bottom' && (
            <div className="mt-4">{renderSocials()}</div>
          )}

          {/* Brand Footer */}
          <div className="mt-6 pt-2 text-center border-t border-white/10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-md text-[10px] font-medium text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              HeyLink Studio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
