import { supabase } from "./supabase-client";
import { AIAgent } from "@/types/database";

export const getAgents = async (isPremium?: boolean): Promise<AIAgent[]> => {
  try {
    let query = supabase.from("ai_agents").select("*");

    if (isPremium !== undefined) {
      query = query.eq("is_premium", isPremium);
    }

    const { data, error } = await query.order("name");

    if (error) throw error;
    return data as AIAgent[];
  } catch (error) {
    console.error("Error getting agents:", error);
    return [];
  }
};

export const getAgentById = async (id: string): Promise<AIAgent | null> => {
  try {
    const { data, error } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as AIAgent;
  } catch (error) {
    console.error("Error getting agent:", error);
    return null;
  }
};

export const createAgent = async (
  agent: Omit<AIAgent, "created_at" | "updated_at">,
): Promise<AIAgent | null> => {
  try {
    const { data, error } = await supabase
      .from("ai_agents")
      .insert(agent)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgent;
  } catch (error) {
    console.error("Error creating agent:", error);
    return null;
  }
};

export const updateAgent = async (
  id: string,
  updates: Partial<AIAgent>,
): Promise<AIAgent | null> => {
  try {
    const { data, error } = await supabase
      .from("ai_agents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgent;
  } catch (error) {
    console.error("Error updating agent:", error);
    return null;
  }
};

export const deleteAgent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("ai_agents").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting agent:", error);
    return false;
  }
};
