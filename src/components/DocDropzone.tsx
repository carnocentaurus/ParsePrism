// src/components/DocDropzone.tsx

import React, {useState, DragEvent, ChangeEvent} from 'react';
import { ExtractionStatus } from '../hooks/useExtraction';

interface DocDropzoneProps {
    onFileAccepted: (file: File) => void;
    status: ExtractionStatus;
}


export default function DocDropzone({onFileAccepted, status}: DocDropzoneProps): React.JSX.Element {
    const [isDragActive, setIsDragActive] = useState<boolean>(false);

    // 1. handle drag handlers
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
    
    return(
        <div></div>
    );
}