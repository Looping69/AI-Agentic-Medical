import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";
import PatientCard from "./PatientCard";
import { Patient, mockPatients } from "@/types/patients";

interface PatientListProps {
  onPatientSelect: (patient: Patient) => void;
}

export default function PatientList({ onPatientSelect }: PatientListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Filter and sort patients
  const filteredPatients = mockPatients
    .filter((patient) => {
      // Filter by search query
      const matchesSearch = patient.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        statusFilter === "all" ||
        patient.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort patients
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "recent") {
        return (
          new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
        );
      } else if (sortBy === "age") {
        return a.age - b.age;
      }
      return 0;
    });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Patient Records</h2>

          <Button size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tabs
              defaultValue="all"
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-40">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-gray-500" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="recent">Recent Visit</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={onPatientSelect}
            />
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500">
            No patients found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
