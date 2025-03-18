import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase-client";
import { Profile } from "@/types/database";
import {
  getUserProfile,
  signIn as authServiceSignIn,
  signOut as authServiceSignOut,
} from "./auth-service";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
});

// Export the hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// Define the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    async function getInitialSession() {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setSession(data.session);
        setUser(data.session?.user || null);

        if (data.session?.user) {
          const userProfile = await getUserProfile(data.session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user || null);
        setLoading(true);

        if (session?.user) {
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }

        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authServiceSignIn({ email, password });
      return result;
    } catch (error) {
      console.error("Error signing in from context:", error);
      setError(error as Error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authServiceSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
      setError(error as Error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        error,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
