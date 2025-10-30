# 🚀 CineVerse Deployment Guide

## 📋 Prerequisites

1. **Supabase Account**: https://supabase.com
2. **Node.js**: v18+ installed
3. **Git**: For version control

---

## 🗄️ Supabase Setup

### 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   - **Name**: cineverse
   - **Database Password**: [secure password]
   - **Region**: Frankfurt (EU) or closest to you

### 2. Run Database Migrations

**Option A: Using Supabase Dashboard (SQL Editor)**

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste `supabase/migrations/20251031_initial_schema.sql`
3. Click "Run"
4. Copy and paste `supabase/migrations/20251031_seed_data.sql`
5. Click "Run"

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy `Project URL` and `anon/public` key

3. Update `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 4. Set Up Storage Buckets (Optional)

Run this in SQL Editor:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('movie-posters', 'movie-posters', true),
  ('movie-backdrops', 'movie-backdrops', true),
  ('profile-photos', 'profile-photos', true),
  ('news-thumbnails', 'news-thumbnails', true);

-- Storage policies
CREATE POLICY "Public read movie posters" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'movie-posters');

CREATE POLICY "Public read movie backdrops" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'movie-backdrops');

CREATE POLICY "Public read profile photos" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Public read news thumbnails" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'news-thumbnails');
```

---

## 💻 Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Test Supabase Connection

Open browser console and check for:
```
✅ Supabase connection successful
```

---

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

4. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add the same variables as Vercel

### Option 3: GitHub Pages (Static Only)

```bash
npm run build
# Push dist/ folder to gh-pages branch
```

---

## 🔧 Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Sample data loaded
- [ ] Environment variables configured
- [ ] Supabase connection tested
- [ ] Storage buckets created (if using images)
- [ ] RLS policies enabled
- [ ] Site accessible via production URL
- [ ] No console errors
- [ ] Test all features (movies, profiles, news, lists)

---

## 🐛 Troubleshooting

### Issue: "Supabase credentials missing"

**Solution**: Make sure `.env.local` exists and contains valid credentials.

### Issue: "CORS error"

**Solution**: Add your domain to Supabase allowed origins:
1. Go to Authentication → URL Configuration
2. Add your production URL to "Site URL"

### Issue: "RLS blocking queries"

**Solution**: Check RLS policies in Supabase dashboard:
```sql
-- Temporarily disable for testing
ALTER TABLE movies DISABLE ROW LEVEL SECURITY;
```

### Issue: "Migration failed"

**Solution**: 
1. Check SQL syntax
2. Ensure UUID extension is enabled
3. Run migrations in order (schema first, then seed data)

---

## 📊 Monitoring

### Supabase Dashboard

- **Database**: Monitor query performance
- **Auth**: Track user signups (V4.0+)
- **Storage**: Check bandwidth usage
- **API**: View request counts

### Vercel Analytics

- Enable in Vercel dashboard
- Track page views and performance

---

## 🔄 Updates & Maintenance

### Update Database Schema

1. Create new migration file:
   ```bash
   supabase migration new your_migration_name
   ```

2. Write SQL changes

3. Apply migration:
   ```bash
   supabase db push
   ```

### Update Dependencies

```bash
npm update
npm audit fix
```

### Rollback (if needed)

```bash
supabase db reset
# Then re-run migrations
```

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Vercel Docs](https://vercel.com/docs)

---

**Last Updated**: 31 October 2025  
**Version**: 3.0  
**Status**: ✅ Ready for Deployment
