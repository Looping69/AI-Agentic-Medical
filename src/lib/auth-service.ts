import { supabase } from "./supabase-client";
import { Profile } from "@/types/database";

export type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "doctor" | "specialist" | "admin" | "master";
  specialty?: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export const signUp = async (data: SignUpData) => {
  try {
    console.log("Starting signup process with data:", {
      ...data,
      password: "[REDACTED]",
    });

    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          specialty: data.specialty || null,
        },
        emailRedirectTo: window.location.origin + "/login",
      },
    });

    if (authError) {
      console.error("Auth error during signup:", authError);
      throw authError;
    }

    if (!authData.user) {
      console.error("No user returned from auth signup");
      throw new Error("User creation failed");
    }

    console.log("User created in auth system, ID:", authData.user.id);

    // Step 2: Create the user profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role,
      specialty: data.specialty || null,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      throw profileError;
    }

    console.log("User profile created successfully");

    // Step 3: Create a free subscription for the user
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: authData.user.id,
        plan: "free",
        status: "active",
      });

    if (subscriptionError) {
      console.error("Subscription creation error:", subscriptionError);
      throw subscriptionError;
    }

    console.log("User subscription created successfully");

    return { user: authData.user, session: authData.session };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signIn = async (data: SignInData) => {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    return { user: authData.user, session: authData.session };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
};

export const getUserProfile = async (
  userId: string,
): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // If no profile found, don't throw an error
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data as Profile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<Profile>,
) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
