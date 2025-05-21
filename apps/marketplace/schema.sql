DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS email_verifications;

CREATE TABLE users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  email           TEXT    NOT NULL UNIQUE,
  password_hash   TEXT    NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email_validated INTEGER NOT NULL DEFAULT 0
);

-- schema.sql  (run once with `wrangler d1 execute`)
CREATE TABLE email_verifications (
  token_hash     TEXT PRIMARY KEY,          -- SHA-256 of raw token
  user_id        INTEGER NOT NULL,
  expires_at     INTEGER NOT NULL,          -- unix epoch (seconds)
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);
