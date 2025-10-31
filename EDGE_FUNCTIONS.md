# ⚡ CineVerse Edge Functions

**Version**: 4.0+ (Planned)  
**Status**: 📋 Planning Phase  
**Runtime**: Deno (Supabase Edge Functions)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Planned Functions](#planned-functions)
3. [Implementation Examples](#implementation-examples)
4. [Deployment Guide](#deployment-guide)
5. [Testing](#testing)
6. [Best Practices](#best-practices)

---

## 🎯 Overview

Supabase Edge Functions, Deno runtime üzerinde çalışan serverless fonksiyonlardır. CineVerse'de AI önerileri, veri işleme ve external API entegrasyonları için kullanılacak.

### Avantajlar

- ⚡ **Düşük Latency**: Edge'de çalışır (kullanıcıya yakın)
- 🔒 **Secure**: Service role key ile çalışır
- 💰 **Cost-effective**: Sadece kullanıldığında ücretlendirilir
- 🦕 **Modern**: Deno runtime (TypeScript native)
- 🌍 **Global**: Otomatik global deployment

### Use Cases

- 🤖 AI-powered film önerileri
- 📊 Veri analizi ve raporlama
- 🔄 TMDB API entegrasyonu
- 📧 Email notifications
- 🎨 Image processing
- 🔐 Webhook handling

---

## 📦 Planned Functions

### V4.0 Functions

| Function | Purpose | Priority | Status |
|----------|---------|----------|--------|
| `recommend-movies` | AI film önerileri | 🔴 High | 📋 Planned |
| `sync-tmdb-movie` | TMDB'den film çekme | 🔴 High | 📋 Planned |
| `generate-summary` | AI ile film özeti | 🟡 Medium | 📋 Planned |
| `send-notification` | Email/push bildirimleri | 🟡 Medium | 📋 Planned |

### V4.5+ Functions

| Function | Purpose | Priority | Status |
|----------|---------|----------|--------|
| `analyze-trends` | Trend analizi | 🟢 Low | ⏳ Backlog |
| `optimize-image` | Görsel optimizasyonu | 🟢 Low | ⏳ Backlog |
| `handle-webhook` | External webhook handler | 🟢 Low | ⏳ Backlog |
| `generate-report` | Aylık rapor oluşturma | 🟢 Low | ⏳ Backlog |

---

## 💻 Implementation Examples

### 1. recommend-movies

**Purpose**: Kullanıcının izleme geçmişine göre AI-powered film önerileri

**Endpoint**: `POST /functions/v1/recommend-movies`

**Request**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "limit": 10
}
```

**Response**:
```json
{
  "recommendations": [
    {
      "movie_id": "234e5678-e89b-12d3-a456-426614174001",
      "title": "Interstellar",
      "score": 0.95,
      "reason": "Similar to Inception (sci-fi, Christopher Nolan)"
    }
  ]
}
```

**Implementation**:
```typescript
// supabase/functions/recommend-movies/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request
    const { user_id, limit = 10 } = await req.json()

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user's watchlist
    const { data: watchlist } = await supabase
      .from('watchlist')
      .select('movie_id, rating')
      .eq('user_id', user_id)
      .eq('status', 'watched')

    if (!watchlist || watchlist.length === 0) {
      // Return popular movies for new users
      const { data: popular } = await supabase
        .from('movies')
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit)

      return new Response(
        JSON.stringify({ recommendations: popular }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get watched movies details
    const movieIds = watchlist.map(w => w.movie_id)
    const { data: watchedMovies } = await supabase
      .from('movies')
      .select('*')
      .in('id', movieIds)

    // Extract genres and directors
    const genres = new Set()
    const directors = new Set()
    
    watchedMovies.forEach(movie => {
      movie.genres?.forEach(g => genres.add(g))
      if (movie.director) directors.add(movie.director)
    })

    // Find similar movies
    const { data: recommendations } = await supabase
      .from('movies')
      .select('*')
      .not('id', 'in', `(${movieIds.join(',')})`)
      .or(`genres.ov.{${Array.from(genres).join(',')}},director.in.(${Array.from(directors).join(',')})`)
      .order('rating', { ascending: false })
      .limit(limit)

    // Calculate recommendation scores
    const scoredRecommendations = recommendations.map(movie => {
      let score = 0
      let reasons = []

      // Genre match
      const genreMatch = movie.genres?.filter(g => genres.has(g)).length || 0
      score += genreMatch * 0.3

      // Director match
      if (directors.has(movie.director)) {
        score += 0.4
        reasons.push(`Same director: ${movie.director}`)
      }

      // Rating bonus
      score += (movie.rating / 5) * 0.3

      return {
        movie_id: movie.id,
        title: movie.title,
        score: Math.min(score, 1).toFixed(2),
        reason: reasons.join(', ') || 'Similar genre'
      }
    })

    // Sort by score
    scoredRecommendations.sort((a, b) => b.score - a.score)

    return new Response(
      JSON.stringify({ recommendations: scoredRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

### 2. sync-tmdb-movie

**Purpose**: TMDB API'den film verisi çekip Supabase'e kaydetme

**Endpoint**: `POST /functions/v1/sync-tmdb-movie`

**Request**:
```json
{
  "tmdb_id": 27205
}
```

**Response**:
```json
{
  "success": true,
  "movie_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Inception"
}
```

**Implementation**:
```typescript
// supabase/functions/sync-tmdb-movie/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY')
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

serve(async (req) => {
  try {
    const { tmdb_id } = await req.json()

    // Fetch from TMDB
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdb_id}?api_key=${TMDB_API_KEY}&language=tr-TR`
    )
    const tmdbMovie = await response.json()

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if movie exists
    const { data: existing } = await supabase
      .from('movies')
      .select('id')
      .eq('tmdb_id', tmdb_id)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Movie already exists',
          movie_id: existing.id 
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Transform TMDB data to our schema
    const movieData = {
      title: tmdbMovie.title,
      original_title: tmdbMovie.original_title,
      year: new Date(tmdbMovie.release_date).getFullYear(),
      rating: tmdbMovie.vote_average / 2, // Convert 0-10 to 0-5
      runtime: tmdbMovie.runtime,
      poster_url: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`,
      backdrop_url: `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`,
      synopsis: tmdbMovie.overview,
      tmdb_id: tmdb_id,
      imdb_id: tmdbMovie.imdb_id,
      genres: tmdbMovie.genres.map(g => g.name),
      release_date: tmdbMovie.release_date,
      language: 'tr',
      status: 'published'
    }

    // Insert into database
    const { data: movie, error } = await supabase
      .from('movies')
      .insert(movieData)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        movie_id: movie.id,
        title: movie.title 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

---

### 3. generate-summary

**Purpose**: OpenAI GPT-4 ile film özeti oluşturma

**Endpoint**: `POST /functions/v1/generate-summary`

**Request**:
```json
{
  "movie_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response**:
```json
{
  "summary": "Inception, rüyalar içinde rüyalar kurarak...",
  "tags": ["Bilim Kurgu", "Aksiyon", "Psikolojik"]
}
```

**Implementation**:
```typescript
// supabase/functions/generate-summary/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  try {
    const { movie_id } = await req.json()

    // Get movie from database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: movie } = await supabase
      .from('movies')
      .select('*')
      .eq('id', movie_id)
      .single()

    if (!movie) {
      throw new Error('Movie not found')
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Sen bir film eleştirmenisin. Filmleri Türkçe olarak özetliyorsun.'
          },
          {
            role: 'user',
            content: `"${movie.title}" (${movie.year}) filmini 2-3 cümle ile özetle. Ayrıca 3-5 etiket öner.`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    })

    const aiResponse = await response.json()
    const summary = aiResponse.choices[0].message.content

    // Update movie with AI-generated summary
    await supabase
      .from('movies')
      .update({ review: summary })
      .eq('id', movie_id)

    return new Response(
      JSON.stringify({ summary }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## 🚀 Deployment Guide

### 1. Setup Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref kkxhdxirjetnohstaciq
```

### 2. Create Function

```bash
# Create new function
supabase functions new recommend-movies

# This creates:
# supabase/functions/recommend-movies/index.ts
```

### 3. Set Environment Variables

```bash
# Set secrets
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set TMDB_API_KEY=your_key

# List secrets
supabase secrets list
```

### 4. Deploy Function

```bash
# Deploy single function
supabase functions deploy recommend-movies

# Deploy all functions
supabase functions deploy

# With environment variables
supabase functions deploy recommend-movies --no-verify-jwt
```

### 5. Test Function

```bash
# Invoke function locally
supabase functions serve recommend-movies

# Test with curl
curl -X POST http://localhost:54321/functions/v1/recommend-movies \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "123e4567-e89b-12d3-a456-426614174000"}'
```

---

## 🧪 Testing

### Local Testing

```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve recommend-movies

# Test in another terminal
curl -X POST http://localhost:54321/functions/v1/recommend-movies \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test-user-id", "limit": 5}'
```

### Production Testing

```bash
# Test production function
curl -X POST https://kkxhdxirjetnohstaciq.supabase.co/functions/v1/recommend-movies \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "real-user-id"}'
```

### Unit Testing (Deno)

```typescript
// supabase/functions/recommend-movies/index.test.ts
import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts'

Deno.test('recommend-movies returns recommendations', async () => {
  const response = await fetch('http://localhost:54321/functions/v1/recommend-movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 'test-id', limit: 5 })
  })
  
  const data = await response.json()
  
  assertEquals(response.status, 200)
  assertEquals(Array.isArray(data.recommendations), true)
})
```

---

## 📚 Best Practices

### 1. Error Handling

```typescript
try {
  // Function logic
} catch (error) {
  console.error('Error:', error)
  return new Response(
    JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }),
    { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    }
  )
}
```

### 2. CORS Headers

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle OPTIONS request
if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders })
}
```

### 3. Input Validation

```typescript
const { user_id, limit } = await req.json()

if (!user_id) {
  return new Response(
    JSON.stringify({ error: 'user_id is required' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  )
}

if (limit && (limit < 1 || limit > 50)) {
  return new Response(
    JSON.stringify({ error: 'limit must be between 1 and 50' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  )
}
```

### 4. Rate Limiting

```typescript
// Use Supabase built-in rate limiting
// Or implement custom rate limiting with Redis
```

### 5. Logging

```typescript
console.log('Function invoked:', {
  user_id,
  timestamp: new Date().toISOString()
})
```

---

## 📊 Monitoring

### Supabase Dashboard

- **Logs**: Real-time function logs
- **Metrics**: Invocation count, duration, errors
- **Traces**: Request/response details

### Custom Monitoring

```typescript
// Log to external service (e.g., Sentry)
import * as Sentry from 'https://deno.land/x/sentry/index.ts'

Sentry.init({ dsn: Deno.env.get('SENTRY_DSN') })

try {
  // Function logic
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

---

## 🔗 Related Documentation

- [API.md](./API.md) - API endpoints
- [AUTH_FLOW.md](./AUTH_FLOW.md) - Authentication flow
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase setup
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)

---

**Version**: 4.0+ (Planned)  
**Status**: 📋 Planning Phase  
**Last Updated**: 31 Ekim 2025
