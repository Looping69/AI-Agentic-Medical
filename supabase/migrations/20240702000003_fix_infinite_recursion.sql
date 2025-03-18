-- Drop all existing policies on profiles to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles access" ON profiles;

-- Temporarily disable RLS to ensure we can make changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Create simplified policies that won't cause recursion
-- Allow authenticated users to view their own profile
CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add a special policy for the signup process that allows any insert
-- This is needed because during signup, the auth.uid() might not be available yet
CREATE POLICY "profiles_insert_during_signup"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
