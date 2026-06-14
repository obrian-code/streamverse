-- StreamVerse OTT Platform - Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM Types
-- ============================================
CREATE TYPE user_role AS ENUM ('admin', 'user', 'editor');
CREATE TYPE content_status AS ENUM ('active', 'inactive', 'coming_soon');
CREATE TYPE content_type AS ENUM ('movie', 'series', 'channel', 'documentary', 'sport', 'news');
CREATE TYPE channel_category AS ENUM ('entertainment', 'sports', 'news', 'documentary', 'movies', 'music', 'kids', 'education');

-- ============================================
-- Users
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    avatar VARCHAR(500),
    reset_token VARCHAR(500),
    reset_token_expires TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Channels (Live TV / Linear Streaming)
-- ============================================
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500),
    category channel_category DEFAULT 'entertainment',
    stream_url VARCHAR(500) NOT NULL,
    dash_url VARCHAR(500),
    country VARCHAR(100),
    language VARCHAR(50),
    status content_status DEFAULT 'active',
    epg_data JSONB DEFAULT '[]',
    viewers_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Movies (VOD)
-- ============================================
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    synopsis TEXT,
    poster VARCHAR(500),
    backdrop VARCHAR(500),
    logo VARCHAR(500),
    category VARCHAR(100),
    genres TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    duration INTEGER,
    release_date DATE,
    rating DECIMAL(3,1) DEFAULT 0,
    maturity_rating VARCHAR(10) DEFAULT 'PG-13',
    video_url VARCHAR(500),
    trailer_url VARCHAR(500),
    director VARCHAR(255),
    cast_members TEXT[] DEFAULT '{}',
    status content_status DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Series (TV Shows)
-- ============================================
CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    synopsis TEXT,
    poster VARCHAR(500),
    backdrop VARCHAR(500),
    logo VARCHAR(500),
    category VARCHAR(100),
    genres TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    release_date DATE,
    rating DECIMAL(3,1) DEFAULT 0,
    maturity_rating VARCHAR(10) DEFAULT 'PG-13',
    trailer_url VARCHAR(500),
    status content_status DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Episodes
-- ============================================
CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_id UUID REFERENCES series(id) ON DELETE CASCADE,
    season INTEGER NOT NULL,
    episode_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    video_url VARCHAR(500) NOT NULL,
    duration INTEGER,
    air_date DATE,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(series_id, season, episode_number)
);

-- ============================================
-- Favorites
-- ============================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id, content_type)
);

-- ============================================
-- Viewing History
-- ============================================
CREATE TABLE history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    season INTEGER,
    episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    watched_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Categories
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Banners (Hero Section)
-- ============================================
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image VARCHAR(500),
    video_url VARCHAR(500),
    content_id UUID,
    content_type VARCHAR(50),
    link_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EPG Programs (Electronic Program Guide)
-- ============================================
CREATE TABLE epg_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    category VARCHAR(100),
    season INTEGER,
    episode INTEGER,
    image VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- ============================================
-- View Stats (Analytics)
-- ============================================
CREATE TABLE view_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    watched_duration INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    device_type VARCHAR(50),
    country VARCHAR(100),
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);

-- Movies
CREATE INDEX idx_movies_category ON movies(category);
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_featured ON movies(is_featured) WHERE is_featured = true;

-- Series
CREATE INDEX idx_series_category ON series(category);
CREATE INDEX idx_series_status ON series(status);

-- Episodes
CREATE INDEX idx_episodes_series ON episodes(series_id);
CREATE INDEX idx_episodes_season ON episodes(series_id, season);

-- Favorites
CREATE INDEX idx_favorites_user ON favorites(user_id);

-- History
CREATE INDEX idx_history_user ON history(user_id);
CREATE INDEX idx_history_recent ON history(user_id, watched_at DESC);

-- Channels
CREATE INDEX idx_channels_category ON channels(category);
CREATE INDEX idx_channels_status ON channels(status);

-- EPG
CREATE INDEX idx_epg_channel ON epg_programs(channel_id);
CREATE INDEX idx_epg_time ON epg_programs(start_time, end_time);

-- View Stats
CREATE INDEX idx_view_stats_content ON view_stats(content_id);
CREATE INDEX idx_view_stats_date ON view_stats(viewed_at);

-- Full-Text Search (Spanish)
CREATE INDEX idx_movies_search ON movies USING gin(to_tsvector('spanish', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_series_search ON series USING gin(to_tsvector('spanish', title || ' ' || COALESCE(description, '')));
