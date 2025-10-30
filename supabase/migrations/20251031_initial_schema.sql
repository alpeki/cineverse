-- CineVerse Database Schema
-- Version: 3.0
-- Date: 2025-10-31

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- MOVIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  original_title TEXT,
  year INTEGER,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  runtime INTEGER, -- minutes
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

-- Indexes for movies
CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_movies_status ON movies(status);
CREATE INDEX IF NOT EXISTS idx_movies_genres ON movies USING GIN(genres);

-- =====================================================
-- PROFILES TABLE (Actors, Directors, Writers)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
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

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_tmdb_id ON profiles(tmdb_id);

-- =====================================================
-- NEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS news (
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

-- Indexes for news
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_tags ON news USING GIN(tags);

-- =====================================================
-- LISTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lists (
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

-- Indexes for lists
CREATE INDEX IF NOT EXISTS idx_lists_slug ON lists(slug);
CREATE INDEX IF NOT EXISTS idx_lists_category ON lists(category);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public movies read" ON movies FOR SELECT USING (status = 'published');
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public news read" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Public lists read" ON lists FOR SELECT USING (status = 'published');

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to increment news views
CREATE OR REPLACE FUNCTION increment_news_views(news_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE news SET views = views + 1 WHERE id = news_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
