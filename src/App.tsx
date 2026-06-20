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
        </main>
    );
}