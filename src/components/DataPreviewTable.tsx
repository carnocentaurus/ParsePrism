// src/components/DataPreviewTable.tsx

import React from 'react';
import { type ExtractedDocData } from '../services/geminiService';

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

    return(
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* TABLE ACTION HEADER BAR */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Extracted Schema Output</h2>
                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-md">Source: {fileName || 'Uploaded Document'}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Clear File
                    </button>
                    <button
                        onClick={exportToCsv}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Export to CSV
                    </button>
                </div>
            </div>


            {/* CORE DOC SUMMARY FIELD BLOCKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6 bg-slate-50/50 border-b border-gray-200">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Vendor Entity</label>
                    <p className="mt-1 font-medium text-gray-900 wrap-break-word">{data.vendorName || '—'}</p>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Document Date</label>
                    <p className="mt-1 font-medium text-gray-900">{data.docDate || '—'}</p>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Reference / Invoice #</label>
                    <p className="mt-1 font-mono font-medium text-gray-900 break-all">{data.invoiceOrRefNum || '—'}</p>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Tax Collected</label>
                    <p className="mt-1 font-medium text-gray-900">${data.taxAmount.toFixed(2)}</p>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Grand Total</label>
                    <p className="mt-1 font-bold text-lg text-blue-600">${data.totalAmount.toFixed(2)}</p>
                </div>
            </div>


            {/* TRANSACTION GRID ITEM TABLE */}
            <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Itemized Line Breakdown</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-3/4">Description</th>
                                <th scope="col" className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider w-1/4">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.lineItems && data.lineItems.length > 0 ? (
                                data.lineItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 whitespace-normal wrap-break-word">{item.description}</td>
                                        <td className="px-6 py-4 text-right text-gray-900 font-mono">${item.amount.toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center text-gray-400 italic">
                                        No granular structured sub-line items identified inside document frame.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}