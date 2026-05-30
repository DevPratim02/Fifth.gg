-- Availability table to track which users are online and ready to play
CREATE TABLE IF NOT EXISTS availability (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_ready BOOLEAN NOT NULL DEFAULT false,
  game_mode VARCHAR(64),
  rank_range VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_availability_ready
  ON availability(is_ready, game_mode);
