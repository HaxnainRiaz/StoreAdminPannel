"use client";

import { useAdmin } from "@/context/AdminContext";
import { ClipboardList, Search, Clock, Shield, Activity, User } from "lucide-react";
import AdminTable from "@/components/admin/AdminTable";
import { useState } from "react";

export default function AuditLogsPage() {
    const { auditLogs, loading } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLogs = (auditLogs || []).filter(log =>
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof log.admin === 'string' ? log.admin.toLowerCase().includes(searchTerm.toLowerCase()) : log.admin?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDownload = () => {
        const headers = ["Date", "Action", "Details", "Admin"];
        const rows = filteredLogs.map(log => [
            new Date(log.createdAt).toLocaleString().replace(/,/g, ''),
            log.action,
            log.details.replace(/,/g, ';'), // Escape commas
            log.admin?.name || log.admin || "System"
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#0a4019] font-heading font-bold animate-pulse">Decrypting Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-[#0a4019] italic">System Manifest</h1>
                    <p className="text-[#6B6B6B] text-sm font-medium mt-1">Immutable record of high-level administrative operations</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDownload}
                        className="bg-[#0a4019] text-[#d3d3d3] px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#051712] transition-all shadow-xl shadow-[#0a4019]/20"
                    >
                        Download Ledger
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#0a4019] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 border border-[#F5F3F0] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#d3d3d3]/5 w-64 bg-white shadow-[0_4px_20px_rgba(11,47,38,0.08)] font-medium text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] p-4 md:p-8">
                <AdminTable
                    columns={[
                        {
                            key: 'createdAt',
                            label: 'Temporal Node',
                            className: 'px-8 py-6',
                            render: (log) => (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-[#0a4019]">{new Date(log.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-neutral-400 font-medium">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: 'action',
                            label: 'Operation',
                            className: 'px-8 py-6',
                            render: (log) => (
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${log.action.includes('Delete') ? 'bg-red-500' : (log.action.includes('Create') ? 'bg-green-500' : 'bg-[#d3d3d3]')}`} />
                                    <span className="text-xs font-bold text-[#0a4019] uppercase tracking-wider italic">{log.action}</span>
                                </div>
                            )
                        },
                        {
                            key: 'details',
                            label: 'Data Payload',
                            className: 'px-8 py-6',
                            render: (log) => (
                                <p className="text-xs text-[#6B6B6B] max-w-md font-medium italic leading-relaxed">
                                    {log.details}
                                </p>
                            )
                        },
                        {
                            key: 'admin',
                            label: 'Curator',
                            className: 'px-8 py-6',
                            hideOnMobile: true,
                            render: (log) => (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#0a4019]/10 flex items-center justify-center text-[#0a4019] border border-[#0a4019]/5 hover:bg-[#0a4019] hover:text-[#d3d3d3] transition-all duration-300">
                                        <Shield size={14} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-[#0a4019] uppercase tracking-widest block">{log.admin?.name || log.admin || "System Agent"}</span>
                                        <span className="text-[9px] text-neutral-300 font-medium">{log.admin?.email || "Encrypted Identity"}</span>
                                    </div>
                                </div>
                            )
                        }
                    ]}
                    data={filteredLogs}
                    emptyMessage={
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Activity className="text-neutral-200" size={32} />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-[#0a4019] italic">No Events Detected</h3>
                            <p className="text-[#6B6B6B] max-w-xs mx-auto mt-2 font-medium">The system ledger is currently devoid of activities matching your parameters.</p>
                        </div>
                    }
                />
            </div>

            <div className="flex items-center justify-between px-4">
                <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em]">Total Recorded Nodes: {filteredLogs.length}</p>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="System Monitor Active" />
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Master Ledger Sync Active</span>
                </div>
            </div>
        </div>
    );
}
