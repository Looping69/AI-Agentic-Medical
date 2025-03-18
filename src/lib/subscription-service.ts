import { supabase } from "./supabase-client";
import { Subscription } from "@/types/database";

export const getUserSubscription = async (
  userId: string,
): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No active subscription found
        return null;
      }
      throw error;
    }

    return data as Subscription;
  } catch (error) {
    console.error("Error getting user subscription:", error);
    return null;
  }
};

export const createSubscription = async (
  subscription: Omit<Subscription, "id" | "created_at" | "updated_at">,
): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert(subscription)
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    return null;
  }
};

export const updateSubscription = async (
  id: string,
  updates: Partial<Subscription>,
): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  } catch (error) {
    console.error("Error updating subscription:", error);
    return null;
  }
};

export const cancelSubscription = async (
  id: string,
): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return null;
  }
};

export const upgradeToPremuim = async (
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
): Promise<Subscription | null> => {
  try {
    // First check if user already has a subscription
    const existingSubscription = await getUserSubscription(userId);

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          plan: "premium",
          status: "active",
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 30 days from now
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscription.id)
        .select()
        .single();

      if (error) throw error;
      return data as Subscription;
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan: "premium",
          status: "active",
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 30 days from now
        })
        .select()
        .single();

      if (error) throw error;
      return data as Subscription;
    }
  } catch (error) {
    console.error("Error upgrading to premium:", error);
    return null;
  }
};
