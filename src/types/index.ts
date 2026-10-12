export type LinkType = 'classic' | 'header' | 'featured' | 'social' | 'music' | 'video';
export type LinkAnimation = 'none' | 'pulse' | 'bounce' | 'glow';
export type ButtonRadius = 'rounded-none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg' | 'glow';
export type FontFamily = 'font-sans' | 'font-outfit' | 'font-inter' | 'font-serif' | 'font-mono';

export interface CustomTheme {
  bgType: 'solid' | 'gradient' | 'mesh' | 'dark';
  bgColor: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  bgGradientAngle?: string;
  cardBg: string;
  cardTextColor: string;
  cardBorderColor: string;
  cardShadow: CardShadow;
  buttonRadius: ButtonRadius;
  fontFamily: FontFamily;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  github?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
  telegram?: string;
  email?: string;
  spotify?: string;
  discord?: string;
  website?: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  is_published: boolean;
  theme_id: string;
  custom_theme: CustomTheme;
  social_links: SocialLinks;
  social_position?: 'top' | 'bottom';
  seo_title?: string;
  seo_description?: string;
  custom_css?: string;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LinkItem {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon?: string;
  is_enabled: boolean;
  position: number;
  group_title?: string; // Section header
  link_type: LinkType;
  animation?: LinkAnimation;
  thumbnail_url?: string;
  clicks_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface LinkClick {
  id: string;
  link_id: string;
  user_id: string;
  referrer: string;
  user_agent?: string;
  country: string;
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  theme: CustomTheme;
}
