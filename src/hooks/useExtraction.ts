// src/hooks/useExtraction.ts

import { useState } from "react";
import { extractTextFromPdf } from "../services/pdfParser";
import { structureTextWithAI, ExtractedDocData } from "../services/geminiService";

export type ExtractionStatus = 'idle' | 'parsing_file' | 'structuring_ai' | 'sucess' | 'error';