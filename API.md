# 🔌 CineVerse API Documentation

**Version**: 3.1  
**Base URL**: `https://kkxhdxirjetnohstaciq.supabase.co`  
**API Type**: Supabase Auto-generated REST API  
**Authentication**: Anon Key (Public) / Service Role Key (Admin)

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Movies API](#movies-api)
3. [Profiles API](#profiles-api)
4. [News API](#news-api)
5. [Lists API](#lists-api)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Examples](#examples)

---

## 🔐 Authentication

### Headers

```http
apikey: YOUR_SUPABASE_ANON_KEY
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

### JavaScript Client

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kkxhdxirjetnohstaciq.supabase.co',
  'YOUR_ANON_KEY'
)
```

---

## 🎬 Movies API

### Base Endpoint
`/rest/v1/movies`

---

### GET /movies - Get All Movies

**Description**: Tüm yayınlanmış filmleri getirir

**Query Parameters**:
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `select` | string | Döndürülecek kolonlar | `*` veya `id,title,rating` |
| `status` | string | Film durumu | `eq.published` |
| `order` | string | Sıralama | `rating.desc` |
| `limit` | integer | Limit | `10` |
| `offset` | integer | Offset (pagination) | `0` |

**Request**:
```http
GET /rest/v1/movies?select=*&status=eq.published&order=rating.desc&limit=6
```

**Response** (200 OK):
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Inception",
    "original_title": "Inception",
    "year": 2010,
    "rating": 4.8,
    "runtime": 148,
    "poster_url": "https://example.com/inception.jpg",
    "backdrop_url": "https://example.com/inception-backdrop.jpg",
    "trailer_url": "https://youtube.com/watch?v=YoHD9XEInc0",
    "synopsis": "A thief who steals corporate secrets...",
    "review": "Nolan'ın en iyi filmlerinden biri...",
    "tmdb_id": 27205,
    "imdb_id": "tt1375666",
    "genres": ["Sci-Fi", "Thriller", "Action"],
    "director": "Christopher Nolan",
    "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    "release_date": "2010-07-16",
    "language": "tr",
    "status": "published",
    "created_at": "2025-10-31T00:00:00Z",
    "updated_at": "2025-10-31T00:00:00Z"
  }
]
```

**JavaScript Example**:
```javascript
const { data: movies, error } = await supabase
  .from('movies')
  .select('*')
  .eq('status', 'published')
  .order('rating', { ascending: false })
  .limit(6)
```

---

### GET /movies?id=eq.{id} - Get Movie by ID

**Description**: Belirli bir filmi ID ile getirir

**Request**:
```http
GET /rest/v1/movies?id=eq.123e4567-e89b-12d3-a456-426614174000&select=*
```

**Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Inception",
  "rating": 4.8,
  ...
}
```

**JavaScript Example**:
```javascript
const { data: movie, error } = await supabase
  .from('movies')
  .select('*')
  .eq('id', movieId)
  .single()
```

---

### GET /movies - Search Movies

**Description**: Film başlığı veya açıklamasında arama yapar

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `or` | string | OR koşulu ile arama |

**Request**:
```http
GET /rest/v1/movies?select=*&or=(title.ilike.%inception%,synopsis.ilike.%inception%)
```

**JavaScript Example**:
```javascript
const { data: results, error } = await supabase
  .from('movies')
  .select('*')
  .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`)
  .limit(10)
```

---

### GET /movies - Filter by Genre

**Description**: Belirli bir türdeki filmleri getirir

**Request**:
```http
GET /rest/v1/movies?select=*&genres=cs.{Sci-Fi}
```

**JavaScript Example**:
```javascript
const { data: movies, error } = await supabase
  .from('movies')
  .select('*')
  .contains('genres', [genre])
  .eq('status', 'published')
```

---

### GET /movies - Filter by Year Range

**Description**: Belirli yıl aralığındaki filmleri getirir

**Request**:
```http
GET /rest/v1/movies?select=*&year=gte.2020&year=lte.2024
```

**JavaScript Example**:
```javascript
const { data: movies, error } = await supabase
  .from('movies')
  .select('*')
  .gte('year', minYear)
  .lte('year', maxYear)
  .eq('status', 'published')
```

---

### GET /movies - Top Rated Movies

**Description**: En yüksek puanlı filmleri getirir

**JavaScript Example**:
```javascript
const { data: movies, error } = await supabase
  .from('movies')
  .select('*')
  .eq('status', 'published')
  .order('rating', { ascending: false })
  .limit(10)
```

---

## 👤 Profiles API

### Base Endpoint
`/rest/v1/profiles`

---

### GET /profiles - Get All Profiles

**Description**: Tüm profilleri getirir (oyuncu/yönetmen)

**Request**:
```http
GET /rest/v1/profiles?select=*&order=name.asc
```

**Response** (200 OK):
```json
[
  {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "Christopher Nolan",
    "bio": "İngiliz yönetmen, senarist ve yapımcı...",
    "photo_url": "https://example.com/nolan.jpg",
    "birth_date": "1970-07-30",
    "birth_place": "London, UK",
    "role": "director",
    "filmography": [
      {
        "movie_id": "123e4567-e89b-12d3-a456-426614174000",
        "role": "director"
      }
    ],
    "awards": ["Oscar", "BAFTA", "Golden Globe"],
    "social_links": {
      "twitter": "https://twitter.com/...",
      "instagram": "https://instagram.com/..."
    },
    "tmdb_id": 525,
    "language": "tr",
    "created_at": "2025-10-31T00:00:00Z",
    "updated_at": "2025-10-31T00:00:00Z"
  }
]
```

**JavaScript Example**:
```javascript
const { data: profiles, error } = await supabase
  .from('profiles')
  .select('*')
  .order('name', { ascending: true })
```

---

### GET /profiles - Filter by Role

**Description**: Belirli role sahip profilleri getirir

**Request**:
```http
GET /rest/v1/profiles?select=*&role=eq.director
```

**JavaScript Example**:
```javascript
const { data: directors, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('role', 'director')
```

---

### GET /profiles - Search Profiles

**Description**: Profil isimlerinde arama yapar

**JavaScript Example**:
```javascript
const { data: results, error } = await supabase
  .from('profiles')
  .select('*')
  .ilike('name', `%${query}%`)
  .limit(10)
```

---

## 📰 News API

### Base Endpoint
`/rest/v1/news`

---

### GET /news - Get All News

**Description**: Tüm yayınlanmış haberleri getirir

**Request**:
```http
GET /rest/v1/news?select=*&status=eq.published&order=published_date.desc&limit=10
```

**Response** (200 OK):
```json
[
  {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "title": "Yeni Christopher Nolan Filmi Duyuruldu",
    "slug": "yeni-christopher-nolan-filmi",
    "excerpt": "Ünlü yönetmen yeni projesi için hazırlıklara başladı...",
    "content": "Detaylı haber içeriği...",
    "thumbnail_url": "https://example.com/news-thumb.jpg",
    "author": "Ahmet Yılmaz",
    "published_date": "2025-10-31",
    "category": "news",
    "tags": ["Christopher Nolan", "Hollywood", "Yeni Film"],
    "status": "published",
    "views": 1523,
    "language": "tr",
    "created_at": "2025-10-31T00:00:00Z",
    "updated_at": "2025-10-31T00:00:00Z"
  }
]
```

**JavaScript Example**:
```javascript
const { data: news, error } = await supabase
  .from('news')
  .select('*')
  .eq('status', 'published')
  .order('published_date', { ascending: false })
  .limit(10)
```

---

### GET /news - Get News by Slug

**Description**: Belirli bir haberi slug ile getirir

**Request**:
```http
GET /rest/v1/news?slug=eq.yeni-christopher-nolan-filmi&select=*
```

**JavaScript Example**:
```javascript
const { data: article, error } = await supabase
  .from('news')
  .select('*')
  .eq('slug', slug)
  .single()
```

---

### GET /news - Filter by Category

**Description**: Belirli kategorideki haberleri getirir

**Request**:
```http
GET /rest/v1/news?select=*&category=eq.review
```

**JavaScript Example**:
```javascript
const { data: reviews, error } = await supabase
  .from('news')
  .select('*')
  .eq('category', 'review')
  .eq('status', 'published')
```

---

### POST /rpc/increment_news_views - Increment Views

**Description**: Haber görüntülenme sayısını artırır

**Request**:
```http
POST /rest/v1/rpc/increment_news_views
Content-Type: application/json

{
  "news_id": "789e0123-e89b-12d3-a456-426614174002"
}
```

**JavaScript Example**:
```javascript
const { error } = await supabase
  .rpc('increment_news_views', { news_id: newsId })
```

---

## 📝 Lists API

### Base Endpoint
`/rest/v1/lists`

---

### GET /lists - Get All Lists

**Description**: Tüm yayınlanmış listeleri getirir

**Request**:
```http
GET /rest/v1/lists?select=*&status=eq.published
```

**Response** (200 OK):
```json
[
  {
    "id": "012e3456-e89b-12d3-a456-426614174003",
    "title": "En İyi Bilim Kurgu Filmleri",
    "slug": "en-iyi-bilim-kurgu-filmleri",
    "description": "Tüm zamanların en iyi sci-fi filmleri...",
    "cover_url": "https://example.com/scifi-list.jpg",
    "movie_ids": [
      "123e4567-e89b-12d3-a456-426614174000",
      "234e5678-e89b-12d3-a456-426614174001"
    ],
    "category": "sci-fi",
    "curator": "CineVerse Editörleri",
    "status": "published",
    "language": "tr",
    "created_at": "2025-10-31T00:00:00Z",
    "updated_at": "2025-10-31T00:00:00Z"
  }
]
```

**JavaScript Example**:
```javascript
const { data: lists, error } = await supabase
  .from('lists')
  .select('*')
  .eq('status', 'published')
```

---

### GET /lists - Get List by Slug

**Description**: Belirli bir listeyi slug ile getirir

**JavaScript Example**:
```javascript
const { data: list, error } = await supabase
  .from('lists')
  .select('*')
  .eq('slug', slug)
  .single()
```

---

### GET /lists - Filter by Category

**Description**: Belirli kategorideki listeleri getirir

**JavaScript Example**:
```javascript
const { data: lists, error } = await supabase
  .from('lists')
  .select('*')
  .eq('category', category)
  .eq('status', 'published')
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "code": "PGRST116",
  "message": "The result contains 0 rows",
  "details": null,
  "hint": null
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `PGRST116` | No rows found | Check query parameters |
| `PGRST301` | Invalid JWT | Check authentication |
| `42P01` | Table does not exist | Check table name |
| `23505` | Unique constraint violation | Check duplicate data |

### JavaScript Error Handling

```javascript
try {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
  
  if (error) {
    console.error('Supabase error:', error)
    throw new Error('Failed to fetch movies')
  }
  
  return data
} catch (err) {
  console.error('Unexpected error:', err)
  return []
}
```

---

## ⚡ Rate Limiting

### Free Tier Limits
- **API Requests**: Unlimited
- **Database Size**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **Concurrent Connections**: 60

### Best Practices
1. **Client-side Caching**: Cache frequently accessed data
2. **Pagination**: Use `limit` and `offset` for large datasets
3. **Selective Queries**: Only select needed columns
4. **Debounce**: Debounce search inputs

---

## 📚 Examples

### Complete Movie Fetch Example

```javascript
import { supabase } from './lib/supabase.js'

async function fetchMoviesWithDetails() {
  try {
    // Fetch movies with loading state
    const { data: movies, error } = await supabase
      .from('movies')
      .select('*')
      .eq('status', 'published')
      .order('rating', { ascending: false })
      .limit(6)
    
    if (error) throw error
    
    return movies
  } catch (error) {
    console.error('Error fetching movies:', error)
    return []
  }
}

// Usage
const movies = await fetchMoviesWithDetails()
console.log('Fetched movies:', movies)
```

---

### Search with Debounce Example

```javascript
let searchTimeout

function debounceSearch(query) {
  clearTimeout(searchTimeout)
  
  searchTimeout = setTimeout(async () => {
    const { data: results } = await supabase
      .from('movies')
      .select('*')
      .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`)
      .limit(10)
    
    displaySearchResults(results)
  }, 300) // 300ms debounce
}

// Usage
searchInput.addEventListener('input', (e) => {
  debounceSearch(e.target.value)
})
```

---

### Pagination Example

```javascript
const PAGE_SIZE = 10

async function fetchMoviesPage(page = 0) {
  const { data: movies, error, count } = await supabase
    .from('movies')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('rating', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
  
  return {
    movies,
    totalPages: Math.ceil(count / PAGE_SIZE),
    currentPage: page
  }
}

// Usage
const { movies, totalPages } = await fetchMoviesPage(0)
```

---

### Real-time Subscription Example (V4.0)

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
      addMovieToUI(payload.new)
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

---

## 🔗 Related Documentation

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase kurulum rehberi
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment kılavuzu
- [PROJE_RAPORU.md](./PROJE_RAPORU.md) - Proje raporu
- [Supabase API Docs](https://supabase.com/docs/guides/api)

---

## 📞 Support

**Proje**: CineVerse  
**GitHub**: https://github.com/alpeki/cineverse  
**Version**: 3.1  
**Last Updated**: 31 Ekim 2025

---

**🎬 Happy Coding!**
