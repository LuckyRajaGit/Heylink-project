import React, { useState } from 'react';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  ExternalLink,
  Sparkles,
  GripVertical,
  Check,
  X,
  FolderPlus,
  BarChart2,
  Search,
  Eye,
  EyeOff,
  Link as LinkIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { LinkAnimation, LinkItem, LinkType } from '../../types';
import { AVAILABLE_ICONS, IconRenderer } from '../common/IconRenderer';

export const LinksManager: React.FC = () => {
  const { links, addLink, updateLink, deleteLink, toggleLink, moveLink } = useApp();
  const { user } = useAuth();

  // Modal / Form state for Add or Edit Link
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('globe');
  const [groupTitle, setGroupTitle] = useState('');
  const [linkType, setLinkType] = useState<LinkType>('classic');
  const [animation, setAnimation] = useState<LinkAnimation>('none');
  const [formError, setFormError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  // Quick Section Modal
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  // Extract unique existing section titles
  const existingSections = Array.from(
    new Set(links.map((l) => l.group_title?.trim()).filter(Boolean))
  ) as string[];

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setIcon('globe');
    setGroupTitle('');
    setLinkType('classic');
    setAnimation('none');
    setFormError(null);
    setEditingId(null);
    setIsEditing(false);
  };

  const openAddForm = (defaultSection = '') => {
    resetForm();
    if (defaultSection) setGroupTitle(defaultSection);
    setIsEditing(true);
  };

  const openEditForm = (item: LinkItem) => {
    setTitle(item.title);
    setUrl(item.url);
    setIcon(item.icon || 'globe');
    setGroupTitle(item.group_title || '');
    setLinkType(item.link_type);
    setAnimation(item.animation || 'none');
    setFormError(null);
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a title for the link.');
      return;
    }

    if (!url.trim()) {
      setFormError('Please enter a valid URL.');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('mailto:')) {
      finalUrl = `https://${finalUrl}`;
    }

    if (editingId) {
      const original = links.find((l) => l.id === editingId);
      if (original) {
        await updateLink({
          ...original,
          title: title.trim(),
          url: finalUrl,
          icon,
          group_title: groupTitle.trim(),
          link_type: linkType,
          animation,
        });
      }
    } else {
      await addLink({
        user_id: user?.id || 'usr_raja_bagdi_demo',
        title: title.trim(),
        url: finalUrl,
        icon,
        is_enabled: true,
        position: links.length,
        group_title: groupTitle.trim(),
        link_type: linkType,
        animation,
      });
    }

    resetForm();
  };

  // Filter links
  const filteredLinks = links.filter((link) => {
    const matchesQuery =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection =
      sectionFilter === 'all'
        ? true
        : sectionFilter === 'ungrouped'
        ? !link.group_title?.trim()
        : link.group_title?.trim() === sectionFilter;
    return matchesQuery && matchesSection;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Links & Sections
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create, reorder, group, and customize links displayed on your bio page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSectionModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs"
          >
            <FolderPlus className="w-4 h-4 text-purple-600" />
            <span>Add Section</span>
          </button>
          <button
            type="button"
            onClick={() => openAddForm()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-purple-600/25 transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search links by title or URL..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
          />
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setSectionFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              sectionFilter === 'all'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({links.length})
          </button>
          {existingSections.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSectionFilter(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                sectionFilter === sec
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Add / Edit Form Card */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-purple-200 shadow-xl shadow-purple-500/5 animate-fade-in">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              {editingId ? 'Edit Link' : 'Add New Link'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 💼 View Portfolio & Case Studies"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination URL *
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Section Header */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Header (Optional)
                </label>
                <input
                  type="text"
                  value={groupTitle}
                  onChange={(e) => setGroupTitle(e.target.value)}
                  placeholder="e.g. Featured Projects"
                  list="section-options"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                />
                <datalist id="section-options">
                  {existingSections.map((sec) => (
                    <option key={sec} value={sec} />
                  ))}
                </datalist>
              </div>

              {/* Link Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Type
                </label>
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as LinkType)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                >
                  <option value="classic">Classic Button</option>
                  <option value="featured">Featured Highlight</option>
                  <option value="video">Video / Stream</option>
                  <option value="music">Music / Audio</option>
                  <option value="header">Section Separator</option>
                </select>
              </div>

              {/* Animation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Click Animation
                </label>
                <select
                  value={animation}
                  onChange={(e) => setAnimation(e.target.value as LinkAnimation)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                >
                  <option value="none">None (Standard)</option>
                  <option value="pulse">Pulse Glow</option>
                  <option value="bounce">Subtle Bounce</option>
                </select>
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Choose Link Icon
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setIcon(ic.id)}
                    className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                      icon === ic.id
                        ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <IconRenderer name={ic.id} className="w-3.5 h-3.5" />
                    <span>{ic.label.split('/')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all transform active:scale-95"
              >
                {editingId ? 'Update Link' : 'Add Link to Bio'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {filteredLinks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <LinkIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No links found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
              {searchQuery
                ? 'No links match your current search query.'
                : 'Your bio page is looking a little empty. Click "Add Link" to add your projects, social profiles, and resources.'}
            </p>
            <button
              type="button"
              onClick={() => openAddForm()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add First Link
            </button>
          </div>
        ) : (
          filteredLinks.map((item, index) => {
            const actualIndex = links.findIndex((l) => l.id === item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all hover:shadow-md ${
                  item.is_enabled
                    ? 'border-slate-200/90 shadow-2xs'
                    : 'border-slate-200/60 bg-slate-50/50 opacity-70'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-3">
                  {/* Left: Reorder Buttons & Icon */}
                  <div className="flex items-center gap-2">
                    {/* Reorder Arrows */}
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveLink(actualIndex, 'up')}
                        disabled={actualIndex === 0}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 transition-colors"
                        title="Move link up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveLink(actualIndex, 'down')}
                        disabled={actualIndex === links.length - 1}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 transition-colors"
                        title="Move link down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Icon Badge */}
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
                      <IconRenderer name={item.icon || 'globe'} className="w-5 h-5" />
                    </div>

                    {/* Title & Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        {item.link_type === 'featured' && (
                          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 rounded border border-amber-200">
                            Featured
                          </span>
                        )}
                        {item.animation !== 'none' && (
                          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-purple-700 bg-purple-50 rounded border border-purple-200">
                            {item.animation}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-600 truncate max-w-[200px] sm:max-w-xs flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>{item.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>

                        {item.group_title && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="font-semibold text-purple-700 text-[11px] truncate max-w-[120px]">
                              {item.group_title}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Clicks, Enable/Disable, Edit, Delete */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Clicks counter */}
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                      title="Total recorded clicks"
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>{item.clicks_count || 0}</span>
                    </div>

                    {/* Enable/Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleLink(item.id)}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        item.is_enabled
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                          : 'text-slate-400 bg-slate-100 border-slate-200 hover:text-slate-700'
                      }`}
                      title={item.is_enabled ? 'Disable link' : 'Enable link'}
                    >
                      {item.is_enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 border border-slate-200 transition-colors"
                      title="Edit link"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${item.title}"?`)) {
                          deleteLink(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-purple-600" />
              Create Section Header
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Section headers organize your links into clean groups (e.g., &quot;Latest Projects&quot;, &quot;Socials&quot;, &quot;Podcasts&quot;).
            </p>

            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="e.g. Featured Projects"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSectionModal(false);
                  setNewSectionName('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newSectionName.trim()) {
                    openAddForm(newSectionName.trim());
                    setShowSectionModal(false);
                    setNewSectionName('');
                  }
                }}
                disabled={!newSectionName.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm disabled:opacity-50"
              >
                Create & Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
