-- Disable RLS on profiles table to fix infinite recursion issue
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop problematic policies that might be causing infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles access" ON profiles;

-- Delete all users from auth.users
-- This will cascade delete all related records in profiles
DELETE FROM auth.users;

-- Make sure realtime is enabled for profiles
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
