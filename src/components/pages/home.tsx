import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, ChevronRight, Settings, Stethoscope, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[1200px] mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl flex items-center">
              <Stethoscope className="h-6 w-6 mr-2 text-blue-600" />
              <span>LENY-AI</span>
              <span className="text-blue-600 ml-1">Medical</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="pt-16">
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white text-center">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-5xl font-bold tracking-tight mb-4 text-gray-900">
              LENY-AI Medical Assistant Network
            </h2>
            <h3 className="text-2xl font-medium text-gray-600 mb-8 max-w-3xl mx-auto">
              A HIPAA-compliant, AI-powered platform providing doctors with
              intelligent support through specialized AI assistants.
            </h3>
            <div className="flex justify-center space-x-6 text-xl">
              <Link
                to="/signup"
                className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Start Free Trial <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
              <Link
                to="/"
                className="flex items-center text-blue-600 px-6 py-3 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                Learn More <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
            <div className="mt-12 relative">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"
                  alt="LENY-AI Platform Interface"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Agent Section */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
              Specialized AI Agents
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-12 max-w-3xl mx-auto">
              Access a comprehensive library of specialized medical AI
              assistants to support your clinical decision-making
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Agents */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Free
                </div>
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold mb-3">General Medicine</h4>
                <p className="text-gray-600 mb-6">
                  Comprehensive medical knowledge covering common conditions,
                  symptoms, and treatments.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Symptom analysis
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Treatment suggestions
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Basic patient education
                  </li>
                </ul>
                <Link to="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Access Now
                  </Button>
                </Link>
              </div>

              {/* Free Agents */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Free
                </div>
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-3">Medical Records</h4>
                <p className="text-gray-600 mb-6">
                  Intelligent EHR assistant that helps organize and analyze
                  patient records efficiently.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    FHIR integration
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Patient history summary
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Basic trend analysis
                  </li>
                </ul>
                <Link to="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Access Now
                  </Button>
                </Link>
              </div>

              {/* Premium Agents Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-sm text-left relative overflow-hidden border-2 border-dashed border-gray-200">
                <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                  Premium
                </div>
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-3">Specialist Agents</h4>
                <p className="text-gray-600 mb-6">
                  Unlock access to 20+ specialized medical AI agents covering
                  all major specialties.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Cardiology, Neurology, Radiology
                  </li>
                  <li className="flex items-center text-gray-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Advanced diagnostic support
                  </li>
                  <li className="flex items-center text-gray-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Specialist-level insights
                  </li>
                </ul>
                <Button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                  disabled
                >
                  Upgrade to Premium
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="text-blue-600 hover:underline flex items-center justify-center"
              >
                View all available agents{" "}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900 text-center">
              Key Features
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-12 max-w-3xl mx-auto text-center">
              Everything you need for intelligent medical assistance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">HIPAA Compliant</h4>
                <p className="text-gray-600">
                  Secure platform that meets all healthcare privacy and security
                  requirements.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">EHR Integration</h4>
                <p className="text-gray-600">
                  Seamless connection with electronic health record systems via
                  FHIR API.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">
                  Role-Based Access
                </h4>
                <p className="text-gray-600">
                  Secure authentication with distinct interfaces for doctors,
                  specialists, and admins.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">
                  Subscription Tiers
                </h4>
                <p className="text-gray-600">
                  Flexible pricing with free tier (3 agents) and premium access
                  to full agent library.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Ready to transform your practice?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals already using LENY-AI
              to enhance patient care.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-medium rounded-full">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-blue-700 px-8 py-6 text-lg font-medium rounded-full"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-medium text-white mb-4">LENY-AI Medical</h4>
              <p className="text-sm mb-4">
                A HIPAA-compliant, AI-powered medical assistant platform for
                healthcare professionals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    AI Agents
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-sm">
            <p>© 2024 LENY-AI Medical. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
