import { Suspense, lazy, useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen } from "./components/ui/loading-spinner";
import { DebugAuth } from "./components/ui/debug-auth";

// Lazy load components to improve performance
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const SignUpForm = lazy(() => import("./components/auth/SignUpForm"));
const Dashboard = lazy(() => import("./components/pages/dashboard"));
const Success = lazy(() => import("./components/pages/success"));
const Home = lazy(() => import("./components/pages/home"));
const Agents = lazy(() => import("./components/pages/agents"));
const AgentChat = lazy(() => import("./components/pages/agent-chat"));
const Consultations = lazy(() => import("./components/pages/consultations"));
const PatientRecordsPage = lazy(
  () => import("./components/pages/patient-records"),
);
const UserFlowDiagram = lazy(() => import("./components/UserFlowDiagram"));

// Supabase Auth Protection
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  console.log(
    "PrivateRoute - User:",
    !!user,
    "Loading:",
    loading,
    "User ID:",
    user?.id,
  );

  // Add a timeout to prevent infinite loading
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Update local loading state when auth loading changes
    setLocalLoading(loading);

    // Set a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (loading) {
        console.log("Forcing loading to false after timeout");
        setLocalLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  // If we have a user, don't show loading screen
  if (user && localLoading) {
    console.log("User exists but still loading, rendering content anyway");
    return <>{children}</>;
  }

  if (localLoading) {
    return <LoadingScreen text="Authenticating..." />;
  }

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen text="Loading application..." />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingScreen text="Loading home..." />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<LoadingScreen text="Loading login..." />}>
                <LoginForm />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<LoadingScreen text="Loading signup..." />}>
                <SignUpForm />
              </Suspense>
            }
          />
          <Route
            path="/success"
            element={
              <Suspense fallback={<LoadingScreen text="Loading..." />}>
                <Success />
              </Suspense>
            }
          />
          <Route
            path="/user-flow"
            element={
              <Suspense
                fallback={<LoadingScreen text="Loading user flow diagram..." />}
              >
                <UserFlowDiagram />
              </Suspense>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Suspense
                  fallback={<LoadingScreen text="Loading dashboard..." />}
                >
                  <Dashboard />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/agents"
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingScreen text="Loading agents..." />}>
                  <Agents />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/agents/:agentId"
            element={
              <PrivateRoute>
                <Suspense
                  fallback={<LoadingScreen text="Loading agent chat..." />}
                >
                  <AgentChat />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/consultations"
            element={
              <PrivateRoute>
                <Suspense
                  fallback={<LoadingScreen text="Loading consultations..." />}
                >
                  <Consultations />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/records"
            element={
              <PrivateRoute>
                <Suspense
                  fallback={<LoadingScreen text="Loading patient records..." />}
                >
                  <PatientRecordsPage />
                </Suspense>
              </PrivateRoute>
            }
          />

          {/* Tempo Routes - Important for storyboards */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={null} />
          )}

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
      <DebugAuth />
    </AuthProvider>
  );
}

export default App;
