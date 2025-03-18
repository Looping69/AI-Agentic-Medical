-- Add isQuestion field to agent_messages table
ALTER TABLE agent_messages ADD COLUMN IF NOT EXISTS is_question BOOLEAN DEFAULT FALSE;

-- Add doctor role to agent_messages
ALTER TABLE agent_messages DROP CONSTRAINT IF EXISTS agent_messages_role_check;
ALTER TABLE agent_messages ADD CONSTRAINT agent_messages_role_check 
  CHECK (role IN ('user', 'agent', 'system', 'orchestrator', 'doctor'));

-- Enable realtime for agent_messages if not already enabled
ALTER PUBLICATION supabase_realtime ADD TABLE agent_messages;
