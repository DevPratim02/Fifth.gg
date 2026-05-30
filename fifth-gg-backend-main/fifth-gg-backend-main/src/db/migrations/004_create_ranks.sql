-- User ranks and stats
CREATE TABLE IF NOT EXISTS user_ranks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_mode VARCHAR(64) NOT NULL,
  rank VARCHAR(64),
  mmr INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, game_mode)
);

CREATE INDEX IF NOT EXISTS idx_user_ranks_mmr
  ON user_ranks(game_mode, mmr DESC);
