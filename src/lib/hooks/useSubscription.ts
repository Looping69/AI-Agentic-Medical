import { useState, useEffect } from "react";
import { useAuth } from "../../supabase/auth";
import { supabase } from "../../supabase/supabase";

type Subscription = {
  id: string;
  user_id: string;
  plan: "free" | "premium";
  status: "active" | "cancelled" | "past_due";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is the error code for no rows returned
          throw error;
        }

        setSubscription(data as Subscription | null);
      } catch (err) {
        console.error("Error loading subscription:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [user]);

  const isPremium =
    subscription?.plan === "premium" && subscription?.status === "active";

  const upgradeToPremium = async (
    stripeCustomerId: string,
    stripeSubscriptionId: string,
  ) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check if user already has a subscription
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      let updatedSubscription;

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
        updatedSubscription = data;
      } else {
        // Create new subscription
        const { data, error } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
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
        updatedSubscription = data;
      }

      setSubscription(updatedSubscription as Subscription);
      return updatedSubscription as Subscription;
    } catch (err) {
      console.error("Error upgrading to premium:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelCurrentSubscription = async () => {
    if (!subscription) {
      setError("No active subscription");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id)
        .select()
        .single();

      if (error) throw error;

      setSubscription(data as Subscription);
      return true;
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscription,
    isPremium,
    isLoading,
    error,
    upgradeToPremium,
    cancelCurrentSubscription,
  };
}
