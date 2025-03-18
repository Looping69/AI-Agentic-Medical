-- First, drop all tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS consultation_messages CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS ai_agents CASCADE;

-- Recreate tables in the correct order
-- AI Agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_premium BOOLEAN DEFAULT false,
  specialties TEXT[] DEFAULT NULL,
  capabilities TEXT[] DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'doctor',
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  medical_history TEXT,
  conditions TEXT[],
  medications TEXT[],
  allergies TEXT[],
  last_visit TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES profiles(id),
  agents UUID[] NOT NULL,
  symptoms TEXT[],
  diagnosis TEXT,
  recommendations TEXT[],
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'in-progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultation messages table
CREATE TABLE IF NOT EXISTS consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  agent_id UUID REFERENCES ai_agents(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS on all tables to start fresh
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultations DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents DISABLE ROW LEVEL SECURITY;

-- Set up realtime
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
ALTER PUBLICATION supabase_realtime ADD TABLE consultations;
ALTER PUBLICATION supabase_realtime ADD TABLE consultation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_agents;

-- Seed some initial AI agents
INSERT INTO ai_agents (name, description, icon, is_premium, specialties, capabilities) VALUES
('General Medicine', 'A general medical assistant with broad knowledge across common conditions', 'stethoscope', false, ARRAY['General Practice', 'Primary Care'], ARRAY['Symptom analysis', 'Treatment suggestions', 'Patient education']),
('Medical Records', 'Helps organize and analyze patient records', 'file-text', false, ARRAY['Medical Records', 'Documentation'], ARRAY['Record summarization', 'History analysis', 'Documentation assistance']),
('Cardiology', 'Specialized in cardiovascular conditions and treatments', 'heart-pulse', true, ARRAY['Cardiology', 'Cardiovascular'], ARRAY['ECG interpretation', 'Heart condition analysis', 'Cardiovascular risk assessment']),
('Neurology', 'Expert in neurological disorders and brain function', 'brain', true, ARRAY['Neurology', 'Neuroscience'], ARRAY['Neurological assessment', 'Brain disorder analysis', 'Cognitive evaluation']),
('Radiology', 'Specialized in medical imaging interpretation', 'scan', true, ARRAY['Radiology', 'Imaging'], ARRAY['X-ray analysis', 'CT scan interpretation', 'MRI evaluation']);
