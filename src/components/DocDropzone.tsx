// src/components/DocDropzone.tsx

import React, {useState, DragEvent, ChangeEvent} from 'react';
import { ExtractionStatus } from '../hooks/useExtraction';

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
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-500 bg-blue-50 rounded-xl min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-blue-800 font-medium">Extracting layout lines locally...</p>
                <p className="text-xs text-blue-500 mt-1">Rasterizing canvases & extracting text arrays</p>
            </div>
        );
    }
}