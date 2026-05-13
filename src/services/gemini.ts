import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features will be limited.");
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getGeminiModel = (modelName = "gemini-3-flash-preview") => {
  if (!ai) throw new Error("AI is not initialized. Please check GEMINI_API_KEY.");
  return modelName;
};

export async function analyzeMedicalImage(imageBuffer: string, mimeType: string, diseaseType: string) {
  if (!ai) return null;
  
  const prompt = `You are a world-class AI Medical Diagnostic System at Lumina Health. 
    Analyze this medical image for ${diseaseType}. 
    Provide your response in JSON format with the following structure:
    {
      "prediction": "string - clear diagnosis name",
      "confidence": "number - index between 0.0 and 1.0",
      "severity": "string - low, moderate, high, or critical",
      "analysis": "string - detailed medical observations",
      "recommendations": ["list", "of", "actions"],
      "explanation": "string - layman explanation for the patient"
    }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imageBuffer,
                mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}

export async function getHealthAssistantResponse(message: string, history: any[] = []) {
  if (!ai) return "AI Assistant is currently offline.";

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are Lumina Health's AI Medical Assistant. You are professional, empathetic, and accurate. Always include a disclaimer that you are an AI and not a substitute for professional medical advice. For emergencies, always recommend calling emergency services immediately."
    }
  });

  // History transformation if needed
  
  const response = await chat.sendMessage({ message });
  return response.text;
}
