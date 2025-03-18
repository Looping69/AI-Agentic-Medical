import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  FileText,
  MessageSquare,
  User,
  Clock,
  Brain,
  Stethoscope,
  Users,
} from "lucide-react";
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

type Message = {
  id: string;
  role: "user" | "agent";
  agentId?: string;
  content: string;
  timestamp: Date;
};

interface EnhancedConsultationWorkspaceProps {
  isCollaborative?: boolean;
  agents: AgentProps[];
  patients: Patient[];
  initialPatient?: Patient | null;
  initialAgents?: AgentProps[];
  onSendMessage?: (
    message: string,
    patientId: string,
    agentIds: string[],
  ) => Promise<void>;
}

export default function EnhancedConsultationWorkspace({
  isCollaborative = false,
  agents,
  patients,
  initialPatient = null,
  initialAgents = [],
  onSendMessage,
}: EnhancedConsultationWorkspaceProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    initialPatient,
  );
  const [selectedAgents, setSelectedAgents] =
    useState<AgentProps[]>(initialAgents);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "patient-info">("chat");
  const [isLoading, setIsLoading] = useState(false);

  // Add initial messages when agents are selected
  useEffect(() => {
    if (selectedAgents.length > 0 && messages.length === 0) {
      const initialMessages: Message[] = selectedAgents.map((agent) => ({
        id: `agent-${agent.id}-${Date.now()}`,
        role: "agent",
        agentId: agent.id,
        content: `Hello, I'm the ${agent.name} specialist. How can I assist with this consultation?`,
        timestamp: new Date(),
      }));

      setMessages(initialMessages);
    }
  }, [selectedAgents]);

  const handleAddQuestion = (question: string) => {
    setNewMessage((prev) => {
      if (prev) return `${prev}\n\n${question}`;
      return question;
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient || selectedAgents.length === 0)
      return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      // Call the onSendMessage prop if provided
      if (onSendMessage) {
        await onSendMessage(
          newMessage,
          selectedPatient.id,
          selectedAgents.map((agent) => agent.id),
        );
      }

      // Simulate agent responses (in a real app, these would come from the backend)
      setTimeout(() => {
        const agentResponses: Message[] = selectedAgents.map((agent) => ({
          id: `agent-${agent.id}-${Date.now() + Math.random() * 1000}`,
          role: "agent",
          agentId: agent.id,
          content: `This is a simulated response from ${agent.name} regarding "${newMessage.substring(0, 30)}${newMessage.length > 30 ? "..." : ""}".`,
          timestamp: new Date(),
        }));

        setMessages((prev) => [...prev, ...agentResponses]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error in consultation:", error);
      setIsLoading(false);
    }
  };

  // Find agent by ID
  const getAgentById = (agentId?: string) => {
    if (!agentId) return null;
    return agents.find((a) => a.id === agentId) || null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          {isCollaborative ? (
            <Users className="h-5 w-5 text-primary" />
          ) : (
            <Stethoscope className="h-5 w-5 text-primary" />
          )}
          <h2 className="text-lg font-semibold">
            {isCollaborative
              ? "Collaborative Consultation"
              : "Patient Consultation"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <TabsList>
            <TabsTrigger
              value="chat"
              onClick={() => setActiveTab("chat")}
              className={
                activeTab === "chat" ? "bg-primary text-primary-foreground" : ""
              }
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="patient-info"
              onClick={() => setActiveTab("patient-info")}
              className={
                activeTab === "patient-info"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Patient Info
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {activeTab === "chat" ? (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  const agent = message.agentId
                    ? getAgentById(message.agentId)
                    : null;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex max-w-[80%]">
                        {!isUser && agent && (
                          <Avatar className="h-8 w-8 mr-2">
                            {agent.icon && (
                              <agent.icon className="h-5 w-5 text-primary" />
                            )}
                            <AvatarFallback>
                              {agent.name?.[0] || "A"}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`rounded-lg p-3 ${isUser ? "bg-primary text-primary-foreground" : "bg-card border"}`}
                        >
                          {!isUser && agent && (
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs font-medium text-primary">
                                {agent.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 h-4"
                              >
                                {agent.specialties?.[0] || "Specialist"}
                              </Badge>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>

                        {isUser && (
                          <Avatar className="h-8 w-8 ml-2 bg-blue-100">
                            <User className="h-5 w-5 text-blue-600" />
                            <AvatarFallback>Dr</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  );
                })}

                {messages.length === 0 && !selectedPatient && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6 max-w-md">
                      <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Start a Consultation
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select a patient and AI agents to begin a new
                        consultation.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <PatientSearchDropdown
                      patients={patients}
                      selectedPatient={selectedPatient}
                      onPatientSelect={setSelectedPatient}
                      placeholder="Select a patient"
                      className="max-w-xs"
                    />
                  </div>
                  <div className="flex-1 flex justify-end">
                    <PredefinedQuestionsDropdown
                      onSelectQuestion={handleAddQuestion}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder={
                      selectedPatient
                        ? "Type your message..."
                        : "Select a patient to start consultation..."
                    }
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[60px]"
                    disabled={
                      !selectedPatient ||
                      selectedAgents.length === 0 ||
                      isLoading
                    }
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      !newMessage.trim() ||
                      !selectedPatient ||
                      selectedAgents.length === 0 ||
                      isLoading
                    }
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              {selectedPatient ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.id}`}
                      />
                      <AvatarFallback>{`${selectedPatient.firstName[0]}${selectedPatient.lastName[0]}`}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h2>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        {selectedPatient.dateOfBirth && (
                          <span>
                            DOB:{" "}
                            {new Date(
                              selectedPatient.dateOfBirth,
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {selectedPatient.gender && (
                          <>
                            <span>•</span>
                            <span>Gender: {selectedPatient.gender}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Medical History
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.medicalHistory ||
                        "No medical history recorded."}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Consultation Agents
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedAgents.map((agent) => (
                        <Card key={agent.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-secondary">
                                <agent.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{agent.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {agent.specialties?.[0] || "Specialist"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6 max-w-md">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Patient Selected
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please select a patient to view their information.
                    </p>
                    <PatientSearchDropdown
                      patients={patients}
                      selectedPatient={selectedPatient}
                      onPatientSelect={setSelectedPatient}
                      placeholder="Select a patient"
                      className="max-w-xs mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar for agents */}
        {isCollaborative && (
          <div className="w-64 border-l p-4 hidden md:block">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Agents
            </h3>
            <div className="space-y-2">
              {agents.map((agent) => {
                const isSelected = selectedAgents.some(
                  (a) => a.id === agent.id,
                );
                return (
                  <div
                    key={agent.id}
                    className={`p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAgents(
                          selectedAgents.filter((a) => a.id !== agent.id),
                        );
                      } else {
                        setSelectedAgents([...selectedAgents, agent]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1 rounded-full ${isSelected ? "bg-primary/10" : "bg-gray-100"}`}
                      >
                        <agent.icon
                          className={`h-3.5 w-3.5 ${isSelected ? "text-primary" : "text-gray-500"}`}
                        />
                      </div>
                      <span className="text-sm">{agent.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
