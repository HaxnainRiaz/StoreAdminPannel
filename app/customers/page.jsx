"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { Search, Mail, Phone, MapPin, Edit2, Save, X, User, Ban, ShieldCheck, History } from "lucide-react";

export default function CustomersPage() {
    const { customers, loading, refreshData } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingOrders, setViewingOrders] = useState(null);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleBanStatus = async (customer) => {
        const isBanned = customer.status === 'banned';
        const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://localhost:5000/api";
        const res = await fetch(`${API_URL}/users/${customer._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: isBanned ? 'active' : 'banned' })
        });
        if (res.ok) refreshData();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Scanning Customer Nodes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary italic">Client Directory</h1>
                    <p className="text-neutral-gray text-sm font-medium mt-1">Manage luxury estate access and history</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-secondary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Locate client by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-4 bg-white border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/20 w-64 md:w-96 shadow-soft transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-large border border-neutral-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-beige/10 text-[10px] uppercase text-neutral-400 font-bold tracking-[0.2em] border-b border-neutral-beige">
                            <tr>
                                <th className="p-8">Customer Identity</th>
                                <th className="p-8">Contact Protocol</th>
                                <th className="p-8">Join Date</th>
                                <th className="p-8">Estate Status</th>
                                <th className="p-8 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-beige/50">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="group hover:bg-neutral-cream/30 transition-all duration-300">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary font-bold shadow-inner group-hover:scale-110 transition-transform">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary text-sm">{customer.name}</p>
                                                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">#{customer._id.substring(18).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-gray">
                                                <Mail size={14} className="text-secondary" />
                                                <span className="group-hover:text-primary transition-colors">{customer.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <span className="text-xs font-bold text-neutral-gray bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                                                {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric', day: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="p-8">
                                            <span className={`
                                                inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border
                                                ${customer.status === 'banned'
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : 'bg-green-50 text-green-700 border-green-200'}
                                            `}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${customer.status === 'banned' ? 'bg-red-500' : 'bg-green-500'}`} />
                                                {customer.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => setViewingOrders(customer)}
                                                    className="p-3 text-neutral-300 hover:text-primary hover:bg-neutral-cream rounded-xl transition-all"
                                                    title="View Order History"
                                                >
                                                    <History size={18} />
                                                </button>
                                                <button
                                                    onClick={() => toggleBanStatus(customer)}
                                                    className={`p-3 rounded-xl transition-all ${customer.status === 'banned' ? 'text-green-600 hover:bg-green-50' : 'text-neutral-300 hover:text-red-600 hover:bg-red-50'}`}
                                                    title={customer.status === 'banned' ? 'Unban User' : 'Ban User'}
                                                >
                                                    {customer.status === 'banned' ? <ShieldCheck size={18} /> : <Ban size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-50 mb-4">
                                            <User className="text-neutral-200" size={32} />
                                        </div>
                                        <p className="text-neutral-300 text-sm font-medium">No clients identified in this sector.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* History Modal Placeholder */}
            {viewingOrders && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md">
                    <div className="bg-white p-10 rounded-[3rem] shadow-large max-w-2xl w-full mx-4 animate-scaleIn border border-neutral-cream relative">
                        <button
                            onClick={() => setViewingOrders(null)}
                            className="absolute top-8 right-8 p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-heading font-bold text-primary">Transaction History</h3>
                            <p className="text-sm text-neutral-gray mt-1">Full purchase manifest for <span className="text-secondary font-bold">{viewingOrders.name}</span></p>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                            <p className="text-center py-10 text-neutral-300 italic text-sm border-2 border-dashed border-neutral-beige rounded-2xl">
                                System integrating order archive...<br />
                                <span className="text-[10px] uppercase tracking-widest mt-2 block">Connection Secure</span>
                            </p>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setViewingOrders(null)}
                                className="bg-primary text-secondary px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all"
                            >
                                Close Archive
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
