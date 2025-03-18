import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { Patient } from "@/types/patients";

interface PatientCardProps {
  patient: Patient;
  onClick: (patient: Patient) => void;
}

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => onClick(patient)}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-primary">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-base">{patient.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {patient.age} years
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{patient.gender}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Patient ID</span>
              <span className="text-xs font-medium">{patient.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Last Visit</span>
              <span className="text-xs font-medium">{patient.lastVisit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Status</span>
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0.5 ${getStatusColor(patient.status)}`}
              >
                {patient.status}
              </Badge>
            </div>
          </div>

          {patient.conditions && patient.conditions.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-gray-500 block mb-1">
                Conditions
              </span>
              <div className="flex flex-wrap gap-1">
                {patient.conditions.slice(0, 3).map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
                {patient.conditions.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{patient.conditions.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-0 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none h-10 flex-1 text-xs font-normal text-gray-500"
        >
          <FileText className="h-3.5 w-3.5 mr-1" />
          Records
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none h-10 flex-1 text-xs font-normal text-gray-500 border-l border-r"
        >
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Appointments
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none h-10 flex-1 text-xs font-normal text-primary"
        >
          View
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
