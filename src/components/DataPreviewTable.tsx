// src/components/DataPreviewTable.tsx

import React from 'react';
import { ExtractedDocData } from '../services/geminiService';

interface DataPreviewTableProps {
    data: ExtractedDocData;
    fileName: string | null;
    onReset: () => void;
}