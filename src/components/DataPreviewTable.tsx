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
        <div className="bg-white border border-black overflow-hidden">
            {/* TABLE ACTION HEADER BAR */}
            <div className="border-b border-black bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-black uppercase tracking-widest">Extracted Schema Output</h2>
                    <p className="text-xs text-gray-600 mt-1 truncate max-w-md font-medium">Source: {fileName || 'Uploaded Document'}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-black bg-white border border-black hover:bg-gray-100 transition-none"
                    >
                        Clear File
                    </button>
                    <button
                        onClick={exportToCsv}
                        className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-white bg-black border border-black hover:bg-gray-800 transition-none flex items-center gap-1.5"
                    >
                        Export to CSV
                    </button>
                </div>
            </div>


            {/* CORE DOC SUMMARY FIELD BLOCKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6 bg-white border-b border-black">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Vendor Entity</label>
                    <p className="font-bold text-black wrap-break-word">{data.vendorName || '—'}</p>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Document Date</label>
                    <p className="font-bold text-black">{data.docDate || '—'}</p>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Reference / Invoice #</label>
                    <p className="font-mono font-bold text-black break-all">{data.invoiceOrRefNum || '—'}</p>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tax Collected</label>
                    <p className="font-bold text-black">${data.taxAmount.toFixed(2)}</p>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Grand Total</label>
                    <p className="font-bold text-xl text-black">${data.totalAmount.toFixed(2)}</p>
                </div>
            </div>


            {/* TRANSACTION GRID ITEM TABLE */}
            <div className="p-6 bg-gray-50">
                <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">Itemized Line Breakdown</h3>
                <div className="overflow-x-auto border border-black">
                    <table className="min-w-full divide-y divide-black text-sm">
                        <thead className="bg-black text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left font-bold uppercase tracking-widest w-3/4 text-xs">Description</th>
                                <th scope="col" className="px-6 py-3 text-right font-bold uppercase tracking-widest w-1/4 text-xs">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-black">
                            {data.lineItems && data.lineItems.length > 0 ? (
                                data.lineItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100 transition-none">
                                        <td className="px-6 py-4 text-black font-bold whitespace-normal wrap-break-word">{item.description}</td>
                                        <td className="px-6 py-4 text-right text-black font-mono font-bold">${item.amount.toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center text-black font-bold uppercase tracking-widest text-xs">
                                        No granular structured sub-line items identified inside document frame.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* AI CONFIDENCE AUDIT INDICATOR NOTES FOOTER */}
            {data.confidenceNotes && (
                <div className="px-6 py-4 bg-gray-200 border-t border-black flex gap-2.5">
                    <div>
                        <span className="font-bold text-black text-xs uppercase tracking-widest block mb-2">AI Engine Analysis Notes</span>
                        <p className="text-black text-sm leading-relaxed font-bold">{data.confidenceNotes}</p>
                    </div>
                </div>
            )}
        </div>
    );
}