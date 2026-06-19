// src/services/geminiService.ts

import { GoogleGenAI, Type, type Schema } from "@google/genai";

// initialize sdk using vite env variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) console.warn('Missing GEMINI_API_KEY env variable!');

const ai = new GoogleGenAI({apiKey});

// ts type for extracted data blueprint
export interface ExtractedDocData {
    vendorName: string;
    docDate: string;
    totalAmount: number;
    taxAmount: number;
    invoiceOrRefNum: string;
    lineItems: Array<{
        description: string;
        amount: number;
    }>;
    confidenceNotes: string;
}

// strict gemini json schema matching the interface
const extractionSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        vendorName: {
            type: Type.STRING,
            description: 'The name of the company or entity that issued the document.'
        },
        docDate: {
            type: Type.STRING,
            description: 'The date the document was issued, formatted as YYYY-MM-DD if possible.'
        },
        totalAmount: {
            type: Type.NUMBER,
            description: 'The absolute grand total amount listed on the document.'
        },
        taxAmount: {
            type: Type.NUMBER,
            description: 'The total tax amount, listed (VAT, Sales Tax, etc.). Return 0 if not found.'
        },
        invoiceOrRefNum: {
            type: Type.STRING,
            description: 'The invoice number, receipt ID, or contract reference string.'
        },
        lineItems: {
            type: Type.ARRAY,
            description: 'Individual breakdown items listed in the transaction grid.',
            items: {
                type: Type.OBJECT,
                properties: {
                    description: {type: Type.STRING, description: 'Name or description of the item/service.'},
                    amount: {type: Type.NUMBER, description: 'The cost/total for this specific line item.'}
                },
                required: ['description', 'amount']
            }
        },
        confidenceNotes: {
            type: Type.STRING,
            description: 'Brief note if any data fields were blurry, ambigous, or missing from the text.'
        },
    },
    required: ['vendorName', 'totalAmount'] as const
}


// sends raw doc text to gemini and retrieves a strictly typed json dataset
export async function structureTextWithAI(rawText: string): Promise<ExtractedDocData> {
    if (!apiKey) throw new Error('Gemini API key missing. Check .env config');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this extracted document text block and accurately pull out the structure transaction details: \n\n${rawText}`,
            config: {
                // enforce immutable json response schema
                responseMimeType: 'application/json',
                responseSchema: extractionSchema,
                // kept very low for factual deterministic extraction rather than creativity
                temperature: 0.1 
            }
        });

        if (!response.text) throw new Error('The AI returned an empty response');

        // because responseSchema is strictly enforced, this safely parses directly to the interface shape
        return JSON.parse(response.text) as ExtractedDocData;
    }
    catch (error: any) {
        alert(`Gemini extraction failure: ${error.msg}`);
        throw new Error(`AI processing failed: ${error.message}`);
    }
}