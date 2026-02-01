
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
    constructor() {
        this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    }

    async getSavingsAdvice(goal, amount, timeline) {
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.0-flash-exp',
                contents: `I want to save ${amount} for ${goal} within ${timeline}. As a friendly Vsave financial assistant, give me 3 short, actionable tips on how to achieve this using a fintech app. Keep it professional and encouraging.`,
                config: {
                    systemInstruction: "You are V-Assistant, the helpful AI financial coach for Vsave. Your tone is professional, encouraging, and focused on financial growth.",
                    temperature: 0.7,
                },
            });

            return response.text ? response.text() : "I'm having trouble thinking of tips right now, but consistent saving is always a great start!";
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Focus on small daily habits. They lead to big results!";
        }
    }
}