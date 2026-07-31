import { GoogleGenAI } from "@google/genai";

console.log()

export const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

