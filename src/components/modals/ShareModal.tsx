import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Code,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IconRenderer } from '../common/IconRenderer';

export const ShareModal: React.FC = () => {
  const { profile, showShareModal, setShowShareModal } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!showShareModal) return null;

  const publicUrl = `${window.location.origin}/u/${profile.username || 'rajabagdi'}`;
  const shareText = `Check out my links and projects on HeyLink Studio: ${publicUrl}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="700" frameborder="0" style="border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      icon: 'send',
      color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    },
    {
      name: 'X / Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      icon: 'twitter',
      color: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`,
      icon: 'linkedin',
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: 'telegram',
      color: 'bg-sky-50 text-sky-600 hover:bg-sky-100',
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(`${profile.full_name}'s Links`)}&body=${encodeURIComponent(shareText)}`,
      icon: 'mail',
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={() => setShowShareModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
          <Share2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center mb-0.5">
          Share Bio Profile
        </h3>
        <p className="text-xs text-slate-500 text-center mb-5">
          Share your custom HeyLink page with your audience and community.
        </p>

        {/* 1-Click Copy Link Box */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Profile URL
            </p>
            <p className="text-xs font-mono font-semibold text-purple-800 truncate">
              {publicUrl}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 transition-transform active:scale-95"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="mb-5">
          <p className="text-xs font-bold text-slate-700 mb-2.5">Quick Social Share</p>
          <div className="grid grid-cols-5 gap-2">
            {shareChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border border-transparent transition-all transform hover:scale-105 ${channel.color}`}
                title={`Share on ${channel.name}`}
              >
                <IconRenderer name={channel.icon} className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-semibold">{channel.name.split('/')[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Embed Widget Snippet */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-purple-600" />
              Embed on Website
            </span>
            <button
              type="button"
              onClick={handleCopyEmbed}
              className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              {copiedEmbed ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedEmbed ? 'Snippet Copied' : 'Copy HTML'}</span>
            </button>
          </div>
          <p className="text-[10px] font-mono text-slate-500 break-all bg-white p-2 rounded-lg border border-slate-200/80">
            {embedCode}
          </p>
        </div>
      </div>
    </div>
  );
};
