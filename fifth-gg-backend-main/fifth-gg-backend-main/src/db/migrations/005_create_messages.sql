CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  room_id VARCHAR(64) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(64),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_room_id
  ON messages(room_id, created_at);
