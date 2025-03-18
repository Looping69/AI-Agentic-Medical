-- Delete all users from auth.users
-- This will cascade delete all related records in profiles and subscriptions
DELETE FROM auth.users;
