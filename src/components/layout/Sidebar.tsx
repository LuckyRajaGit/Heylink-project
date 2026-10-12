import React from 'react';
import {
  Link2,
  User,
  Palette,
  BarChart3,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, links, profile, setShowSupabaseModal } = useApp();
  const { user } = useAuth();

  const enabledLinksCount = links.filter((l) => l.is_enabled).length;

  const navItems = [
    {
      id: 'links' as const,
      label: 'Links & Sections',
      description: 'Manage & reorder bio links',
      icon: Link2,
      badge: `${enabledLinksCount}/${links.length}`,
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      description: 'Bio, avatar & social handles',
      icon: User,
    },
    {
      id: 'appearance' as const,
      label: 'Appearance',
      description: 'Themes, fonts & buttons',
      icon: Palette,
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      description: 'Clicks, CTR & traffic stats',
      icon: BarChart3,
    },
    {
      id: 'settings' as const,
      label: 'Settings & SEO',
      description: 'Backup, DB & search preview',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between py-6 pr-6 border-r border-slate-200/80 min-h-[calc(100vh-4rem)]">
        <div className="space-y-6">
          {/* User Profile Mini Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white border border-purple-100/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full ring-2 ring-purple-200 overflow-hidden bg-purple-100 shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-purple-700">
                    R
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {profile.full_name || 'Raja Bagdi'}
                </p>
                <p className="text-xs text-purple-700 font-medium truncate">
                  @{profile.username || 'rajabagdi'}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Online
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <div className="min-w-0">
                      <span className="text-sm block leading-tight truncate">{item.label}</span>
                      <span
                        className={`text-[11px] block leading-tight truncate ${
                          isActive ? 'text-purple-100' : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-purple-700 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-200">PostgreSQL Backend</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Real Supabase authentication and Row Level Security ready.
          </p>
          <button
            type="button"
            onClick={() => setShowSupabaseModal(true)}
            className="w-full py-1.5 px-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-[11px] font-bold text-white transition-colors"
          >
            Configure Supabase
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? 'text-purple-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
