# 🗄️ Supabase Backend Setup Guide

## 📋 İçindekiler
1. [Supabase Neden?](#supabase-neden)
2. [Proje Kurulumu](#proje-kurulumu)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Storage & CDN](#storage--cdn)
7. [Frontend Entegrasyonu](#frontend-entegrasyonu)
8. [Deployment](#deployment)

---

## 🎯 Supabase Neden?

### Avantajlar
✅ **Postgres Database** - Güçlü, ilişkisel veritabanı  
✅ **Auto-generated REST API** - Instant API endpoints  
✅ **Real-time Subscriptions** - WebSocket desteği  
✅ **Built-in Auth** - Email, OAuth, Magic Links  
✅ **Storage** - S3-compatible file storage  
✅ **Edge Functions** - Serverless functions (Deno)  
✅ **Row Level Security** - Database-level güvenlik  
✅ **Free Tier** - 500MB database, 1GB storage, 2GB bandwidth  

### Strapi vs Supabase

| Özellik | Supabase | Strapi |
|---------|----------|--------|
| **Database** | PostgreSQL (managed) | Any (self-managed) |
| **API** | Auto-generated REST + GraphQL | REST (custom) |
| **Auth** | Built-in | Plugin |
| **Real-time** | ✅ Native | ❌ Requires custom |
| **Hosting** | Managed (free tier) | Self-hosted |
| **Learning Curve** | Düşük | Orta |
| **Scalability** | Yüksek | Orta |

**Karar**: Supabase ✅

---

## 🚀 Proje Kurulumu

### 1. Supabase Projesi Oluştur

```bash
# Supabase'e git: https://supabase.com
# "New Project" oluştur
# Project Name: cineverse
# Database Password: [güçlü şifre]
# Region: Frankfurt (EU) veya en yakın
```

### 2. Supabase CLI Kurulumu

```bash
# NPM ile kurulum
npm install -g supabase

# Login
supabase login

# Proje bağlantısı
supabase link --project-ref [YOUR_PROJECT_REF]

# Local development
supabase start
```

### 3. Environment Variables

`.env.local` oluştur:

```env
# Supabase
VITE_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# Optional
VITE_SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

> **Güvenlik**: `.env.local` dosyasını `.gitignore`'a ekle!

---

## 🗃️ Database Schema

### Tables

#### 1. **movies** (Filmler)

```sql
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  original_title TEXT,
  year INTEGER,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  runtime INTEGER, -- dakika
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  synopsis TEXT,
  review TEXT,
  tmdb_id INTEGER UNIQUE,
  imdb_id TEXT,
  genres TEXT[], -- ['Drama', 'Thriller']
  director TEXT,
  cast TEXT[], -- ['Actor 1', 'Actor 2']
  release_date DATE,
  language TEXT DEFAULT 'tr',
  status TEXT DEFAULT 'published', -- draft, published, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_movies_year ON movies(year);
CREATE INDEX idx_movies_rating ON movies(rating DESC);
CREATE INDEX idx_movies_tmdb_id ON movies(tmdb_id);
CREATE INDEX idx_movies_status ON movies(status);
```

#### 2. **profiles** (Oyuncu/Yönetmen)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  birth_date DATE,
  birth_place TEXT,
  role TEXT NOT NULL, -- 'actor', 'director', 'writer'
  filmography JSONB, -- [{ movie_id: uuid, role: 'lead' }]
  awards TEXT[],
  social_links JSONB, -- { twitter: '', instagram: '' }
  tmdb_id INTEGER UNIQUE,
  language TEXT DEFAULT 'tr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_tmdb_id ON profiles(tmdb_id);
```

#### 3. **news** (Haberler)

```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  thumbnail_url TEXT,
  author TEXT,
  published_date DATE DEFAULT CURRENT_DATE,
  category TEXT, -- 'news', 'review', 'interview'
  tags TEXT[],
  status TEXT DEFAULT 'published',
  views INTEGER DEFAULT 0,
  language TEXT DEFAULT 'tr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published_date ON news(published_date DESC);
CREATE INDEX idx_news_status ON news(status);
```

#### 4. **lists** (Listeler)

```sql
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_url TEXT,
  movie_ids UUID[], -- [uuid1, uuid2, ...]
  category TEXT, -- 'sci-fi', 'cult', 'classic'
  curator TEXT,
  status TEXT DEFAULT 'published',
  language TEXT DEFAULT 'tr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lists_slug ON lists(slug);
CREATE INDEX idx_lists_category ON lists(category);
```

#### 5. **users** (Kullanıcılar - V4.0)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB, -- { theme: 'dark', language: 'tr' }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Watchlist
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'want_to_watch', -- watching, watched, want_to_watch
  rating DECIMAL(2,1),
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Reviews
CREATE TABLE user_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  review TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public movies read" ON movies FOR SELECT USING (status = 'published');
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public news read" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Public lists read" ON lists FOR SELECT USING (status = 'published');

-- Admin write access (V3.0+)
-- CREATE POLICY "Admin movies write" ON movies FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 🔌 API Endpoints

### Auto-generated REST API

Supabase otomatik olarak tüm tablolar için REST API oluşturur:

```javascript
// GET all movies
GET https://[PROJECT_REF].supabase.co/rest/v1/movies?select=*

// GET single movie
GET https://[PROJECT_REF].supabase.co/rest/v1/movies?id=eq.[UUID]

// GET movies with filters
GET https://[PROJECT_REF].supabase.co/rest/v1/movies?year=gte.2020&rating=gte.4.0&order=rating.desc

// GET movies with pagination
GET https://[PROJECT_REF].supabase.co/rest/v1/movies?select=*&limit=10&offset=0
```

### JavaScript Client Kullanımı

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Fetch movies
const { data: movies, error } = await supabase
  .from('movies')
  .select('*')
  .eq('status', 'published')
  .order('rating', { ascending: false })
  .limit(6)

// Fetch single movie with relations
const { data: movie } = await supabase
  .from('movies')
  .select(`
    *,
    profiles!inner(name, photo_url)
  `)
  .eq('id', movieId)
  .single()

// Search movies
const { data: results } = await supabase
  .from('movies')
  .select('*')
  .textSearch('title', searchQuery)
  .limit(10)
```

---

## 🔐 Authentication (V4.0)

### Email + Password

```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      full_name: 'John Doe',
      username: 'johndoe'
    }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### OAuth (Google, Twitter)

```javascript
// Google login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://cineverse.vercel.app/auth/callback'
  }
})

// Twitter login
await supabase.auth.signInWithOAuth({
  provider: 'twitter'
})
```

### Magic Link

```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://cineverse.vercel.app/welcome'
  }
})
```

---

## 📦 Storage & CDN

### Bucket Setup

```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('movie-posters', 'movie-posters', true),
  ('movie-backdrops', 'movie-backdrops', true),
  ('profile-photos', 'profile-photos', true),
  ('news-thumbnails', 'news-thumbnails', true),
  ('user-avatars', 'user-avatars', true);

-- Storage policies
CREATE POLICY "Public read movie posters" ON storage.objects FOR SELECT USING (bucket_id = 'movie-posters');
CREATE POLICY "Authenticated upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');
```

### File Upload

```javascript
// Upload file
const file = event.target.files[0]
const fileName = `${Date.now()}-${file.name}`

const { data, error } = await supabase.storage
  .from('movie-posters')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  })

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('movie-posters')
  .getPublicUrl(fileName)

// Delete file
await supabase.storage
  .from('movie-posters')
  .remove([fileName])
```

### Image Transformation

```javascript
// Resize image on-the-fly
const imageUrl = supabase.storage
  .from('movie-posters')
  .getPublicUrl('poster.jpg', {
    transform: {
      width: 400,
      height: 600,
      resize: 'cover',
      quality: 80
    }
  })
```

---

## 💻 Frontend Entegrasyonu

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Supabase Client Setup

`src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'cineverse'
    }
  }
})
```

### 3. Data Fetching Example

`src/services/movies.js`:

```javascript
import { supabase } from '../lib/supabase'

export async function getMovies(limit = 6) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'published')
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching movies:', error)
    return []
  }

  return data
}

export async function getMovieById(id) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching movie:', error)
    return null
  }

  return data
}

export async function searchMovies(query) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`)
    .limit(10)

  if (error) {
    console.error('Error searching movies:', error)
    return []
  }

  return data
}
```

### 4. Real-time Subscriptions (V4.0+)

```javascript
// Subscribe to new movies
const subscription = supabase
  .channel('movies-channel')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'movies' 
    }, 
    (payload) => {
      console.log('New movie added:', payload.new)
      // Update UI
    }
  )
  .subscribe()

