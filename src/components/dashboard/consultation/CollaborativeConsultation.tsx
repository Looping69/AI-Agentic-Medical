import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
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
  Stethoscope,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { AgentProps } from "../agents/AgentProvider";
import {
  performCollaborativeConsultation,
  addMessage,
  createConversation,
  getConversationMessages,
} from "@/lib/ai/agent-service";
import { useAuth } from "../../../../supabase/auth";

// Mock user for storyboard/testing environments
const MOCK_USER = { id: "mock-user-id", email: "doctor@example.com" };

type MessageType = {
  id: string;
  role: "user" | "agent" | "system" | "orchestrator" | "doctor";
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  agentIcon?: React.ReactNode;
  highlighted?: boolean;
  isLoading?: boolean;
  isQuestion?: boolean;
};

interface CollaborativeConsultationProps {
  agents: AgentProps[];
  collaborationMode: "solo" | "collaborative";
  onEndConsultation: () => void;
  patientInfo?: {
    name: string;
    age: number;
    symptoms: string[];
  };
}

export default function CollaborativeConsultation({
  agents = [],
  collaborationMode = "solo",
  onEndConsultation = () => {},
  patientInfo = {
    name: "John Doe",
    age: 45,
    symptoms: ["Persistent cough", "Fatigue", "Mild fever"],
  },
}: CollaborativeConsultationProps) {
  // Try to use auth context, but provide a fallback for storyboard/testing
  const auth = { user: MOCK_USER };
  try {
    const authContext = useAuth();
    if (authContext && authContext.user) {
      auth.user = authContext.user;
    }
  } catch (error) {
    console.log("Auth context not available, using mock user");
    // Continue with mock user
  }
  const { user } = auth;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "summary">("chat");
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [agentThinking, setAgentThinking] = useState<string | null>(null);
  const [agentQueue, setAgentQueue] = useState<AgentProps[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<{
    diagnosis: string;
    recommendations: string[];
    nextSteps: string[];
  }>({ diagnosis: "", recommendations: [], nextSteps: [] });

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initialize the chat with a system message and create a conversation
  useEffect(() => {
    const initializeConsultation = async () => {
      // Always proceed with either real or mock user

      // Create a new conversation in the database
      const newConversationId = await createConversation(
        user.id,
        `Consultation for ${patientInfo.name}`,
      );

      if (newConversationId) {
        setConversationId(newConversationId);

        // Add initial system messages to the conversation
        const initialSystemMessage =
          collaborationMode === "collaborative"
            ? `Collaborative diagnosis started with ${agents.length} agents: ${agents.map((a) => a.name).join(", ")}`
            : `Diagnosis started with ${agents[0]?.name}`;

        const patientInfoText = `Patient: ${patientInfo.name}, Age: ${patientInfo.age}, Symptoms: ${patientInfo.symptoms.join(", ")}`;

        await addMessage(newConversationId, "system", initialSystemMessage);
        await addMessage(newConversationId, "system", patientInfoText);

        // Set initial messages in the UI
        const initialMessage: MessageType = {
          id: "system-1",
          role: "system",
          content: initialSystemMessage,
          timestamp: new Date(),
        };

        const patientInfoMessage: MessageType = {
          id: "system-2",
          role: "system",
          content: patientInfoText,
          timestamp: new Date(),
        };

        setMessages([initialMessage, patientInfoMessage]);

        // Start the agent conversation
        startAgentConversation(patientInfoText, newConversationId);
      }
    };

    initializeConsultation();
  }, [user]);

  // Function to start the agent conversation
  const startAgentConversation = async (
    initialPrompt: string,
    convoId: string,
  ) => {
    if (agents.length === 0) return;

    // Add a loading message for the first agent
    const firstAgent = agents[0];
    const loadingMessage: MessageType = {
      id: `agent-loading-${Date.now()}`,
      role: "agent",
      content: "",
      timestamp: new Date(),
      agentId: firstAgent.id,
      agentName: firstAgent.name,
      agentIcon: firstAgent.icon && (
        <firstAgent.icon className="h-5 w-5 text-primary" />
      ),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);
    setAgentThinking(firstAgent.id);

    try {
      // Generate the first agent's response
      const initialPromptForAgent = `You are a medical AI assistant specializing in ${firstAgent.name}. Please analyze the following patient information and provide your initial thoughts: ${initialPrompt}`;

      const response = await performCollaborativeConsultation(
        initialPromptForAgent,
        [firstAgent.id],
        convoId,
        user.id,
      );

      // Remove the loading message and add the real response
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) => m.id !== `agent-loading-${Date.now()}`,
        );
        const agentResponse: MessageType = {
          id: `agent-${firstAgent.id}-${Date.now()}`,
          role: "agent",
          content: response,
          timestamp: new Date(),
          agentId: firstAgent.id,
          agentName: firstAgent.name,
          agentIcon: firstAgent.icon && (
            <firstAgent.icon className="h-5 w-5 text-primary" />
          ),
        };
        return [...filtered, agentResponse];
      });

      // Queue up the next agent if in collaborative mode
      if (collaborationMode === "collaborative" && agents.length > 1) {
        const remainingAgents = agents.slice(1);
        setAgentQueue(remainingAgents);
        processNextAgent(convoId, initialPrompt, response);
      }
    } catch (error) {
      console.error("Error starting agent conversation:", error);
      // Add an error message
      const errorMessage: MessageType = {
        id: `error-${Date.now()}`,
        role: "system",
        content:
          "I encountered an error starting the consultation. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setAgentThinking(null);
    }

    // Initialize summary after a delay
    setTimeout(() => {
      updateConsultationSummary();
    }, 3000);
  };

  // Process the next agent in the queue
  const processNextAgent = async (
    convoId: string,
    patientInfo: string,
    previousResponse: string,
  ) => {
    if (!user || agentQueue.length === 0) return;

    const nextAgent = agentQueue[0];
    const remainingAgents = agentQueue.slice(1);
    setAgentQueue(remainingAgents);

    // Add a loading message for this agent
    const loadingMessage: MessageType = {
      id: `agent-loading-${nextAgent.id}-${Date.now()}`,
      role: "agent",
      content: "",
      timestamp: new Date(),
      agentId: nextAgent.id,
      agentName: nextAgent.name,
      agentIcon: nextAgent.icon && (
        <nextAgent.icon className="h-5 w-5 text-primary" />
      ),
      isLoading: true,
      highlighted: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);
    setAgentThinking(nextAgent.id);

    try {
      // Generate this agent's response, considering the previous agent's response
      const promptForAgent = `You are a medical AI assistant specializing in ${nextAgent.name}. 
      Please review the patient information: ${patientInfo}
      
      Your colleague has already provided this analysis: "${previousResponse}"
      
      Please add your perspective, focusing on your specialty. You may agree or disagree with your colleague, but provide your unique insights.`;

      const response = await performCollaborativeConsultation(
        promptForAgent,
        [nextAgent.id],
        convoId,
        user.id,
      );

      // Remove the loading message and add the real response
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) => m.id !== `agent-loading-${nextAgent.id}-${Date.now()}`,
        );
        const agentResponse: MessageType = {
          id: `agent-${nextAgent.id}-${Date.now()}`,
          role: "agent",
          content: response,
          timestamp: new Date(),
          agentId: nextAgent.id,
          agentName: nextAgent.name,
          agentIcon: nextAgent.icon && (
            <nextAgent.icon className="h-5 w-5 text-primary" />
          ),
          highlighted: true,
        };
        return [...filtered, agentResponse];
      });

      // Process the next agent if there are more in the queue
      if (remainingAgents.length > 0) {
        processNextAgent(convoId, patientInfo, response);
      } else {
        // All agents have responded, now ask a question to the doctor
        setTimeout(() => {
          const randomAgent = agents[Math.floor(Math.random() * agents.length)];
          const questionMessage: MessageType = {
            id: `agent-question-${Date.now()}`,
            role: "agent",
            content:
              "Doctor, could you provide more details about when these symptoms first appeared and if there are any relevant factors in the patient's medical history?",
            timestamp: new Date(),
            agentId: randomAgent.id,
            agentName: randomAgent.name,
            agentIcon: randomAgent.icon && (
              <randomAgent.icon className="h-5 w-5 text-primary" />
            ),
            isQuestion: true,
            highlighted: true,
          };
          setMessages((prev) => [...prev, questionMessage]);

          // Add this question to the database
          if (convoId) {
            addMessage(
              convoId,
              "agent",
              questionMessage.content,
              randomAgent.id,
            );
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error processing next agent:", error);
      // Add an error message
      const errorMessage: MessageType = {
        id: `error-${Date.now()}`,
        role: "system",
        content:
          "I encountered an error with one of the consulting agents. Please continue with the available information.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Try to process the next agent anyway
      if (remainingAgents.length > 0) {
        processNextAgent(convoId, patientInfo, previousResponse);
      }
    } finally {
      setAgentThinking(null);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isThinking || !conversationId) return;

    // Add doctor message
    const doctorMessage: MessageType = {
      id: `doctor-${Date.now()}`,
      role: "doctor",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, doctorMessage]);
    setNewMessage("");
    setIsThinking(true);

    try {
      // Add the doctor's message to the conversation in the database
      await addMessage(conversationId, "user", newMessage);

      // Determine which agent should respond first (randomly select one)
      const respondingAgentIndex = Math.floor(Math.random() * agents.length);
      const respondingAgent = agents[respondingAgentIndex];

      // Add a loading message for the responding agent
      const loadingMessage: MessageType = {
        id: `agent-loading-${respondingAgent.id}-${Date.now()}`,
        role: "agent",
        content: "",
        timestamp: new Date(),
        agentId: respondingAgent.id,
        agentName: respondingAgent.name,
        agentIcon: respondingAgent.icon && (
          <respondingAgent.icon className="h-5 w-5 text-primary" />
        ),
        isLoading: true,
      };

      setMessages((prev) => [...prev, loadingMessage]);
      setAgentThinking(respondingAgent.id);

      // Get the conversation history to provide context
      const conversationHistory = await getConversationMessages(conversationId);
      const historyContext = conversationHistory
        .slice(-10) // Get the last 10 messages for context
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      // Generate the agent's response
      const promptForAgent = `You are a medical AI assistant specializing in ${respondingAgent.name}. 
      The doctor has just said: "${newMessage}"
      
      Here is the recent conversation history for context:
      ${historyContext}
      
      Please respond to the doctor's message, focusing on your specialty. If appropriate, ask follow-up questions to gather more information.`;

      const response = await performCollaborativeConsultation(
        promptForAgent,
        [respondingAgent.id],
        conversationId,
        user.id,
      );

      // Remove the loading message and add the real response
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) => m.id !== `agent-loading-${respondingAgent.id}-${Date.now()}`,
        );
        const agentResponse: MessageType = {
          id: `agent-${respondingAgent.id}-${Date.now()}`,
          role: "agent",
          content: response,
          timestamp: new Date(),
          agentId: respondingAgent.id,
          agentName: respondingAgent.name,
          agentIcon: respondingAgent.icon && (
            <respondingAgent.icon className="h-5 w-5 text-primary" />
          ),
          isQuestion:
            response.includes("?") ||
            response.toLowerCase().includes("could you") ||
            response.toLowerCase().includes("can you"),
        };
        return [...filtered, agentResponse];
      });

      // If in collaborative mode, have another agent respond
      if (collaborationMode === "collaborative" && agents.length > 1) {
        // Select a different agent to respond
        const otherAgents = agents.filter((a) => a.id !== respondingAgent.id);
        const secondAgentIndex = Math.floor(Math.random() * otherAgents.length);
        const secondAgent = otherAgents[secondAgentIndex];

        setTimeout(async () => {
          // Add a loading message for the second agent
          const secondLoadingMessage: MessageType = {
            id: `agent-loading-${secondAgent.id}-${Date.now()}`,
            role: "agent",
            content: "",
            timestamp: new Date(),
            agentId: secondAgent.id,
            agentName: secondAgent.name,
            agentIcon: secondAgent.icon && (
              <secondAgent.icon className="h-5 w-5 text-primary" />
            ),
            isLoading: true,
            highlighted: true,
          };

          setMessages((prev) => [...prev, secondLoadingMessage]);
          setAgentThinking(secondAgent.id);

          try {
            // Generate the second agent's response
            const promptForSecondAgent = `You are a medical AI assistant specializing in ${secondAgent.name}. 
            The doctor has just said: "${newMessage}"
            
            Your colleague (${respondingAgent.name}) has responded with: "${response}"
            
            Here is the recent conversation history for context:
            ${historyContext}
            
            Please add your perspective to the conversation, focusing on your specialty. You may agree or disagree with your colleague, but provide your unique insights.`;

            const secondResponse = await performCollaborativeConsultation(
              promptForSecondAgent,
              [secondAgent.id],
              conversationId,
              user.id,
            );

            // Remove the loading message and add the real response
            setMessages((prev) => {
              const filtered = prev.filter(
                (m) => m.id !== `agent-loading-${secondAgent.id}-${Date.now()}`,
              );
              const secondAgentResponse: MessageType = {
                id: `agent-${secondAgent.id}-${Date.now()}`,
                role: "agent",
                content: secondResponse,
                timestamp: new Date(),
                agentId: secondAgent.id,
                agentName: secondAgent.name,
                agentIcon: secondAgent.icon && (
                  <secondAgent.icon className="h-5 w-5 text-primary" />
                ),
                highlighted: true,
                isQuestion:
                  secondResponse.includes("?") ||
                  secondResponse.toLowerCase().includes("could you") ||
                  secondResponse.toLowerCase().includes("can you"),
              };
              return [...filtered, secondAgentResponse];
            });
          } catch (error) {
            console.error("Error getting second agent response:", error);
            setMessages((prev) => {
              const filtered = prev.filter(
                (m) => m.id !== `agent-loading-${secondAgent.id}-${Date.now()}`,
              );
              return filtered;
            });
          } finally {
            setAgentThinking(null);
          }
        }, 2000);
      }

      // Update the summary after all responses
      updateConsultationSummary();
    } catch (error) {
      console.error("Error in consultation:", error);
      // Add an error message
      const errorMessage: MessageType = {
        id: `error-${Date.now()}`,
        role: "system",
        content:
          "I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  // Function to add a new agent to the consultation
  const addNewAgent = () => {
    // This would typically open a modal to select a new agent
    // For now, we'll just simulate adding a predefined agent
    const newAgent: AgentProps = {
      id: "pathology",
      name: "Pathology Consultant",
      description:
        "Assists with laboratory test interpretation and disease diagnosis.",
      icon: Microscope,
      isPremium: true,
      specialties: ["Lab Results", "Histopathology", "Disease Markers"],
    };

    // Add the agent to the conversation
    const systemMessage: MessageType = {
      id: `system-${Date.now()}`,
      role: "system",
      content: `${newAgent.name} has joined the consultation.`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, systemMessage]);

    // In a real implementation, you would update the agents list
    // and potentially notify the backend about the new agent
  };

  const updateConsultationSummary = () => {
    // In a real application, this would be generated by an AI based on the conversation
    // For now, we'll use a static example
    setSummary({
      diagnosis:
        "Probable seasonal allergic rhinitis with mild upper respiratory symptoms.",
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
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border shadow-sm">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "chat" | "summary")}
          className="w-full"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {collaborationMode === "collaborative"
                  ? "Collaborative Consultation"
                  : `Consultation with ${agents[0]?.name || "AI Agent"}`}
              </h2>
              <Badge variant="outline" className="ml-2">
                {patientInfo.name}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={addNewAgent}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Add Agent
              </Button>
              <TabsList>
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className="flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Summary
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isUser = message.role === "user";
                const isDoctor = message.role === "doctor";
                const isSystem = message.role === "system";
                const isOrchestrator = message.role === "orchestrator";
                const isAgent = message.role === "agent";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser || isDoctor ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-[80%] ${isSystem ? "w-full justify-center" : ""} ${message.highlighted ? "border-l-4 border-primary pl-2" : ""} ${message.isQuestion && isAgent ? "border-l-4 border-amber-400 pl-2" : ""}`}
                    >
                      {!isUser && !isDoctor && !isSystem && (
                        <Avatar className="h-8 w-8 mr-2">
                          {isOrchestrator ? (
                            <Cpu className="h-5 w-5 text-primary" />
                          ) : message.agentIcon ? (
                            message.agentIcon
                          ) : (
                            <Brain className="h-5 w-5 text-primary" />
                          )}
                          <AvatarFallback>
                            {isOrchestrator
                              ? "O"
                              : message.agentName?.[0] || "A"}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`rounded-lg p-3 ${isUser || isDoctor ? "bg-primary text-primary-foreground" : isSystem ? "bg-muted text-muted-foreground text-sm w-full text-center" : message.isLoading ? "bg-card border min-w-[100px]" : "bg-card border"}`}
                      >
                        {!isSystem &&
                          !isUser &&
                          !isDoctor &&
                          !isOrchestrator &&
                          !message.isLoading && (
                            <div className="flex items-center gap-1 mb-1">
                              <span className="font-semibold text-sm">
                                {message.agentName || "AI Agent"}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {isOrchestrator ? "Orchestrator" : "Specialist"}
                              </Badge>
                              {message.isQuestion && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-amber-100 text-amber-800 border-amber-200"
                                >
                                  Question
                                </Badge>
                              )}
                            </div>
                          )}
                        {message.isLoading ? (
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
                        ) : (
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        )}
                        <div className="text-xs opacity-70 mt-1">
                          {!isSystem && !message.isLoading && (
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

                      {(isUser || isDoctor) && (
                        <Avatar className="h-8 w-8 ml-2 bg-blue-100">
                          <User className="h-5 w-5 text-blue-600" />
                          <AvatarFallback>Dr</AvatarFallback>
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
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
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
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Respond as the doctor..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[60px]"
                  disabled={isThinking || agentThinking !== null}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !newMessage.trim() || isThinking || agentThinking !== null
                  }
                  size="icon"
                  className="h-[60px] w-[60px]"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {agentThinking ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>
                      {agents.find((a) => a.id === agentThinking)?.name ||
                        "Agent"}{" "}
                      is thinking...
                    </span>
                  </div>
                ) : (
                  <span>Press Enter to send, Shift+Enter for new line</span>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="flex-1 p-0 m-0">
            <div className="p-4 space-y-4 h-full overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{summary.diagnosis}</p>
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
                  <ul className="list-disc pl-5 space-y-1">
                    {summary.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
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
                  <ul className="list-disc pl-5 space-y-1">
                    {summary.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
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
                    {agents.map((agent) => (
                      <Badge
                        key={agent.id}
                        variant="secondary"
                        className="flex items-center gap-1 py-1 px-2"
                      >
                        {agent.icon && <agent.icon className="h-3 w-3" />}
                        {agent.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 border-t">
              <Button
                onClick={onEndConsultation}
                className="w-full"
                variant="outline"
              >
                End Consultation
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
