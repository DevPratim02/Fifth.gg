CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(255),
  in_game_name VARCHAR(64),
  tagline VARCHAR(16),
  region VARCHAR(32),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid
  ON users(firebase_uid);
