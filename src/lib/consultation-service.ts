import { supabase } from "./supabase-client";
import { Consultation, ConsultationMessage } from "@/types/database";

export const getConsultations = async (): Promise<Consultation[]> => {
  try {
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Consultation[];
  } catch (error) {
    console.error("Error getting consultations:", error);
    return [];
  }
};

export const getConsultationById = async (
  id: string,
): Promise<Consultation | null> => {
  try {
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Consultation;
  } catch (error) {
    console.error("Error getting consultation:", error);
    return null;
  }
};

export const getConsultationsByPatientId = async (
  patientId: string,
): Promise<Consultation[]> => {
  try {
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Consultation[];
  } catch (error) {
    console.error("Error getting consultations by patient ID:", error);
    return [];
  }
};

export const createConsultation = async (
  consultation: Omit<Consultation, "id" | "created_at" | "updated_at">,
): Promise<Consultation | null> => {
  try {
    const { data, error } = await supabase
      .from("consultations")
      .insert(consultation)
      .select()
      .single();

    if (error) throw error;
    return data as Consultation;
  } catch (error) {
    console.error("Error creating consultation:", error);
    return null;
  }
};

export const updateConsultation = async (
  id: string,
  updates: Partial<Consultation>,
): Promise<Consultation | null> => {
  try {
    const { data, error } = await supabase
      .from("consultations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Consultation;
  } catch (error) {
    console.error("Error updating consultation:", error);
    return null;
  }
};

export const getConsultationMessages = async (
  consultationId: string,
): Promise<ConsultationMessage[]> => {
  try {
    const { data, error } = await supabase
      .from("consultation_messages")
      .select("*")
      .eq("consultation_id", consultationId)
      .order("created_at");

    if (error) throw error;
    return data as ConsultationMessage[];
  } catch (error) {
    console.error("Error getting consultation messages:", error);
    return [];
  }
};

export const addConsultationMessage = async (
  message: Omit<ConsultationMessage, "id" | "created_at">,
): Promise<ConsultationMessage | null> => {
  try {
    const { data, error } = await supabase
      .from("consultation_messages")
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data as ConsultationMessage;
  } catch (error) {
    console.error("Error adding consultation message:", error);
    return null;
  }
};

export const completeConsultation = async (
  id: string,
  diagnosis: string,
  recommendations: string[],
): Promise<Consultation | null> => {
  try {
    const { data, error } = await supabase
      .from("consultations")
      .update({
        diagnosis,
        recommendations,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Consultation;
  } catch (error) {
    console.error("Error completing consultation:", error);
    return null;
  }
};
