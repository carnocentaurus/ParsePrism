// src/services/geminiService.ts

import { GoogleGenAI, Type, Schema } from "@google/genai";

// initialize sdk using vite env variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) console.warn('Missing GEMINI_API_KEY env variable!');

const ai = new GoogleGenAI({apiKey});