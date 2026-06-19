// src/components/DocDropzone.tsx

import React, {useState, DragEvent, ChangeEvent} from 'react';
import { ExtractionStatus } from '../hooks/useExtraction';

interface DocDropzoneProps {
    onFileAccepted: (file: File) => void;
    status: ExtractionStatus;
}