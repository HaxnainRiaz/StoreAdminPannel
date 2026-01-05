"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { TicketPercent, Plus, Trash2, Copy, Check, X, Save, Calendar, DollarSign, Zap } from "lucide-react";

export default function DiscountsPage() {
    const { coupons, addCoupon, deleteCoupon, loading } = useAdmin();
    const [copiedId, setCopiedId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [newDiscount, setNewDiscount] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minAmount: "",
        expiresAt: ""
    });

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const success = await addCoupon({
            ...newDiscount,
            discountValue: Number(newDiscount.discountValue),
            minAmount: Number(newDiscount.minAmount || 0)
        });
        if (success) {
            setShowModal(false);
            setNewDiscount({ code: "", discountType: "percentage", discountValue: "", minAmount: "", expiresAt: "" });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Initializing Perks...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary italic">Promotions</h1>
                    <p className="text-neutral-gray text-sm font-medium mt-1">Deploy automated incentives across the estate</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-3 bg-primary text-secondary px-8 py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 font-bold text-xs uppercase tracking-widest active:scale-95"
                >
                    <Plus size={18} />
                    <span>Generate Code</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.length > 0 ? (
                    coupons.map((discount) => (
                        <div key={discount._id} className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-neutral-beige group hover:shadow-large transition-all duration-500 relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-secondary-dark" />

                            <div className="flex items-start justify-between mb-8">
                                <div className="p-4 bg-secondary/10 rounded-2xl text-primary border border-secondary/20 shadow-inner">
                                    <TicketPercent size={28} />
                                </div>
                                <span className={`
                                    px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border shadow-sm
                                    ${discount.discountType === 'percentage' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}
                                `}>
                                    {discount.discountType}
                                </span>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-3xl font-bold text-primary tracking-widest font-heading italic">{discount.code}</h3>
                                    <button
                                        onClick={() => handleCopy(discount.code, discount._id)}
                                        className="p-2 text-neutral-300 hover:text-secondary transition-all hover:bg-neutral-50 rounded-xl"
                                    >
                                        {copiedId === discount._id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-secondary" />
                                    <p className="text-neutral-gray text-xs font-bold uppercase tracking-wider">
                                        {discount.discountType === 'percentage' ? `${discount.discountValue}% Reduction` : `$${discount.discountValue} Credit`}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-neutral-beige/50 mt-auto">
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                    <div className="flex items-center gap-2 text-neutral-300">
                                        <DollarSign size={12} />
                                        <span>Minimum Spend</span>
                                    </div>
                                    <span className="text-primary">${discount.minAmount || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                    <div className="flex items-center gap-2 text-neutral-300">
                                        <Calendar size={12} />
                                        <span>Expiration</span>
                                    </div>
                                    <span className="text-primary">{new Date(discount.expiresAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteCoupon(discount._id)}
                                className="mt-8 w-full py-3 text-red-400 hover:text-white hover:bg-red-500 font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl border border-red-100 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                                Terminate Reward
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-40 text-center bg-neutral-cream/20 rounded-[3rem] border-2 border-dashed border-neutral-beige">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                            <TicketPercent className="text-neutral-200" size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary">No Active Promotions</h3>
                        <p className="text-neutral-gray text-sm mt-2 font-medium">Create your first incentive code to drive estate conversion.</p>
                    </div>
                )}
            </div>

            {/* Create Code Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xl animate-fadeIn">
                    <div className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-large border border-white animate-scaleIn relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full -mr-24 -mt-24" />

                        <div className="flex justify-between items-start mb-10 relative">
                            <div>
                                <h2 className="text-4xl font-heading font-bold text-primary italic">Forge Reward</h2>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mt-2">Promotional Engine v2.1</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-neutral-50 rounded-full transition-colors text-neutral-300">
                                <X size={28} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-8 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 ml-2">Identity Code (UPPERCASE) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newDiscount.code}
                                        onChange={e => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                                        placeholder="LUMINELLE30"
                                        className="w-full px-8 py-5 bg-neutral-cream/20 border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/20 font-bold tracking-[0.3em] text-xl shadow-inner text-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 ml-2">Discount Logic</label>
                                    <select
                                        value={newDiscount.discountType}
                                        onChange={e => setNewDiscount({ ...newDiscount, discountType: e.target.value })}
                                        className="w-full px-6 py-4 bg-neutral-50 border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 font-bold text-xs uppercase tracking-widest text-primary"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 ml-2">Value *</label>
                                    <input
                                        type="number"
                                        required
                                        value={newDiscount.discountValue}
                                        onChange={e => setNewDiscount({ ...newDiscount, discountValue: e.target.value })}
                                        placeholder="30"
                                        className="w-full px-6 py-4 bg-neutral-50 border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 font-bold text-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 ml-2">Min. Valuation Threshold</label>
                                    <input
                                        type="number"
                                        value={newDiscount.minAmount}
                                        onChange={e => setNewDiscount({ ...newDiscount, minAmount: e.target.value })}
                                        placeholder="150"
                                        className="w-full px-6 py-4 bg-neutral-50 border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 font-bold text-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 ml-2">Expiration Protocol *</label>
                                    <input
                                        type="date"
                                        required
                                        value={newDiscount.expiresAt}
                                        onChange={e => setNewDiscount({ ...newDiscount, expiresAt: e.target.value })}
                                        className="w-full px-6 py-4 bg-neutral-50 border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 font-bold text-primary text-xs"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-5 text-neutral-400 font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-50 rounded-2xl transition-all"
                                >
                                    Safe Exit
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-5 bg-primary text-secondary font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20 active:scale-95"
                                >
                                    Authorize Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
