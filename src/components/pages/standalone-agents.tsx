import { useState } from "react";
import DashboardHeader from "../dashboard/layout/DashboardHeader";
import DashboardSidebar from "../dashboard/layout/DashboardSidebar";
import StandaloneAgentGrid from "../dashboard/agents/StandaloneAgentGrid";
import AgentCollaboration from "../dashboard/agents/AgentCollaboration";
import CollaborativeConsultation from "../dashboard/consultation/CollaborativeConsultation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Brain,
  Users,
  FileText,
  Activity,
  Heart,
  Microscope,
  Stethoscope,
} from "lucide-react";
import { AgentProps } from "../dashboard/agents/AgentCard";

export default function StandaloneAgentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSubscription] = useState<"free" | "premium">("free");
  const [consultationMode, setConsultationMode] = useState<
    "selection" | "collaboration" | "consultation"
  >("selection");
  const [selectedAgents, setSelectedAgents] = useState<AgentProps[]>([]);
  const [collaborationMode, setCollaborationMode] = useState<
    "solo" | "collaborative"
  >("collaborative");
  const [activeItem, setActiveItem] = useState("AI Agents");

  // Default agents data
  const defaultAgents: AgentProps[] = [
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
      specialties: ["FHIR Integration", "Patient History", "Trend Analysis"],
    },
    {
      id: "radiology",
      name: "Radiology Assistant",
      description:
        "Specialized in analyzing and interpreting medical imaging studies.",
      icon: FileText,
      isPremium: true,
      specialties: ["X-Ray", "CT Scan", "MRI", "Ultrasound"],
    },
    {
      id: "cardiology",
      name: "Cardiology Specialist",
      description:
        "Expert in cardiovascular conditions, ECG interpretation, and heart health.",
      icon: Heart,
      isPremium: true,
      specialties: ["ECG Analysis", "Heart Disease", "Risk Assessment"],
    },
    {
      id: "pathology",
      name: "Pathology Consultant",
      description:
        "Assists with laboratory test interpretation and disease diagnosis.",
      icon: Microscope,
      isPremium: true,
      specialties: ["Lab Results", "Histopathology", "Disease Markers"],
    },
    {
      id: "vitals-monitor",
      name: "Vitals Monitor",
      description:
        "Tracks and analyzes patient vital signs, alerting to concerning patterns.",
      icon: Activity,
      isPremium: false,
      specialties: ["BP Monitoring", "Heart Rate", "Respiratory Rate"],
    },
  ];

  const handleAgentSelect = (agentIds: string[]) => {
    // Find the selected agents
    const agents = defaultAgents.filter((a) => agentIds.includes(a.id));
    setSelectedAgents(agents);
    setConsultationMode("collaboration");
  };

  const handleAgentToggle = (agent: AgentProps) => {
    // If agent is already selected, remove it
    if (selectedAgents.some((a) => a.id === agent.id)) {
      setSelectedAgents(selectedAgents.filter((a) => a.id !== agent.id));
    } else {
      // If agent is not selected, add it (respecting solo/collaborative mode)
      if (collaborationMode === "solo") {
        setSelectedAgents([agent]);
      } else {
        const maxAgents = userSubscription === "premium" ? 5 : 2;
        if (selectedAgents.length < maxAgents) {
          setSelectedAgents([...selectedAgents, agent]);
        }
      }
    }
  };

  const handleStartCollaboration = (mode: "solo" | "collaborative") => {
    setCollaborationMode(mode);
    setConsultationMode("consultation");
  };

  const handleBackToSelection = () => {
    setConsultationMode("selection");
    setSelectedAgents([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex min-h-[calc(100vh-64px)]">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userSubscription={userSubscription}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />

        <main className="flex-1 p-6 pt-20 md:pt-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Medical Agents
            </h1>
            <p className="text-gray-600">
              Select and collaborate with specialized AI agents for patient
              diagnosis
            </p>
          </div>

          {consultationMode === "selection" && (
            <div className="grid grid-cols-1 gap-6">
              <StandaloneAgentGrid
                onMultiSelect={handleAgentSelect}
                userSubscription={userSubscription}
              />
            </div>
          )}

          {consultationMode === "collaboration" && (
            <>
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={handleBackToSelection}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Agent Selection
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <AgentCollaboration
                    selectedAgents={selectedAgents}
                    availableAgents={defaultAgents}
                    onAgentToggle={handleAgentToggle}
                    onStartCollaboration={handleStartCollaboration}
                    userSubscription={userSubscription}
                  />
                </div>

                <div>
                  <StandaloneAgentGrid
                    onMultiSelect={handleAgentSelect}
                    userSubscription={userSubscription}
                  />
                </div>
              </div>
            </>
          )}

          {consultationMode === "consultation" && (
            <>
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={handleBackToSelection}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> End Consultation
                </Button>
              </div>

              <div className="h-[calc(100vh-200px)]">
                <CollaborativeConsultation
                  agents={selectedAgents}
                  collaborationMode={collaborationMode}
                  onEndConsultation={handleBackToSelection}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
