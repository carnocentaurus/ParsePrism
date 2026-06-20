// src/components/DocDropzone.tsx

import React, {useState, type DragEvent, type ChangeEvent} from 'react';
import { type ExtractionStatus } from '../hooks/useExtraction';

interface DocDropzoneProps {
    onFileAccepted: (file: File) => void;
    status: ExtractionStatus;
}


export default function DocDropzone({onFileAccepted, status}: DocDropzoneProps): React.JSX.Element {
    const [isDragActive, setIsDragActive] = useState<boolean>(false);

    // handle drag
    const handleDrag = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.type === 'dragenter' || event.type === 'dragover') {
            setIsDragActive(true);
        }
        else if (event.type === 'dragleave') {
            setIsDragActive(false);
        }
    }

    // handle file drop
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);

        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const droppedFile = event.dataTransfer.files[0];

            if (droppedFile.type === 'application/pdf') {
                onFileAccepted(droppedFile);
            }
            else {
                alert('ParsePrism currently only handles PDF documents');
            }
        }
    }

    // handle fallback manual file click input selection
    const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileAccepted(event.target.files[0]);
        }
    }
    
    // render dynamic ui loaders based on parsing stages
    if (status === 'parsing_file') {
        return(
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-500 bg-blue-50 rounded-xl min-h-75">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-blue-800 font-medium">Extracting layout lines locally...</p>
                <p className="text-xs text-blue-500 mt-1">Rasterizing canvases & extracting text arrays</p>
            </div>
        );
    }

    if (status === 'structuring_ai') {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-purple-500 bg-purple-50 rounded-xl min-h-75">
                <div className="animate-pulse flex space-x-2 justify-center items-center mb-4">
                    <div className="h-4 w-4 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-4 w-4 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-4 w-4 bg-purple-600 rounded-full animate-bounce"></div>
                </div>
                <p className="text-purple-800 font-medium">Gemini AI is structuring data objects...</p>
                <p className="text-xs text-purple-500 mt-1">Enforcing transactional JSON schemas</p>
            </div>
        );
    }

    return(
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-all min-h-75 cursor-pointer
                ${isDragActive 
                    ? 'border-blue-500 bg-blue-50 scale-[0.99]' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileInput}
            />

            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
        
                <span className="text-lg font-medium text-gray-700">
                    Drag and drop your PDF document here
                </span>

                <span className="text-sm text-gray-500 mt-1">
                    or <span className="text-blue-600 underline">browse your files</span>
                </span>

                <span className="text-xs text-gray-400 mt-6 bg-gray-100 px-3 py-1 rounded-full">
                    Supports native PDFs or scanned invoice prints
                </span>
            </label>
        </div>
    );
}