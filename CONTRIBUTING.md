# 🤝 Contributing to CineVerse

**Teşekkürler!** CineVerse'e katkıda bulunmak istediğiniz için çok teşekkür ederiz. Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Nasıl Katkıda Bulunurum?](#nasıl-katkıda-bulunurum)
3. [Development Setup](#development-setup)
4. [Branch Strategy](#branch-strategy)
5. [Commit Standards](#commit-standards)
6. [Pull Request Process](#pull-request-process)
7. [Code Style Guide](#code-style-guide)
8. [Testing Guidelines](#testing-guidelines)
9. [Documentation](#documentation)

---

## 📜 Code of Conduct

### Davranış Kuralları

- **Saygılı Olun**: Tüm katkıda bulunanlara saygılı davranın
- **Yapıcı Olun**: Eleştirilerinizi yapıcı bir şekilde iletin
- **Kapsayıcı Olun**: Farklı bakış açılarına açık olun
- **Profesyonel Olun**: Profesyonel bir dil kullanın

### Kabul Edilemez Davranışlar

- Hakaret, aşağılama veya taciz
- Spam veya reklam
- Başkalarının kişisel bilgilerini paylaşma
- Projeye zarar verecek davranışlar

---

## 🚀 Nasıl Katkıda Bulunurum?

### 1. Issue Oluşturma

Katkıda bulunmadan önce **mutlaka** bir issue oluşturun:

#### Bug Report

```markdown
**Bug Açıklaması**
Kısa ve net bir açıklama

**Nasıl Tekrarlanır**
1. '...' sayfasına git
2. '...' butonuna tıkla
3. Hatayı gör

**Beklenen Davranış**
Ne olmasını bekliyordunuz?

**Screenshots**
Varsa ekran görüntüleri ekleyin

**Ortam**
- OS: [örn. Windows 11]
- Browser: [örn. Chrome 120]
- Version: [örn. 3.1]
```

#### Feature Request

```markdown
**Özellik Açıklaması**
Eklemek istediğiniz özelliği açıklayın

**Motivasyon**
Bu özellik neden gerekli?

**Önerilen Çözüm**
Nasıl implement edilebilir?

**Alternatifler**
Düşündüğünüz alternatif çözümler

**Ek Bilgi**
Mockup, diagram, vb.
```

### 2. Issue Onayı Bekleme

- Maintainer'lar issue'nuzu inceleyecek
- Gerekirse ek bilgi isteyebilir
- Onay aldıktan sonra çalışmaya başlayın

### 3. Fork & Clone

```bash
# Fork the repository (GitHub'da Fork butonuna tıklayın)

# Clone your fork
git clone https://github.com/YOUR_USERNAME/cineverse.git
cd cineverse

# Add upstream remote
git remote add upstream https://github.com/alpeki/cineverse.git
```

### 4. Branch Oluşturma

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/amazing-feature
# veya
git checkout -b fix/bug-description
```

### 5. Değişiklik Yapma

- Kod yazın
- Test edin
- Commit edin
- Push edin

### 6. Pull Request Açma

- GitHub'da Pull Request açın
- Template'i doldurun
- Review bekleyin

---

## 💻 Development Setup

### Gereksinimler

- **Node.js**: v18+ (https://nodejs.org)
- **npm**: v9+
- **Git**: Latest version
- **Supabase Account**: https://supabase.com

### Kurulum Adımları

```bash
# 1. Dependencies yükle
npm install

# 2. Environment variables
cp .env.example .env.local
# .env.local dosyasını düzenle

# 3. Husky setup
npm run prepare

# 4. Development server
npm run dev
```

### Supabase Setup

```bash
# 1. Supabase Dashboard'da yeni proje oluştur
# 2. SQL Editor'de migrations'ları çalıştır
# 3. .env.local'e credentials ekle
```

Detaylı kurulum: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 🌿 Branch Strategy

### Branch İsimlendirme

```
feature/feature-name    # Yeni özellik
fix/bug-description     # Bug fix
docs/update-readme      # Dokümantasyon
refactor/code-cleanup   # Refactoring
test/add-unit-tests     # Test ekleme
chore/update-deps       # Dependencies, build
```

### Branch Kuralları

- **main**: Production-ready kod
- **develop**: Development branch (şu an yok)
- **feature/***: Yeni özellikler
- **fix/***: Bug fixes
- **hotfix/***: Acil production fixes

### Örnek Workflow

```bash
# Feature branch
git checkout -b feature/search-functionality

# Değişiklik yap
git add .
git commit -m "feat: Add search functionality"

# Push
git push origin feature/search-functionality

# Pull Request aç
```

---

## 📝 Commit Standards

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Açıklama | Örnek |
|------|----------|-------|
| `feat` | Yeni özellik | `feat: Add search bar` |
| `fix` | Bug fix | `fix: Resolve scroll issue` |
| `docs` | Dokümantasyon | `docs: Update README` |
| `style` | Formatla, stil | `style: Fix indentation` |
| `refactor` | Code refactoring | `refactor: Simplify API calls` |
| `perf` | Performans | `perf: Optimize image loading` |
| `test` | Test ekleme | `test: Add unit tests for movies` |
| `chore` | Build, deps | `chore: Update dependencies` |

### Scope (Opsiyonel)

```
feat(movies): Add filter by genre
fix(auth): Resolve login redirect
docs(api): Update endpoint examples
```

### Subject

- Küçük harfle başla
- Nokta ile bitirme
- 50 karakter veya daha az
- Imperative mood kullan ("Add" not "Added")

### Body (Opsiyonel)

- Ne değişti ve neden?
- 72 karakter satır uzunluğu

### Footer (Opsiyonel)

- Breaking changes
- Issue referansları

### Örnekler

**Basit Commit**:
```bash
git commit -m "feat: Add search functionality"
```

**Detaylı Commit**:
```bash
git commit -m "feat(movies): Add advanced filter system

- Add genre filter dropdown
- Add year range slider
- Add rating filter
- Update UI with filter results

Closes #42"
```

**Bug Fix**:
```bash
git commit -m "fix: Resolve modal scroll lock on iOS

Modal was not preventing body scroll on iOS Safari.
Added touch-action: none to modal overlay.

Fixes #38"
```

---

## 🔄 Pull Request Process

### PR Oluşturma

1. **Issue Referansı**: PR'da issue numarasını belirt
2. **Açıklama**: Ne değişti, neden değişti?
3. **Screenshots**: UI değişiklikleri için ekran görüntüsü
4. **Checklist**: Aşağıdaki checklist'i tamamla

### PR Template

```markdown
## Açıklama
Bu PR'da ne değişti?

## İlgili Issue
Closes #42

## Değişiklik Tipi
- [ ] Bug fix
- [ ] Yeni özellik
- [ ] Breaking change
- [ ] Dokümantasyon

## Checklist
- [ ] Kod test edildi
- [ ] Testler eklendi/güncellendi
- [ ] Dokümantasyon güncellendi
- [ ] Commit mesajları standartlara uygun
- [ ] Lint hatası yok
- [ ] Build başarılı

## Screenshots (UI değişiklikleri için)
Ekran görüntüleri ekleyin

## Ek Notlar
Varsa ek bilgiler
```

### Review Süreci

1. **Otomatik Kontroller**: CI/CD pipeline çalışır
   - Linting
   - Unit tests
   - E2E tests
   - Build
2. **Code Review**: Maintainer'lar kodu inceler
3. **Feedback**: Gerekirse değişiklik istenir
4. **Approval**: Onay alındıktan sonra merge edilir

### PR Kuralları

- ✅ **Küçük PR'lar**: Tek bir özellik/fix
- ✅ **Test Edilmiş**: Tüm testler geçmeli
- ✅ **Dokümante**: Gerekirse dokümantasyon ekle
- ✅ **Conflict-free**: Merge conflict olmamalı
- ❌ **WIP PR**: Work-in-progress PR açma

---

## 🎨 Code Style Guide

### JavaScript

#### Naming Conventions

```javascript
// Variables & Functions: camelCase
const movieTitle = 'Inception'
function fetchMovies() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://...'
const MAX_RETRIES = 3

// Classes: PascalCase
class MovieService {}

// Private: _prefix
const _privateFunction = () => {}
```

#### Code Style

```javascript
// ✅ Good
async function fetchMovies() {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// ❌ Bad
async function fetchMovies(){
  const {data,error}=await supabase.from('movies').select('*')
  if(error)throw error
  return data
}
```

### HTML

```html
<!-- ✅ Good: Semantic, indented -->
<section class="movies-section">
  <h2 class="section-title">Featured Movies</h2>
  <div class="movie-grid">
    <article class="movie-card">
      <img src="poster.jpg" alt="Movie Title" loading="lazy">
      <h3>Movie Title</h3>
    </article>
  </div>
</section>

<!-- ❌ Bad: Non-semantic, not indented -->
<div class="movies">
<div class="title">Featured Movies</div>
<div class="grid">
<div class="card">
<img src="poster.jpg">
<div>Movie Title</div>
</div>
</div>
</div>
```

### CSS

```css
/* ✅ Good: BEM naming, organized */
.movie-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.movie-card__image {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.movie-card__title {
  font-size: 1.25rem;
  font-weight: 600;
}

/* ❌ Bad: Generic names, unorganized */
.card {
  display: flex;
}
.img {
  width: 100%;
}
.title {
  font-size: 1.25rem;
}
```

### ESLint & Prettier

Projede ESLint ve Prettier kullanılıyor:

```bash
# Lint check
npm run lint

# Lint fix
npm run lint:fix

# Format check
npm run format:check

# Format code
npm run format
```

**Pre-commit hook** otomatik olarak lint ve format kontrolü yapar.

---

## 🧪 Testing Guidelines

### Test Yazma

```javascript
// tests/unit/movies.test.js
import { describe, it, expect } from '@jest/globals'
import { getMovies } from '../../src/services/movies.js'

describe('Movies Service', () => {
  it('should fetch movies successfully', async () => {
    const movies = await getMovies(6)
    
    expect(movies).toBeDefined()
    expect(Array.isArray(movies)).toBe(true)
    expect(movies.length).toBeLessThanOrEqual(6)
  })
  
  it('should return empty array on error', async () => {
    // Test error handling
  })
})
```

### Test Çalıştırma

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# All tests
npm test

# Watch mode
npm run test:unit:watch

# Coverage
npm run test:unit:coverage
```

### Test Coverage

- **Hedef**: %70+ coverage
- **Zorunlu**: Yeni özellikler için test yazın
- **Önerilen**: Bug fix'ler için regression test

---

## 📚 Documentation

### Dokümantasyon Güncelleme

Aşağıdaki durumlarda dokümantasyon güncelleyin:

- ✅ Yeni özellik eklendi
- ✅ API değişti
- ✅ Kurulum adımları değişti
- ✅ Yeni dependency eklendi

### Dokümantasyon Dosyaları

| Dosya | İçerik |
|-------|--------|
| `README.md` | Genel proje bilgisi |
| `API.md` | API endpoint dokümantasyonu |
| `SUPABASE_SETUP.md` | Supabase kurulum |
| `DEPLOYMENT.md` | Deployment rehberi |
| `CONTRIBUTING.md` | Bu dosya |

### Code Comments

```javascript
// ✅ Good: Açıklayıcı comment
// Fetch top-rated movies for homepage hero section
const movies = await getTopRatedMovies(6)

// ❌ Bad: Gereksiz comment
// Get movies
const movies = await getMovies()
```

### JSDoc (Opsiyonel)

```javascript
/**
 * Fetch movies from Supabase
 * @param {number} limit - Maximum number of movies to fetch
 * @returns {Promise<Array>} Array of movie objects
 */
async function getMovies(limit = 6) {
  // ...
}
```

---

## 🎯 Contribution Areas

### 🔴 Yüksek Öncelik

- Frontend-backend entegrasyonu
- Loading states UI
- Error handling UI
- Search functionality
- Performance optimization

### 🟡 Orta Öncelik

- Filter system
- Pagination
- SEO optimization
- Test coverage artırma
- Dokümantasyon iyileştirme

### 🟢 Düşük Öncelik

- Dark mode toggle
- Category pages
- Advanced filters
- Social sharing
- Animations iyileştirme

---

## 🏆 Recognition

Katkıda bulunanlar `README.md` dosyasında listelenecektir:

```markdown
## 👥 Contributors

- [@username](https://github.com/username) - Feature X
- [@username2](https://github.com/username2) - Bug fix Y
```

---

## ❓ Sorular?

- **Issue Aç**: GitHub'da issue açın
- **Discussions**: GitHub Discussions kullanın
- **Email**: Maintainer'lara email gönderin

---

## 📞 İletişim

**Proje**: CineVerse  
**GitHub**: https://github.com/alpeki/cineverse  
**Maintainer**: [@alpeki](https://github.com/alpeki)

---

**🙏 Katkılarınız için teşekkürler!**
