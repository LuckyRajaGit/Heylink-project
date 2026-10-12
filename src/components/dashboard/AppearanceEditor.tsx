import React from 'react';
import {
  Palette,
  Sparkles,
  Type,
  Square,
  SunMedium,
  Check,
  Layers,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { THEME_PRESETS } from '../../lib/presets';
import { ButtonRadius, CardShadow, CustomTheme, FontFamily } from '../../types';

export const AppearanceEditor: React.FC = () => {
  const { profile, updateProfileDraft, updateThemeDraft } = useApp();

  const theme: CustomTheme = profile.custom_theme || THEME_PRESETS[0].theme;

  const handleApplyPreset = (presetId: string) => {
    const selected = THEME_PRESETS.find((p) => p.id === presetId);
    if (selected) {
      updateThemeDraft(selected.theme, selected.id);
    }
  };

  const updateField = <K extends keyof CustomTheme>(key: K, value: CustomTheme[K]) => {
    updateThemeDraft({
      ...theme,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Appearance & Themes
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Choose from designer-crafted presets or fine-tune background gradients, button curves, fonts, and shadows.
        </p>
      </div>

      {/* Preset Themes Gallery */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Curated Themes
          </h3>
          <span className="text-xs text-purple-700 font-semibold">1-Click Apply</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {THEME_PRESETS.map((preset) => {
            const isSelected = profile.theme_id === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className={`text-left p-3 rounded-2xl border-2 transition-all group relative overflow-hidden ${
                  isSelected
                    ? 'border-purple-600 shadow-md ring-2 ring-purple-600/20'
                    : 'border-slate-200 hover:border-purple-300 hover:shadow-sm'
                }`}
              >
                {/* Visual Preview Swatch */}
                <div
                  className="h-20 rounded-xl mb-2.5 flex items-center justify-center p-2 relative shadow-inner"
                  style={{ background: preset.previewGradient }}
                >
                  <div className="w-4/5 py-1.5 px-2 bg-white/90 rounded-md text-[9px] font-bold text-center text-slate-900 shadow-xs truncate">
                    Preview Link
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-white text-purple-600 rounded-full p-1 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-xs font-bold text-slate-900 truncate">{preset.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Theme Customizer */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          Custom Styling Studio
        </h3>

        {/* Background Styling */}
        <div className="space-y-3 pb-5 border-b border-slate-100">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <SunMedium className="w-4 h-4 text-purple-600" />
            Background Style
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Gradient Start */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Gradient Start
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.bgGradientStart || '#6366f1'}
                  onChange={(e) => updateField('bgGradientStart', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={theme.bgGradientStart || '#6366f1'}
                  onChange={(e) => updateField('bgGradientStart', e.target.value)}
                  className="w-full text-xs font-mono uppercase bg-white border border-slate-200 rounded-lg px-2 py-1"
                />
              </div>
            </div>

            {/* Gradient End */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Gradient End
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.bgGradientEnd || '#9333ea'}
                  onChange={(e) => updateField('bgGradientEnd', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={theme.bgGradientEnd || '#9333ea'}
                  onChange={(e) => updateField('bgGradientEnd', e.target.value)}
                  className="w-full text-xs font-mono uppercase bg-white border border-slate-200 rounded-lg px-2 py-1"
                />
              </div>
            </div>

            {/* Gradient Angle */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Gradient Direction
              </label>
              <select
                value={theme.bgGradientAngle || '135deg'}
                onChange={(e) => updateField('bgGradientAngle', e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5"
              >
                <option value="135deg">Diagonal (135°)</option>
                <option value="180deg">Top to Bottom (180°)</option>
                <option value="90deg">Left to Right (90°)</option>
                <option value="45deg">Up Diagonal (45°)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card & Button Styles */}
        <div className="space-y-3 pb-5 border-b border-slate-100">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            Link Card & Button Fill
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card Background Color */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Card Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.cardBg.startsWith('#') ? theme.cardBg : '#ffffff'}
                  onChange={(e) => updateField('cardBg', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={theme.cardBg}
                  onChange={(e) => updateField('cardBg', e.target.value)}
                  placeholder="#ffffff or rgba(...)"
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-2 py-1"
                />
              </div>
            </div>

            {/* Card Text Color */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Card Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.cardTextColor.startsWith('#') ? theme.cardTextColor : '#0f172a'}
                  onChange={(e) => updateField('cardTextColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={theme.cardTextColor}
                  onChange={(e) => updateField('cardTextColor', e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-2 py-1"
                />
              </div>
            </div>

            {/* Button Corner Radius */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Corner Radius
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'rounded-none', label: 'Square' },
                  { id: 'rounded-lg', label: 'Rounded' },
                  { id: 'rounded-2xl', label: 'Curved' },
                  { id: 'rounded-full', label: 'Pill' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('buttonRadius', item.id as ButtonRadius)}
                    className={`py-1 text-[10px] font-semibold rounded-md border transition-all ${
                      theme.buttonRadius === item.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Shadow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Typography */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-600" />
              Font Family
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'font-sans', label: 'Plus Jakarta Sans', sample: 'Modern & Clean' },
                { id: 'font-outfit', label: 'Outfit Display', sample: 'Geometric & Bold' },
                { id: 'font-inter', label: 'Inter Sans', sample: 'Neutral & Crisp' },
                { id: 'font-serif', label: 'Playfair Serif', sample: 'Editorial & Elegant' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateField('fontFamily', f.id as FontFamily)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    theme.fontFamily === f.id
                      ? 'bg-purple-50 border-purple-600 ring-1 ring-purple-600'
                      : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{f.label}</p>
                  <p className="text-[10px] text-slate-400">{f.sample}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Shadow Depth */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              Card Shadow Depth
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'Flat (No Shadow)' },
                { id: 'sm', label: 'Subtle Soft' },
                { id: 'md', label: 'Medium Elevated' },
                { id: 'glow', label: 'Neon Glow Pulse' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => updateField('cardShadow', s.id as CardShadow)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    theme.cardShadow === s.id
                      ? 'bg-purple-50 border-purple-600 ring-1 ring-purple-600'
                      : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{s.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
