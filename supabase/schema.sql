-- ==============================================================================
-- HeyLink Studio - Supabase Database Schema & Row Level Security (RLS)
-- ==============================================================================
-- This script sets up profiles, links, link_clicks tables, automated triggers,
-- indexes, RLS policies, and the increment_link_click RPC function.
-- ==============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  theme_id TEXT DEFAULT 'purple-haze',
  custom_theme JSONB DEFAULT '{
    "bgType": "gradient",
    "bgColor": "#7c3aed",
    "bgGradientStart": "#6366f1",
    "bgGradientEnd": "#9333ea",
    "cardBg": "#ffffff",
    "cardTextColor": "#0f172a",
    "cardBorderColor": "rgba(255,255,255,0.4)",
    "cardShadow": "md",
    "buttonRadius": "rounded-2xl",
    "fontFamily": "font-sans"
  }'::jsonb,
  social_links JSONB DEFAULT '{
    "instagram": "",
    "twitter": "",
    "github": "",
    "youtube": "",
    "linkedin": "",
    "tiktok": "",
    "telegram": "",
    "email": ""
  }'::jsonb,
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  custom_css TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~* '^[a-z0-9_-]+$')
);

-- 2. Create Links Table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'globe',
  is_enabled BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  group_title TEXT DEFAULT '',
  link_type TEXT DEFAULT 'classic', -- 'classic', 'header', 'featured', 'music', 'video'
  animation TEXT DEFAULT 'none',    -- 'none', 'pulse', 'bounce', 'glow'
  thumbnail_url TEXT DEFAULT '',
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Link Clicks Table (Analytics)
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referrer TEXT DEFAULT 'Direct',
  user_agent TEXT DEFAULT '',
  country TEXT DEFAULT 'US',
  device TEXT DEFAULT 'desktop',    -- 'mobile', 'tablet', 'desktop'
  browser TEXT DEFAULT 'Chrome',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_links_user_id_position ON public.links(user_id, position);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_user_id_created_at ON public.link_clicks(user_id, created_at);

-- 5. Auto Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_links_updated_at ON public.links;
CREATE TRIGGER trigger_links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. New User Registration Trigger (Auto Create Profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  chosen_username TEXT;
BEGIN
  -- Extract initial username from email or metadata
  base_username := LOWER(COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1),
    'user'
  ));
  -- Sanitize username
  base_username := REGEXP_REPLACE(base_username, '[^a-z0-9_-]', '', 'g');
  IF LENGTH(base_username) < 3 THEN
    base_username := 'user_' || SUBSTRING(NEW.id::text, 1, 6);
  END IF;

  chosen_username := base_username;

  -- Ensure uniqueness
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = chosen_username) THEN
    chosen_username := base_username || '_' || SUBSTRING(NEW.id::text, 1, 4);
  END IF;

  INSERT INTO public.profiles (id, username, full_name, avatar_url, bio)
  VALUES (
    NEW.id,
    chosen_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', INITCAP(chosen_username)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    'Welcome to my official links! Explore my social media and latest projects.'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Secure Click Increment RPC Function
CREATE OR REPLACE FUNCTION public.record_link_click(
  p_link_id UUID,
  p_referrer TEXT DEFAULT 'Direct',
  p_country TEXT DEFAULT 'US',
  p_device TEXT DEFAULT 'desktop',
  p_browser TEXT DEFAULT 'Chrome'
)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Verify the link exists and fetch user_id
  SELECT user_id INTO v_user_id FROM public.links WHERE id = p_link_id;

  IF v_user_id IS NOT NULL THEN
    -- Increment counter
    UPDATE public.links
    SET clicks_count = clicks_count + 1
    WHERE id = p_link_id;

    -- Record click event
    INSERT INTO public.link_clicks (link_id, user_id, referrer, country, device, browser)
    VALUES (p_link_id, v_user_id, COALESCE(p_referrer, 'Direct'), COALESCE(p_country, 'US'), COALESCE(p_device, 'desktop'), COALESCE(p_browser, 'Chrome'));
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies: Profiles
-- Anyone can view published profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_published = true OR auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- 10. RLS Policies: Links
-- Anyone can view enabled links belonging to a published profile
CREATE POLICY "Enabled links of published profiles are viewable by anyone"
  ON public.links FOR SELECT
  USING (
    (is_enabled = true AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = links.user_id AND profiles.is_published = true
    ))
    OR (auth.uid() = user_id)
  );

-- Authenticated users can insert their own links
CREATE POLICY "Users can create their own links"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own links
CREATE POLICY "Users can update their own links"
  ON public.links FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own links
CREATE POLICY "Users can delete their own links"
  ON public.links FOR DELETE
  USING (auth.uid() = user_id);

-- 11. RLS Policies: Link Clicks
-- Only profile owner can view click analytics
CREATE POLICY "Users can view click analytics for their own links"
  ON public.link_clicks FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert a click (or via record_link_click RPC function)
CREATE POLICY "Anyone can log click events"
  ON public.link_clicks FOR INSERT
  WITH CHECK (true);
