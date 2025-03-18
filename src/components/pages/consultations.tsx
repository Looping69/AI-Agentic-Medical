import { useState } from "react";
import ConsultationSection from "../dashboard/consultation/ConsultationSection";
import DashboardHeader from "../dashboard/layout/DashboardHeader";
import DashboardSidebar from "../dashboard/layout/DashboardSidebar";

export default function ConsultationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Consultations");
  const [userSubscription] = useState<"free" | "premium">("free");

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
        <main className="flex-1 pt-20 md:pt-0">
          <ConsultationSection userSubscription={userSubscription} />
        </main>
      </div>
    </div>
  );
}
