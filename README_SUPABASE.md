# 🎯 Supabase Quick Start Guide

Bu dosya, projeyi hızlıca çalıştırmak için gerekli adımları içerir.

## ⚡ Hızlı Başlangıç

### 1. Dependencies Yükle

```bash
npm install
```

### 2. Environment Variables

`.env.local` dosyası oluştur ve Supabase bilgilerini ekle:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

> **Not**: Bu bilgileri SUPABASE_SETUP.md dosyasından alabilirsiniz.

### 3. Database Setup

Supabase Dashboard'da SQL Editor'ü aç ve şu dosyaları sırayla çalıştır:

1. `supabase/migrations/20251031_initial_schema.sql`
2. `supabase/migrations/20251031_seed_data.sql`

### 4. Development Server

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

---

## 📁 Yeni Dosya Yapısı

```
cineverse/
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase client
│   └── services/
│       ├── movies.js            # Film servisleri
│       ├── profiles.js          # Profil servisleri
│       ├── news.js              # Haber servisleri
│       └── lists.js             # Liste servisleri
├── supabase/
│   └── migrations/
│       ├── 20251031_initial_schema.sql
│       └── 20251031_seed_data.sql
├── package.json                 # Dependencies
├── vite.config.js              # Vite config
├── .env.local                  # Environment variables (create this)
└── .env.example                # Example env file
```

---

## 🔌 Supabase Servisleri Kullanımı

### Movies Service

```javascript
import { getMovies, getMovieById, searchMovies } from './src/services/movies.js'

// Tüm filmleri getir
const movies = await getMovies(6)

// ID ile film getir
const movie = await getMovieById('uuid-here')

// Film ara
const results = await searchMovies('blade runner')
```

### Profiles Service

```javascript
import { getProfiles, getProfilesByRole } from './src/services/profiles.js'

// Tüm profilleri getir
const profiles = await getProfiles(8)

// Yönetmenleri getir
const directors = await getProfilesByRole('director')
```

### News Service

```javascript
import { getNews, getNewsByCategory } from './src/services/news.js'

// Son haberleri getir
const news = await getNews(3)

// İncelemeleri getir
const reviews = await getNewsByCategory('review')
```

### Lists Service

```javascript
import { getLists, getListBySlug } from './src/services/lists.js'

// Tüm listeleri getir
const lists = await getLists()

// Slug ile liste getir
const list = await getListBySlug('en-iyi-bilim-kurgu-filmleri')
```

---

## 🎨 Frontend Entegrasyonu (Sonraki Adım)

Mevcut `index.html` ve `script.js` dosyalarını Supabase ile entegre etmek için:

1. Script.js'e import ekle:
   ```javascript
   import { getMovies } from './src/services/movies.js'
   ```

2. Statik veriyi dinamik veri ile değiştir:
   ```javascript
   // Eski (statik)
   const movies = [...]
   
   // Yeni (dinamik)
   const movies = await getMovies(6)
   ```

3. HTML'i güncelle:
   ```javascript
   movies.forEach(movie => {
     // Render movie cards
   })
   ```

---

## ✅ Kontrol Listesi

- [ ] `npm install` çalıştırıldı
- [ ] `.env.local` oluşturuldu ve dolduruldu
- [ ] Database migrations çalıştırıldı
- [ ] Sample data yüklendi
- [ ] `npm run dev` ile server başlatıldı
- [ ] Tarayıcı console'da "✅ Supabase connection successful" görüldü

---

## 🆘 Sorun mu var?

1. **Supabase bağlantı hatası**: `.env.local` dosyasını kontrol et
2. **Migration hatası**: SQL dosyalarını sırayla çalıştırdığından emin ol
3. **CORS hatası**: Supabase dashboard'da URL ayarlarını kontrol et

Detaylı troubleshooting için: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Hazırlayan**: CineVerse Team  
**Tarih**: 31 Ekim 2025  
**Versiyon**: 3.0
