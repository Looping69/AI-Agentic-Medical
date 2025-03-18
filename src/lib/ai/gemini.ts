import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const API_KEY =
  import.meta.env.VITE_GOOGLE_AI_API_KEY ||
  "AIzaSyBBXVIaqFnVmbT7cjp_f1Ow0sWcHGt9teI";

// Create a client with the API key
export const genAI = new GoogleGenerativeAI(API_KEY);

// Function to get a model instance
export const getGeminiModel = (modelName: string = "gemini-pro") => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Function to generate content using Gemini
export async function generateContent(
  prompt: string,
  modelName: string = "gemini-pro",
) {
  try {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
}

// Function to generate content with a specific system prompt
export async function generateContentWithSystemPrompt(
  userPrompt: string,
  systemPrompt: string,
  modelName: string = "gemini-pro",
) {
  try {
    const model = getGeminiModel(modelName);
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand and will act according to these instructions.",
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(userPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with system prompt:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
}
