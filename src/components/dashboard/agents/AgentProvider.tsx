import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAgents,
  getAIModels,
  AIAgent,
  AIModel,
} from "@/lib/ai/agent-service";
import { Brain, FileText, Heart, Microscope, Activity } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface AgentContextType {
  agents: AgentProps[];
  loading: boolean;
  error: string | null;
  refreshAgents: () => Promise<void>;
  getIconComponent: (iconName: string) => LucideIcon;
}

export interface AgentProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isPremium: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  specialties?: string[];
  systemPrompt?: string;
  modelId?: string;
  modelName?: string;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<AgentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<AIModel[]>([]);

  // Function to map icon names to Lucide icon components
  const getIconComponent = (iconName: string): LucideIcon => {
    switch (iconName) {
      case "Brain":
        return Brain;
      case "FileText":
        return FileText;
      case "Heart":
        return Heart;
      case "Microscope":
        return Microscope;
      case "Activity":
        return Activity;
      default:
        return Brain; // Default icon
    }
  };

  const loadAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch models first
      const aiModels = await getAIModels();
      setModels(aiModels);

      // Then fetch agents
      const aiAgents = await getAgents();

      // Transform the agents data to match our UI components
      const transformedAgents: AgentProps[] = aiAgents.map((agent) => {
        const model = aiModels.find((m) => m.id === agent.model_id);
        return {
          id: agent.id,
          name: agent.name,
          description: agent.description || "",
          icon: getIconComponent(agent.icon_name),
          isPremium: agent.is_premium,
          specialties: agent.specialty.split(",").map((s) => s.trim()),
          systemPrompt: agent.system_prompt,
          modelId: agent.model_id,
          modelName: model?.name || "Unknown Model",
        };
      });

      setAgents(transformedAgents);
    } catch (err) {
      console.error("Error loading agents:", err);
      setError("Failed to load AI agents. Please try again later.");

      // Fallback to default agents if API fails
      setAgents([
        {
          id: "general-medicine",
          name: "General Medicine",
          description:
            "Comprehensive medical knowledge covering common conditions, symptoms, and treatments.",
          icon: Brain,
          isPremium: false,
          specialties: [
            "Symptom Analysis",
            "Treatment Suggestions",
            "Patient Education",
          ],
        },
        {
          id: "medical-records",
          name: "Medical Records",
          description:
            "Intelligent EHR assistant that helps organize and analyze patient records efficiently.",
          icon: FileText,
          isPremium: false,
          specialties: [
            "FHIR Integration",
            "Patient History",
            "Trend Analysis",
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load agents on component mount
  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <AgentContext.Provider
      value={{
        agents,
        loading,
        error,
        refreshAgents: loadAgents,
        getIconComponent,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgents must be used within an AgentProvider");
  }
  return context;
}
