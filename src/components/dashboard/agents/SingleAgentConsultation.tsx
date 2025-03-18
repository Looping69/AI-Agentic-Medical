import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, Stethoscope } from "lucide-react";
import { AgentProps } from "./AgentProvider";
import AgentChat from "./AgentChat";

interface SingleAgentConsultationProps {
  agent: AgentProps;
  onClose?: () => void;
}

export default function SingleAgentConsultation({
  agent,
  onClose,
}: SingleAgentConsultationProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "info">("chat");

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border shadow-sm">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "chat" | "info")}
          className="w-full h-full"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                Consultation with {agent.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <TabsList>
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="info" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Info
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent
            value="chat"
            className="flex-1 flex flex-col p-0 m-0 h-full"
          >
            <AgentChat agent={agent} />
          </TabsContent>

          <TabsContent value="info" className="flex-1 p-4 m-0 overflow-y-auto">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <agent.icon className="h-5 w-5 text-primary" />
                    About {agent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{agent.description}</p>

                  <h3 className="font-semibold mb-2">Specialties</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {agent.specialties?.map((specialty, index) => (
                      <li key={index}>{specialty}</li>
                    ))}
                  </ul>

                  {agent.modelName && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">AI Model</h3>
                      <p>{agent.modelName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Ask specific questions related to{" "}
                      {agent.name.toLowerCase()} topics
                    </li>
                    <li>
                      Provide relevant context for more accurate responses
                    </li>
                    <li>
                      Remember that AI responses are informational and not a
                      substitute for professional medical advice
                    </li>
                    <li>All conversations are encrypted and HIPAA-compliant</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4">
              {onClose && (
                <Button onClick={onClose} className="w-full" variant="outline">
                  Close Consultation
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
