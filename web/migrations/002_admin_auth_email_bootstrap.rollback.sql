-- Rollback for 002_admin_auth_email_bootstrap.sql
-- Run with: psql $DATABASE_URL -f web/migrations/002_admin_auth_email_bootstrap.rollback.sql

ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_email_unique;
ALTER TABLE admin_users ALTER COLUMN email DROP NOT NULL;

ALTER TABLE admin_sessions DROP CONSTRAINT IF EXISTS admin_sessions_token_hash_unique;
