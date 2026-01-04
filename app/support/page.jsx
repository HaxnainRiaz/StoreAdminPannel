"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { LifeBuoy, MessageSquare, AlertCircle, CheckCircle, X, Send, User, ShieldCheck, Clock, Hash } from "lucide-react";

export default function SupportPage() {
    const { tickets, updateTicketStatus, loading } = useAdmin();
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [reply, setReply] = useState("");

    const safeTickets = tickets || [];
    const filteredTickets = statusFilter === "All" ? safeTickets : safeTickets.filter(t => t.status === statusFilter);

    const getPriorityColor = (p) => {
        if (p === 'High') return 'text-red-600 bg-red-50 border-red-100';
        if (p === 'Medium') return 'text-orange-600 bg-orange-50 border-orange-100';
        return 'text-green-600 bg-green-50 border-green-100';
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        setReply("");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Syncing Concierge Desk...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary italic">Concierge Console</h1>
                    <p className="text-neutral-gray text-sm font-medium mt-1">Sustain customer excellence and brand fidelity</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-soft border border-neutral-beige p-8">
                        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">Dispatch Filters</h3>
                        <div className="space-y-2">
                            {['All', 'Open', 'Pending', 'Resolved'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${statusFilter === status ? 'bg-primary text-secondary shadow-xl shadow-primary/20 scale-105' : 'text-neutral-gray hover:bg-neutral-50'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary rounded-[2.5rem] p-8 text-secondary shadow-2xl overflow-hidden relative group">
                        <LifeBuoy className="absolute -bottom-6 -right-6 w-32 h-32 text-secondary/5 group-hover:scale-110 transition-transform duration-1000" />
                        <h4 className="text-xl font-heading font-bold mb-2 relative z-10 italic">Agent Codex</h4>
                        <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-widest leading-relaxed mb-6 relative z-10">Internal protocols for luxury retail excellence.</p>
                        <button className="relative z-10 w-full py-4 bg-secondary text-primary rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors">Access Intelligence</button>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-6">
                    {filteredTickets.map(ticket => (
                        <div
                            key={ticket._id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`bg-white rounded-[2.5rem] shadow-soft border group hover:border-secondary transition-all duration-500 cursor-pointer p-10 relative overflow-hidden ${selectedTicket?._id === ticket._id ? 'border-secondary ring-4 ring-secondary/5' : 'border-neutral-beige'}`}
                        >
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                <div className="flex items-start gap-6">
                                    <div className={`p-4 rounded-[1.5rem] transition-colors duration-500 ${ticket.status === 'Open' ? 'bg-secondary/20 text-primary' : 'bg-green-50 text-green-600'}`}>
                                        {ticket.status === 'Open' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h3 className="text-xl font-heading font-bold text-primary italic group-hover:text-secondary-dark transition-colors">{ticket.subject}</h3>
                                            <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border shadow-sm ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority} Tier
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><Hash size={10} /> {ticket._id.substring(18).toUpperCase()}</span>
                                            <span className="text-neutral-200">|</span>
                                            <span className="text-primary italic">Client: {ticket.user?.name || "Verified Buyer"}</span>
                                            <span className="text-neutral-200">|</span>
                                            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border shadow-sm ${ticket.status === 'Open' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                    {ticket.status}
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-neutral-beige/50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200" />
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-secondary text-[10px] flex items-center justify-center font-bold">L</div>
                                    </div>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{ticket.replies?.length || 0} Communiqués</span>
                                </div>
                                <button className="text-[10px] font-bold text-neutral-400 group-hover:text-secondary transition-colors uppercase tracking-[0.2em]">
                                    Enter Thread →
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredTickets.length === 0 && (
                        <div className="text-center py-32 bg-white rounded-[3rem] border border-neutral-beige shadow-soft">
                            <LifeBuoy size={48} className="mx-auto text-neutral-100 mb-6" />
                            <h3 className="text-2xl font-heading font-bold text-primary italic">Ethereal Calm</h3>
                            <p className="text-neutral-gray max-w-sm mx-auto mt-2 font-medium">No support inquiries currently populate this transmission node.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary/30 backdrop-blur-md animate-fadeIn">
                    <div className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl border border-neutral-beige animate-scaleIn flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-10 border-b border-neutral-beige bg-neutral-50/30 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">Support Protocol</span>
                                    <span className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded-full border ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority}</span>
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-primary italic">{selectedTicket.subject}</h2>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="w-12 h-12 bg-white border border-neutral-beige text-neutral-400 hover:text-primary rounded-2xl transition-all shadow-sm flex items-center justify-center">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-neutral-cream/10">
                            {/* Original Message */}
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-secondary/30 flex items-center justify-center text-primary border border-secondary/20 shadow-sm shrink-0">
                                    <User size={24} />
                                </div>
                                <div className="flex-1 max-w-[80%]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold text-primary italic">{selectedTicket.user?.name || "Client"}</span>
                                        <span className="text-[9px] text-neutral-300 font-bold uppercase tracking-widest">{new Date(selectedTicket.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="bg-white rounded-[2rem] rounded-tl-none p-6 text-sm text-primary font-medium border border-neutral-100 shadow-soft leading-relaxed italic">
                                        {selectedTicket.message}
                                    </div>
                                </div>
                            </div>

                            {/* Replies */}
                            {(selectedTicket.replies || []).map((reply, idx) => (
                                <div key={idx} className={`flex gap-6 ${reply.isAdmin ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 ${reply.isAdmin ? 'bg-primary text-secondary border-primary/20' : 'bg-secondary/30 text-primary border-secondary/20'}`}>
                                        {reply.isAdmin ? <ShieldCheck size={24} /> : <User size={24} />}
                                    </div>
                                    <div className={`flex-1 max-w-[80%] ${reply.isAdmin ? 'text-right' : ''}`}>
                                        <div className={`flex items-center gap-3 mb-2 ${reply.isAdmin ? 'justify-end' : ''}`}>
                                            {!reply.isAdmin && <span className="text-xs font-bold text-primary italic">{selectedTicket.user?.name || "Client"}</span>}
                                            <span className="text-[9px] text-neutral-300 font-bold uppercase tracking-widest">{new Date(reply.createdAt).toLocaleTimeString()}</span>
                                            {reply.isAdmin && <span className="text-xs font-bold text-primary italic">Luminelle Curator</span>}
                                        </div>
                                        <div className={`rounded-[2rem] p-6 text-sm font-medium shadow-soft leading-relaxed italic border ${reply.isAdmin ? 'bg-primary text-secondary rounded-tr-none border-primary/10' : 'bg-white text-primary rounded-tl-none border-neutral-100'}`}>
                                            {reply.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Reply */}
                        <div className="p-10 border-t border-neutral-beige bg-white">
                            <form onSubmit={handleSendReply} className="flex gap-4">
                                <input
                                    type="text"
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    placeholder="Compose an expert response..."
                                    className="flex-1 px-8 py-5 bg-neutral-50 border border-neutral-beige rounded-[1.5rem] focus:ring-4 focus:ring-secondary/5 focus:outline-none text-sm font-medium shadow-inner"
                                />
                                <button className="w-16 h-16 bg-primary text-secondary rounded-[1.5rem] hover:bg-primary-dark transition-all transform active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center">
                                    <Send size={24} />
                                </button>
                            </form>
                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => {
                                        updateTicketStatus(selectedTicket._id, "Resolved");
                                        setSelectedTicket(null);
                                    }}
                                    className="px-6 py-3 text-[10px] font-bold text-green-600 hover:bg-green-50 rounded-xl border border-green-100 transition-all uppercase tracking-[0.2em] shadow-sm active:scale-95"
                                >
                                    Fulfill Request
                                </button>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="px-6 py-3 text-[10px] font-bold text-neutral-400 hover:text-primary rounded-xl transition-all uppercase tracking-[0.2em] hover:bg-neutral-50"
                                >
                                    Exit Console
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
