"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { TicketPercent, Plus, Trash2, Copy, Check, X, Save } from "lucide-react";

export default function DiscountsPage() {
    const { discounts, addDiscount, deleteDiscount } = useAdmin();
    const [copiedId, setCopiedId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [newDiscount, setNewDiscount] = useState({
        code: "",
        type: "percent",
        value: "",
        minSpend: "",
        expiry: ""
    });

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        addDiscount({
            ...newDiscount,
            value: Number(newDiscount.value),
            minSpend: Number(newDiscount.minSpend)
        });
        setShowModal(false);
        setNewDiscount({ code: "", type: "percent", value: "", minSpend: "", expiry: "" });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Discounts & Coupons</h1>
                    <p className="text-neutral-gray">Manage your promotional codes</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-all transform hover:scale-105 shadow-md"
                >
                    <Plus size={18} />
                    <span className="font-medium tracking-wide">Create New Code</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discounts.map((discount) => (
                    <div key={discount.id} className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-beige group hover:border-primary/30 transition-all flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-secondary/10 rounded-xl text-primary border border-secondary/20">
                                <TicketPercent size={24} />
                            </div>
                            <span className={`
                                px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border
                                ${discount.type === 'percent' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}
                            `}>
                                {discount.type}
                            </span>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-2xl font-bold text-primary tracking-wide font-heading">{discount.code}</h3>
                                <button
                                    onClick={() => handleCopy(discount.code, discount.id)}
                                    className="text-neutral-400 hover:text-primary transition-colors"
                                >
                                    {copiedId === discount.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                            <p className="text-neutral-gray text-sm font-medium">
                                {discount.type === 'percent' ? `${discount.value}% Off` : `$${discount.value} Flat Discount`}
                            </p>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-neutral-beige/50 mt-auto">
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-400 uppercase tracking-widest">Min. Spend</span>
                                <span className="font-bold text-primary">${discount.minSpend}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-400 uppercase tracking-widest">Uses</span>
                                <span className="font-bold text-primary">{discount.usageCount}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-400 uppercase tracking-widest">Expires</span>
                                <span className="font-bold text-primary">{new Date(discount.expiry).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-neutral-beige/50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                                onClick={() => deleteDiscount(discount.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={14} /> DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Code Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-neutral-beige animate-scaleIn">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-heading font-bold text-primary">New Promo Code</h2>
                            <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-primary transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Discount Code</label>
                                <input
                                    type="text"
                                    required
                                    value={newDiscount.code}
                                    onChange={e => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                                    placeholder="SUMMER25"
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-primary focus:outline-none font-bold tracking-widest"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Type</label>
                                    <select
                                        value={newDiscount.type}
                                        onChange={e => setNewDiscount({ ...newDiscount, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    >
                                        <option value="percent">Percent (%)</option>
                                        <option value="flat">Flat ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Value</label>
                                    <input
                                        type="number"
                                        required
                                        value={newDiscount.value}
                                        onChange={e => setNewDiscount({ ...newDiscount, value: e.target.value })}
                                        placeholder="15"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Min. Spend</label>
                                    <input
                                        type="number"
                                        value={newDiscount.minSpend}
                                        onChange={e => setNewDiscount({ ...newDiscount, minSpend: e.target.value })}
                                        placeholder="50"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Expiry Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newDiscount.expiry}
                                        onChange={e => setNewDiscount({ ...newDiscount, expiry: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg active:scale-95 mt-4"
                            >
                                <Save size={18} />
                                Create Coupon
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
