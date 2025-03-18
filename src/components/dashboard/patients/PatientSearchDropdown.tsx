import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string;
};

interface PatientSearchDropdownProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onPatientSelect: (patient: Patient) => void;
  placeholder?: string;
  className?: string;
}

export default function PatientSearchDropdown({
  patients,
  selectedPatient,
  onPatientSelect,
  placeholder = "Select a patient",
  className,
}: PatientSearchDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedPatient ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.id}`}
                />
                <AvatarFallback>{`${selectedPatient.firstName[0]}${selectedPatient.lastName[0]}`}</AvatarFallback>
              </Avatar>
              <span>
                {selectedPatient.firstName} {selectedPatient.lastName}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>{placeholder}</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search patients..." />
          <CommandEmpty>No patient found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {patients.map((patient) => (
              <CommandItem
                key={patient.id}
                value={`${patient.firstName} ${patient.lastName}`}
                onSelect={() => {
                  onPatientSelect(patient);
                  setOpen(false);
                }}
                className="flex items-center gap-2 py-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
                  />
                  <AvatarFallback>{`${patient.firstName[0]}${patient.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString()
                      : "No DOB"}
                    {patient.gender ? ` • ${patient.gender}` : ""}
                  </span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedPatient?.id === patient.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
