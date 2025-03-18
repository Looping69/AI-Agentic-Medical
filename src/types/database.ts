export type Profile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "doctor" | "specialist" | "admin" | "master";
  specialty: string | null;
  created_at: string;
  updated_at: string;
};

export type AIAgent = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_premium: boolean;
  specialties: string[] | null;
  capabilities: string[] | null;
  created_at: string;
  updated_at: string;
};

export type Patient = {
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

export type Consultation = {
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

export type ConsultationMessage = {
  id: string;
  consultation_id: string;
  role: "user" | "agent" | "system" | "orchestrator";
  content: string;
  agent_id: string | null;
  created_at: string;
};

export type Subscription = {
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
