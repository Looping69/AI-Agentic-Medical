import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Upload,
  User,
  Users,
  X,
  Zap,
  Heart,
  Activity,
  Microscope,
  Stethoscope,
} from "lucide-react";
import { AgentProps } from "../agents/AgentCard";
import CollaborativeConsultation from "./CollaborativeConsultation";

interface ConsultationSectionProps {
  userSubscription?: "free" | "premium";
}

export default function ConsultationSection({
  userSubscription = "free",
}: ConsultationSectionProps) {
  const [activeTab, setActiveTab] = useState<"new" | "active" | "history">(
    "new",
  );
  const [selectedConsultation, setSelectedConsultation] = useState<
    string | null
  >(null);
  const [consultationMode, setConsultationMode] = useState<
    "selection" | "consultation"
  >("selection");
  const [selectedAgents, setSelectedAgents] = useState<AgentProps[]>([]);

  // Mock data for consultations
  const activeConsultations = [
    {
      id: "c1",
      patientName: "John Doe",
      startTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      agents: ["General Medicine", "Cardiology"],
      status: "in-progress",
    },
    {
      id: "c2",
      patientName: "Jane Smith",
      startTime: new Date(Date.now() - 120 * 60000), // 2 hours ago
      agents: ["Radiology", "Pathology"],
      status: "waiting",
    },
  ];

  const historyConsultations = [
    {
      id: "h1",
      patientName: "Robert Johnson",
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 45 * 60000), // 45 minutes later
      agents: ["General Medicine", "Medical Records"],
      diagnosis: "Seasonal allergic rhinitis",
    },
    {
      id: "h2",
      patientName: "Emily Davis",
      startTime: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 days ago
      endTime: new Date(Date.now() - 5 * 24 * 60 * 60000 + 60 * 60000), // 60 minutes later
      agents: ["Cardiology", "Vitals Monitor"],
      diagnosis: "Mild hypertension, recommended lifestyle changes",
    },
  ];

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
      id: "cardiology",
      name: "Cardiology Specialist",
      description:
        "Expert in cardiovascular conditions, ECG interpretation, and heart health.",
      icon: Heart,
      isPremium: true,
      specialties: ["ECG Analysis", "Heart Disease", "Risk Assessment"],
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

  const handleStartConsultation = () => {
    setConsultationMode("consultation");
  };

  const handleEndConsultation = () => {
    setConsultationMode("selection");
    setSelectedAgents([]);
  };

  const handleAgentSelect = (agent: AgentProps) => {
    // If agent is already selected, remove it
    if (selectedAgents.some((a) => a.id === agent.id)) {
      setSelectedAgents(selectedAgents.filter((a) => a.id !== agent.id));
    } else {
      // If agent is not selected, add it (respecting max agents)
      const maxAgents = userSubscription === "premium" ? 5 : 2;
      if (selectedAgents.length < maxAgents) {
        setSelectedAgents([...selectedAgents, agent]);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${formatTime(date)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${formatTime(date)}`;
    } else {
      return (
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
        `, ${formatTime(date)}`
      );
    }
  };

  const renderNewConsultation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Consultation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" placeholder="Enter patient name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID (Optional)</Label>
                <Input id="patientId" placeholder="Enter patient ID" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">Chief Complaint</Label>
              <Textarea
                id="chiefComplaint"
                placeholder="Describe the main symptoms or reason for consultation"
                className="min-h-[100px]"
              />
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-sm font-medium mb-3">
                Select AI Agents for Consultation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {defaultAgents.map((agent) => {
                  const isSelected = selectedAgents.some(
                    (a) => a.id === agent.id,
                  );
                  const isPremiumLocked =
                    agent.isPremium && userSubscription === "free";

                  return (
                    <div
                      key={agent.id}
                      className={`border rounded-lg p-3 ${isSelected ? "border-primary bg-secondary/50" : "border-gray-200"} 
                                ${isPremiumLocked ? "opacity-60" : "cursor-pointer hover:border-primary/50"}`}
                      onClick={() =>
                        !isPremiumLocked && handleAgentSelect(agent)
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-full ${isSelected ? "bg-primary/20" : "bg-gray-100"}`}
                          >
                            {React.createElement(agent.icon, {
                              className: `h-4 w-4 ${isSelected ? "text-primary" : "text-gray-600"}`,
                            })}
                          </div>
                          <h4 className="font-medium">{agent.name}</h4>
                        </div>
                        {agent.isPremium && (
                          <Badge className="bg-secondary text-primary">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {agent.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {agent.specialties
                          ?.slice(0, 2)
                          .map((specialty, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        {agent.specialties && agent.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {userSubscription === "free" && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <p className="text-sm text-amber-700">
                      Free plan limited to 2 agents per consultation. Upgrade
                      for up to 5 agents.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              className="bg-primary hover:bg-primary/90"
              disabled={selectedAgents.length === 0}
              onClick={handleStartConsultation}
            >
              <Users className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveConsultations = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input placeholder="Search consultations..." className="pl-9" />
      </div>

      <div className="space-y-3">
        {activeConsultations.map((consultation) => (
          <Card
            key={consultation.id}
            className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedConsultation === consultation.id ? "border-primary" : ""}`}
            onClick={() => setSelectedConsultation(consultation.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{consultation.patientName}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Started {formatDate(consultation.startTime)}</span>
                  </div>
                </div>
                <Badge
                  className={
                    consultation.status === "in-progress"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {consultation.status === "in-progress"
                    ? "In Progress"
                    : "Waiting"}
                </Badge>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">AI Agents:</div>
                <div className="flex flex-wrap gap-1">
                  {consultation.agents.map((agent, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {agent}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {activeConsultations.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
            <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium mb-1">No Active Consultations</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start a new consultation to begin diagnosing patients
            </p>
            <Button variant="outline" onClick={() => setActiveTab("new")}>
              Start New Consultation
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderConsultationHistory = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input placeholder="Search consultation history..." className="pl-9" />
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {historyConsultations.map((consultation) => (
            <Card
              key={consultation.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{consultation.patientName}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(consultation.startTime)}</span>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Diagnosis:</div>
                  <p className="text-sm">{consultation.diagnosis}</p>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">AI Agents:</div>
                  <div className="flex flex-wrap gap-1">
                    {consultation.agents.map((agent, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {agent}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View Report
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    New Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {historyConsultations.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium mb-1">No Consultation History</h3>
              <p className="text-sm text-gray-500 mb-4">
                Your completed consultations will appear here
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {consultationMode === "selection" ? (
        <div className="container mx-auto py-6 pt-20 md:pt-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Medical Consultations
            </h1>
            <p className="text-gray-600">
              Start a new consultation or manage existing ones
            </p>
          </div>

          <Tabs
            defaultValue="new"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "new" | "active" | "history")
            }
          >
            <TabsList className="mb-4">
              <TabsTrigger value="new" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                New Consultation
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Active ({activeConsultations.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new">{renderNewConsultation()}</TabsContent>

            <TabsContent value="active">
              {renderActiveConsultations()}
            </TabsContent>

            <TabsContent value="history">
              {renderConsultationHistory()}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="container mx-auto py-6 pt-20 md:pt-6">
          <div className="mb-4 flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleEndConsultation}
            >
              <X className="h-4 w-4 mr-1" /> End Consultation
            </Button>
          </div>

          <div className="h-[calc(100vh-200px)]">
            <CollaborativeConsultation
              agents={selectedAgents}
              collaborationMode="collaborative"
              onEndConsultation={handleEndConsultation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
