import { LinkClick, LinkItem, Profile } from '../types';
import { INITIAL_LINKS, INITIAL_PROFILE } from './presets';
import { getSupabase, isSupabaseConfigured } from './supabase';

const STORAGE_PROFILE_KEY = 'heylink_profile_v1';
const STORAGE_LINKS_KEY = 'heylink_links_v1';
const STORAGE_CLICKS_KEY = 'heylink_clicks_v1';

// Seed mock click analytics if empty
function generateInitialClicks(links: LinkItem[], userId: string): LinkClick[] {
  const referrers = ['Instagram', 'Twitter / X', 'Direct / Bio', 'LinkedIn', 'YouTube', 'TikTok'];
  const countries = ['US', 'IN', 'GB', 'DE', 'CA', 'AU', 'FR', 'SG'];
  const devices: ('mobile' | 'tablet' | 'desktop')[] = ['mobile', 'mobile', 'desktop', 'mobile', 'desktop'];
  const browsers = ['Chrome Mobile', 'Safari Mobile', 'Chrome Desktop', 'Firefox', 'Edge'];

  const clicks: LinkClick[] = [];
  const now = Date.now();

  links.forEach((link) => {
    const count = Math.min(link.clicks_count || 10, 25);
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 28);
      const hoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date(now - (daysAgo * 86400000 + hoursAgo * 3600000)).toISOString();

      clicks.push({
        id: `click_${link.id}_${i}`,
        link_id: link.id,
        user_id: userId,
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        created_at: timestamp,
      });
    }
  });

  return clicks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// -------------------------------------------------------------
// LOCAL STORAGE ENGINE
// -------------------------------------------------------------
function getLocalProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading local profile:', e);
  }
  localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
  return INITIAL_PROFILE;
}

function saveLocalProfile(profile: Profile): void {
  localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
}

function getLocalLinks(): LinkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_LINKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading local links:', e);
  }
  localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(INITIAL_LINKS));
  return INITIAL_LINKS;
}

function saveLocalLinks(links: LinkItem[]): void {
  localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
}

