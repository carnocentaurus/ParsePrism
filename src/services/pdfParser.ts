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
async function extractOcrText(file: File, pdf: pdfjsLib.PDFDocumentProxy): Promise<string> {
    let fullText: string = '';

    // initialize the tesseract worker for english text
    const worker = await createWorker('eng');

    // convert file to an ArrayBuffer for internal pdfjs canvas rendering hooks
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
    const internalPdf = await loadingTask.promise;

    for (let i = 1; i <= internalPdf.numPages; i++) {
        const page = await internalPdf.getPage(i);

        // set up a standard 1.5x resolution scale for clean text image legibility
        const viewport = page.getViewport({scale: 1.5});

        // create an in-memory canvas element to hold the rasterized page frame
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (!context) continue;

        // render the pdf page into the canvas context natively
        await page.render({canvasContext: context, viewport}).promise;

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