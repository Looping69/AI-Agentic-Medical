import { supabase } from "../../../supabase/supabase";
import { generateContentWithSystemPrompt } from "./gemini";

// Types for our agent system
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  description?: string;
  api_key_required: boolean;
  is_active: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  specialty: string;
  icon_name: string;
  system_prompt: string;
  model_id: string;
  is_premium: boolean;
  is_active: boolean;
}

export interface KnowledgeBaseItem {
  id: string;
  agent_id: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface OrchestratorConfig {
  id: string;
  name: string;
  description?: string;
  system_prompt: string;
  model_id: string;
  is_active: boolean;
}

// Fetch all available AI models
export async function getAIModels(): Promise<AIModel[]> {
  const { data, error } = await supabase
    .from("ai_agent_models")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching AI models:", error);
    return [];
  }

  return data;
}

// Fetch all available agents
export async function getAgents(): Promise<AIAgent[]> {
  const { data, error } = await supabase
    .from("ai_agents")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching agents:", error);
    return [];
  }

  return data;
}

// Fetch a specific agent by ID
export async function getAgentById(agentId: string): Promise<AIAgent | null> {
  const { data, error } = await supabase
    .from("ai_agents")
    .select("*")
    .eq("id", agentId)
    .single();

  if (error) {
    console.error(`Error fetching agent with ID ${agentId}:`, error);
    return null;
  }

  return data;
}

// Fetch knowledge base items for a specific agent
export async function getAgentKnowledgeBase(
  agentId: string,
): Promise<KnowledgeBaseItem[]> {
  const { data, error } = await supabase
    .from("agent_knowledge_base")
    .select("*")
    .eq("agent_id", agentId);

  if (error) {
    console.error(`Error fetching knowledge base for agent ${agentId}:`, error);
    return [];
  }

  return data;
}

// Fetch the orchestrator configuration
export async function getOrchestratorConfig(): Promise<OrchestratorConfig | null> {
  const { data, error } = await supabase
    .from("orchestrator_config")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching orchestrator config:", error);
    return null;
  }

  return data;
}

// Create a new conversation
export async function createConversation(
  userId: string,
  title?: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("agent_conversations")
    .insert([{ user_id: userId, title: title || "New Conversation" }])
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return null;
  }

  return data.id;
}

// Add a message to a conversation
export async function addMessage(
  conversationId: string,
  role: "user" | "agent" | "system" | "orchestrator",
  content: string,
  agentId?: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("agent_messages")
    .insert([
      {
        conversation_id: conversationId,
        role,
        content,
        agent_id: agentId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding message:", error);
    return null;
  }

  return data.id;
}

// Get all messages for a conversation
export async function getConversationMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("agent_messages")
    .select("*, agent:ai_agents(name, specialty, icon_name)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching conversation messages:", error);
    return [];
  }

  return data;
}

// Generate a response from a specific agent
export async function generateAgentResponse(
  agentId: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
): Promise<string> {
  try {
    // Fetch the agent details
    const agent = await getAgentById(agentId);
    if (!agent) {
      throw new Error(`Agent with ID ${agentId} not found`);
    }

    // Fetch the agent's model
    const { data: modelData } = await supabase
      .from("ai_agent_models")
      .select("*")
      .eq("id", agent.model_id)
      .single();

    if (!modelData) {
      throw new Error(`Model for agent ${agent.name} not found`);
    }

    // Fetch knowledge base items for context enhancement
    const knowledgeItems = await getAgentKnowledgeBase(agentId);
    let knowledgeContext = "";
    if (knowledgeItems.length > 0) {
      knowledgeContext =
        "\n\nRelevant knowledge base information:\n" +
        knowledgeItems
          .map((item) => `${item.title}:\n${item.content}`)
          .join("\n\n");
    }

    // Prepare the system prompt with knowledge base context
    const enhancedSystemPrompt = agent.system_prompt + knowledgeContext;

    // Prepare conversation context
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext =
        "\n\nConversation history:\n" +
        conversationHistory
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n");
    }

    // Generate the response using the appropriate model
    const fullPrompt = userMessage + conversationContext;
    return await generateContentWithSystemPrompt(
      fullPrompt,
      enhancedSystemPrompt,
      modelData.model_id,
    );
  } catch (error) {
    console.error("Error generating agent response:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
}

// Generate a response from the orchestrator
export async function generateOrchestratorResponse(
  userMessage: string,
  agentResponses: Array<{
    agentId: string;
    agentName: string;
    response: string;
  }>,
  conversationHistory: Array<{ role: string; content: string }> = [],
): Promise<string> {
  try {
    // Fetch the orchestrator configuration
    const orchestrator = await getOrchestratorConfig();
    if (!orchestrator) {
      throw new Error("Orchestrator configuration not found");
    }

    // Fetch the orchestrator's model
    const { data: modelData } = await supabase
      .from("ai_agent_models")
      .select("*")
      .eq("id", orchestrator.model_id)
      .single();

    if (!modelData) {
      throw new Error("Model for orchestrator not found");
    }

    // Prepare agent responses for the orchestrator
    const agentResponsesText = agentResponses
      .map((ar) => `${ar.agentName} (${ar.agentId}): ${ar.response}`)
      .join("\n\n");

    // Prepare conversation context
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext =
        "\n\nConversation history:\n" +
        conversationHistory
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n");
    }

    // Prepare the full prompt for the orchestrator
    const fullPrompt = `User query: ${userMessage}\n\nAgent responses:\n${agentResponsesText}${conversationContext}\n\nPlease synthesize these responses into a coherent, comprehensive answer that addresses the user's query.`;

    // Generate the orchestrator's response
    return await generateContentWithSystemPrompt(
      fullPrompt,
      orchestrator.system_prompt,
      modelData.model_id,
    );
  } catch (error) {
    console.error("Error generating orchestrator response:", error);
    return "I encountered an error while coordinating the agent responses. Please try again later.";
  }
}

// Collaborative consultation with multiple agents and orchestrator
export async function performCollaborativeConsultation(
  userMessage: string,
  agentIds: string[],
  conversationId: string,
  userId: string,
): Promise<string> {
  try {
    // Create a new conversation if not provided
    if (!conversationId) {
      const newConversationId = await createConversation(userId);
      if (!newConversationId) {
        throw new Error("Failed to create a new conversation");
      }
      conversationId = newConversationId;
    }

    // Add the user message to the conversation
    await addMessage(conversationId, "user", userMessage);

    // Get conversation history
    const conversationMessages = await getConversationMessages(conversationId);
    const history = conversationMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate responses from each agent
    const agentResponses = [];
    for (const agentId of agentIds) {
      const agent = await getAgentById(agentId);
      if (!agent) continue;

      const response = await generateAgentResponse(
        agentId,
        userMessage,
        history,
      );

      // Add the agent's response to the conversation
      await addMessage(conversationId, "agent", response, agentId);

      agentResponses.push({
        agentId,
        agentName: agent.name,
        response,
      });
    }

    // If there's only one agent, return its response directly
    if (agentResponses.length === 1) {
      return agentResponses[0].response;
    }

    // If there are multiple agents, use the orchestrator to synthesize responses
    const orchestratorResponse = await generateOrchestratorResponse(
      userMessage,
      agentResponses,
      history,
    );

    // Add the orchestrator's response to the conversation
    await addMessage(conversationId, "orchestrator", orchestratorResponse);

    return orchestratorResponse;
  } catch (error) {
    console.error("Error in collaborative consultation:", error);
    return "I encountered an error during the consultation process. Please try again later.";
  }
}
