-- Seed the Vercel Postgres (Neon) database.
-- Run once: psql "$POSTGRES_URL" -f scripts/setup/seed.sql

-- notes_views — aggregate view counts per note slug
CREATE TABLE IF NOT EXISTS notes_views (
  slug VARCHAR(255) PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

-- user_views — per-user throttle tracking for view increments
CREATE TABLE IF NOT EXISTS user_views (
  user_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  last_viewed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, ip_address, slug)
);

CREATE INDEX IF NOT EXISTS idx_user_views_slug ON user_views (slug);

-- chatbot_logs — conversation logs for the AI chatbot
CREATE TABLE IF NOT EXISTS chatbot_logs (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  thread_id VARCHAR(255),
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_logs_created_at ON chatbot_logs (created_at DESC);
