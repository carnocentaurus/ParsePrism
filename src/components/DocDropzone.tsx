// src/components/DocDropzone.tsx

import React, {useState, DragEvent, ChangeEvent} from 'react';
import { ExtractionStatus } from '../hooks/useExtraction';

interface DocDropzoneProps {
    onFileAccepted: (file: File) => void;
    status: ExtractionStatus;
}


export default function DocDropzone({onFileAccepted, status}: DocDropzoneProps): React.JSX.Element {
    const [isDragActive, setIsDragActive] = useState<boolean>(false);

    // 1. handle drag
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

    // 2. handle file drop
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

    // 3. handle fallback manual file click input selection
    const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileAccepted(event.target.files[0]);
        }
    }
    
    return(
        <div></div>
    );
}