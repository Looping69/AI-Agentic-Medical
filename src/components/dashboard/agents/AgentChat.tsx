import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, User, Clock } from "lucide-react";
import { AgentProps } from "./AgentProvider";
import { generateAgentResponse } from "@/lib/ai/agent-service";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
};

interface AgentChatProps {
  agent: AgentProps;
  onClose?: () => void;
}

export default function AgentChat({ agent, onClose }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Add initial greeting from the agent
  useEffect(() => {
    const initialMessage: Message = {
      id: `agent-${Date.now()}`,
      role: "agent",
      content: `Hello, I'm the ${agent.name} specialist. How can I assist you today with ${agent.specialties?.join(", ") || "medical questions"}?`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [agent]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: newMessage,
      timestamp: new Date(),
    };

    // Add loading message for agent
    const loadingMessage: Message = {
      id: `agent-loading-${Date.now()}`,
      role: "agent",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Generate response from the agent
      const response = await generateAgentResponse(
        agent.id,
        newMessage,
        conversationHistory,
      );

      // Remove loading message and add real response
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) => m.id !== `agent-loading-${Date.now()}`,
        );
        const agentResponse: Message = {
          id: `agent-${Date.now()}`,
          role: "agent",
          content: response,
          timestamp: new Date(),
        };
        return [...filtered, agentResponse];
      });
    } catch (error) {
      console.error("Error in agent chat:", error);
      // Remove loading message and add error message
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) => m.id !== `agent-loading-${Date.now()}`,
        );
        const errorMessage: Message = {
          id: `agent-error-${Date.now()}`,
          role: "agent",
          content:
            "I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full bg-background rounded-lg border shadow-sm">
      <CardContent className="flex flex-col h-full p-0">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-secondary">
              {agent.icon && <agent.icon className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{agent.name}</h2>
              <div className="flex flex-wrap gap-1">
                {agent.specialties?.slice(0, 2).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {(agent.specialties?.length || 0) > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{(agent.specialties?.length || 0) - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex max-w-[80%]">
                  {!isUser && (
                    <Avatar className="h-8 w-8 mr-2">
                      {agent.icon && (
                        <agent.icon className="h-5 w-5 text-primary" />
                      )}
                      <AvatarFallback>{agent.name?.[0] || "A"}</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`rounded-lg p-3 ${isUser ? "bg-primary text-primary-foreground" : message.isLoading ? "bg-card border min-w-[100px]" : "bg-card border"}`}
                  >
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
                      {!message.isLoading && (
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
                    <Avatar className="h-8 w-8 ml-2 bg-blue-100">
                      <User className="h-5 w-5 text-blue-600" />
                      <AvatarFallback>Dr</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && !messages.some((m) => m.isLoading) && (
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
              placeholder="Ask a question..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[60px]"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {isLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>{agent.name} is thinking...</span>
              </div>
            ) : (
              <span>Press Enter to send, Shift+Enter for new line</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
