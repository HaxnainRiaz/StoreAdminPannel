"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { Search, Mail, Phone, MapPin, Edit2, Save, X, User } from "lucide-react";

export default function CustomersPage() {
    const { customers, updateCustomerNotes } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [tempNote, setTempNote] = useState("");

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startEditing = (customer) => {
        setEditingId(customer.id);
        setTempNote(customer.notes || "");
    };

    const saveNote = (id) => {
        updateCustomerNotes(id, tempNote);
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Customers</h1>
                    <p className="text-neutral-gray">View and manage your customer base</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-neutral-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64 md:w-80"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-neutral-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-beige/30 text-xs uppercase text-neutral-gray tracking-wider">
                            <tr>
                                <th className="p-6">Customer</th>
                                <th className="p-6">Contact</th>
                                <th className="p-6">Orders</th>
                                <th className="p-6">Total Spent</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 w-1/3">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-beige">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-neutral-cream transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary font-bold">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-primary">{customer.name}</p>
                                                    <p className="text-xs text-neutral-400">ID: #{customer.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-neutral-gray">
                                                    <Mail size={14} />
                                                    <span>{customer.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-medium text-neutral-600">
                                                {customer.ordersCount} Orders
                                            </span>
                                        </td>
                                        <td className="p-6 font-medium text-primary">
                                            ${customer.totalSpent.toFixed(2)}
                                        </td>
                                        <td className="p-6">
                                            <span className={`
                                                px-3 py-1 rounded-full text-xs font-medium border
                                                ${customer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                                ${customer.status === 'Flagged' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                            `}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            {editingId === customer.id ? (
                                                <div className="flex items-start gap-2 animate-fadeIn">
                                                    <textarea
                                                        value={tempNote}
                                                        onChange={(e) => setTempNote(e.target.value)}
                                                        className="w-full p-2 text-sm border border-neutral-300 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                                                        rows={2}
                                                        autoFocus
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <button onClick={() => saveNote(customer.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                                            <Save size={16} />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="group relative">
                                                    <p className="text-sm text-neutral-gray truncate max-w-[200px] cursor-pointer" onClick={() => startEditing(customer)}>
                                                        {customer.notes || <span className="italic text-neutral-300">Add a note...</span>}
                                                    </p>
                                                    <button
                                                        onClick={() => startEditing(customer)}
                                                        className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-primary transition-opacity"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-neutral-400">
                                        No customers found.
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
