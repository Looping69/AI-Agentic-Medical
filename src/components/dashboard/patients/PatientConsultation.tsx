import { useState, useEffect } from "react";
import { Patient } from "@/types/patients";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Brain,
  Clock,
  Send,
  User,
  Users,
  MessageSquare,
  FileText,
  Lightbulb,
  AlertCircle,
  Cpu,
  Plus,
  Pill,
  Activity,
} from "lucide-react";
import { AgentProps } from "@/components/dashboard/agents/AgentCard";

type MessageType = {
  id: string;
  role: "user" | "agent" | "system" | "orchestrator";
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  agentIcon?: any;
  highlighted?: boolean;
};

interface PatientConsultationProps {
  patient: Patient;
  onBack: () => void;
  onComplete: (consultation: any) => void;
  availableAgents: AgentProps[];
}

export default function PatientConsultation({
  patient,
  onBack,
  onComplete,
  availableAgents = [],
}: PatientConsultationProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<AgentProps[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState("");
  const [summary, setSummary] = useState({
    diagnosis: "",
    recommendations: [] as string[],
    nextSteps: [] as string[],
  });

  // Initialize with patient info
  useEffect(() => {
    setMessages([
      {
        id: "system-1",
        role: "system",
        content: `Starting consultation for patient: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`,
        timestamp: new Date(),
      },
    ]);

    // Pre-select the General Medicine agent if available
    const generalMedicine = availableAgents.find(
      (a) => a.name === "General Medicine",
    );
    if (generalMedicine) {
      setSelectedAgents([generalMedicine]);
    }

    // Pre-populate symptoms if patient has conditions
    if (patient.conditions && patient.conditions.length > 0) {
      setSymptoms(patient.conditions);
    }
  }, [patient, availableAgents]);

  const handleAgentToggle = (agent: AgentProps) => {
    if (selectedAgents.some((a) => a.id === agent.id)) {
      setSelectedAgents(selectedAgents.filter((a) => a.id !== agent.id));
    } else {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  const handleAddSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom.trim())) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom("");
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || isThinking) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsThinking(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      // First agent response
      if (selectedAgents.length > 0) {
        const firstAgentResponse = {
          id: `agent-${selectedAgents[0].id}-${Date.now()}`,
          role: "agent",
          content:
            "Based on the symptoms you've described, this could be consistent with seasonal allergies. The timing, presentation, and lack of fever are typical indicators. However, we should consider other respiratory conditions as well.",
          timestamp: new Date(),
          agentId: selectedAgents[0].id,
          agentName: selectedAgents[0].name,
          agentIcon: selectedAgents[0].icon,
        };

        setMessages((prev) => [...prev, firstAgentResponse]);

        // Second agent response after another delay if multiple agents
        if (selectedAgents.length > 1) {
          setTimeout(() => {
            const secondAgentResponse = {
              id: `agent-${selectedAgents[1].id}-${Date.now()}`,
              role: "agent",
              content:
                "I agree with my colleague's assessment. Based on the symptoms described, this appears to be a common presentation of seasonal allergies, though we should rule out respiratory infection.",
              timestamp: new Date(),
              agentId: selectedAgents[1].id,
              agentName: selectedAgents[1].name,
              agentIcon: selectedAgents[1].icon,
              highlighted: true,
            };

            setMessages((prev) => [...prev, secondAgentResponse]);

            // Final orchestrator response
            setTimeout(() => {
              const orchestratorResponse = {
                id: `orchestrator-${Date.now()}`,
                role: "orchestrator",
                content:
                  "After analyzing your symptoms and considering both agents' assessments, the most likely diagnosis is seasonal allergic rhinitis. I recommend starting with an over-the-counter antihistamine like loratadine, using saline nasal rinses, and monitoring for any worsening symptoms. If you develop a fever or symptoms worsen, please seek further medical attention as this could indicate a respiratory infection rather than allergies.",
                timestamp: new Date(),
                highlighted: true,
              };

              setMessages((prev) => [...prev, orchestratorResponse]);
              setIsThinking(false);

              // Update summary
              setSummary({
                diagnosis: "Seasonal allergic rhinitis",
                recommendations: [
                  "Over-the-counter antihistamine (e.g., loratadine 10mg daily)",
                  "Nasal saline rinse twice daily",
                  "Avoid known allergens when possible",
                  "Monitor for fever or worsening symptoms",
                ],
                nextSteps: [
                  "Follow up in 7-10 days if symptoms persist",
                  "Consider allergy testing if symptoms recur seasonally",
                  "Return sooner if symptoms worsen or new symptoms develop",
                ],
              });
            }, 1500);
          }, 1500);
        } else {
          // If only one agent, provide response and update summary
          setTimeout(() => {
            setIsThinking(false);
            setSummary({
              diagnosis: "Probable seasonal allergic rhinitis",
              recommendations: [
                "Over-the-counter antihistamine (e.g., loratadine 10mg daily)",
                "Nasal saline rinse twice daily",
                "Avoid known allergens when possible",
              ],
              nextSteps: [
                "Follow up in 7-10 days if symptoms persist",
                "Return sooner if symptoms worsen",
              ],
            });
          }, 1500);
        }
      } else {
        // No agents selected
        const systemMessage = {
          id: `system-${Date.now()}`,
          role: "system",
          content:
            "Please select at least one AI agent to assist with this consultation.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMessage]);
        setIsThinking(false);
      }
    }, 1500);
  };

  const handleCompleteConsultation = () => {
    // Create a new consultation record
    const newConsultation = {
      id: `C-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      symptoms: symptoms,
      diagnosis: summary.diagnosis,
      treatment: summary.recommendations.join("; "),
      notes: "AI-assisted consultation",
      aiAgents: selectedAgents.map((agent) => agent.name),
      recommendations: summary.recommendations,
      followUp: "2 weeks",
    };

    onComplete(newConsultation);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">AI Consultation</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleCompleteConsultation}
              disabled={!summary.diagnosis || symptoms.length === 0}
            >
              Complete Consultation
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-primary">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{patient.name}</h3>
              <div className="text-sm text-gray-500">
                {patient.age} years, {patient.gender} • ID: {patient.id}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-wrap gap-2 justify-end">
            {patient.conditions && patient.conditions.length > 0 && (
              <div className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Conditions:</span>
                {patient.conditions.slice(0, 2).map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
                {patient.conditions.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{patient.conditions.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {patient.medications && patient.medications.length > 0 && (
              <div className="flex items-center gap-1">
                <Pill className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Medications:</span>
                {patient.medications.slice(0, 2).map((med, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {med.name}
                  </Badge>
                ))}
                {patient.medications.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{patient.medications.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Summary
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-350px)]">
            {/* Symptoms Section */}
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {symptoms.map((symptom, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 py-1 pl-2 pr-1"
                    >
                      {symptom}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-primary/20 rounded-full"
                        onClick={() => handleRemoveSymptom(symptom)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add symptom..."
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSymptom();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddSymptom}
                    disabled={!newSymptom.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            {messages.map((message) => {
              const isUser = message.role === "user";
              const isSystem = message.role === "system";
              const isOrchestrator = message.role === "orchestrator";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[80%] ${isSystem ? "w-full justify-center" : ""} ${message.highlighted ? "border-l-4 border-primary pl-2" : ""}`}
                  >
                    {!isUser && !isSystem && (
                      <Avatar className="h-8 w-8 mr-2">
                        {isOrchestrator ? (
                          <Cpu className="h-5 w-5 text-primary" />
                        ) : message.agentIcon ? (
                          <message.agentIcon className="h-5 w-5 text-primary" />
                        ) : (
                          <Brain className="h-5 w-5 text-primary" />
                        )}
                        <AvatarFallback>
                          {isOrchestrator ? "O" : message.agentName?.[0] || "A"}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`rounded-lg p-3 ${isUser ? "bg-primary text-primary-foreground" : isSystem ? "bg-muted text-muted-foreground text-sm w-full text-center" : "bg-card border"}`}
                    >
                      {!isSystem && !isUser && !isOrchestrator && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-semibold text-sm">
                            {message.agentName || "AI Agent"}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {isOrchestrator ? "Orchestrator" : "Specialist"}
                          </Badge>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {!isSystem && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <Avatar className="h-8 w-8 ml-2">
                        <User className="h-5 w-5" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
            {isThinking && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%]">
                  <Avatar className="h-8 w-8 mr-2">
                    <Brain className="h-5 w-5 animate-pulse text-primary" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-card border">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                      <div
                        className="h-2 w-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-2 w-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a question about the patient..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="min-h-[60px]"
              />
              <Button
                onClick={handleSendMessage}
                disabled={
                  !newMessage.trim() ||
                  isThinking ||
                  selectedAgents.length === 0
                }
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="agents"
          className="p-4 m-0 max-h-[calc(100vh-350px)] overflow-y-auto"
        >
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Selected AI Agents</h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose the AI agents that will assist with this consultation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableAgents.map((agent) => {
                const isSelected = selectedAgents.some(
                  (a) => a.id === agent.id,
                );
                return (
                  <div
                    key={agent.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
                    onClick={() => handleAgentToggle(agent)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleAgentToggle(agent)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">
                            {agent.name}
                          </div>
                          {agent.isPremium && (
                            <Badge variant="outline" className="text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {agent.description}
                        </p>
                        {agent.specialties && agent.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {agent.specialties
                              .slice(0, 2)
                              .map((specialty, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            {agent.specialties.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{agent.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="summary"
          className="p-4 m-0 max-h-[calc(100vh-350px)] overflow-y-auto"
        >
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Diagnosis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summary.diagnosis ? (
                  <p>{summary.diagnosis}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    Diagnosis will appear here after consultation.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summary.recommendations.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {summary.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Recommendations will appear here after consultation.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summary.nextSteps.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {summary.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Next steps will appear here after consultation.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Consulting Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedAgents.length > 0 ? (
                    selectedAgents.map((agent) => (
                      <Badge
                        key={agent.id}
                        variant="secondary"
                        className="flex items-center gap-1 py-1 px-2"
                      >
                        <agent.icon className="h-3 w-3" />
                        {agent.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No agents selected. Please select agents in the Agents
                      tab.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>
    </div>
  );
}
