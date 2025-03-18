import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import SimpleLoginForm from "./components/auth/SimpleLoginForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { SimpleAuthProvider, useSimpleAuth } from "./lib/simple-auth-context";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen } from "./components/ui/loading-spinner";
import Agents from "./components/pages/agents";
import Consultations from "./components/pages/consultations";
import PatientRecordsPage from "./components/pages/patient-records";

// Simple Auth Protection
function SimpleAuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSimpleAuth();

  if (!isAuthenticated) {
    return <SimpleLoginForm />;
  }

  return <>{children}</>;
}

// Supabase Auth Protection (original)
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  // For tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  // If tempo routes matched, return them
  if (tempoRoutes) return tempoRoutes;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="signup" element={<SignUpForm />} />
      <Route
        path="dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="dashboard/agents"
        element={
          <PrivateRoute>
            <Agents />
          </PrivateRoute>
        }
      />
      <Route
        path="dashboard/consultations"
        element={
          <PrivateRoute>
            <Consultations />
          </PrivateRoute>
        }
      />
      <Route
        path="dashboard/records"
        element={
          <PrivateRoute>
            <PatientRecordsPage />
          </PrivateRoute>
        }
      />
      <Route path="success" element={<Success />} />
      {/* Add this before the catchall route */}
      {import.meta.env.VITE_TEMPO === "true" && (
        <Route path="tempobook/*" element={<></>} />
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <SimpleAuthProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen text="Loading application..." />}>
          <SimpleAuthCheck>
            <AppRoutes />
          </SimpleAuthCheck>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </SimpleAuthProvider>
  );
}

export default App;
