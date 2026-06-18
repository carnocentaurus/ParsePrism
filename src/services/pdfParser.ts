// src/services/pdfParser.ts

import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// setup bg worker thread for vite compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).href;


// extracts text from a pdf file layer by layer
async function extractDigitalText(pdf: pdfjsLib.PDFDocumentProxy): Promise<string> {
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    const pageText = textContent.items
      // @ts-ignore - items can be TextItem or TextInput, we want the str property safely
      .map((item) => item.str || '')
      .join(' ');
      
    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
  }

  return fullText.trim();
}