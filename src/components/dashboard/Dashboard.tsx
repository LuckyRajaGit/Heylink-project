import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';
import { LinksManager } from './LinksManager';
import { ProfileEditor } from './ProfileEditor';
import { AppearanceEditor } from './AppearanceEditor';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import { PhoneMockup } from '../preview/PhoneMockup';
import { MobilePreviewModal } from '../preview/MobilePreviewModal';
import { QrCodeModal } from '../modals/QrCodeModal';
import { ShareModal } from '../modals/ShareModal';
import { SupabaseConfigModal } from '../modals/SupabaseConfigModal';
import { AuthModal } from '../auth/AuthModal';
import { Smartphone, Sparkles, ExternalLink } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { activeTab, profile } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'links':
        return <LinksManager />;
      case 'profile':
        return <ProfileEditor />;
      case 'appearance':
        return <AppearanceEditor />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <LinksManager />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 pb-20 md:pb-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Center Editing Canvas */}
        <main className="flex-1 min-w-0 py-6">
          {renderActiveView()}
        </main>

        {/* Right Dock: Live Mobile Phone Preview (Visible on xl+ screens) */}
        <aside className="w-80 shrink-0 hidden xl:flex flex-col items-center py-6 border-l border-slate-200/80 pl-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
          <div className="w-full flex items-center justify-between mb-3 px-1 text-slate-500 text-xs">
            <span className="font-bold flex items-center gap-1.5 text-slate-700">
              <Smartphone className="w-3.5 h-3.5 text-purple-600" />
              Live Preview
            </span>
            <a
              href={`/u/${profile.username || 'rajabagdi'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-700 flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Interactive Phone Frame */}
          <div className="transform scale-[0.92] origin-top">
            <PhoneMockup />
          </div>
        </aside>
      </div>

      {/* Global Modals */}
      <MobilePreviewModal />
      <QrCodeModal />
      <ShareModal />
      <SupabaseConfigModal />
      <AuthModal />
    </div>
  );
};
