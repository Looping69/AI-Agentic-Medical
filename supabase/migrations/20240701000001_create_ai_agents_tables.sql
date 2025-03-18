-- Create AI Agent Models table
CREATE TABLE IF NOT EXISTS ai_agent_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    provider TEXT NOT NULL,
    model_id TEXT NOT NULL,
    capabilities JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI Agents table
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    specialty TEXT NOT NULL,
    icon TEXT,
    model_id UUID REFERENCES ai_agent_models(id),
    system_prompt TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Agent Knowledge Base table
CREATE TABLE IF NOT EXISTS agent_knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES ai_agents(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Agent Conversations table
CREATE TABLE IF NOT EXISTS agent_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    patient_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Agent Messages table
CREATE TABLE IF NOT EXISTS agent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES agent_conversations(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES ai_agents(id),
    role TEXT NOT NULL CHECK (role IN ('user', 'agent', 'system', 'orchestrator')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orchestrator Config table
CREATE TABLE IF NOT EXISTS orchestrator_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL,
    model_id UUID REFERENCES ai_agent_models(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Agent Conversation Participants table
CREATE TABLE IF NOT EXISTS agent_conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES agent_conversations(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES ai_agents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Subscription table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT NOT NULL CHECK (subscription_tier IN ('free', 'premium')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ai_agent_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchestrator_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for ai_agent_models" ON ai_agent_models;
DROP POLICY IF EXISTS "Public read access for ai_agents" ON ai_agents;
DROP POLICY IF EXISTS "Public read access for agent_knowledge_base" ON agent_knowledge_base;
DROP POLICY IF EXISTS "Auth users can manage their conversations" ON agent_conversations;
DROP POLICY IF EXISTS "Auth users can manage their messages" ON agent_messages;
DROP POLICY IF EXISTS "Public read access for orchestrator_config" ON orchestrator_config;

-- Create policies
CREATE POLICY "Public read access for ai_agent_models"
ON ai_agent_models FOR SELECT
USING (true);

CREATE POLICY "Public read access for ai_agents"
ON ai_agents FOR SELECT
USING (true);

CREATE POLICY "Public read access for agent_knowledge_base"
ON agent_knowledge_base FOR SELECT
USING (true);

CREATE POLICY "Auth users can manage their conversations"
ON agent_conversations FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Auth users can manage their messages"
ON agent_messages FOR ALL
USING (
    conversation_id IN (
        SELECT id FROM agent_conversations WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Public read access for orchestrator_config"
ON orchestrator_config FOR SELECT
USING (true);

CREATE POLICY "Auth users can manage their conversation participants"
ON agent_conversation_participants FOR ALL
USING (
    conversation_id IN (
        SELECT id FROM agent_conversations WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Auth users can manage their subscriptions"
ON user_subscriptions FOR ALL
USING (auth.uid() = user_id);

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE agent_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_conversation_participants;

-- Insert sample data for AI agent models
INSERT INTO ai_agent_models (name, description, provider, model_id, capabilities)
VALUES
    ('Gemini Pro', 'Google''s Gemini Pro model for general medical analysis', 'Google', 'gemini-pro', '{"text_generation": true, "reasoning": true}'),
    ('Gemini Pro Vision', 'Google''s Gemini Pro Vision model for image analysis', 'Google', 'gemini-pro-vision', '{"text_generation": true, "image_analysis": true}'),
    ('Claude 3 Opus', 'Anthropic''s Claude 3 Opus for detailed medical analysis', 'Anthropic', 'claude-3-opus', '{"text_generation": true, "reasoning": true, "long_context": true}')
ON CONFLICT DO NOTHING;

-- Insert sample data for AI agents
INSERT INTO ai_agents (name, description, specialty, icon, model_id, system_prompt, is_premium)
VALUES
    ('General Practitioner', 'Primary care physician with broad medical knowledge', 'general', 'User', (SELECT id FROM ai_agent_models WHERE name = 'Gemini Pro' LIMIT 1), 'You are an AI assistant acting as a general practitioner. Provide medical advice based on symptoms and medical history.', false),
    ('Cardiologist', 'Specialist in heart and cardiovascular conditions', 'cardiology', 'Heart', (SELECT id FROM ai_agent_models WHERE name = 'Gemini Pro' LIMIT 1), 'You are an AI assistant acting as a cardiologist. Focus on heart-related symptoms and conditions.', true),
    ('Neurologist', 'Specialist in brain and nervous system disorders', 'neurology', 'Brain', (SELECT id FROM ai_agent_models WHERE name = 'Gemini Pro' LIMIT 1), 'You are an AI assistant acting as a neurologist. Focus on symptoms related to the brain and nervous system.', true),
    ('Radiologist', 'Expert in interpreting medical imaging', 'radiology', 'FileImage', (SELECT id FROM ai_agent_models WHERE name = 'Gemini Pro Vision' LIMIT 1), 'You are an AI assistant acting as a radiologist. Analyze and interpret medical images.', true),
    ('Medical Records Analyst', 'Specialist in analyzing patient history', 'records', 'FileText', (SELECT id FROM ai_agent_models WHERE name = 'Claude 3 Opus' LIMIT 1), 'You are an AI assistant acting as a medical records analyst. Review and analyze patient medical history for relevant information.', false),
    ('Vital Signs Monitor', 'Monitors and interprets vital signs', 'vitals', 'Activity', (SELECT id FROM ai_agent_models WHERE name = 'Gemini Pro' LIMIT 1), 'You are an AI assistant monitoring vital signs. Interpret vital sign readings and alert to abnormalities.', false)
ON CONFLICT DO NOTHING;

-- Insert sample orchestrator config
INSERT INTO orchestrator_config (name, description, system_prompt, model_id)
VALUES
    ('Medical Consultation Orchestrator', 'Coordinates multiple medical AI agents for comprehensive diagnosis', 'You are an orchestrator AI that coordinates multiple medical specialist AIs. Synthesize their inputs to provide a comprehensive medical assessment.', (SELECT id FROM ai_agent_models WHERE name = 'Claude 3 Opus' LIMIT 1))
ON CONFLICT DO NOTHING;
