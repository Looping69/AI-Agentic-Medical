import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileUp,
  Send,
  Paperclip,
  Clock,
  User,
  Stethoscope,
} from "lucide-react";

interface ConsultationWorkspaceProps {
  selectedAgentId?: string | null;
  agentName?: string;
}

export default function ConsultationWorkspace({
  selectedAgentId = null,
  agentName = "Medical Assistant",
}: ConsultationWorkspaceProps) {
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
    chiefComplaint: "",
  });

  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; timestamp: Date }>
  >([]);
  const [newMessage, setNewMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setPatientInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      role: "user" as const,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant" as const,
        content: `Based on the information provided, I recommend conducting further tests to evaluate the patient's condition. The symptoms described could be consistent with several conditions including respiratory infection or allergic reaction.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-1">Consultation Workspace</h2>
          <p className="text-sm text-gray-600">
            {selectedAgentId
              ? `Working with ${agentName || "AI Assistant"}`
              : "Select an agent to begin consultation"}
          </p>
        </div>
        {selectedAgentId && (
          <Badge className="bg-secondary text-primary hover:bg-secondary">
            <Brain className="h-3 w-3 mr-1" />
            Active Session
          </Badge>
        )}
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <div className="border-b border-gray-100">
          <TabsList className="px-4">
            <TabsTrigger value="chat">Consultation Chat</TabsTrigger>
            <TabsTrigger value="patient">Patient Information</TabsTrigger>
            <TabsTrigger value="files">Medical Files</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="bg-secondary p-4 rounded-full mb-4">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Start Your Consultation
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Describe the patient's symptoms, upload relevant medical
                  files, or ask specific medical questions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <FileUp className="h-4 w-4" /> Upload Files
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <User className="h-4 w-4" /> Patient Templates
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar
                      className={
                        message.role === "assistant"
                          ? "bg-secondary"
                          : "bg-gray-100"
                      }
                    >
                      {message.role === "assistant" ? (
                        <Brain className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-gray-600" />
                      )}
                      <AvatarFallback>
                        {message.role === "assistant" ? "AI" : "You"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        className={`rounded-lg p-3 ${message.role === "assistant" ? "bg-secondary text-gray-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {message.content}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <Textarea
                placeholder={
                  selectedAgentId
                    ? "Type your message..."
                    : "Select an agent to begin consultation"
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[60px] resize-none"
                disabled={!selectedAgentId}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  disabled={!selectedAgentId}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                  disabled={!selectedAgentId || !newMessage.trim()}
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="patient" className="p-4 m-0 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Enter basic patient details for this consultation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    placeholder="Full name"
                    value={patientInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Age</Label>
                    <Input
                      id="patientAge"
                      placeholder="Years"
                      type="number"
                      value={patientInfo.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientGender">Gender</Label>
                    <Input
                      id="patientGender"
                      placeholder="Gender"
                      value={patientInfo.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Textarea
                  id="chiefComplaint"
                  placeholder="Describe the main symptoms or reason for consultation"
                  className="min-h-[100px]"
                  value={patientInfo.chiefComplaint}
                  onChange={(e) =>
                    handleInputChange("chiefComplaint", e.target.value)
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Clear Form</Button>
              <Button className="bg-primary hover:bg-primary/90">
                Save Information
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="p-4 m-0 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Medical Files</CardTitle>
              <CardDescription>
                Upload and manage patient medical files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <div className="mx-auto flex flex-col items-center justify-center">
                  <FileUp className="h-10 w-10 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-1">
                    Upload Medical Files
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop files or click to browse
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    Select Files
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">
                  Supported File Types
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge variant="outline" className="justify-center">
                    DICOM
                  </Badge>
                  <Badge variant="outline" className="justify-center">
                    PDF
                  </Badge>
                  <Badge variant="outline" className="justify-center">
                    JPG/PNG
                  </Badge>
                  <Badge variant="outline" className="justify-center">
                    HL7/FHIR
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
