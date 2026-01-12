"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { TicketPercent, Plus, Trash2, Copy, Check, X, Save, Calendar, DollarSign, Zap } from "lucide-react";
import { Input, Dropdown, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

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
                <div className="w-10 h-10 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#0a4019] font-heading font-bold animate-pulse">Initializing Perks...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-[#0a4019] italic">Promotions</h1>
                    <p className="text-[#6B6B6B] text-sm font-medium mt-1">Deploy automated incentives across the estate</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-3 bg-[#0a4019] text-[#d3d3d3] px-8 py-4 rounded-2xl hover:bg-[#051712] transition-all shadow-xl shadow-[#0a4019]/10 font-bold text-xs uppercase tracking-widest active:scale-95"
                >
                    <Plus size={18} />
                    <span>Generate Code</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.length > 0 ? (
                    coupons.map((discount) => (
                        <div key={discount._id} className="bg-white rounded-[2.5rem] p-8 shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] group hover:shadow-[0_16px_60px_rgba(11,47,38,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d3d3d3] to-[#B8A68A]" />

                            <div className="flex items-start justify-between mb-8">
                                <div className="p-4 bg-[#d3d3d3]/10 rounded-2xl text-[#0a4019] border border-[#d3d3d3]/20 shadow-inner">
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
                                    <h3 className="text-3xl font-bold text-[#0a4019] tracking-widest font-heading italic">{discount.code}</h3>
                                    <button
                                        onClick={() => handleCopy(discount.code, discount._id)}
                                        className="p-2 text-neutral-300 hover:text-[#d3d3d3] transition-all hover:bg-neutral-50 rounded-xl"
                                    >
                                        {copiedId === discount._id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-[#d3d3d3]" />
                                    <p className="text-[#6B6B6B] text-xs font-bold uppercase tracking-wider">
                                        {discount.discountType === 'percentage' ? `${discount.discountValue}% Reduction` : `${formatPrice(discount.discountValue)} Credit`}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-[#F5F3F0]/50 mt-auto">
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                    <div className="flex items-center gap-2 text-neutral-300">
                                        <DollarSign size={12} />
                                        <span>Minimum Spend</span>
                                    </div>
                                    <span className="text-[#0a4019]">{formatPrice(discount.minAmount || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                    <div className="flex items-center gap-2 text-neutral-300">
                                        <Calendar size={12} />
                                        <span>Expiration</span>
                                    </div>
                                    <span className="text-[#0a4019]">{new Date(discount.expiresAt).toLocaleDateString()}</span>
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
                    <div className="col-span-full py-40 text-center bg-[#FDFCFB]/20 rounded-[3rem] border-2 border-dashed border-[#F5F3F0]">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_20px_rgba(11,47,38,0.08)]">
                            <TicketPercent className="text-neutral-200" size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-[#0a4019]">No Active Promotions</h3>
                        <p className="text-[#6B6B6B] text-sm mt-2 font-medium">Create your first incentive code to drive estate conversion.</p>
                    </div>
                )}
            </div>

            {/* Create Code Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a4019]/40 backdrop-blur-xl animate-fadeIn">
                    <div className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-[0_16px_60px_rgba(11,47,38,0.15)] border border-white animate-scaleIn relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d3d3d3]/10 rounded-full -mr-24 -mt-24" />

                        <div className="flex justify-between items-start mb-10 relative">
                            <div>
                                <h2 className="text-4xl font-heading font-bold text-[#0a4019] italic">Forge Reward</h2>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mt-2">Promotional Engine v2.1</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-neutral-50 rounded-full transition-colors text-neutral-300">
                                <X size={28} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-8 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Identity Code (UPPERCASE) *"
                                    required
                                    value={newDiscount.code}
                                    onChange={e => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                                    placeholder="LUMINELLE30"
                                    className="md:col-span-2"
                                />

                                <Dropdown
                                    label="Discount Logic"
                                    value={newDiscount.discountType}
                                    onChange={e => setNewDiscount({ ...newDiscount, discountType: e.target.value })}
                                    options={[
                                        { value: "percentage", label: "Percentage (%)" },
                                        { value: "fixed", label: "Fixed Amount (PKR)" }
                                    ]}
                                />

                                <Input
                                    label="Value *"
                                    type="number"
                                    required
                                    value={newDiscount.discountValue}
                                    onChange={e => setNewDiscount({ ...newDiscount, discountValue: e.target.value })}
                                    placeholder="30"
                                />

                                <Input
                                    label="Min. Valuation Threshold"
                                    type="number"
                                    value={newDiscount.minAmount}
                                    onChange={e => setNewDiscount({ ...newDiscount, minAmount: e.target.value })}
                                    placeholder="150"
                                />

                                <Input
                                    label="Expiration Protocol *"
                                    type="date"
                                    required
                                    value={newDiscount.expiresAt}
                                    onChange={e => setNewDiscount({ ...newDiscount, expiresAt: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 flex gap-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-5 rounded-2xl"
                                >
                                    Safe Exit
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 py-5 rounded-2xl shadow-2xl shadow-[#0a4019]/20"
                                >
                                    Authorize Coupon
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
