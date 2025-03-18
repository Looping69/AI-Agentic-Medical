-- Create profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'specialist', 'admin', 'master')),
  specialty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'master')
  ));

-- Create AI agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_premium BOOLEAN DEFAULT false,
  specialties TEXT[],
  capabilities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient records table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  medical_history TEXT,
  conditions TEXT[],
  medications TEXT[],
  allergies TEXT[],
  last_visit DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Doctors can view their patients" ON patients;
CREATE POLICY "Doctors can view their patients"
  ON patients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'doctor' OR profiles.role = 'specialist' OR profiles.role = 'admin' OR profiles.role = 'master')
  ));

DROP POLICY IF EXISTS "Doctors can insert patients" ON patients;
CREATE POLICY "Doctors can insert patients"
  ON patients FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'doctor' OR profiles.role = 'specialist' OR profiles.role = 'admin' OR profiles.role = 'master')
  ));

DROP POLICY IF EXISTS "Doctors can update their patients" ON patients;
CREATE POLICY "Doctors can update their patients"
  ON patients FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'doctor' OR profiles.role = 'specialist' OR profiles.role = 'admin' OR profiles.role = 'master')
  ));

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES profiles(id) NOT NULL,
  agents TEXT[] NOT NULL,
  symptoms TEXT[],
  diagnosis TEXT,
  recommendations TEXT[],
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Doctors can view their consultations" ON consultations;
CREATE POLICY "Doctors can view their consultations"
  ON consultations FOR SELECT
  USING (doctor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'master')
  ));

DROP POLICY IF EXISTS "Doctors can insert consultations" ON consultations;
CREATE POLICY "Doctors can insert consultations"
  ON consultations FOR INSERT
  WITH CHECK (doctor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'master')
  ));

DROP POLICY IF EXISTS "Doctors can update their consultations" ON consultations;
CREATE POLICY "Doctors can update their consultations"
  ON consultations FOR UPDATE
  USING (doctor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'master')
  ));

-- Create consultation messages table
CREATE TABLE IF NOT EXISTS consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'agent', 'system', 'orchestrator')),
  content TEXT NOT NULL,
  agent_id TEXT REFERENCES ai_agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE consultation_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Doctors can view consultation messages" ON consultation_messages;
CREATE POLICY "Doctors can view consultation messages"
  ON consultation_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM consultations
    WHERE consultations.id = consultation_id AND (consultations.doctor_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'master')
    ))
  ));

DROP POLICY IF EXISTS "Doctors can insert consultation messages" ON consultation_messages;
CREATE POLICY "Doctors can insert consultation messages"
  ON consultation_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM consultations
    WHERE consultations.id = consultation_id AND (consultations.doctor_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'master')
    ))
  ));

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'master')
  ));

-- Enable realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table ai_agents;
alter publication supabase_realtime add table patients;
alter publication supabase_realtime add table consultations;
alter publication supabase_realtime add table consultation_messages;
alter publication supabase_realtime add table subscriptions;
