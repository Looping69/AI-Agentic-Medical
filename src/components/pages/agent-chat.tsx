import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SingleAgentConsultation from "@/components/dashboard/agents/SingleAgentConsultation";
import { useAgents } from "@/components/dashboard/agents/AgentProvider";
import { LoadingScreen } from "@/components/ui/loading-spinner";

export default function AgentChatPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { agents, loading, error } = useAgents();

  // Find the selected agent
  const selectedAgent = agents.find((agent) => agent.id === agentId);

  const handleBack = () => {
    navigate("/dashboard/agents");
  };

  if (loading) {
    return <LoadingScreen text="Loading agent..." />;
  }

  if (error || !selectedAgent) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agents
        </Button>

        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error || "Agent not found. Please select a different agent."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agents
      </Button>

      <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-180px)]">
        <SingleAgentConsultation agent={selectedAgent} onClose={handleBack} />
      </div>
    </div>
  );
}
