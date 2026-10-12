import React from 'react';
import { X, Smartphone, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PhoneMockup } from './PhoneMockup';

export const MobilePreviewModal: React.FC = () => {
  const { showMobilePreviewModal, setShowMobilePreviewModal, profile } = useApp();

  if (!showMobilePreviewModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="relative max-w-sm w-full py-4 flex flex-col items-center">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2 text-white">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold">Live Mobile Screen Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/u/${profile.username || 'rajabagdi'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Open full page in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => setShowMobilePreviewModal(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Live Phone Frame */}
        <PhoneMockup />
      </div>
    </div>
  );
};
