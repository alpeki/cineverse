# 🎬 CineVerse — Dizi & Film Kültür Sitesi

Modern, sinematik bir dizi ve film kültür platformu. LandoNorris.com tarzında smooth scroll ve sahne geçişleriyle zenginleştirilmiş tek sayfalık deneyim.

![Version](https://img.shields.io/badge/version-2.0-red)
![Status](https://img.shields.io/badge/status-production-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Özellikler

### 🎨 Tasarım
- **Koyu Tema**: Netflix tarzı (#0E0E0E arka plan, #E50914 accent)
- **Space Grotesk Font**: Modern ve okunabilir tipografi
- **Responsive**: Mobil, tablet ve desktop uyumlu
- **Smooth Scroll**: Lenis ile akıcı kaydırma deneyimi

### 🎭 Bölümler
1. **Hero**: Tam ekran video arka plan + CTA
2. **İncelemeler**: 3x2 film/dizi kartları (poster, yıldız, özet)
3. **Fragmanlar**: YouTube embed carousel
4. **Listeler**: Full-width görseller + modal detaylar
5. **Profiller**: Oyuncu/yönetmen grid + biyografi modalları
6. **Haberler**: 3 sütun haber kartları
7. **Footer**: Minimal tasarım + sosyal medya

### ⚡ Animasyonlar (V2.0)
- **GSAP ScrollTrigger**: Section crossfade + scale transitions
- **Parallax Effects**: Hero video ve list images (throttled)
- **Card Tilt**: 3D perspective hover effect
- **Card Glow**: Radial gradient hover animation
- **Stagger Animations**: Cards fade-in with delay
- **Smooth Scroll**: Lenis (duration: 0.8s, lerp: 0.12)
- **Fast Navigation**: Optimized anchor link transitions (1.0s)
- Modal açılış/kapanış animasyonları
- Lazy loading görseller + video

---

## 🚀 Kurulum

### Gereksinimler
- Modern web tarayıcı (Chrome, Firefox, Safari, Edge)
- Yerel sunucu (Live Server, Python HTTP Server, vb.)

### Adımlar

1. **Projeyi İndir**
```bash
git clone https://github.com/username/cineverse.git
cd cineverse
```

2. **Assets Ekle**
```
/assets
  /images
    - movie1.jpg → movie6.jpg (film posterleri)
    - profile1.jpg → profile8.jpg (profil fotoları)
    - list-scifi.jpg, list-cult.jpg (liste görselleri)
    - news1.jpg → news3.jpg (haber görselleri)
    - og-cover.jpg (sosyal medya paylaşım görseli)
  /videos
    - intro.mp4 (hero video)
```

3. **Yerel Sunucu Başlat**

**VS Code Live Server:**
```
Sağ tık → Open with Live Server
```

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx serve
```

4. **Tarayıcıda Aç**
```
http://localhost:8000
```

### 🛠️ Geliştirme (Gelecek)

Şu anda CDN üzerinden çalışıyoruz. İleride build sistemi için:

```bash
# Dependencies yükle
npm install

# Development server
npm run dev

# Production build
npm run build
```

**package.json** (planlanan):
```json
{
  "dependencies": {
    "@studio-freight/lenis": "^1.0.29",
    "gsap": "^3.12.2",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

> **Not**: V3.0'da build sistemi ve npm workflow'u eklenecek.

---

## 🎬 Demo

[![CineVerse Scroll Showcase](./assets/images/demo-placeholder.gif)](https://github.com/alpeki/cineverse)

> **Demo GIF**: Smooth scroll, parallax ve card animations showcase (yakında eklenecek)

---

## 📁 Dosya Yapısı

```
cineverse/
├── index.html              # Ana HTML dosyası
├── style.css               # Custom CSS stilleri
├── script.js               # JavaScript (Lenis, GSAP, Modal)
├── gelecek-gelistirmeler.md # Roadmap
├── README.md               # Bu dosya
└── assets/
    ├── images/             # Görseller
    │   ├── movie1.jpg
    │   ├── profile1.jpg
    │   └── ...
    └── videos/             # Videolar
        └── intro.mp4
```

---

## 🛠️ Teknolojiler

### Frontend
- **HTML5**: Semantic markup + preload optimization
- **TailwindCSS**: Utility-first CSS (CDN)
- **Vanilla JavaScript**: Modüler ve performanslı
- **CSS3**: will-change, transform optimizations

### Kütüphaneler (CDN)
- **Lenis**: Smooth scroll ([studio-freight/lenis](https://github.com/studio-freight/lenis))
- **GSAP**: Animasyon motoru ([greensock.com](https://greensock.com))
- **ScrollTrigger**: Scroll-based animasyonlar

### Font
- **Space Grotesk**: Google Fonts

---

## 🎨 Renk Paleti

```css
--bg-primary: #0E0E0E;      /* Koyu arka plan */
--text-primary: #F2F2F2;    /* Açık metin */
--accent: #E50914;          /* Netflix kırmızısı */
--accent-hover: #B20710;    /* Hover durumu */
--overlay: rgba(14, 14, 14, 0.85); /* Modal overlay */
```

---

## 📸 Görsel Gereksinimleri

### Film Posterleri (movie1-6.jpg)
- **Boyut**: 400x600px (2:3 oran)
- **Format**: JPG/PNG
- **Optimizasyon**: <200KB

### Profil Fotoları (profile1-8.jpg)
- **Boyut**: 300x400px
- **Format**: JPG/PNG
- **Stil**: Portre, yüksek kontrast

### Liste Görselleri (list-scifi.jpg, list-cult.jpg)
- **Boyut**: 800x400px (2:1 oran)
- **Format**: JPG
- **Stil**: Sinematik, koyu tonlar

### Haber Görselleri (news1-3.jpg)
- **Boyut**: 600x400px (3:2 oran)
- **Format**: JPG

### Hero Video (intro.mp4)
- **Boyut**: 1920x1080px (Full HD)
- **Süre**: 10-30 saniye (loop)
- **Format**: MP4 (H.264)
- **Boyut**: <10MB

---

## 🔧 Özelleştirme

### Renkleri Değiştir
`index.html` içinde Tailwind config:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'accent': '#YOUR_COLOR',
            }
        }
    }
}
```

### Font Değiştir
`index.html` head bölümünde:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

### Animasyon Hızı
`script.js` içinde:
```javascript
const lenis = new Lenis({
    duration: 1.2,  // Daha hızlı: 0.8, Daha yavaş: 2.0
    lerp: 0.08      // Daha smooth: 0.05, Daha hızlı: 0.15
});
```

---

## 🐛 Bilinen Sorunlar

1. **Video Autoplay**: Bazı tarayıcılarda autoplay çalışmayabilir (muted olmalı)
2. **Modal Scroll**: iOS Safari'de body scroll lock sorunları olabilir
3. **Lazy Loading**: Eski tarayıcılarda IntersectionObserver desteklenmez

---

## 📈 Performans

### Lighthouse Skorları (Hedef)
- **Performance**: 95+ (✅ Optimized)
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

### ✅ Uygulanmış Optimizasyonlar
- ✅ Preload kritik assets (Lenis, GSAP, CSS, JS)
- ✅ Lazy load video (preload="metadata")
- ✅ CSS will-change properties
- ✅ Transform-based animations (GPU acceleration)
- ✅ Intersection Observer (lazy images)
- ✅ Throttled scroll events (requestAnimationFrame)
- ✅ Faster scroll speed (0.8s duration, 0.12 lerp)
- ✅ No custom cursor (native performance)

### Gelecek Optimizasyonlar
- [ ] Görselleri WebP formatına çevir
- [ ] CDN kullan (Cloudflare)
- [ ] Gzip/Brotli compression
- [ ] Service Worker (PWA)

---

## 🗺️ Roadmap

Detaylı geliştirme planı için: [gelecek-gelistirmeler.md](./gelecek-gelistirmeler.md)

**Kısa Özet:**
- **V2.0**: ✅ Gelişmiş animasyonlar (Tamamlandı)
- **V2.5**: Testing & CI/CD (2 hafta)
- **V3.0**: Headless CMS (1 ay)
- **V3.5**: CMS + AI pipeline (3 hafta)
- **V4.0**: Kullanıcı sistemi (2 ay)
- **V5.0**: Monetization (3 ay)
- **V6.0**: Mobile App (4 ay)
- **V7.0**: Globalization (5 ay)

### 📊 Stratejik Roadmap

| Faz | Odak | Not |
|-----|------|-----|
| **V2.5** | CI/CD + Testing + Analytics | Performans ölçümünü erken başlat |
| **V3.0** | CMS (Strapi/Supabase) | Dinamik içerik + Build system |
| **V3.5** | AI + CMS birleşimi | TMDB + OpenAI pipeline |
| **V4.0** | Kullanıcı sistemi | Auth + Watchlist + AI öneriler |
| **V5.0** | Premium & Monetization | Stripe + Premium content |
| **V6.0** | Mobile App | React Native (iOS + Android) |
| **V7.0** | Globalization & Smart Platforms | i18n + Desktop + Voice |

---

## 🤝 Katkıda Bulunma

**⚠️ Önemli**: Pull Request açmadan önce lütfen bir **Issue** oluşturun ve önerinizi tartışın.

### Katkı Adımları

1. **Issue Oluştur**
   - Bug report veya feature request açın
   - Detaylı açıklama ve örnekler ekleyin
   - Maintainer onayını bekleyin

2. **Fork & Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Standards**
   ```bash
   git commit -m "feat: Add amazing feature"
   # veya
   git commit -m "fix: Resolve scroll bug"
   ```

4. **Push & PR**
   ```bash
   git push origin feature/amazing-feature
   ```
   - Pull Request açın
   - Issue numarasını referans verin (#123)
   - Screenshot/GIF ekleyin (UI değişiklikleri için)

5. **Code Review**
   - Feedback'leri bekleyin
   - Gerekli değişiklikleri yapın
   - Merge onayını alın

### Commit Konvansiyonları
- `feat:` - Yeni özellik
- `fix:` - Bug fix
- `docs:` - Dokümantasyon
- `style:` - Formatla, stil
- `refactor:` - Code refactoring
- `perf:` - Performans iyileştirmesi
- `test:` - Test ekleme
- `chore:` - Build, dependencies

---

## 🔗 SEO & Link Önizleme

[![CineVerse Preview](./assets/images/og-cover.jpg)](https://cineverse.vercel.app)

**Open Graph Meta Tags:**
```html
<meta property="og:title" content="CineVerse – Dizi & Film Kültür Sitesi">
<meta property="og:description" content="Sinema ve dizi kültürünün kalbi.">
<meta property="og:image" content="/assets/images/og-cover.jpg">
<meta property="og:type" content="website">
```

> **Not**: `og-cover.jpg` (1200x630px) sosyal medya paylaşımları için optimize edilmiştir.

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

## 👨‍💻 Geliştirici

**CineVerse Team**  
👨‍💻 GitHub: [@alpeki](https://github.com/alpeki)  
🌐 Repository: [github.com/alpeki/cineverse](https://github.com/alpeki/cineverse)

---

## 🙏 Teşekkürler

- [Lenis](https://github.com/studio-freight/lenis) - Smooth scroll
- [GSAP](https://greensock.com) - Animasyon motoru
- [TailwindCSS](https://tailwindcss.com) - CSS framework
- [LandoNorris.com](https://landonorris.com) - Tasarım ilhamı

---

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**
