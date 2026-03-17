-- Create chatbot_logs table for tracking user queries
-- Run this against your Vercel Postgres database once.

CREATE TABLE IF NOT EXISTS chatbot_logs (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  thread_id VARCHAR(255),
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_logs_created_at ON chatbot_logs (created_at DESC);
