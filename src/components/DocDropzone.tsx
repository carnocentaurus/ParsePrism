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
            <div className="flex flex-col items-center justify-center p-12 border border-black bg-gray-100 min-h-[300px]">
                <p className="text-black font-bold uppercase tracking-widest mb-2">[ Extracting ]</p>
                <p className="text-black font-medium">Extracting layout lines locally...</p>
                <p className="text-xs text-gray-600 mt-1 font-medium">Rasterizing canvases & extracting text arrays</p>
            </div>
        );
    }

    if (status === 'structuring_ai') {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-black bg-gray-100 min-h-[300px]">
                <p className="text-black font-bold uppercase tracking-widest mb-2">[ Structuring ]</p>
                <p className="text-black font-medium">Gemini AI is structuring data objects...</p>
                <p className="text-xs text-gray-600 mt-1 font-medium">Enforcing transactional JSON schemas</p>
            </div>
        );
    }

    return(
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-12 border transition-none min-h-[300px] cursor-pointer
                ${isDragActive 
                    ? 'border-black bg-gray-200' 
                    : 'border-black bg-white hover:bg-gray-100'
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
                <span className="text-2xl font-bold text-black mb-6 border border-black px-4 py-2">PDF</span>
        
                <span className="text-lg font-bold text-black">
                    Drag and drop your document here
                </span>

                <span className="text-sm text-gray-600 mt-2 font-medium">
                    or <span className="text-black underline font-bold hover:text-gray-600">browse your files</span>
                </span>

                <span className="text-xs text-black mt-8 border border-black px-3 py-1 font-bold uppercase tracking-widest">
                    Supports native PDFs or scanned invoice prints
                </span>
            </label>
        </div>
    );
}