import { useState } from "react";
import DashboardHeader from "./layout/DashboardHeader";
import DashboardSidebar from "./layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  Plus,
  Users,
  Brain,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function MedicalDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSubscription] = useState<"free" | "premium">("free");
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex min-h-[calc(100vh-64px)]">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userSubscription={userSubscription}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />

        <main className="flex-1 p-6 pt-20 md:pt-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Medical Assistant Dashboard
            </h1>
            <p className="text-gray-600">
              Access AI agents and manage patient consultations
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Patients
                </CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-gray-500 mt-1">+2 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  AI Consultations
                </CardTitle>
                <Brain className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Response Time
                </CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.4m</div>
                <p className="text-xs text-gray-500 mt-1">
                  -12s from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Patient Activity</CardTitle>
                <CardDescription>
                  Latest consultations and patient interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      patient: "John Doe",
                      action: "AI Consultation",
                      time: "Today, 10:30 AM",
                      status: "Completed",
                    },
                    {
                      patient: "Jane Smith",
                      action: "Lab Results Review",
                      time: "Yesterday, 3:45 PM",
                      status: "Pending",
                    },
                    {
                      patient: "Robert Johnson",
                      action: "Medication Review",
                      time: "Yesterday, 1:15 PM",
                      status: "Completed",
                    },
                    {
                      patient: "Emily Davis",
                      action: "New Patient Registration",
                      time: "Aug 15, 9:20 AM",
                      status: "Completed",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {activity.patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {activity.patient}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {activity.action}
                            </span>
                            <span className="text-xs text-gray-400">
                              • {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${activity.status === "Completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to="/dashboard/agents">
                    <Button
                      variant="outline"
                      className="w-full justify-between h-auto py-3"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-secondary mr-3">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <span>Start AI Consultation</span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-secondary mr-3">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <span>Schedule Appointment</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-secondary mr-3">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span>View Patient Records</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-secondary mr-3">
                        <Plus className="h-4 w-4 text-primary" />
                      </div>
                      <span>Add New Patient</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
