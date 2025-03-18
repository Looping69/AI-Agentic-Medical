import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  medical_history: string | null;
  conditions: string[] | null;
  medications: string[] | null;
  allergies: string[] | null;
  last_visit: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type Consultation = {
  id: string;
  patient_id: string;
  doctor_id: string;
  agents: string[];
  symptoms: string[] | null;
  diagnosis: string | null;
  recommendations: string[] | null;
  notes: string | null;
  status: "in-progress" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};

type ConsultationMessage = {
  id: string;
  consultation_id: string;
  role: "user" | "agent" | "system" | "orchestrator";
  content: string;
  agent_id: string | null;
  created_at: string;
};

type MessageWithAgent = ConsultationMessage & {
  agentName?: string;
  agentIcon?: string;
};

type ConsultationHookProps = {
  consultationId: string;
};

export function useConsultation({ consultationId }: ConsultationHookProps) {
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<MessageWithAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadConsultation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get consultation details
        const { data: consultationData, error: consultationError } =
          await supabase
            .from("consultations")
            .select("*")
            .eq("id", consultationId)
            .single();

        if (consultationError) throw consultationError;
        if (!consultationData) throw new Error("Consultation not found");

        setConsultation(consultationData as Consultation);

        // Get patient details
        const { data: patientData, error: patientError } = await supabase
          .from("patients")
          .select("*")
          .eq("id", consultationData.patient_id)
          .single();

        if (patientError) throw patientError;
        if (!patientData) throw new Error("Patient not found");

        setPatient(patientData as Patient);

        // Get messages
        await loadMessages();
      } catch (err) {
        console.error("Error loading consultation:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadConsultation();

    // Set up real-time subscription for messages
    const subscription = supabase
      .channel("consultation-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "consultation_messages",
          filter: `consultation_id=eq.${consultationId}`,
        },
        () => {
          loadMessages();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [consultationId]);

  const loadMessages = async () => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from("consultation_messages")
        .select("*")
        .eq("consultation_id", consultationId)
        .order("created_at");

      if (messagesError) throw messagesError;

      // Enhance messages with agent details
      const enhancedMessages = await Promise.all(
        (messagesData || []).map(async (message) => {
          if (message.agent_id) {
            const { data: agent } = await supabase
              .from("ai_agents")
              .select("name, icon")
              .eq("id", message.agent_id)
              .single();

            return {
              ...message,
              agentName: agent?.name,
              agentIcon: agent?.icon,
            };
          }
          return message;
        }),
      );

      setMessages(enhancedMessages as MessageWithAgent[]);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred loading messages",
      );
    }
  };

  const sendMessage = async (content: string) => {
    try {
      setIsSending(true);
      setError(null);

      // Add user message to the database
      const { error: messageError } = await supabase
        .from("consultation_messages")
        .insert({
          consultation_id: consultationId,
          role: "user",
          content,
          agent_id: null,
        });

      if (messageError) throw messageError;

      // Call the agent orchestrator edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-orchestrator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            consultationId,
            message: content,
            userId: (await supabase.auth.getUser()).data.user?.id,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process message");
      }

      // Messages will be updated via the real-time subscription
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred sending message",
      );
    } finally {
      setIsSending(false);
    }
  };

  const finishConsultation = async (
    diagnosis: string,
    recommendations: string[],
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("consultations")
        .update({
          diagnosis,
          recommendations,
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", consultationId)
        .select()
        .single();

      if (error) throw error;
      setConsultation(data as Consultation);
      return data as Consultation;
    } catch (err) {
      console.error("Error completing consultation:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred completing consultation",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    consultation,
    patient,
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    finishConsultation,
  };
}
