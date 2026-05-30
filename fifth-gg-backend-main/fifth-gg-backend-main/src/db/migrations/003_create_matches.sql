-- Matches table to store game sessions
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  match_code VARCHAR(32) UNIQUE NOT NULL,
  game_mode VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending', -- pending, active, completed, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Match participants (players in a match)
CREATE TABLE IF NOT EXISTS match_participants (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team VARCHAR(16), -- team1, team2, etc.
  status VARCHAR(32) NOT NULL DEFAULT 'pending', -- pending, accepted, declined
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(match_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_status
  ON matches(status, created_at);

CREATE INDEX IF NOT EXISTS idx_match_participants_user
  ON match_participants(user_id, match_id);
