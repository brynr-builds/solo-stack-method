-- Email bootstrap: admin_users.email unique not null, admin_sessions.token_hash unique
-- Run after 001_admin_auth.sql
-- Run with: psql $DATABASE_URL -f web/migrations/002_admin_auth_email_bootstrap.sql
--
-- ROLLBACK: see 002_admin_auth_email_bootstrap.rollback.sql

-- Ensure admin_users.email is unique and not null
-- If you have existing rows with NULL email, delete them first or set a value
ALTER TABLE admin_users
  ALTER COLUMN email SET NOT NULL,
  ADD CONSTRAINT admin_users_email_unique UNIQUE (email);

-- Ensure admin_sessions.token_hash is unique
ALTER TABLE admin_sessions
  ADD CONSTRAINT admin_sessions_token_hash_unique UNIQUE (session_token_hash);
