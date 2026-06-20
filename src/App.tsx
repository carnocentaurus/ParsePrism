// 06/18/2026

// src/App.tsx

import React from 'react';
import { useExtraction } from './hooks/useExtraction';
import DocDropzone from './components/DocDropzone';
import DataPreviewTable from './components/DataPreviewTable';


export default function App(): React.JSX.Element {
    const {
        status,
        error,
        extractedData,
        fileName,
        processDoc,
        resetExtraction
    } = useExtraction();

    return(
        <main className="min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
            {/* UNIVERSAL BANNER NAVBAR */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 bg-linear-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.795H14.19l.818-5.096L6 16.004h3.813z" />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ParsePrism
                            </h1>

                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                                AI Document Engine
                            </span>
                        </div>
                    </div>
          
                    <div className="flex items-center gap-4">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                            Local Client Engine + Gemini API
                        </span>
                    </div>
                </div>
            </header>


            {/* MAIN CONTAINER LAYOUT BODY GRID WORKSPACE */}
            <main className="max-w-6xl mx-auto px-4 py-10">
                {/* Intro Branding Header Blocks */}
                {status === 'idle' && (
                    <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                            Turn Unstructured PDFs into Clean Data
                        </h2>
                        <p className="mt-3 text-lg text-slate-500 leading-relaxed">
                            Upload standard receipts, contracts, or scanned image invoices. ParsePrism maps layout elements locally before distilling fields using guaranteed AI data models.
                        </p>
                    </div>
                )}

                {/* Global Error Banner Messaging Handler */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-900 shadow-sm animate-shake">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-500 shrink-0 mt-0.5">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm">Processing Failure Detected</h3>
                            <p className="text-sm text-rose-700 mt-0.5">{error}</p>
                            <button 
                                onClick={resetExtraction} 
                                className="mt-2.5 text-xs font-semibold text-rose-600 hover:text-rose-800 underline block"
                            >
                                Dismiss & Reset Workspace
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </main>
    );
}