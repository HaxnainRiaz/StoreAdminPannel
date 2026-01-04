"use client";

import { useAdmin } from "@/context/AdminContext";
import { ClipboardList, Search } from "lucide-react";
import { useState } from "react";

export default function AuditLogsPage() {
    const { auditLogs } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLogs = auditLogs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Audit Logs</h1>
                    <p className="text-neutral-gray">Track system activities and changes</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-neutral-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64 md:w-80"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-neutral-beige overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-beige/30 text-xs uppercase text-neutral-gray tracking-wider">
                        <tr>
                            <th className="p-6">Timestamp</th>
                            <th className="p-6">Action</th>
                            <th className="p-6">Details</th>
                            <th className="p-6">Admin User</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-beige">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-neutral-cream transition-colors">
                                <td className="p-6 text-sm text-neutral-500 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="p-6 text-sm font-medium text-primary">
                                    {log.action}
                                </td>
                                <td className="p-6 text-sm text-neutral-gray">
                                    {log.details}
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-secondary/30 flex items-center justify-center text-xs text-primary font-bold">
                                            {log.admin.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium">{log.admin}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-neutral-400">
                                    No logs found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
