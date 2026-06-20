// src/hooks/useExtraction.ts

import { useState } from "react";
import { extractTextFromPdf } from "../services/pdfParser";
import { structureTextWithAI, type ExtractedDocData } from "../services/geminiService";

export type ExtractionStatus = 'idle' | 'parsing_file' | 'structuring_ai' | 'success' | 'error';


export function useExtraction() {
    const [status, setStatus] = useState<ExtractionStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<ExtractedDocData | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    // orchestrates the parsing and structuring lifecycle for an uploaded file
    const processDoc = async (file: File) => {
        if (!file) return;

        // reset status variables for a clean execution run
        setStatus('parsing_file');
        setError(null);
        setExtractedData(null);
        setFileName(file.name);

        try {
            // 1. run local file layer extraction or canvas ocr
            const rawText = await extractTextFromPdf(file);

            if (!rawText || rawText.trim().length === 0) {
                throw new Error('Could not extract any legible text from this file');
            }

            // 2. advance status and pass textual data to gemini api
            setStatus('structuring_ai');
            const structuredJson = await structureTextWithAI(rawText);

            // 3. save resulting transaction dataset to state hook memory
            setExtractedData(structuredJson);
            setStatus('success');
        }
        catch (error: any) {
            alert(`Document pipeline failed: ${error.message}`);
            setError(error.message || 'An unexpected error occured during document processing');
            setStatus('error');
        }
    }

    // flushes active state memories back to default properties
    const resetExtraction = () => {
        setStatus('idle');
        setError(null);
        setExtractedData(null);
        setFileName(null);
    }

    return {
        status,
        error,
        extractedData,
        fileName,
        processDoc,
        resetExtraction
    }
}