function getLocalClicks(): LinkClick[] {
  try {
    const raw = localStorage.getItem(STORAGE_CLICKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading local clicks:', e);
  }
  const seeded = generateInitialClicks(INITIAL_LINKS, INITIAL_PROFILE.id);
  localStorage.setItem(STORAGE_CLICKS_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveLocalClicks(clicks: LinkClick[]): void {
  localStorage.setItem(STORAGE_CLICKS_KEY, JSON.stringify(clicks));
}

// -------------------------------------------------------------
// DATA SERVICE INTERFACE
// -------------------------------------------------------------

export const DataService = {
  // 1. Fetch Profile
  async getProfile(userId?: string): Promise<Profile> {
    const supabase = getSupabase();
    if (supabase && userId && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.warn('Supabase profile fetch error, fallback to local:', error.message);
          return getLocalProfile();
        }
        if (data) return data as Profile;
      } catch (err) {
        console.warn('Supabase fetch exception, fallback to local:', err);
      }
    }
    return getLocalProfile();
  },

  // 2. Fetch Profile by Username (Public view)
  async getProfileByUsername(username: string): Promise<{ profile: Profile | null; links: LinkItem[] }> {
    const cleanUsername = username.toLowerCase().replace('@', '').trim();
    const supabase = getSupabase();

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .ilike('username', cleanUsername)
          .single();

        if (!profileErr && profileData) {
          const { data: linksData } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', profileData.id)
            .eq('is_enabled', true)
            .order('position', { ascending: true });

          return {
            profile: profileData as Profile,
            links: (linksData || []) as LinkItem[],
          };
        }
      } catch (err) {
        console.warn('Supabase public fetch error:', err);
      }
    }

    // Local fallback check
    const localProfile = getLocalProfile();
    if (localProfile.username.toLowerCase() === cleanUsername || cleanUsername === 'rajabagdi' || cleanUsername === 'demo') {
      const localLinks = getLocalLinks().filter((l) => l.is_enabled);
      return { profile: localProfile, links: localLinks };
    }

    return { profile: null, links: [] };
  },

  // 3. Save/Update Profile
  async updateProfile(profile: Profile): Promise<Profile> {
    saveLocalProfile(profile);

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: profile.id,
            username: profile.username.toLowerCase(),
            full_name: profile.full_name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            is_published: profile.is_published,
            theme_id: profile.theme_id,
            custom_theme: profile.custom_theme,
            social_links: profile.social_links,
            seo_title: profile.seo_title,
            seo_description: profile.seo_description,
            custom_css: profile.custom_css,
            updated_at: new Date().toISOString(),
          });

        if (error) console.warn('Supabase updateProfile error:', error.message);
      } catch (err) {
        console.warn('Supabase updateProfile exception:', err);
      }
    }

    return profile;
  },

  // 4. Fetch Links
  async getLinks(userId?: string): Promise<LinkItem[]> {
    const supabase = getSupabase();
    if (supabase && userId && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', userId)
          .order('position', { ascending: true });

        if (!error && data) return data as LinkItem[];
      } catch (err) {
        console.warn('Supabase getLinks exception:', err);
      }
    }
    return getLocalLinks();
  },

  // 5. Create Link
  async createLink(linkData: Omit<LinkItem, 'id' | 'clicks_count'>): Promise<LinkItem> {
    const newId = `link_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newLink: LinkItem = {
      ...linkData,
      id: newId,
      clicks_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const localLinks = getLocalLinks();
    const updatedLinks = [...localLinks, newLink];
    saveLocalLinks(updatedLinks);

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('links')
          .insert({
            user_id: newLink.user_id,
            title: newLink.title,
            url: newLink.url,
            icon: newLink.icon || 'globe',
            is_enabled: newLink.is_enabled,
            position: newLink.position,
            group_title: newLink.group_title || '',
            link_type: newLink.link_type,
            animation: newLink.animation || 'none',
            thumbnail_url: newLink.thumbnail_url || '',
            clicks_count: 0,
          })
          .select()
          .single();

        if (!error && data) {
          // Sync id from DB
          return data as LinkItem;
        }
      } catch (err) {
        console.warn('Supabase createLink exception:', err);
      }
    }

    return newLink;
  },

  // 6. Update Link
  async updateLink(link: LinkItem): Promise<LinkItem> {
    const localLinks = getLocalLinks();
    const index = localLinks.findIndex((l) => l.id === link.id);
    if (index !== -1) {
      localLinks[index] = { ...link, updated_at: new Date().toISOString() };
      saveLocalLinks(localLinks);
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase
          .from('links')
          .update({
            title: link.title,
            url: link.url,
            icon: link.icon,
            is_enabled: link.is_enabled,
            position: link.position,
            group_title: link.group_title,
            link_type: link.link_type,
            animation: link.animation,
            thumbnail_url: link.thumbnail_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', link.id);
      } catch (err) {
        console.warn('Supabase updateLink exception:', err);
      }
    }

    return link;
  },

  // 7. Delete Link
  async deleteLink(linkId: string): Promise<void> {
    const localLinks = getLocalLinks().filter((l) => l.id !== linkId);
    saveLocalLinks(localLinks);

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('links').delete().eq('id', linkId);
      } catch (err) {
        console.warn('Supabase deleteLink exception:', err);
      }
    }
  },

  // 8. Reorder Links
  async reorderLinks(links: LinkItem[]): Promise<LinkItem[]> {
    const ordered = links.map((l, index) => ({ ...l, position: index }));
    saveLocalLinks(ordered);

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        for (const item of ordered) {
          await supabase.from('links').update({ position: item.position }).eq('id', item.id);
        }
      } catch (err) {
        console.warn('Supabase reorderLinks exception:', err);
      }
    }

    return ordered;
  },

  // 9. Record Link Click (Public & Protected Function)
  async recordClick(linkId: string, userId: string): Promise<void> {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    const device: 'mobile' | 'tablet' | 'desktop' = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    let browser = 'Chrome';
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct';

    // Local storage increment
    const localLinks = getLocalLinks();
    const link = localLinks.find((l) => l.id === linkId);
    if (link) {
      link.clicks_count = (link.clicks_count || 0) + 1;
      saveLocalLinks(localLinks);
    }

    const clickRecord: LinkClick = {
      id: `click_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      link_id: linkId,
      user_id: userId,
      referrer,
      country: 'US',
      device,
      browser,
      created_at: new Date().toISOString(),
    };

    const clicks = getLocalClicks();
    clicks.unshift(clickRecord);
    saveLocalClicks(clicks);

    // Supabase RPC
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.rpc('record_link_click', {
          p_link_id: linkId,
          p_referrer: referrer,
          p_country: 'US',
          p_device: device,
          p_browser: browser,
        });
      } catch (err) {
        console.warn('Supabase recordClick error:', err);
      }
    }
  },

  // 10. Fetch Analytics Clicks
  async getClickAnalytics(userId?: string): Promise<LinkClick[]> {
    const supabase = getSupabase();
    if (supabase && userId && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('link_clicks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1000);

        if (!error && data) return data as LinkClick[];
      } catch (err) {
        console.warn('Supabase getClickAnalytics error:', err);
      }
    }
    return getLocalClicks();
  },

  // 11. Reset / Seed Demo Data
  resetToDefault(): { profile: Profile; links: LinkItem[] } {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(INITIAL_LINKS));
    const seeded = generateInitialClicks(INITIAL_LINKS, INITIAL_PROFILE.id);
    localStorage.setItem(STORAGE_CLICKS_KEY, JSON.stringify(seeded));
    return { profile: INITIAL_PROFILE, links: INITIAL_LINKS };
  },
};
