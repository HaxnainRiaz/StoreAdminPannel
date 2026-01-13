"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * AdminTable - A reusable, fully responsive data table component.
 * 
 * @param {Object} props
 * @param {Array} props.columns - Column definitions [{ key, label, className, render, align, sortable }]
 * @param {Array} props.data - Data array to display (aliased as 'rows' in spec)
 * @param {String} props.keyField - Unique key property on data objects (default: "_id")
 * @param {String|JSX} props.emptyMessage - Message or component to show when data is empty
 * @param {Boolean} props.loading - Loading state
 * @param {Function} props.onRowClick - Handler for row clicks
 * @param {String|Function} props.rowClassName - Custom class for rows
 */
export default function AdminTable({
    columns = [],
    data = [],
    keyField = "_id",
    emptyMessage = "No data available",
    loading = false,
    onRowClick = null,
    rowClassName = "",
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Handle Sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sort Data
    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                {typeof emptyMessage === 'string' ? <p className="italic font-medium">{emptyMessage}</p> : emptyMessage}
            </div>
        );
    }

    return (
        <div className="w-full relative overflow-hidden rounded-2xl border border-[#F5F3F0] bg-white shadow-[0_4px_20px_rgba(11,47,38,0.08)]">
            <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <table className="w-full min-w-max text-left border-collapse whitespace-nowrap">
                    <thead className="bg-[#F5F3F0]/30 text-[10px] uppercase text-neutral-400 font-bold tracking-[0.2em] border-b border-[#F5F3F0]">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key || idx}
                                    className={`py-5 px-6 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.sortable ? 'cursor-pointer hover:bg-neutral-50 transition-colors group' : ''} ${col.className || ''}`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className={`flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                                        {col.label}
                                        {col.sortable && sortConfig.key === col.key && (
                                            <span className="text-[#0a4019] animate-fadeIn">
                                                {sortConfig.direction === 'asc' ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F3F0]/50">
                        {sortedData.map((row, rowIndex) => (
                            <tr
                                key={row[keyField] || rowIndex}
                                className={`
                                    transition-all duration-200 group
                                    ${onRowClick ? 'cursor-pointer active:scale-[0.995]' : ''}
                                    ${typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName}
                                    hover:bg-[#FDFCFB]
                                `}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={col.key || colIndex}
                                        className={`py-5 px-6 text-sm ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                                    >
                                        {col.render ? col.render(row, rowIndex) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
