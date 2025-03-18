import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";

export function DebugAuth() {
  const { user, loading, error, session } = useAuth();
  const [timeInLoading, setTimeInLoading] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (loading) {
      interval = setInterval(() => {
        setTimeInLoading((prev) => prev + 1);
      }, 1000) as unknown as number;
    } else {
      setTimeInLoading(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-2 text-xs z-50 max-w-xs">
      <div>
        <strong>Supabase Auth:</strong> {user ? "✅" : "❌"}
      </div>
      <div>
        <strong>Loading:</strong> {loading ? `✅ (${timeInLoading}s)` : "❌"}
      </div>
      <div>
        <strong>Session:</strong> {session ? "✅" : "❌"}
      </div>
      <div>
        <strong>User ID:</strong> {user?.id?.substring(0, 8) || "none"}
      </div>
      <div>
        <strong>Email:</strong> {user?.email || "none"}
      </div>
      {error && (
        <div>
          <strong>Error:</strong> {error.message}
        </div>
      )}
    </div>
  );
}
