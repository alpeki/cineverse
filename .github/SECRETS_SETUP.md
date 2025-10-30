# 🔐 GitHub Secrets Setup Guide

Bu dosya, GitHub Actions için gerekli secrets'ların nasıl ekleneceğini açıklar.

## 📋 Gerekli Secrets

### 1. Supabase Credentials

**VITE_SUPABASE_URL**
- Supabase Dashboard → Project Settings → API → Project URL
- Örnek: `https://xxxxx.supabase.co`

**VITE_SUPABASE_ANON_KEY**
- Supabase Dashboard → Project Settings → API → Project API keys → anon/public
- Örnek: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Vercel Deployment

**VERCEL_TOKEN**
- Vercel Dashboard → Settings → Tokens
- Create new token with deployment permissions

**VERCEL_ORG_ID** (Optional)
- Vercel Dashboard → Settings → General → Organization ID

**VERCEL_PROJECT_ID** (Optional)
- Vercel Dashboard → Project Settings → General → Project ID

### 3. Lighthouse CI (Optional)

**LHCI_GITHUB_APP_TOKEN**
- GitHub App token for Lighthouse CI
- https://github.com/apps/lighthouse-ci

## 🔧 Secrets Ekleme Adımları

### GitHub Repository

1. GitHub repository'ye git
2. Settings → Secrets and variables → Actions
3. "New repository secret" tıkla
4. Secret name ve value gir
5. "Add secret" tıkla

### Komut Satırı ile (GitHub CLI)

```bash
# GitHub CLI yükle
# https://cli.github.com/

# Login
gh auth login

# Secret ekle
gh secret set VITE_SUPABASE_URL
gh secret set VITE_SUPABASE_ANON_KEY
gh secret set VERCEL_TOKEN
```

## ✅ Kontrol Listesi

- [ ] VITE_SUPABASE_URL eklendi
- [ ] VITE_SUPABASE_ANON_KEY eklendi
- [ ] VERCEL_TOKEN eklendi (deployment için)
- [ ] LHCI_GITHUB_APP_TOKEN eklendi (optional)

## 🔒 Güvenlik Notları

1. **Asla secrets'ları commit etme**
   - .env.local dosyası .gitignore'da olmalı
   - Secrets sadece GitHub Settings'de olmalı

2. **Anon key kullan, Service Role key kullanma**
   - Service role key admin yetkilerine sahip
   - Sadece backend'de kullanılmalı

3. **Secrets'ları düzenli olarak rotate et**
   - 3-6 ayda bir yenile
   - Şüpheli aktivite varsa hemen değiştir

4. **Environment-specific secrets**
   - Production ve development için ayrı keys kullan
   - Test ortamı için ayrı Supabase projesi

## 📚 Daha Fazla Bilgi

- [GitHub Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
