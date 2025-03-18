import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  FileText,
  Calendar,
  Brain,
  Activity,
  Stethoscope,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSimpleAuth } from "@/lib/simple-auth-context";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
  userSubscription?: "free" | "premium";
  isOpen?: boolean;
  onClose?: () => void;
}

const defaultNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    href: "/dashboard",
    isActive: true,
  },
  { icon: <Brain size={20} />, label: "AI Agents", href: "/dashboard/agents" },
  {
    icon: <Stethoscope size={20} />,
    label: "Consultations",
    href: "/dashboard/consultations",
  },
  {
    icon: <FileText size={20} />,
    label: "Patient Records",
    href: "/dashboard/records",
  },
  {
    icon: <Calendar size={20} />,
    label: "Appointments",
    href: "/dashboard/appointments",
  },
  {
    icon: <Activity size={20} />,
    label: "Analytics",
    href: "/dashboard/analytics",
  },
];

const defaultBottomItems: NavItem[] = [
  {
    icon: <Settings size={20} />,
    label: "Settings",
    href: "/dashboard/settings",
  },
  {
    icon: <HelpCircle size={20} />,
    label: "Help & Support",
    href: "/dashboard/support",
  },
];

export default function DashboardSidebar({
  items = defaultNavItems,
  activeItem = "Dashboard",
  onItemClick = () => {},
  userSubscription = "free",
  isOpen = true,
  onClose = () => {},
}: SidebarProps) {
  const { username, logout: simpleLogout } = useSimpleAuth();
  const { signOut } = useAuth();

  // If admin is logged in, treat as premium
  const effectiveSubscription =
    username === "klaasvaakie" ? "premium" : userSubscription;

  const handleLogout = () => {
    signOut();
    simpleLogout();
  };
  return (
    <div
      className={`${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white shadow-md border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out`}
    >
      <div className="p-6 flex items-center">
        <Link to="/" className="font-medium text-xl flex items-center">
          <Stethoscope className="h-6 w-6 mr-2 text-primary" />
          <span>LENY-AI</span>
          <span className="text-primary ml-1">Medical</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      {username === "klaasvaakie" && (
        <div className="px-4 py-2 mx-4 mb-2 bg-amber-50 border border-amber-100 rounded-lg">
          <div className="text-amber-800 text-sm font-medium flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            Admin Mode Active
          </div>
          <div className="text-amber-700 text-xs mt-1">
            All features unlocked
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1.5">
          {items.map((item) => {
            const isPremiumLocked =
              item.isPremium && effectiveSubscription === "free";

            return (
              <Link to={isPremiumLocked ? "#" : item.href} key={item.label}>
                <Button
                  variant={"ghost"}
                  className={`w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium ${item.label === activeItem ? "bg-secondary text-primary hover:bg-secondary/80" : "text-gray-700 hover:bg-gray-100"} ${isPremiumLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isPremiumLocked && onItemClick(item.label)}
                  disabled={isPremiumLocked}
                >
                  <span
                    className={`${item.label === activeItem ? "text-primary" : "text-gray-500"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isPremiumLocked && (
                    <span className="ml-auto text-xs text-amber-600 flex items-center">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
          ;
        </div>

        <Separator className="my-4 bg-gray-100" />

        <div className="space-y-3">
          <h3 className="text-xs font-medium px-4 py-1 text-gray-500 uppercase tracking-wider">
            Recent Patients
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-primary">
              JD
            </span>
            John Doe
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-600">
              JS
            </span>
            Jane Smith
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-600">
              RJ
            </span>
            Robert Johnson
          </Button>
        </div>
      </ScrollArea>

      {effectiveSubscription === "free" && (
        <div className="p-4 mx-4 mb-4 bg-secondary rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-primary">Free Plan</h3>
          </div>
          <p className="text-xs text-gray-700 mb-3">
            Upgrade to Premium for access to all specialized AI agents and
            features
          </p>
          <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
            Upgrade Now
          </Button>
        </div>
      )}

      <div className="p-4 mt-auto border-t border-gray-200">
        {defaultBottomItems.map((item) => (
          <Link to={item.href} key={item.label}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 mb-1.5"
              onClick={() => onItemClick(item.label)}
            >
              <span className="text-gray-500">{item.icon}</span>
              {item.label}
            </Button>
          </Link>
        ))}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 mb-1.5"
          onClick={handleLogout}
        >
          <span className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          Log out
        </Button>
      </div>
    </div>
  );
}
