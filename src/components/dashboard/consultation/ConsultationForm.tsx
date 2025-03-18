import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageSquare, Stethoscope, Users } from "lucide-react";
import PatientSearchDropdown from "../patients/PatientSearchDropdown";
import PredefinedQuestionsDropdown from "./PredefinedQuestionsDropdown";
import { AgentProps } from "../agents/AgentProvider";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string;
};

interface ConsultationFormProps {
  agents: AgentProps[];
  patients: Patient[];
  onStartConsultation: (data: {
    title: string;
    description: string;
    patientId: string;
    agentIds: string[];
    isCollaborative: boolean;
  }) => void;
}

export default function ConsultationForm({
  agents,
  patients,
  onStartConsultation,
}: ConsultationFormProps) {
  const [consultationType, setConsultationType] = useState<
    "solo" | "collaborative"
  >("solo");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const handleAddQuestion = (question: string) => {
    setDescription((prev) => {
      if (prev) return `${prev}\n\n${question}`;
      return question;
    });
  };

  const handleAgentSelection = (agentId: string) => {
    if (consultationType === "solo") {
      setSelectedAgents([agentId]);
    } else {
      setSelectedAgents((prev) => {
        if (prev.includes(agentId)) {
          return prev.filter((id) => id !== agentId);
        } else {
          return [...prev, agentId];
        }
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedPatient || selectedAgents.length === 0 || !title) return;

    onStartConsultation({
      title,
      description,
      patientId: selectedPatient.id,
      agentIds: selectedAgents,
      isCollaborative: consultationType === "collaborative",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          New Consultation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient</Label>
            <PatientSearchDropdown
              patients={patients}
              selectedPatient={selectedPatient}
              onPatientSelect={setSelectedPatient}
              placeholder="Search for a patient"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Consultation Title</Label>
            <Input
              id="title"
              placeholder="E.g., Follow-up appointment, Initial assessment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Description & Symptoms</Label>
              <PredefinedQuestionsDropdown
                onSelectQuestion={handleAddQuestion}
              />
            </div>
            <Textarea
              id="description"
              placeholder="Describe the patient's symptoms and concerns..."
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Consultation Type</Label>
            <Tabs
              value={consultationType}
              onValueChange={(value) => {
                setConsultationType(value as "solo" | "collaborative");
                setSelectedAgents([]);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="solo" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Solo Agent
                </TabsTrigger>
                <TabsTrigger
                  value="collaborative"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Collaborative
                </TabsTrigger>
              </TabsList>

              <TabsContent value="solo" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedAgents.includes(agent.id) ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
                      onClick={() => handleAgentSelection(agent.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-full ${selectedAgents.includes(agent.id) ? "bg-primary/10" : "bg-gray-100"}`}
                        >
                          <agent.icon
                            className={`h-4 w-4 ${selectedAgents.includes(agent.id) ? "text-primary" : "text-gray-500"}`}
                          />
                        </div>
                        <span className="font-medium text-sm">
                          {agent.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="collaborative" className="pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Select multiple AI agents to collaborate on this
                    consultation.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedAgents.includes(agent.id) ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
                        onClick={() => handleAgentSelection(agent.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded-full ${selectedAgents.includes(agent.id) ? "bg-primary/10" : "bg-gray-100"}`}
                          >
                            <agent.icon
                              className={`h-4 w-4 ${selectedAgents.includes(agent.id) ? "text-primary" : "text-gray-500"}`}
                            />
                          </div>
                          <span className="font-medium text-sm">
                            {agent.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!selectedPatient || selectedAgents.length === 0 || !title}
          >
            {consultationType === "solo"
              ? "Start Consultation"
              : "Start Collaborative Session"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
