import { GoogleGenAI } from "@google/genai";
import { DashboardMetrics } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDashboardInsights = async (data: DashboardMetrics): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your environment configuration.";
  }

  try {
    const prompt = `
      Analyze the following Asset Management Dashboard data and provide 3 brief, actionable insights or alerts for the facility manager.
      
      Data:
      ${JSON.stringify(data, null, 2)}
      
      Format the response as a bulleted list. Keep it professional and concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to generate insights. Please try again later.";
  }
};