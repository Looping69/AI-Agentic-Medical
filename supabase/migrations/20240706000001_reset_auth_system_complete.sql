-- Drop all existing tables
DROP TABLE IF EXISTS agent_messages CASCADE;
DROP TABLE IF EXISTS agent_collaborations CASCADE;
DROP TABLE IF EXISTS consultation_agents CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS patient_records CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS ai_agents CASCADE;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT CHECK (role IN ('doctor', 'specialist', 'admin', 'master')),
  specialty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient records table
CREATE TABLE IF NOT EXISTS patient_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  medical_history TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patient_records(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultation agents table
CREATE TABLE IF NOT EXISTS consultation_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(consultation_id, agent_id)
);

-- Create agent collaborations table
CREATE TABLE IF NOT EXISTS agent_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent messages table
CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES agent_collaborations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('agent', 'user', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for AI agents
DROP POLICY IF EXISTS "Anyone can view AI agents" ON ai_agents;
CREATE POLICY "Anyone can view AI agents"
  ON ai_agents FOR SELECT
  USING (true);

-- Create policies for patient records
DROP POLICY IF EXISTS "Doctors can view their patients" ON patient_records;
CREATE POLICY "Doctors can view their patients"
  ON patient_records FOR SELECT
  USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can insert patient records" ON patient_records;
CREATE POLICY "Doctors can insert patient records"
  ON patient_records FOR INSERT
  WITH CHECK (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can update their patients" ON patient_records;
CREATE POLICY "Doctors can update their patients"
  ON patient_records FOR UPDATE
  USING (auth.uid() = doctor_id);

-- Create policies for consultations
DROP POLICY IF EXISTS "Doctors can view their consultations" ON consultations;
CREATE POLICY "Doctors can view their consultations"
  ON consultations FOR SELECT
  USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can insert consultations" ON consultations;
CREATE POLICY "Doctors can insert consultations"
  ON consultations FOR INSERT
  WITH CHECK (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can update their consultations" ON consultations;
CREATE POLICY "Doctors can update their consultations"
  ON consultations FOR UPDATE
  USING (auth.uid() = doctor_id);

-- Seed some initial AI agents
INSERT INTO ai_agents (name, specialty, description, avatar_url, is_premium)
VALUES
  ('Dr. Cardio', 'Cardiology', 'Specialized in heart conditions and cardiovascular health', 'https://api.dicebear.com/7.x/avataaars/svg?seed=cardio', false),
  ('Dr. Neuro', 'Neurology', 'Expert in neurological disorders and brain health', 'https://api.dicebear.com/7.x/avataaars/svg?seed=neuro', false),
  ('Dr. Derma', 'Dermatology', 'Specialized in skin conditions and treatments', 'https://api.dicebear.com/7.x/avataaars/svg?seed=derma', false),
  ('Dr. Ortho', 'Orthopedics', 'Expert in bone and joint conditions', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ortho', true),
  ('Dr. Gastro', 'Gastroenterology', 'Specialized in digestive system disorders', 'https://api.dicebear.com/7.x/avataaars/svg?seed=gastro', true),
  ('Dr. Pulmo', 'Pulmonology', 'Expert in respiratory conditions and lung health', 'https://api.dicebear.com/7.x/avataaars/svg?seed=pulmo', true)
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table subscriptions;
alter publication supabase_realtime add table ai_agents;
alter publication supabase_realtime add table patient_records;
alter publication supabase_realtime add table consultations;
alter publication supabase_realtime add table consultation_agents;
alter publication supabase_realtime add table agent_collaborations;
alter publication supabase_realtime add table agent_messages;