// Unsubscribe
subscription.unsubscribe()
```

---

## 🚀 Deployment

### Vercel Deployment

1. **Environment Variables** (Vercel Dashboard):
   ```
   VITE_SUPABASE_URL=https://[PROJECT_REF].supabase.co
   VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
   ```

2. **Build Settings**:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Database Migrations

```bash
# Create migration
supabase migration new create_movies_table

# Apply migration
supabase db push

# Reset database (local)
supabase db reset
```

---

## 📊 Performance Optimization

### 1. Database Indexes

```sql
-- Already created in schema
-- Add more as needed based on query patterns
CREATE INDEX idx_movies_genres ON movies USING GIN(genres);
CREATE INDEX idx_news_tags ON news USING GIN(tags);
```

### 2. Connection Pooling

Supabase otomatik olarak connection pooling sağlar (PgBouncer).

### 3. Caching Strategy

```javascript
// Client-side caching
const CACHE_TIME = 5 * 60 * 1000 // 5 minutes

let moviesCache = null
let cacheTimestamp = null

export async function getMoviesCached() {
  const now = Date.now()
  
  if (moviesCache && cacheTimestamp && (now - cacheTimestamp < CACHE_TIME)) {
    return moviesCache
  }
  
  const data = await getMovies()
  moviesCache = data
  cacheTimestamp = now
  
  return data
}
```

### 4. Edge Functions (Optional)

```typescript
// supabase/functions/recommend-movies/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { userId } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  // AI recommendation logic
  const recommendations = await getRecommendations(userId)
  
  return new Response(JSON.stringify(recommendations), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## 🔧 Admin Panel (V3.0)

### Option 1: Supabase Studio (Built-in)

- URL: `https://supabase.com/dashboard/project/[PROJECT_REF]`
- Table editor, SQL editor, Auth management
- ✅ Free, no setup required

### Option 2: Custom Admin (V3.5+)

```javascript
// Admin route with RLS bypass
const { data } = await supabase
  .from('movies')
  .select('*')
  .eq('status', 'draft') // Admins can see drafts
```

---

## 📈 Monitoring & Analytics

### Supabase Dashboard

- **Database**: Query performance, table sizes
- **Auth**: User signups, active sessions
- **Storage**: Bandwidth usage, file counts
- **API**: Request counts, response times

### Custom Analytics (V2.5)

```javascript
// Track page views
await supabase
  .from('analytics_events')
  .insert({
    event_type: 'page_view',
    page_url: window.location.pathname,
    user_id: user?.id,
    timestamp: new Date().toISOString()
  })
```

---

## 🎯 Migration Roadmap

### V3.0 (1 ay)
- ✅ Supabase project setup
- ✅ Database schema creation
- ✅ Basic CRUD operations
- ✅ Frontend integration
- ✅ Vercel deployment

### V3.5 (3 hafta)
- ✅ TMDB API → Supabase pipeline
- ✅ Automated content import
- ✅ Image optimization (Cloudinary)
- ✅ Search functionality

### V4.0 (2 ay)
- ✅ Authentication (Email + OAuth)
- ✅ User profiles
- ✅ Watchlist & reviews
- ✅ Real-time features

---

## 🆘 Troubleshooting

### Common Issues

**1. CORS Errors**
```javascript
// Add to supabase client config
{
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
```

**2. RLS Blocking Queries**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE movies DISABLE ROW LEVEL SECURITY;

-- Re-enable after fixing policies
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
```

**3. Connection Limits**
- Free tier: 60 concurrent connections
- Use connection pooling (automatic)
- Implement client-side caching

---

## 📚 Resources

- **Docs**: https://supabase.com/docs
- **Examples**: https://github.com/supabase/supabase/tree/master/examples
- **Discord**: https://discord.supabase.com
- **YouTube**: https://www.youtube.com/@Supabase

---

**Son Güncelleme**: 30 Ekim 2025  
**Durum**: 📋 Planning Phase  
**Next Steps**: V3.0 implementation başlat
