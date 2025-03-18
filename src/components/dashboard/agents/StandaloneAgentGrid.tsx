import React, { useState, useEffect } from "react";
import {
  Brain,
  Activity,
  FileText,
  Microscope,
  Heart,
  Stethoscope,
  PlusCircle,
  Filter,
  Cpu,
} from "lucide-react";
import AgentCard, { AgentProps } from "./AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Mock data for agents
const mockAgents: AgentProps[] = [
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

interface StandaloneAgentGridProps {
  onAgentSelect?: (agentId: string) => void;
  onMultiSelect?: (agentIds: string[]) => void;
  userSubscription?: "free" | "premium";
}

export default function StandaloneAgentGrid({
  onAgentSelect = () => {},
  onMultiSelect = () => {},
  userSubscription = "free",
}: StandaloneAgentGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [detailAgent, setDetailAgent] = useState<AgentProps | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleAgentClick = (agentId: string) => {
    const agent = mockAgents.find((a) => a.id === agentId);
    if (agent) {
      setDetailAgent(agent);
      setShowDetailDialog(true);
    }
  };

  const handleAgentSelect = (agentId: string, selected: boolean) => {
    // If clicking on a premium agent while on free subscription, don't select it
    const agent = mockAgents.find((a) => a.id === agentId);
    if (agent?.isPremium && userSubscription === "free") {
      return;
    }

    if (selected) {
      setSelectedAgentIds([...selectedAgentIds, agentId]);
    } else {
      setSelectedAgentIds(selectedAgentIds.filter((id) => id !== agentId));
    }

    // Notify parent component about selection changes
    onMultiSelect(
      [...selectedAgentIds, agentId].filter((id) => selected || id !== agentId),
    );
  };

  const filteredAgents = mockAgents.filter((agent) => {
    // Filter by search query
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialties?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "free" && !agent.isPremium) ||
      (activeTab === "premium" && agent.isPremium);

    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AI Medical Agents</h2>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={selectedAgentIds.length === 0}
              onClick={() => onMultiSelect(selectedAgentIds)}
            >
              <Brain className="h-4 w-4" />
              Start Collaboration
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
        {filteredAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            {...agent}
            isActive={false}
            isSelected={selectedAgentIds.includes(agent.id)}
            onClick={handleAgentClick}
            onSelect={handleAgentSelect}
          />
        ))}

        {userSubscription === "premium" && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center h-full">
            <div className="p-3 rounded-full bg-gray-100 mb-3">
              <PlusCircle className="h-5 w-5 text-gray-500" />
            </div>
            <h3 className="font-medium mb-1">Request New Agent</h3>
            <p className="text-xs text-gray-500 mb-3">
              Need a specialized AI agent?
            </p>
            <Button variant="outline" size="sm">
              Request Agent
            </Button>
          </div>
        )}
      </div>

      {userSubscription === "free" && (
        <div className="p-4 bg-secondary border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary">
                Premium Agents Available
              </h3>
              <p className="text-sm text-gray-700">
                Upgrade to access all specialized medical agents
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Agent Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-md">
          {detailAgent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-secondary">
                    {detailAgent.icon &&
                      React.createElement(detailAgent.icon, {
                        className: "h-5 w-5 text-primary",
                      })}
                  </div>
                  <DialogTitle>{detailAgent.name}</DialogTitle>
                </div>
                <DialogDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {detailAgent.isPremium ? (
                      <Badge className="bg-secondary text-primary hover:bg-secondary">
                        Premium Agent
                      </Badge>
                    ) : (
                      <Badge className="bg-secondary text-primary hover:bg-secondary">
                        Free Agent
                      </Badge>
                    )}
                    {detailAgent.modelName && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Cpu className="h-3 w-3" />
                        {detailAgent.modelName}
                      </Badge>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-gray-600">
                    {detailAgent.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {detailAgent.specialties?.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Analyze patient symptoms and medical history</li>
                    <li>Provide evidence-based recommendations</li>
                    <li>
                      Collaborate with other AI agents for comprehensive
                      analysis
                    </li>
                    <li>Generate detailed medical reports</li>
                    <li>
                      Maintain its own knowledge base for specialized insights
                    </li>
                  </ul>
                </div>
              </div>

              <DialogFooter className="flex sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailDialog(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleAgentSelect(
                      detailAgent.id,
                      !selectedAgentIds.includes(detailAgent.id),
                    );
                    setShowDetailDialog(false);
                  }}
                >
                  {selectedAgentIds.includes(detailAgent.id)
                    ? "Deselect Agent"
                    : "Select Agent"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
