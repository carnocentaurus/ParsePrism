// src/components/DataPreviewTable.tsx

import React from 'react';
import { ExtractedDocData } from '../services/geminiService';

interface DataPreviewTableProps {
    data: ExtractedDocData;
    fileName: string | null;
    onReset: () => void;
}


export default function DataPreviewTable({data, fileName, onReset}: DataPreviewTableProps): React.JSX.Element {
    // converts individual table rows into a flat layout text structure and downloads it
    const exportToCsv = () => {
        const headers = [
            'Vendor Name',
            'Document Date',
            'Reference/Invoice Number',
            'Total Amount',
            'Tax Amount',
            'Item Description',
            'Item Cost'
        ];

        // flatten metadata headers side by side with individual sequential line items
        const rows = data.lineItems.map(item => [
            `"${data.vendorName.replace(/"/g, '""')}"`,
            `"${data.docDate}"`,
            `"${data.invoiceOrRefNum}"`,
            data.totalAmount,
            data.taxAmount,
            `"${item.description.replace(/"/g, '""')}"`,
            item.amount
        ]);

        // if there are zero line items, output a single master data summary string row
        if (rows.length === 0) {
            rows.push([
                `"${data.vendorName.replace(/"/g, '""')}"`,
                `"${data.docDate}"`,
                `"${data.invoiceOrRefNum}"`,
                data.totalAmount,
                data.taxAmount,
                '"N/A"',
                0
            ]);
        }

        const csvContent = [headers.join(','), ...rows.map(event => event.join(','))].join('\n');

        // trigger browser file download attachment hooks
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `ParsePrism_${fileName?.replace(/\.[^/.]+$/, "") || 'Extraction'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}