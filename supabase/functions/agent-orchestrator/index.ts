import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.24.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { consultationId, message, userId } = await req.json();

    if (!consultationId || !message || !userId) {
      throw new Error("Missing required parameters");
    }

    // Get the consultation details
    const { data: consultation, error: consultationError } = await supabase
      .from("consultations")
      .select("*")
      .eq("id", consultationId)
      .single();

    if (consultationError) throw consultationError;
    if (!consultation) throw new Error("Consultation not found");

    // Get the patient details
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("id", consultation.patient_id)
      .single();

    if (patientError) throw patientError;
    if (!patient) throw new Error("Patient not found");

    // Get the AI agents involved in this consultation
    const { data: agents, error: agentsError } = await supabase
      .from("ai_agents")
      .select("*")
      .in("id", consultation.agents);

    if (agentsError) throw agentsError;
    if (!agents || agents.length === 0)
      throw new Error("No agents found for this consultation");

    // Get previous messages in this consultation
    const { data: previousMessages, error: messagesError } = await supabase
      .from("consultation_messages")
      .select("*")
      .eq("consultation_id", consultationId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    // Add the user message to the database
    const { error: userMessageError } = await supabase
      .from("consultation_messages")
      .insert({
        consultation_id: consultationId,
        role: "user",
        content: message,
      });

    if (userMessageError) throw userMessageError;

    // Prepare context for the AI model
    const patientContext = `
      Patient: ${patient.first_name} ${patient.last_name}
      Age: ${calculateAge(patient.date_of_birth)}
      Gender: ${patient.gender || "Not specified"}
      Medical History: ${patient.medical_history || "None"}
      Conditions: ${patient.conditions?.join(", ") || "None"}
      Medications: ${patient.medications?.join(", ") || "None"}
      Allergies: ${patient.allergies?.join(", ") || "None"}
      Last Visit: ${patient.last_visit || "N/A"}
    `;

    const agentContext = agents
      .map(
        (agent) => `
      Agent: ${agent.name}
      Specialties: ${agent.specialties?.join(", ") || "None"}
      Capabilities: ${agent.capabilities?.join(", ") || "None"}
    `,
      )
      .join("\n");

    const conversationHistory =
      previousMessages
        ?.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n") || "";

    // Process the message with each agent
    const agentResponses = await Promise.all(
      agents.map(async (agent) => {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });

          const prompt = `
          You are ${agent.name}, a specialized medical AI assistant with expertise in ${agent.specialties?.join(", ")}.
          
          ${patientContext}
          
          Previous conversation:\n${conversationHistory}
          
          USER: ${message}
          
          Provide a helpful, accurate, and concise response based on your medical expertise. Focus on your specialties but acknowledge when a question is outside your area of expertise.
        `;

          const result = await model.generateContent(prompt);
          const response = result.response.text();

          // Save the agent's response to the database
          await supabase.from("consultation_messages").insert({
            consultation_id: consultationId,
            role: "agent",
            content: response,
            agent_id: agent.id,
          });

          return {
            agentId: agent.id,
            agentName: agent.name,
            response,
          };
        } catch (error) {
          console.error(`Error with agent ${agent.name}:`, error);
          return {
            agentId: agent.id,
            agentName: agent.name,
            response: `Error: Unable to generate response from ${agent.name}.`,
          };
        }
      }),
    );

    // Generate orchestrator response that synthesizes the agent responses
    const orchestratorPrompt = `
      You are a medical AI orchestrator that coordinates responses from multiple specialized medical AI agents.
      
      ${patientContext}
      
      The user asked: "${message}"
      
      The following specialized agents provided these responses:
      ${agentResponses.map((r) => `${r.agentName}: ${r.response}`).join("\n\n")}
      
      Synthesize these responses into a single, coherent answer that highlights the most important information and reconciles any differences in the agents' perspectives. Be concise but comprehensive.
    `;

    const orchestratorModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const orchestratorResult =
      await orchestratorModel.generateContent(orchestratorPrompt);
    const orchestratorResponse = orchestratorResult.response.text();

    // Save the orchestrator's response to the database
    await supabase.from("consultation_messages").insert({
      consultation_id: consultationId,
      role: "orchestrator",
      content: orchestratorResponse,
    });

    // Return all responses
    return new Response(
      JSON.stringify({
        agentResponses,
        orchestratorResponse,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string | null): string {
  if (!dateOfBirth) return "Unknown";

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age.toString();
}
