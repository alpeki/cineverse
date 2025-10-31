# 🔐 CineVerse Authentication Flow

**Version**: 4.0 (Planned)  
**Status**: 📋 Planning Phase  
**Implementation**: Q1 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Methods](#authentication-methods)
3. [User Flow Diagrams](#user-flow-diagrams)
4. [Database Schema](#database-schema)
5. [Implementation Guide](#implementation-guide)
6. [Security Considerations](#security-considerations)

---

## 🎯 Overview

CineVerse V4.0'da Supabase Auth kullanarak kullanıcı kimlik doğrulama sistemi eklenecek.

### Desteklenecek Yöntemler

- ✅ **Email + Password**: Geleneksel email/şifre girişi
- ✅ **Google OAuth**: Google hesabı ile giriş
- ✅ **Magic Link**: Şifresiz email link girişi
- ⏳ **Twitter OAuth**: Twitter hesabı ile giriş (V4.1)
- ⏳ **GitHub OAuth**: GitHub hesabı ile giriş (V4.1)

### Özellikler

- 🔒 Secure session management
- 🔄 Auto token refresh
- 📧 Email verification
- 🔑 Password reset
- 👤 User profiles
- 🎭 Role-based access (user, admin)

---

## 🔐 Authentication Methods

### 1. Email + Password

#### Sign Up Flow

```
┌─────────────┐
│   User      │
│ Visits Site │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Click Sign Up  │
└──────┬──────────┘
       │
       ▼
┌──────────────────────┐
│  Fill Registration   │
│  Form:               │
│  - Email             │
│  - Password          │
│  - Username          │
│  - Full Name         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Supabase Auth       │
│  signUp()            │
└──────┬───────────────┘
       │
       ├─── Success ───┐
       │               ▼
       │         ┌─────────────────┐
       │         │ Verification    │
       │         │ Email Sent      │
       │         └─────────────────┘
       │               │
       │               ▼
       │         ┌─────────────────┐
       │         │ User Clicks     │
       │         │ Verify Link     │
       │         └─────────────────┘
       │               │
       │               ▼
       │         ┌─────────────────┐
       │         │ Email Verified  │
       │         │ Redirect to App │
       │         └─────────────────┘
       │
       └─── Error ────┐
                      ▼
               ┌──────────────┐
               │ Show Error   │
               │ Message      │
               └──────────────┘
```

#### Sign In Flow

```
┌─────────────┐
│   User      │
│ Visits Site │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Click Sign In  │
└──────┬──────────┘
       │
       ▼
┌──────────────────────┐
│  Enter Credentials   │
│  - Email             │
│  - Password          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Supabase Auth       │
│  signInWithPassword()│
└──────┬───────────────┘
       │
       ├─── Success ───┐
       │               ▼
       │         ┌─────────────────┐
       │         │ Session Created │
       │         │ Redirect to App │
       │         └─────────────────┘
       │
       └─── Error ────┐
                      ▼
               ┌──────────────┐
               │ Show Error   │
               │ - Wrong pass │
               │ - Not found  │
               └──────────────┘
```

#### Code Example

```javascript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      username: 'johndoe',
      full_name: 'John Doe'
    },
    emailRedirectTo: 'https://cineverse.app/auth/callback'
  }
})

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})

// Sign Out
await supabase.auth.signOut()
```

---

### 2. Google OAuth

#### OAuth Flow

```
┌─────────────┐
│   User      │
│ Visits Site │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ Click "Sign in with  │
│      Google"         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Redirect to Google  │
│  OAuth Consent       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  User Grants         │
│  Permission          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Google Redirects    │
│  to Callback URL     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Supabase Creates    │
│  Session             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Check if New User   │
└──────┬───────────────┘
       │
       ├─── New User ──┐
       │               ▼
       │         ┌─────────────────┐
       │         │ Create Profile  │
       │         │ in Database     │
       │         └─────────────────┘
       │               │
       │               ▼
       │         ┌─────────────────┐
       │         │ Redirect to     │
       │         │ Onboarding      │
       │         └─────────────────┘
       │
       └─ Existing ───┐
                      ▼
               ┌──────────────┐
               │ Redirect to  │
               │ Dashboard    │
               └──────────────┘
```

#### Code Example

```javascript
// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://cineverse.app/auth/callback',
    scopes: 'email profile'
  }
})

// Handle callback
// In /auth/callback page
const { data: { session }, error } = await supabase.auth.getSession()

if (session) {
  // Check if profile exists
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  if (!profile) {
    // Create profile
    await supabase.from('user_profiles').insert({
      id: session.user.id,
      username: session.user.email.split('@')[0],
      full_name: session.user.user_metadata.full_name,
      avatar_url: session.user.user_metadata.avatar_url
    })
  }
  
  // Redirect
  window.location.href = '/dashboard'
}
```

---

### 3. Magic Link

#### Magic Link Flow

```
┌─────────────┐
│   User      │
│ Visits Site │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ Click "Sign in with  │
│    Magic Link"       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Enter Email         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Supabase Sends      │
│  Magic Link Email    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Show "Check Email"  │
│  Message             │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  User Opens Email    │
│  Clicks Link         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Redirect to App     │
│  with Token          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Session Created     │
│  User Logged In      │
└──────────────────────┘
```

#### Code Example

```javascript
// Send Magic Link
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://cineverse.app/auth/callback'
  }
})

if (!error) {
  alert('Check your email for the magic link!')
}
```

---

## 🗄️ Database Schema

### user_profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Public profiles read" 
  ON user_profiles FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users update own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### watchlist Table

```sql
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'want_to_watch' 
    CHECK (status IN ('watching', 'watched', 'want_to_watch')),
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watched_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, movie_id)
);

-- Indexes
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_watchlist_movie_id ON watchlist(movie_id);
CREATE INDEX idx_watchlist_status ON watchlist(status);

-- RLS Policies
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Users can only see their own watchlist
CREATE POLICY "Users read own watchlist" 
  ON watchlist FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can manage their own watchlist
CREATE POLICY "Users manage own watchlist" 
  ON watchlist FOR ALL 
  USING (auth.uid() = user_id);
```

### user_reviews Table

```sql
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

-- Indexes
CREATE INDEX idx_user_reviews_user_id ON user_reviews(user_id);
CREATE INDEX idx_user_reviews_movie_id ON user_reviews(movie_id);
CREATE INDEX idx_user_reviews_rating ON user_reviews(rating DESC);

-- RLS Policies
ALTER TABLE user_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read published reviews
CREATE POLICY "Public reviews read" 
  ON user_reviews FOR SELECT 
  USING (true);

-- Users can manage their own reviews
CREATE POLICY "Users manage own reviews" 
  ON user_reviews FOR ALL 
  USING (auth.uid() = user_id);
```

---

## 💻 Implementation Guide

### 1. Setup Supabase Auth

```bash
# Supabase Dashboard → Authentication → Providers

# Enable Email Provider
✅ Email/Password
✅ Email Verification Required

# Enable OAuth Providers
✅ Google OAuth
  - Client ID: [from Google Console]
  - Client Secret: [from Google Console]
  - Redirect URL: https://[project-ref].supabase.co/auth/v1/callback

✅ Magic Links
  - Email Template: Customize
```

### 2. Frontend Implementation

```javascript
// src/lib/auth.js
import { supabase } from './supabase.js'

export const auth = {
  // Sign Up
  async signUp(email, password, metadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    return { data, error }
  },
  
  // Sign In
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },
  
  // Sign Out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },
  
  // Get Current User
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },
  
  // OAuth
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    return { data, error }
  },
  
  // Magic Link
  async sendMagicLink(email) {
    const { error } = await supabase.auth.signInWithOtp({ email })
    return { error }
  }
}
```

### 3. Auth State Management

```javascript
// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  
  if (event === 'SIGNED_IN') {
    // User signed in
    updateUIForAuthenticatedUser(session.user)
  } else if (event === 'SIGNED_OUT') {
    // User signed out
    updateUIForAnonymousUser()
  } else if (event === 'TOKEN_REFRESHED') {
    // Token refreshed
    console.log('Token refreshed')
  }
})
```

### 4. Protected Routes

```javascript
// Middleware for protected routes
async function requireAuth() {
  const user = await auth.getCurrentUser()
  
  if (!user) {
    window.location.href = '/login'
    return false
  }
  
  return true
}

// Usage
if (await requireAuth()) {
  // Load protected content
  loadDashboard()
}
```

---

## 🔒 Security Considerations

### Best Practices

1. **Password Requirements**
   - Minimum 8 characters
   - At least 1 uppercase, 1 lowercase, 1 number
   - Optional: Special characters

2. **Email Verification**
   - Always verify emails
   - Prevent spam accounts

3. **Session Management**
   - Auto token refresh
   - Secure cookie storage
   - HTTPS only

4. **Rate Limiting**
   - Limit login attempts
   - Prevent brute force attacks

5. **RLS Policies**
   - Always use RLS
   - Test policies thoroughly

### Security Checklist

- [ ] Email verification enabled
- [ ] Strong password requirements
- [ ] HTTPS enforced
- [ ] RLS policies tested
- [ ] OAuth redirect URLs whitelisted
- [ ] CORS properly configured
- [ ] Session timeout configured
- [ ] Rate limiting implemented

---

## 📊 User Journey

### New User Journey

```
Sign Up → Email Verification → Create Profile → Onboarding → Dashboard
```

### Returning User Journey

```
Sign In → Dashboard
```

### Password Reset Journey

```
Forgot Password → Email Sent → Click Link → Reset Password → Sign In
```

---

## 🔗 Related Documentation

- [API.md](./API.md) - API endpoints
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase setup
- [PROJE_RAPORU.md](./PROJE_RAPORU.md) - Project report

---

**Version**: 4.0 (Planned)  
**Status**: 📋 Planning Phase  
**Implementation**: Q1 2026  
**Last Updated**: 31 Ekim 2025
