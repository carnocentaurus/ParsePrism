// src/services/geminiService.ts

import { GoogleGenAI, Type, Schema } from "@google/genai";

// initialize sdk using vite env variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) console.warn('Missing GEMINI_API_KEY env variable!');

const ai = new GoogleGenAI({apiKey});

// define ts type for extracted data blueprint
export interface ExtractedDocData {
    vendorName: string;
    docDate: string;
    totalAmount: number;
    taxAmount: number;
    invoiceOrRefNum: string;
    lineItems: Array<{
        desc: string;
        amount: number;
    }>;
    confidenceNotes: string;
}