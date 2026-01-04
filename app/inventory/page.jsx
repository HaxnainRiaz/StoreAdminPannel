"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, Package, Trash2, Plus, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
    const { products, updateProduct, deleteProduct, loading } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStockUpdate = async (id, newStock) => {
        const stockVal = Math.max(0, parseInt(newStock) || 0);

        let visibilityStatus = "published";
        if (stockVal === 0) visibilityStatus = "draft"; // Hide if out of stock automatically? or keep published

        await updateProduct(id, { stock: stockVal });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Auditing Stock Records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary italic">Inventory Desk</h1>
                    <p className="text-neutral-gray text-sm font-medium mt-1">Global logistics and supply chain optimization</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-secondary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Interrogate SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 bg-white border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 w-64 md:w-80 shadow-soft transition-all text-sm font-bold"
                        />
                    </div>
                    <Link
                        href="/products"
                        className="flex items-center gap-3 bg-primary text-secondary px-6 py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 font-bold text-xs uppercase tracking-widest active:scale-95"
                    >
                        <Plus size={18} />
                        Launch New
                    </Link>
                </div>
            </div>

            {/* Inventory Alerts Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-beige shadow-soft flex items-center gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 group-hover:bg-red-100 transition-colors" />
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-inner relative"><AlertTriangle size={28} /></div>
                    <div className="relative">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Critical Void</p>
                        <p className="text-3xl font-heading font-bold text-primary italic">{products.filter(p => p.stock === 0).length} Lines</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-beige shadow-soft flex items-center gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:bg-orange-100 transition-colors" />
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl shadow-inner relative"><ArrowLeftRight size={28} /></div>
                    <div className="relative">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Low Reserves</p>
                        <p className="text-3xl font-heading font-bold text-primary italic">{products.filter(p => p.stock > 0 && p.stock < 10).length} Lines</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-beige shadow-soft flex items-center gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 group-hover:bg-green-100 transition-colors" />
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl shadow-inner relative"><CheckCircle size={28} /></div>
                    <div className="relative">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Optimal Tier</p>
                        <p className="text-3xl font-heading font-bold text-primary italic">{products.filter(p => p.stock >= 10).length} Lines</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-large border border-neutral-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-beige/10 text-[10px] uppercase text-neutral-400 tracking-[0.25em] font-bold border-b border-neutral-beige">
                            <tr>
                                <th className="p-8">Assigned Asset</th>
                                <th className="p-8">Registry ID</th>
                                <th className="p-8 text-center">Available Units</th>
                                <th className="p-8 text-center">Logistics Status</th>
                                <th className="p-8 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-beige/50">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-neutral-cream/20 transition-all duration-300 group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-neutral-100 rounded-2xl overflow-hidden relative border border-neutral-beige shadow-inner group-hover:scale-110 transition-transform">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-heading font-bold text-primary text-base italic leading-tight mb-1">{product.title}</p>
                                                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{product.category?.name || "Uncategorized"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-[10px] font-mono text-neutral-400 font-bold bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                            REF:{product._id.toString().substring(18).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                className="w-12 h-12 rounded-2xl border border-neutral-200 hover:bg-white hover:shadow-xl transition-all flex items-center justify-center text-primary font-bold shadow-sm active:scale-90 bg-neutral-50"
                                                onClick={() => handleStockUpdate(product._id, Number(product.stock) - 1)}
                                            >
                                                -
                                            </button>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={product.stock}
                                                    onChange={(e) => handleStockUpdate(product._id, e.target.value)}
                                                    className="w-24 text-center border-2 border-neutral-100 bg-neutral-50/50 rounded-2xl py-3 font-heading font-bold text-primary text-xl focus:ring-4 focus:ring-secondary/20 focus:outline-none transition-all"
                                                />
                                            </div>
                                            <button
                                                className="w-12 h-12 rounded-2xl border border-neutral-200 hover:bg-white hover:shadow-xl transition-all flex items-center justify-center text-primary font-bold shadow-sm active:scale-90 bg-neutral-50"
                                                onClick={() => handleStockUpdate(product._id, Number(product.stock) + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className={`
                                            inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm
                                            ${product.stock === 0 ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                            ${product.stock < 10 && product.stock > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                                            ${product.stock >= 10 ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                        `}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock === 0 ? 'bg-red-500' : (product.stock < 10 ? 'bg-orange-500' : 'bg-green-500')}`} />
                                            {product.stock === 0 ? 'Inert' : (product.stock < 10 ? 'Unstable' : 'Certified')}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => deleteProduct(product._id)}
                                                className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-red-100"
                                                title="Decommission Asset"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
