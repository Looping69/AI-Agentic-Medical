import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Users, UserPlus, Zap, X } from "lucide-react";
import { AgentProps } from "./AgentCard";

interface AgentCollaborationProps {
  selectedAgents: AgentProps[];
  availableAgents: AgentProps[];
  onAgentToggle: (agent: AgentProps) => void;
  onStartCollaboration: (mode: "solo" | "collaborative") => void;
  userSubscription: "free" | "premium";
}

export default function AgentCollaboration({
  selectedAgents = [],
  availableAgents = [],
  onAgentToggle = () => {},
  onStartCollaboration = () => {},
  userSubscription = "free",
}: AgentCollaborationProps) {
  const [collaborationMode, setCollaborationMode] = useState<
    "solo" | "collaborative"
  >("collaborative");

  const maxAgents = userSubscription === "premium" ? 5 : 2;
  const canAddMore = selectedAgents.length < maxAgents;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold mb-1">Diagnostic Collaboration</h2>
        <p className="text-sm text-gray-600">
          Configure how AI agents will collaborate on your patient&apos;s
          diagnosis
        </p>
      </div>

      <div className="p-4 border-b border-gray-100">
        <Tabs
          defaultValue="collaborative"
          value={collaborationMode}
          onValueChange={(value) =>
            setCollaborationMode(value as "solo" | "collaborative")
          }
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
              Collaborative Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solo" className="mt-4">
            <div className="text-sm text-gray-600 mb-4">
              Select a single agent to handle your patient&apos;s diagnosis
            </div>
            {selectedAgents.length > 0 ? (
              <div className="flex items-center justify-between bg-secondary p-3 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    {selectedAgents[0].icon && (
                      <div className="h-5 w-5 text-primary">
                        {React.createElement(selectedAgents[0].icon)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedAgents[0].name}</h3>
                    <p className="text-xs text-gray-600">
                      {selectedAgents[0].description.substring(0, 60)}...
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAgentToggle(selectedAgents[0])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                <Brain className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium mb-1">No Agent Selected</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select an agent from the list below
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="collaborative" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Multiple agents will collaborate to provide a comprehensive
                diagnosis
              </div>
              <Badge variant="outline">
                {selectedAgents.length}/{maxAgents} Selected
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              {selectedAgents.length > 0 ? (
                selectedAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between bg-secondary p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        {agent.icon && (
                          <div className="h-5 w-5 text-primary">
                            {React.createElement(agent.icon)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.specialties
                            ?.slice(0, 2)
                            .map((specialty, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-white"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          {agent.specialties &&
                            agent.specialties.length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-white"
                              >
                                +{agent.specialties.length - 2} more
                              </Badge>
                            )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAgentToggle(agent)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Users className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <h3 className="font-medium mb-1">No Agents Selected</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Select agents from the list below
                  </p>
                </div>
              )}
            </div>

            {!canAddMore && userSubscription === "free" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-amber-700">
                    Free plan limited to {maxAgents} agents. Upgrade for up to 5
                    agents.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4">
        <h3 className="font-medium mb-3">Available Agents</h3>
        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
          {availableAgents
            .filter(
              (agent) =>
                !selectedAgents.some((selected) => selected.id === agent.id),
            )
            .map((agent) => (
              <div
                key={agent.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${canAddMore ? "border-gray-200 hover:border-primary/50 cursor-pointer" : "border-gray-200 opacity-50"}`}
                onClick={() => canAddMore && onAgentToggle(agent)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`agent-${agent.id}`}
                    checked={selectedAgents.some((a) => a.id === agent.id)}
                    disabled={!canAddMore}
                    onCheckedChange={() => canAddMore && onAgentToggle(agent)}
                  />
                  <div className="p-2 rounded-full bg-gray-100">
                    {agent.icon && (
                      <div className="h-4 w-4 text-gray-600">
                        {React.createElement(agent.icon)}
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor={`agent-${agent.id}`}
                    className="cursor-pointer"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{agent.name}</h4>
                      <p className="text-xs text-gray-500">
                        {agent.description.substring(0, 60)}...
                      </p>
                    </div>
                  </Label>
                </div>
                {agent.isPremium && userSubscription === "free" && (
                  <Badge className="bg-secondary text-primary hover:bg-secondary">
                    Premium
                  </Badge>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          disabled={selectedAgents.length === 0}
          onClick={() => onStartCollaboration(collaborationMode)}
        >
          {collaborationMode === "solo" ? (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Start Solo Diagnosis
            </>
          ) : (
            <>
              <Users className="h-4 w-4 mr-2" />
              Start Collaborative Diagnosis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
