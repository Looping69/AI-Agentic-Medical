import { useState } from "react";
import { Patient } from "@/types/patients";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Activity,
  AlertCircle,
  Pill,
  ClipboardList,
  Brain,
  Edit,
  Trash,
  Plus,
} from "lucide-react";

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onStartConsultation: (patient: Patient) => void;
}

export default function PatientDetail({
  patient,
  onBack,
  onStartConsultation,
}: PatientDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
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
            <h2 className="text-xl font-semibold">Patient Details</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onStartConsultation(patient)}
            >
              <Brain className="h-4 w-4" />
              Start Consultation
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-secondary text-primary text-xl">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-xl font-semibold">{patient.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`${patient.status === "Active" ? "bg-green-100 text-green-800" : patient.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {patient.status}
                </Badge>
                <span className="text-sm text-gray-500">ID: {patient.id}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <User className="h-3.5 w-3.5" />
                  {patient.age} years, {patient.gender}
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="h-3.5 w-3.5" />
                    {patient.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
            <Card className="bg-gray-50 border-none shadow-none">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-gray-500">Last Visit</div>
                    <div className="text-sm font-medium">
                      {patient.lastVisit}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {patient.nextAppointment && (
              <Card className="bg-gray-50 border-none shadow-none">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Next Appointment
                      </div>
                      <div className="text-sm font-medium">
                        {patient.nextAppointment}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-50 border-none shadow-none">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-gray-500">Conditions</div>
                    <div className="text-sm font-medium">
                      {patient.conditions?.length || 0} Recorded
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 max-h-[calc(100vh-350px)] overflow-y-auto">
        <TabsContent value="overview" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{patient.email}</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{patient.phone}</span>
                    </div>
                  )}
                  {patient.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{patient.address}</span>
                    </div>
                  )}
                  {patient.emergencyContact && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">
                        Emergency Contact
                      </div>
                      <div className="text-sm">
                        {patient.emergencyContact.name} (
                        {patient.emergencyContact.relationship})
                      </div>
                      <div className="text-sm">
                        {patient.emergencyContact.phone}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary" />
                  Current Medications
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {patient.medications && patient.medications.length > 0 ? (
                  <div className="space-y-3">
                    {patient.medications.map((medication, index) => (
                      <div
                        key={index}
                        className="pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between">
                          <div className="font-medium text-sm">
                            {medication.name}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {medication.dosage}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {medication.frequency} • Started{" "}
                          {medication.startDate}
                        </div>
                        {medication.notes && (
                          <div className="text-xs text-gray-500 mt-1">
                            Note: {medication.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-2">
                    No medications recorded
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conditions */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Conditions
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {patient.conditions && patient.conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions.map((condition, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs py-1"
                      >
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-2">
                    No conditions recorded
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Allergies
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs py-1 bg-red-50 text-red-700 border-red-200"
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-2">
                    No allergies recorded
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Vitals */}
            {patient.vitalSigns && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Recent Vitals
                    <Badge variant="outline" className="text-xs ml-2">
                      {patient.vitalSigns.recordedDate}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {patient.vitalSigns.bloodPressure && (
                      <div>
                        <div className="text-xs text-gray-500">
                          Blood Pressure
                        </div>
                        <div className="text-sm font-medium">
                          {patient.vitalSigns.bloodPressure}
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.heartRate && (
                      <div>
                        <div className="text-xs text-gray-500">Heart Rate</div>
                        <div className="text-sm font-medium">
                          {patient.vitalSigns.heartRate} bpm
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.temperature && (
                      <div>
                        <div className="text-xs text-gray-500">Temperature</div>
                        <div className="text-sm font-medium">
                          {patient.vitalSigns.temperature}
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.respiratoryRate && (
                      <div>
                        <div className="text-xs text-gray-500">
                          Respiratory Rate
                        </div>
                        <div className="text-sm font-medium">
                          {patient.vitalSigns.respiratoryRate} breaths/min
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.height && patient.vitalSigns.weight && (
                      <div>
                        <div className="text-xs text-gray-500">
                          Height/Weight
                        </div>
                        <div className="text-sm font-medium">
                          {patient.vitalSigns.height},{" "}
                          {patient.vitalSigns.weight}
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.bmi && (
                      <div>
                        <div className="text-xs text-gray-500">BMI</div>
                        <div className="text-sm font-medium">
                          {patient.vitalSigns.bmi}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insurance Information */}
            {patient.insuranceInfo && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Insurance Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500">Provider</div>
                      <div className="text-sm font-medium">
                        {patient.insuranceInfo.provider}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">
                          Policy Number
                        </div>
                        <div className="text-sm font-medium">
                          {patient.insuranceInfo.policyNumber}
                        </div>
                      </div>
                      {patient.insuranceInfo.groupNumber && (
                        <div>
                          <div className="text-xs text-gray-500">
                            Group Number
                          </div>
                          <div className="text-sm font-medium">
                            {patient.insuranceInfo.groupNumber}
                          </div>
                        </div>
                      )}
                    </div>
                    {patient.insuranceInfo.coverageType && (
                      <div>
                        <div className="text-xs text-gray-500">
                          Coverage Type
                        </div>
                        <div className="text-sm font-medium">
                          {patient.insuranceInfo.coverageType}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="medical" className="m-0">
          <div className="grid grid-cols-1 gap-6">
            {patient.medicalHistory ? (
              <>
                {/* Past Illnesses */}
                {patient.medicalHistory.pastIllnesses &&
                  patient.medicalHistory.pastIllnesses.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base font-medium">
                          Past Illnesses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {patient.medicalHistory.pastIllnesses.map(
                            (illness, index) => (
                              <li key={index} className="text-sm">
                                {illness}
                              </li>
                            ),
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {/* Surgeries */}
                {patient.medicalHistory.surgeries &&
                  patient.medicalHistory.surgeries.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base font-medium">
                          Surgical History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {patient.medicalHistory.surgeries.map(
                            (surgery, index) => (
                              <div
                                key={index}
                                className="pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                              >
                                <div className="flex justify-between">
                                  <div className="font-medium text-sm">
                                    {surgery.procedure}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {surgery.date}
                                  </Badge>
                                </div>
                                {surgery.hospital && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Hospital: {surgery.hospital}
                                  </div>
                                )}
                                {surgery.notes && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Notes: {surgery.notes}
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Family History */}
                {patient.medicalHistory.familyHistory &&
                  patient.medicalHistory.familyHistory.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base font-medium">
                          Family History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {patient.medicalHistory.familyHistory.map(
                            (history, index) => (
                              <li key={index} className="text-sm">
                                {history}
                              </li>
                            ),
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {/* Lifestyle */}
                {patient.medicalHistory.lifestyle && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium">
                        Lifestyle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {patient.medicalHistory.lifestyle.smoking && (
                          <div>
                            <div className="text-xs text-gray-500">Smoking</div>
                            <div className="text-sm">
                              {patient.medicalHistory.lifestyle.smoking}
                            </div>
                          </div>
                        )}
                        {patient.medicalHistory.lifestyle.alcohol && (
                          <div>
                            <div className="text-xs text-gray-500">Alcohol</div>
                            <div className="text-sm">
                              {patient.medicalHistory.lifestyle.alcohol}
                            </div>
                          </div>
                        )}
                        {patient.medicalHistory.lifestyle.exercise && (
                          <div>
                            <div className="text-xs text-gray-500">
                              Exercise
                            </div>
                            <div className="text-sm">
                              {patient.medicalHistory.lifestyle.exercise}
                            </div>
                          </div>
                        )}
                        {patient.medicalHistory.lifestyle.diet && (
                          <div>
                            <div className="text-xs text-gray-500">Diet</div>
                            <div className="text-sm">
                              {patient.medicalHistory.lifestyle.diet}
                            </div>
                          </div>
                        )}
                        {patient.medicalHistory.lifestyle.occupation && (
                          <div>
                            <div className="text-xs text-gray-500">
                              Occupation
                            </div>
                            <div className="text-sm">
                              {patient.medicalHistory.lifestyle.occupation}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No medical history records available.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="m-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Consultation History</h3>
            <Button
              onClick={() => onStartConsultation(patient)}
              className="flex items-center gap-1"
            >
              <Brain className="h-4 w-4" />
              New Consultation
            </Button>
          </div>

          {patient.consultations && patient.consultations.length > 0 ? (
            <div className="space-y-4">
              {patient.consultations.map((consultation, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">
                          Consultation on {consultation.date}
                        </CardTitle>
                        {consultation.doctorName && (
                          <div className="text-sm text-gray-500">
                            Doctor: {consultation.doctorName}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {consultation.aiAgents &&
                          consultation.aiAgents.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Brain className="h-3 w-3" />
                              AI Assisted
                            </Badge>
                          )}
                        {consultation.followUp && (
                          <Badge variant="outline">
                            Follow-up: {consultation.followUp}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-1">Symptoms</div>
                        <div className="flex flex-wrap gap-1">
                          {consultation.symptoms.map((symptom, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {consultation.diagnosis && (
                        <div>
                          <div className="text-sm font-medium mb-1">
                            Diagnosis
                          </div>
                          <div className="text-sm">
                            {consultation.diagnosis}
                          </div>
                        </div>
                      )}

                      {consultation.treatment && (
                        <div>
                          <div className="text-sm font-medium mb-1">
                            Treatment
                          </div>
                          <div className="text-sm">
                            {consultation.treatment}
                          </div>
                        </div>
                      )}

                      {consultation.recommendations &&
                        consultation.recommendations.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-1">
                              Recommendations
                            </div>
                            <ul className="list-disc pl-5 space-y-1">
                              {consultation.recommendations.map((rec, i) => (
                                <li key={i} className="text-sm">
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {consultation.notes && (
                        <div>
                          <div className="text-sm font-medium mb-1">Notes</div>
                          <div className="text-sm text-gray-600">
                            {consultation.notes}
                          </div>
                        </div>
                      )}

                      {consultation.aiAgents &&
                        consultation.aiAgents.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">
                              AI Agents Used
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {consultation.aiAgents.map((agent, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {agent}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No consultation records available.
            </div>
          )}
        </TabsContent>

        <TabsContent value="vitals" className="m-0">
          {patient.vitalSigns ? (
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center justify-between">
                    <span>Vital Signs</span>
                    <Badge variant="outline">
                      Recorded: {patient.vitalSigns.recordedDate}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {patient.vitalSigns.height && (
                      <div>
                        <div className="text-xs text-gray-500">Height</div>
                        <div className="text-lg font-medium">
                          {patient.vitalSigns.height}
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.weight && (
                      <div>
                        <div className="text-xs text-gray-500">Weight</div>
                        <div className="text-lg font-medium">
                          {patient.vitalSigns.weight}
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.bmi && (
                      <div>
                        <div className="text-xs text-gray-500">BMI</div>
                        <div className="text-lg font-medium">
                          {patient.vitalSigns.bmi}
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.bloodPressure && (
                      <div>
                        <div className="text-xs text-gray-500">
                          Blood Pressure
                        </div>
                        <div className="text-lg font-medium">
                          {patient.vitalSigns.bloodPressure}
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.heartRate && (
                      <div>
                        <div className="text-xs text-gray-500">Heart Rate</div>
                        <div className="text-lg font-medium">
                          {patient.vitalSigns.heartRate} bpm
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.respiratoryRate && (
                      <div>
                        <div className="text-xs text-gray-500">
                          Respiratory Rate
                        </div>
                        <div className="text-lg font-medium">
                          {patient.vitalSigns.respiratoryRate} breaths/min
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.temperature && (
                      <div>
                        <div className="text-xs text-gray-500">Temperature</div>
                        <div className="text-lg font-medium">
                          {patient.vitalSigns.temperature}
                        </div>
                      </div>
                    )}
                    {patient.vitalSigns.oxygenSaturation && (
                      <div>
                        <div className="text-xs text-gray-500">
                          Oxygen Saturation
                        </div>
                        <div className="text-lg font-medium">
                          {patient.vitalSigns.oxygenSaturation}%
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vitals History Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Vitals History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Vitals history chart would be displayed here</p>
                      <p className="text-xs">
                        Historical data tracking blood pressure, heart rate,
                        etc.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No vital signs records available.
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="m-0">
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No documents available for this patient.</p>
            <Button variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" /> Upload Document
            </Button>
          </div>
        </TabsContent>
      </div>
    </div>
  );
}
