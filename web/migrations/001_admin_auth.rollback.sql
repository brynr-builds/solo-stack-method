-- Rollback for 001_admin_auth.sql
-- Run with: psql $DATABASE_URL -f web/migrations/001_admin_auth.rollback.sql
-- WARNING: This drops all admin auth tables and data.

DROP TABLE IF EXISTS admin_backup_codes;
DROP TABLE IF EXISTS admin_sessions;
DROP TABLE IF EXISTS webauthn_challenges;
DROP TABLE IF EXISTS webauthn_credentials;
DROP TABLE IF EXISTS admin_users;
