"use client";

import { useAdmin } from "@/context/AdminContext";
import { ClipboardList, Search, Clock, Shield, Activity, User } from "lucide-react";
import { useState } from "react";

export default function AuditLogsPage() {
    const { auditLogs, loading } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLogs = (auditLogs || []).filter(log =>
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof log.admin === 'string' ? log.admin.toLowerCase().includes(searchTerm.toLowerCase()) : log.admin?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Decrypting Ledger...</p>
            </div>
        );
        //hdhd
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary italic">System Manifest</h1>
                    <p className="text-neutral-gray text-sm font-medium mt-1">Immutable record of high-level administrative operations</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Filter transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-4 border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/5 w-full md:w-96 bg-white shadow-soft font-medium text-sm transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-soft border border-neutral-beige overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-neutral-beige/20 border-b border-neutral-beige">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Temporal Node</th>
                            <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Operation</th>
                            <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Data Payload</th>
                            <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Curator</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-beige/50">
                        {filteredLogs.map((log) => (
                            <tr key={log._id} className="hover:bg-neutral-cream/20 transition-all duration-300 group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400">
                                            <Clock size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-primary">{new Date(log.createdAt).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-neutral-400 font-medium">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.action.includes('Delete') ? 'bg-red-500' : (log.action.includes('Create') ? 'bg-green-500' : 'bg-secondary')}`} />
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider italic">{log.action}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xs text-neutral-gray max-w-md font-medium italic leading-relaxed">
                                        {log.details}
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/5 hover:bg-primary hover:text-secondary transition-all duration-300">
                                            <Shield size={14} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">{log.admin?.name || log.admin || "System Agent"}</span>
                                            <span className="text-[9px] text-neutral-300 font-medium">{log.admin?.email || "Encrypted Identity"}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-8 py-32 text-center">
                                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Activity className="text-neutral-200" size={32} />
                                    </div>
                                    <h3 className="text-xl font-heading font-bold text-primary italic">No Events Detected</h3>
                                    <p className="text-neutral-gray max-w-xs mx-auto mt-2 font-medium">The system ledger is currently devoid of activities matching your parameters.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
