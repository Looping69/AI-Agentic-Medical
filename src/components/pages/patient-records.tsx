import { useState } from "react";
import DashboardHeader from "../dashboard/layout/DashboardHeader";
import DashboardSidebar from "../dashboard/layout/DashboardSidebar";
import PatientList from "../dashboard/patients/PatientList";
import PatientDetail from "../dashboard/patients/PatientDetail";
import PatientConsultation from "../dashboard/patients/PatientConsultation";
import { Patient, mockPatients } from "@/types/patients";
import { Brain, FileText, Heart, Microscope, Activity } from "lucide-react";

export default function PatientRecordsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSubscription] = useState<"free" | "premium">("free");
  const [activeItem, setActiveItem] = useState("Patient Records");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "consultation">(
    "list",
  );

  // Mock AI agents data
  const mockAgents = [
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
      name: "Cardiology",
      description:
        "Specialized in cardiovascular conditions, heart health, and related treatments.",
      icon: Heart,
      isPremium: true,
      specialties: ["Heart Disease", "Arrhythmias", "Preventive Cardiology"],
    },
    {
      id: "pathology",
      name: "Pathology",
      description:
        "Expert in analyzing lab results, tissue samples, and disease markers.",
      icon: Microscope,
      isPremium: true,
      specialties: ["Lab Result Analysis", "Histopathology", "Disease Markers"],
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

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedPatient(null);
  };

  const handleStartConsultation = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode("consultation");
  };

  const handleCompleteConsultation = (consultationData: any) => {
    // In a real app, we would save this consultation to the database
    // For now, we'll just update our local state
    if (selectedPatient) {
      const updatedPatient = { ...selectedPatient };

      // Add the new consultation to the patient's consultations array
      if (!updatedPatient.consultations) {
        updatedPatient.consultations = [];
      }
      updatedPatient.consultations = [
        consultationData,
        ...updatedPatient.consultations,
      ];

      // Update the patient's last visit date
      updatedPatient.lastVisit = new Date().toISOString().split("T")[0];

      // If the consultation has a diagnosis, add it to the patient's conditions if not already there
      if (
        consultationData.diagnosis &&
        !updatedPatient.conditions?.includes(consultationData.diagnosis)
      ) {
        if (!updatedPatient.conditions) {
          updatedPatient.conditions = [];
        }
        updatedPatient.conditions = [
          ...updatedPatient.conditions,
          consultationData.diagnosis,
        ];
      }

      // Update the patient in our local state
      setSelectedPatient(updatedPatient);

      // Return to the patient detail view
      setViewMode("detail");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
        userSubscription={userSubscription}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Patient Records" onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4">
          {viewMode === "list" && (
            <PatientList onPatientSelect={handlePatientSelect} />
          )}

          {viewMode === "detail" && selectedPatient && (
            <PatientDetail
              patient={selectedPatient}
              onBack={handleBackToList}
              onStartConsultation={handleStartConsultation}
            />
          )}

          {viewMode === "consultation" && selectedPatient && (
            <PatientConsultation
              patient={selectedPatient}
              onBack={() => setViewMode("detail")}
              onComplete={handleCompleteConsultation}
              availableAgents={mockAgents}
            />
          )}
        </main>
      </div>
    </div>
  );
}
