# Vercel Deployment & Optimization Guide for HeyLink Studio

HeyLink Studio is pre-configured and optimized for **Vercel** with maximum performance, Edge CDN caching, security headers, and single-page application (SPA) routing rewrites.

---

## 🚀 Quick Deployment Options

### Option A: 1-Click Deploy via Vercel CLI (Fastest)

1. Install the Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Run the deployment command in the project root:
   ```bash
   vercel
   ```
   - Set project name: `heylink-studio`
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`

3. To deploy directly to production:
   ```bash
   vercel --prod
   ```

---

### Option B: Deploy via GitHub / GitLab

1. Push this codebase to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: production-ready HeyLink Studio for Raja Bagdi"
   git remote add origin https://github.com/rajabagdi/heylink-studio.git
   git push -u origin main
   ```

2. Log in to [Vercel](https://vercel.com) and click **"Add New"** → **"Project"**.
3. Import your `heylink-studio` repository.
4. Framework Preset will automatically detect **Vite**.
5. Add the **Environment Variables** (see below).
6. Click **Deploy**.

---

## 🔑 Environment Variables to Configure in Vercel

In your **Vercel Project Settings → Environment Variables**, add:

| Variable Name | Value Description | Example |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase Project REST URL | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anon key | `eyJhbGciOiJIUzI1NiIsInR5c...` |
| `VITE_APP_URL` | Your live production Vercel URL | `https://heylink-studio.vercel.app` |

*(Note: If Supabase credentials are not provided initially, the application automatically runs in an instant sandbox mode with local persistence preloaded with Raja Bagdi's profile, links, and analytics).*

---

## ⚡ Built-in Performance & Caching Optimizations

The included `vercel.json` and `vite.config.ts` provide production-level optimizations:

1. **Edge CDN Immutable Caching**:
   - Static bundles (`/assets/*`) are cached at the edge for **1 year** (`max-age=31536000, immutable`), ensuring sub-50ms repeat loads.
   - HTML (`index.html`) is always fresh (`max-age=0, must-revalidate`).

2. **Modular Vendor Chunk Splitting**:
   - `vendor-react`: React 19 core modules
   - `vendor-supabase`: Supabase database & auth client
   - `vendor-icons`: Lucide icon graph
   - `vendor-utils`: QR code generator & canvas confetti
   - *Result: Smaller initial JavaScript payload and faster Time to Interactive (TTI).*

3. **Strict Security Headers**:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`

4. **SPA Dynamic Routing**:
   - Rewrites all paths (e.g., `/u/:username`, `/analytics`, `/appearance`) to `index.html` without 404 errors.

---

## 🌐 Custom Domain Setup

To link your custom domain (e.g. `rajabagdi.com` or `bio.rajabagdi.com`):

1. Go to **Vercel Dashboard → Project Settings → Domains**.
2. Add your custom domain (e.g., `bio.rajabagdi.com`).
3. Add the recommended **CNAME** or **A** record in your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.).
4. Vercel automatically issues an SSL certificate within 60 seconds.

---

## ✅ Post-Deployment Verification Checklist

- [x] Visit your production URL (`https://your-domain.vercel.app`).
- [x] Visit `/u/rajabagdi` to verify public bio rendering without login.
- [x] Test clicking links and confirm click analytics are recorded.
- [x] Test the **QR Code** generator modal and verify PNG download.
- [x] Test theme customization and live preview updates.
- [x] In **Settings & SEO**, test exporting a JSON backup file.
