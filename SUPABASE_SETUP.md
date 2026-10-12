# HeyLink Studio — Supabase & Vercel Deployment Guide

This guide details how to configure Supabase PostgreSQL, Authentication, Row Level Security (RLS), and deploy HeyLink Studio to Vercel.

---

## 1. Supabase Setup

### Step 1: Create a Supabase Project
1. Go to [https://database.new](https://database.new) (Supabase dashboard).
2. Create a new project (e.g., `heylink-studio`).
3. Note your database password and project region.

### Step 2: Run the SQL Schema & RLS Policies
1. In your Supabase dashboard, open the **SQL Editor** on the left menu.
2. Click **New Query**.
3. Copy and paste the entire contents of `supabase/schema.sql`.
4. Click **Run**.
5. This creates:
   - `public.profiles` with validation rules & automated timestamps
   - `public.links` with reordering positions and click counters
   - `public.link_clicks` for analytics tracking
   - Automated triggers for `auth.users` profile generation
   - `record_link_click` secure RPC function
   - Strict Row Level Security (RLS) policies allowing public visitors to read only published profiles/links while isolating user writes.

### Step 3: Configure Authentication & Redirect URLs
1. Navigate to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to your production URL:
   - Development: `http://localhost:3000` (or your preview URL)
   - Production: `https://your-vercel-domain.vercel.app`
3. In **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `https://your-vercel-domain.vercel.app/**`
4. Under **Authentication** -> **Providers**, ensure **Email** is enabled.
   - For demo/instant testing, you can disable "Confirm email" under **Email Auth** if you want users to log in immediately upon registration.

### Step 4: Obtain API Keys
1. In your Supabase dashboard, go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL** (`https://xyzcompany.supabase.co`)
   - **anon / public key** (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
3. *Note: Never expose the `service_role` secret in frontend code.*

---

## 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_APP_URL=https://your-vercel-domain.vercel.app
```

> **Smart Dual-Engine Fallback**: If Supabase credentials are not provided or if testing offline, HeyLink Studio seamlessly boots with an in-memory & LocalStorage persistence engine with Raja Bagdi's sample profile and links. Once valid Supabase keys are configured, it automatically connects to your live PostgreSQL database!

---

## 3. Vercel Deployment

1. Push this repository to GitHub or GitLab.
2. In [Vercel](https://vercel.com), click **Add New** -> **Project**.
3. Import your repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Add the **Environment Variables**:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `VITE_APP_URL`: Your Vercel production domain
8. Click **Deploy**.
9. The included `vercel.json` ensures client-side routing (`/u/:username`, `/analytics`, `/appearance`, etc.) works seamlessly.
