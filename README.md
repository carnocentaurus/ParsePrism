# ParsePrism

ParsePrism is an intelligent, privacy-conscious document data extraction application that transforms chaotic, unstructured files — like scanned PDFs, invoices, receipts, and contracts — into pristine, structured JSON data models.

By combining local browser-based parsing with lightweight AI orchestration, ParsePrism eliminates manual data entry completely, for free.

---

## The Problem & The Solution

**The Problem:** Small businesses, freelancers, and developers waste countless hours manually copying data from PDF invoices, legal agreements, and receipts into spreadsheets or databases. Existing corporate OCR solutions are expensive, complex, and tied to heavy monthly subscriptions.

**The Solution:** ParsePrism acts like a physical prism — taking a chaotic, unstructured beam of document text and breaking it down into a perfectly organized spectrum of structured, database-ready objects. It costs nothing to run, performs textual analysis locally, and leverages free AI developer tiers to guarantee data integrity.

---

## Tech Stack & Architecture

ParsePrism is engineered using modern, lightweight web standards:

- **Frontend:** React, TypeScript, Tailwind CSS
- **Text Extraction (Local):** `pdfjs-dist` for digital PDF layers, `Tesseract.js` for browser-side OCR on scanned images
- **Data Structuring:** Google Gemini API (`gemini-2.5-flash`) with native Structured Outputs to enforce runtime JSON schemas
- **Deployment:** Vercel (free tier)

### System Data Flow

```
User Uploads File
       │
       ▼
Local Text Engine          ◄── pdfjs-dist (digital PDFs)
(Processed in Browser)     ◄── Tesseract.js (scanned/OCR)
       │
       ▼  [Raw Unstructured Text]
Google Gemini API          ◄── Matches text against target TypeScript schema
       │
       ▼  [Guaranteed JSON Output]
Interactive Data Grid      ◄── Preview table with "Export to CSV"
```

---

## Getting Started

### Prerequisites

Ensure [Node.js](https://nodejs.org) is installed on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ParsePrism.git
cd ParsePrism
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

ParsePrism uses the Google Gemini AI free developer tier. Get a free API key from [Google AI Studio](https://aistudio.google.com), then create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_free_gemini_api_key_here
```

### 4. Launch the Application

```bash
npm run dev
```

Open your browser to the local port (usually `http://localhost:5173`) to interact with the dashboard.

---

## Project Structure

```
src/
├── components/
│   ├── DocumentDropzone.tsx   # Drag-and-drop file upload container
│   ├── DataPreviewTable.tsx   # Interactive structured JSON results viewer
│   └── DashboardLayout.tsx    # Workspace shell and layout control
├── hooks/
│   └── useExtraction.ts       # Master orchestration state engine
├── services/
│   ├── pdfParser.ts           # Extracts text strings from digital PDFs
│   └── geminiService.ts       # Structures text into JSON via schemas
└── App.tsx                    # Application entry point
```

---

## Privacy & Cost

- **Zero server costs** — ParsePrism runs entirely client-side. Documents are parsed locally in your browser without uploading file binaries to any third-party storage.
- **Minimal data footprint** — Only the extracted raw text layer is sent (over TLS) to the Google Gemini API to format the data schema. Source files never leave your machine.

---

## License

Distributed under the [MIT License](LICENSE).