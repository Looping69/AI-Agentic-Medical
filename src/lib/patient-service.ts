import { supabase } from "./supabase-client";
import { Patient } from "@/types/database";

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("last_name");

    if (error) throw error;
    return data as Patient[];
  } catch (error) {
    console.error("Error getting patients:", error);
    return [];
  }
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Patient;
  } catch (error) {
    console.error("Error getting patient:", error);
    return null;
  }
};

export const createPatient = async (
  patient: Omit<Patient, "id" | "created_at" | "updated_at">,
): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .insert(patient)
      .select()
      .single();

    if (error) throw error;
    return data as Patient;
  } catch (error) {
    console.error("Error creating patient:", error);
    return null;
  }
};

export const updatePatient = async (
  id: string,
  updates: Partial<Patient>,
): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Patient;
  } catch (error) {
    console.error("Error updating patient:", error);
    return null;
  }
};

export const deletePatient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting patient:", error);
    return false;
  }
};

export const searchPatients = async (query: string): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .or(
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`,
      )
      .order("last_name");

    if (error) throw error;
    return data as Patient[];
  } catch (error) {
    console.error("Error searching patients:", error);
    return [];
  }
};
