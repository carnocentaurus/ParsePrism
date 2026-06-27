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
        <main className="min-h-screen bg-white text-black antialiased font-sans">
            {/* UNIVERSAL BANNER NAVBAR */}
            <header className="bg-white border-b border-black sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 bg-black flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-black">
                                ParsePrism
                            </h1>

                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block -mt-1">
                                AI Document Engine
                            </span>
                        </div>
                    </div>
          
                    <div className="flex items-center gap-4">
                        <span className="flex h-2 w-2 bg-black"></span>
                        <span className="text-xs font-bold text-black bg-white border border-black px-2.5 py-1">
                            Local Client Engine + Gemini API
                        </span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTAINER LAYOUT BODY GRID WORKSPACE */}
            <main className="max-w-6xl mx-auto px-4 py-10">
                {/* Intro Branding Header Blocks */}
                {status === 'idle' && (
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-3xl font-extrabold text-black tracking-tight sm:text-4xl">
                            Turn Unstructured PDFs into Clean Data
                        </h2>
                        <p className="mt-3 text-lg text-gray-600 leading-relaxed font-medium">
                            Upload standard receipts, contracts, or scanned image invoices. ParsePrism maps layout elements locally before distilling fields using guaranteed AI data models.
                        </p>
                    </div>
                )}

                {/* Global Error Banner Messaging Handler */}
                {error && (
                    <div className="mb-6 p-4 bg-white border border-black flex items-start gap-3 text-black">
                        <div className="flex-1">
                            <h3 className="font-bold text-sm uppercase tracking-widest">Processing Failure Detected</h3>
                            <p className="text-sm text-gray-700 mt-1">{error}</p>
                            <button 
                                onClick={resetExtraction} 
                                className="mt-4 text-xs font-bold text-black hover:text-gray-500 underline block uppercase tracking-widest"
                            >
                                Dismiss & Reset Workspace
                            </button>
                        </div>
                    </div>
                )}

                {/* Core Component Active Switchboard Section Container */}
                <div className="space-y-8">
                    {status !== 'success' ? (
                    <div className="max-w-3xl mx-auto">
                        <DocDropzone 
                            onFileAccepted={processDoc} 
                            status={status} 
                        />
                    </div>
                    ) : (
                         extractedData && (
                            <div>
                                <DataPreviewTable 
                                    data={extractedData} 
                                    fileName={fileName} 
                                    onReset={resetExtraction} 
                                />
                            </div>
                        )
                    )}
                </div>
            </main>
        </main>
    );
}