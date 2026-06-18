// src/services/pdfParser.ts

import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// setup bg worker thread for vite compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).href;