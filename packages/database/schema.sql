-- ============================================================
-- GOALRUSH GLOBAL — PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- for fast text search

-- ─── ENUMS ────────────────────────────────────────────────

CREATE TYPE match_status AS ENUM (
  'SCHEDULED', 'LIVE', 'HT', 'FT', 'AET', 'PEN', 'SUSP', 'ABD', 'CANC', 'TBD'
);

CREATE TYPE article_category AS ENUM (
  'breaking', 'match-report', 'transfer', 'analysis',
  'opinion', 'preview', 'stats', 'history', 'women', 'youth'
);

CREATE TYPE transfer_status AS ENUM (
  'rumour', 'confirmed', 'completed', 'failed'
);

CREATE TYPE social_platform AS ENUM (
  'twitter', 'instagram', 'tiktok', 'facebook', 'youtube', 'telegram', 'discord'
);

CREATE TYPE social_post_status AS ENUM (
  'pending', 'scheduled', 'generating', 'published', 'failed'
);

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

-- ─── USERS ────────────────────────────────────────────────

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        user_role NOT NULL DEFAULT 'viewer',
  name        TEXT,
  avatar      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LEAGUES ──────────────────────────────────────────────

CREATE TABLE leagues (
  id          INTEGER PRIMARY KEY,            -- from football API
  name        TEXT NOT NULL,
  short_name  TEXT NOT NULL,
  logo        TEXT,
  country     TEXT NOT NULL,
  flag        TEXT,
  season      INTEGER NOT NULL DEFAULT 2025,
  type        TEXT NOT NULL DEFAULT 'League', -- League | Cup | International
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO leagues (id, name, short_name, country, type) VALUES
  (39,  'Premier League',       'PL',   'England',  'League'),
  (140, 'La Liga',              'LL',   'Spain',    'League'),
  (135, 'Serie A',              'SA',   'Italy',    'League'),
  (78,  'Bundesliga',           'BL',   'Germany',  'League'),
  (61,  'Ligue 1',              'L1',   'France',   'League'),
  (2,   'Champions League',     'UCL',  'Europe',   'Cup'),
  (3,   'Europa League',        'UEL',  'Europe',   'Cup'),
  (1,   'World Cup',            'WC',   'World',    'International'),
  (9,   'Copa America',         'CA',   'S America','International'),
  (253, 'MLS',                  'MLS',  'USA',      'League'),
  (307, 'Saudi Pro League',     'SPL',  'Saudi',    'League'),
  (71,  'Brazil Serie A',       'BSA',  'Brazil',   'League'),
  (128, 'Argentina Liga',       'ARL',  'Argentina','League');

-- ─── TEAMS ────────────────────────────────────────────────

CREATE TABLE teams (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  short_name  TEXT NOT NULL,
  logo        TEXT,
  country     TEXT,
  founded     INTEGER,
  venue       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PLAYERS ──────────────────────────────────────────────

CREATE TABLE players (
  id              INTEGER PRIMARY KEY,
  name            TEXT NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  nationality     TEXT,
  position        TEXT,
  age             INTEGER,
  photo           TEXT,
  team_id         INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  market_value    BIGINT,
  jersey_number   INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── MATCHES ──────────────────────────────────────────────

CREATE TABLE matches (
  id              INTEGER PRIMARY KEY,
  status          match_status NOT NULL DEFAULT 'SCHEDULED',
  home_team_id    INTEGER NOT NULL REFERENCES teams(id),
  away_team_id    INTEGER NOT NULL REFERENCES teams(id),
  league_id       INTEGER NOT NULL REFERENCES leagues(id),
  home_score      INTEGER,
  away_score      INTEGER,
  minute          INTEGER,
  match_date      TIMESTAMPTZ NOT NULL,
  venue           TEXT,
  referee         TEXT,
  season          INTEGER NOT NULL DEFAULT 2025,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_league ON matches(league_id);

-- ─── MATCH EVENTS ─────────────────────────────────────────

CREATE TABLE match_events (
  id          SERIAL PRIMARY KEY,
  match_id    INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  minute      INTEGER NOT NULL,
  type        TEXT NOT NULL,              -- GOAL | CARD | SUBST | VAR
  detail      TEXT,
  player_id   INTEGER REFERENCES players(id),
  player_name TEXT,
  assist_id   INTEGER REFERENCES players(id),
  assist_name TEXT,
  team_id     INTEGER REFERENCES teams(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_match ON match_events(match_id);

-- ─── STANDINGS ────────────────────────────────────────────

CREATE TABLE standings (
  id              SERIAL PRIMARY KEY,
  league_id       INTEGER NOT NULL REFERENCES leagues(id),
  team_id         INTEGER NOT NULL REFERENCES teams(id),
  season          INTEGER NOT NULL,
  rank            INTEGER NOT NULL,
  played          INTEGER NOT NULL DEFAULT 0,
  won             INTEGER NOT NULL DEFAULT 0,
  drawn           INTEGER NOT NULL DEFAULT 0,
  lost            INTEGER NOT NULL DEFAULT 0,
  goals_for       INTEGER NOT NULL DEFAULT 0,
  goals_against   INTEGER NOT NULL DEFAULT 0,
  goal_diff       INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points          INTEGER NOT NULL DEFAULT 0,
  form            TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(league_id, team_id, season)
);

-- ─── ARTICLES ─────────────────────────────────────────────

CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT NOT NULL,
  content         TEXT NOT NULL,
  category        article_category NOT NULL DEFAULT 'analysis',
  tags            JSONB NOT NULL DEFAULT '[]',
  image_url       TEXT,
  image_alt       TEXT,
  author          TEXT NOT NULL DEFAULT 'GoalRush AI',
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  is_breaking     BOOLEAN NOT NULL DEFAULT FALSE,
  views           INTEGER NOT NULL DEFAULT 0,
  read_time       INTEGER NOT NULL DEFAULT 3,
  seo_title       TEXT,
  seo_description TEXT,
  league_id       INTEGER REFERENCES leagues(id),
  published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published, published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_breaking ON articles(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('english', title || ' ' || excerpt));

-- ─── TRANSFERS ────────────────────────────────────────────

CREATE TABLE transfers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       INTEGER NOT NULL REFERENCES players(id),
  from_team_id    INTEGER NOT NULL REFERENCES teams(id),
  to_team_id      INTEGER NOT NULL REFERENCES teams(id),
  fee             BIGINT,
  fee_currency    TEXT DEFAULT 'EUR',
  loan_type       TEXT,   -- permanent | loan | free | loan-to-buy
  status          transfer_status NOT NULL DEFAULT 'rumour',
  confidence      INTEGER NOT NULL DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
  source          TEXT,
  contract_years  INTEGER,
  analysis        TEXT,
  transfer_date   DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transfers_status ON transfers(status);
CREATE INDEX idx_transfers_player ON transfers(player_id);
CREATE INDEX idx_transfers_created ON transfers(created_at DESC);

-- ─── PREDICTIONS ──────────────────────────────────────────

CREATE TABLE predictions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id        INTEGER NOT NULL REFERENCES matches(id),
  home_win_pct    NUMERIC(5,2) NOT NULL,
  draw_pct        NUMERIC(5,2) NOT NULL,
  away_win_pct    NUMERIC(5,2) NOT NULL,
  predicted_home  INTEGER,
  predicted_away  INTEGER,
  btts            BOOLEAN,
  over_25_goals   BOOLEAN,
  key_factor      TEXT,
  confidence      INTEGER NOT NULL DEFAULT 70,
  analysis        TEXT,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(match_id)
);

-- ─── SOCIAL POSTS ─────────────────────────────────────────

CREATE TABLE social_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform        social_platform NOT NULL,
  content         TEXT NOT NULL,
  media_urls      JSONB DEFAULT '[]',
  hashtags        JSONB DEFAULT '[]',
  status          social_post_status NOT NULL DEFAULT 'pending',
  scheduled_at    TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  external_id     TEXT,
  article_id      UUID REFERENCES articles(id),
  match_id        INTEGER REFERENCES matches(id),
  engagement      JSONB DEFAULT '{}',
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_social_status ON social_posts(status);
CREATE INDEX idx_social_platform ON social_posts(platform);
CREATE INDEX idx_social_scheduled ON social_posts(scheduled_at) WHERE status = 'scheduled';

-- ─── NEWSLETTER SUBSCRIBERS ───────────────────────────────

CREATE TABLE newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── AUTOMATION LOGS ──────────────────────────────────────

CREATE TABLE automation_logs (
  id          SERIAL PRIMARY KEY,
  job_name    TEXT NOT NULL,
  status      TEXT NOT NULL,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  items_processed INTEGER DEFAULT 0,
  error_message   TEXT,
  metadata    JSONB DEFAULT '{}'
);

CREATE INDEX idx_logs_job ON automation_logs(job_name);
CREATE INDEX idx_logs_started ON automation_logs(started_at DESC);

-- ─── REFRESH updated_at ───────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users       BEFORE UPDATE ON users       FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_players     BEFORE UPDATE ON players     FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_matches     BEFORE UPDATE ON matches     FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_articles    BEFORE UPDATE ON articles    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_transfers   BEFORE UPDATE ON transfers   FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
