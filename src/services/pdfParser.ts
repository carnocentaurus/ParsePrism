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


// renders pdf pages onto an off-screen html canvas and runs tesseract ocr
// to scrape text out of scanned images or flat photo documents
async function extractOcrText(pdf: pdfjsLib.PDFDocumentProxy): Promise<string> {
    let fullText: string = '';

    // initialize the tesseract worker for english text
    const worker = await createWorker('eng');

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // set up a standard 1.5x resolution scale for clean text image legibility
        const viewport = page.getViewport({scale: 1.5});

        // create an in-memory canvas element to hold the rasterized page frame
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (!context) continue;

        // render the pdf page into the canvas context natively
        await page.render({canvasContext: context, viewport, canvas}).promise;

        // convert canvas img frame to a data url and feed it directly to tesseract
        const imgUrl = canvas.toDataURL('image/png');
        const {data: {text}} = await worker.recognize(imgUrl);

        fullText += `--- Page ${i} (OCR Master) ---\n${text}\n\n`;

        // clean up canvas reference from dom tracking footprint
        canvas.remove();
    }

    // shut down the bg multi-thread worker safely to avoid memory leaks
    await worker.terminate();
    return fullText.trim();
}


// master extraction hub: extracts all text from a given pdf file
// automatically switches to ocr if a doc is scanned or lacks selectable text layers
export async function extractTextFromPdf(file: File): Promise<string> {
    try {
         const arrayBuffer = await file.arrayBuffer();
         const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
         const pdf = await loadingTask.promise;

         // step 1: attempt fast digital text extraction
         const digitalText = await extractDigitalText(pdf);

         // step 2: fallback check. if extracted text is empty or negligible,
         // its highly likely a flat scanned img, so trigger the ocr engine
         const cleanCheck = digitalText.replace(/--- Page \d+ ---|\s/g, '');
         if (cleanCheck.length < 15) return await extractOcrText(pdf);
 
         return digitalText;
    }
    catch (error: any) {
        console.error('PDF Parser Failure:', error);
        throw new Error(`Failed to read doc contents: ${error.message}`);
    }
}