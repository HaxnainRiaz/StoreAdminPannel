"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { LifeBuoy, MoreHorizontal, MessageSquare, AlertCircle, CheckCircle, X, Send, User, ShieldCheck } from "lucide-react";

export default function SupportPage() {
    const { tickets, updateTicketStatus } = useAdmin();
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [reply, setReply] = useState("");

    const filteredTickets = statusFilter === "All" ? tickets : tickets.filter(t => t.status === statusFilter);

    const getPriorityColor = (p) => {
        if (p === 'High') return 'text-red-600 bg-red-50 border-red-100';
        if (p === 'Medium') return 'text-orange-600 bg-orange-50 border-orange-100';
        return 'text-green-600 bg-green-50 border-green-100';
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        // Mock reply
        setReply("");
        // Optionally mark as Resolved if needed
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Support Tickets</h1>
                    <p className="text-neutral-gray">Resolve customer inquiries and maintain satisfaction</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl shadow-soft border border-neutral-beige p-6">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Quick Filters</h3>
                        <div className="space-y-1">
                            {['All', 'Open', 'Pending', 'Resolved'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${statusFilter === status ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-neutral-gray hover:bg-neutral-50'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                        <LifeBuoy className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
                        <h4 className="font-bold mb-1 relative z-10">Need Help?</h4>
                        <p className="text-xs text-white/70 relative z-10">Internal support documentation for common skincare issues.</p>
                        <button className="mt-4 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors relative z-10">View Docs</button>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-4">
                    {filteredTickets.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`bg-white rounded-2xl shadow-soft border group hover:border-primary/30 transition-all cursor-pointer p-6 ${selectedTicket?.id === ticket.id ? 'border-primary ring-1 ring-primary/20' : 'border-neutral-beige'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-2xl ${ticket.status === 'Open' ? 'bg-secondary/10 text-primary border border-secondary/20' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                        {ticket.status === 'Open' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-primary group-hover:text-secondary-dark transition-colors">{ticket.subject}</h3>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-gray font-medium">
                                            #{ticket.id} • Customer: <span className="text-primary">{ticket.customer}</span> • {new Date(ticket.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${ticket.status === 'Open' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                    {ticket.status}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-neutral-beige/50 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-sm text-secondary-dark font-bold">
                                    <MessageSquare size={16} />
                                    <span>2 Messages</span>
                                </div>
                                <button className="text-xs font-bold text-neutral-400 group-hover:text-primary transition-colors underline-offset-4 hover:underline">
                                    Open Case
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredTickets.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-beige shadow-soft">
                            <LifeBuoy size={48} className="mx-auto text-neutral-200 mb-4" />
                            <p className="text-neutral-gray italic">No support tickets found for this filter.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-neutral-beige animate-scaleIn flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-beige bg-neutral-50/50 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Support Case #{selectedTicket.id}</span>
                                <h2 className="text-xl font-heading font-bold text-primary">{selectedTicket.subject}</h2>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="p-2 text-neutral-400 hover:text-primary rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-primary border border-secondary/20">
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-primary">{selectedTicket.customer}</span>
                                        <span className="text-[10px] text-neutral-400 font-medium">10:45 AM</span>
                                    </div>
                                    <div className="bg-neutral-100 rounded-2xl rounded-tl-none p-4 text-sm text-neutral-700 border border-neutral-200/50">
                                        Hello, I haven't received my order #ORD-7782 yet. The tracking shows it's stuck in NY for 3 days. Can you please check?
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center border border-primary/20">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                        <span className="text-[10px] text-neutral-400 font-medium">11:02 AM</span>
                                        <span className="text-sm font-bold text-primary">Support Agent (You)</span>
                                    </div>
                                    <div className="bg-primary/5 rounded-2xl rounded-tr-none p-4 text-sm text-primary border border-primary/10">
                                        Hi {selectedTicket.customer}, let me check that for you right away. NYC processing can sometimes take longer during the holidays.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Reply */}
                        <div className="p-6 border-t border-neutral-beige bg-white">
                            <form onSubmit={handleSendReply} className="flex gap-3">
                                <input
                                    type="text"
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    placeholder="Type your response..."
                                    className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                                />
                                <button className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all transform active:scale-95 shadow-md">
                                    <Send size={20} />
                                </button>
                            </form>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => {
                                        updateTicketStatus(selectedTicket.id, "Resolved");
                                        setSelectedTicket(null);
                                    }}
                                    className="text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 transition-colors"
                                >
                                    Mark as Resolved
                                </button>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="text-xs font-bold text-neutral-400 hover:bg-neutral-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    Close Case
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
