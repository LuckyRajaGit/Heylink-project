import React, { useEffect, useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Share2,
  QrCode,
  Sparkles,
  Link2,
  ArrowLeft,
} from 'lucide-react';
import { DataService } from '../../lib/storage';
import { CustomTheme, LinkItem, Profile } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { QrCodeModal } from '../modals/QrCodeModal';
import { ShareModal } from '../modals/ShareModal';
import { useApp } from '../../context/AppContext';

interface PublicBioPageProps {
  username: string;
  onNavigateHome?: () => void;
}

export const PublicBioPage: React.FC<PublicBioPageProps> = ({ username, onNavigateHome }) => {
  const { setShowQrModal, setShowShareModal } = useApp();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPublicData() {
      setIsLoading(true);
      try {
        const result = await DataService.getProfileByUsername(username);
        if (result.profile) {
          setProfile(result.profile);
          setLinks(result.links);

          // Update page title & SEO meta dynamically
          const pageTitle = result.profile.seo_title || `${result.profile.full_name} | HeyLink Studio`;
          document.title = pageTitle;

          if (result.profile.seo_description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', result.profile.seo_description);
            }
          }
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading public bio:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadPublicData();
  }, [username]);

  const handleLinkClick = (link: LinkItem) => {
    if (profile) {
      // Record analytics event
      DataService.recordClick(link.id, profile.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center animate-bounce shadow-xl">
          <Link2 className="w-6 h-6 text-white" />
        </div>
        <p className="text-xs text-slate-400 mt-4 font-mono tracking-widest uppercase">
          Loading Bio Profile...
        </p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white text-center">
        <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-900/50 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-700/50">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            The handle <span className="font-mono text-purple-400 font-bold">@{username}</span> is either unpublished or has not yet been registered on HeyLink Studio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to HeyLink Studio</span>
              </button>
            )}
            <a
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold inline-flex items-center justify-center transition-all"
            >
              Claim this Username
            </a>
          </div>
        </div>
      </div>
    );
  }

  const theme: CustomTheme = profile.custom_theme || {
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

  // Font styling
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

  const getShadowClass = () => {
    switch (theme.cardShadow) {
      case 'sm':
        return 'shadow-sm';
      case 'md':
        return 'shadow-md';
      case 'lg':
        return 'shadow-xl';
      case 'glow':
        return 'shadow-[0_0_25px_rgba(168,85,247,0.4)]';
      case 'none':
      default:
        return '';
    }
  };

  // Section grouping
  const sectionedItems: { sectionTitle: string; items: LinkItem[] }[] = [];
  let currentGroup = '';
  let currentItems: LinkItem[] = [];

  links.forEach((link) => {
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

  // Socials
  const socials = profile.social_links || {};
  const activeSocialKeys = Object.entries(socials).filter(([, url]) => Boolean(url && url.trim()));

  const renderSocials = () => {
    if (activeSocialKeys.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 py-2">
        {activeSocialKeys.map(([platform, url]) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/35 backdrop-blur-md text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm"
            title={platform}
          >
            <IconRenderer name={platform} className="w-4 h-4" />
          </a>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen py-10 px-4 sm:px-6 flex flex-col justify-between selection:bg-white/20 selection:text-white ${getFontClass()}`}
      style={getBackgroundStyle()}
    >
      {/* Top Floating Control Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between mb-8">
        {onNavigateHome ? (
          <button
            type="button"
            onClick={onNavigateHome}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-95 shadow-sm"
            title="Return to Studio Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <a
            href="/"
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-95 shadow-sm"
            title="HeyLink Studio"
          >
            <Link2 className="w-4 h-4" />
          </a>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-95 shadow-sm"
            title="Scan QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-95 shadow-sm"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Container */}
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center mb-6">
          {/* Avatar */}
          <div className="relative mb-3.5">
            <div className="w-24 h-24 rounded-full ring-4 ring-white/30 shadow-2xl overflow-hidden bg-white/20 flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-extrabold text-white">
                  {profile.full_name?.charAt(0) || 'R'}
                </span>
              )}
            </div>
            {profile.is_verified && (
              <div
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 shadow-md ring-2 ring-white"
                title="Verified Creator"
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Name & Handle */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
            {profile.full_name}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-white/85 mt-0.5 mb-2 font-mono drop-shadow-xs">
            @{profile.username}
          </p>

          {/* Bio statement */}
          {profile.bio && (
            <p className="text-xs sm:text-sm text-white/95 max-w-xs leading-relaxed drop-shadow-xs mb-3">
              {profile.bio}
            </p>
          )}

          {/* Top Socials */}
          {profile.social_position !== 'bottom' && renderSocials()}
        </div>

        {/* Links List */}
        <div className="space-y-3.5 my-2">
          {links.length === 0 ? (
            <div className="p-8 text-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white text-xs">
              No links available at the moment.
            </div>
          ) : (
            sectionedItems.map((group, gIdx) => (
              <div key={`pub-group-${gIdx}`} className="space-y-3">
                {group.sectionTitle && (
                  <div className="pt-3 pb-0.5 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/85 text-center drop-shadow-xs">
                      {group.sectionTitle}
                    </h3>
                  </div>
                )}

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
                      href={link.url}
                      onClick={() => handleLinkClick(link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block w-full py-3.5 px-4 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                        theme.buttonRadius
                      } ${getShadowClass()} ${animClass}`}
                      style={{
                        backgroundColor: theme.cardBg,
                        color: theme.cardTextColor,
                        border: `1px solid ${theme.cardBorderColor}`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Icon */}
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-slate-900/5 group-hover:bg-slate-900/10 transition-colors">
                          <IconRenderer name={link.icon || 'globe'} className="w-4 h-4" />
                        </div>

                        {/* Title */}
                        <span className="flex-1 text-center font-bold text-xs sm:text-sm leading-snug line-clamp-2">
                          {link.title}
                        </span>

                        {/* Arrow or Sparkle */}
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                          {isFeatured ? (
                            <Sparkles className="w-4 h-4 text-purple-600" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
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

        {/* Bottom Socials */}
        {profile.social_position === 'bottom' && (
          <div className="mt-4">{renderSocials()}</div>
        )}
      </div>

      {/* Powered by HeyLink Studio Footer */}
      <footer className="max-w-md mx-auto w-full text-center mt-10 pt-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/25 hover:bg-black/35 backdrop-blur-md text-[11px] font-semibold text-white/90 border border-white/10 transition-colors shadow-xs"
        >
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span>Create your own HeyLink Studio</span>
        </a>
      </footer>

      {/* Reusable Modals */}
      <QrCodeModal />
      <ShareModal />
    </div>
  );
};
