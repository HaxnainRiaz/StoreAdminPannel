"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import { Search, AlertTriangle, CheckCircle, Package, Trash2, Plus, ArrowLeftRight, Save } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
    const { products, updateProduct, deleteProduct, loading } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");
    const [localStocks, setLocalStocks] = useState({}); // { productId: stockValue }
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    // Sync local stocks when products load
    useEffect(() => {
        if (products.length > 0) {
            const stocks = {};
            products.forEach(p => {
                stocks[p._id] = p.stock;
            });
            setLocalStocks(stocks);
        }
    }, [products]);

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLocalStockChange = (id, newVal) => {
        const val = Math.max(0, parseInt(newVal) || 0);
        setLocalStocks(prev => ({ ...prev, [id]: val }));
    };

    const handleSaveStock = async (id) => {
        setIsUpdating(true);
        await updateProduct(id, { stock: localStocks[id] });
        setIsUpdating(false);
    };

    const confirmDelete = (id) => {
        setIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (idToDelete) {
            await deleteProduct(idToDelete);
            setIsDeleteModalOpen(false);
            setIdToDelete(null);
        }
    };

    const handleBatchUpdate = async () => {
        setIsUpdating(true);
        // In a real app we'd have a batch endpoint, for now we do them sequentially but quietly
        for (const [id, stock] of Object.entries(localStocks)) {
            const originalProduct = products.find(p => p._id === id);
            if (originalProduct && originalProduct.stock !== stock) {
                await updateProduct(id, { stock });
            }
        }
        setIsUpdating(false);
        alert("Inventory synchronized successfully!");
    };

    if (loading && Object.keys(localStocks).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Auditing Stock Records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn text-primary">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary italic">Inventory Desk</h1>
                    <p className="text-neutral-gray text-sm font-medium mt-1">Global logistics and supply chain optimization</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBatchUpdate}
                        disabled={isUpdating}
                        className="flex items-center gap-3 bg-secondary text-primary px-6 py-4 rounded-2xl hover:bg-white transition-all shadow-xl shadow-secondary/10 font-bold text-xs uppercase tracking-widest active:scale-95 disabled:opacity-50"
                    >
                        <Save size={18} />
                        Sync All Changes
                    </button>
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
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-beige shadow-soft flex items-center gap-6 relative overflow-hidden group text-primary">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 group-hover:bg-red-100 transition-colors" />
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-inner relative"><AlertTriangle size={28} /></div>
                    <div className="relative">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Critical Void</p>
                        <p className="text-3xl font-heading font-bold text-primary italic">{products.filter(p => p.stock === 0).length} Lines</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-beige shadow-soft flex items-center gap-6 relative overflow-hidden group text-primary">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:bg-orange-100 transition-colors" />
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl shadow-inner relative"><ArrowLeftRight size={28} /></div>
                    <div className="relative">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Low Reserves</p>
                        <p className="text-3xl font-heading font-bold text-primary italic">{products.filter(p => p.stock > 0 && p.stock < 10).length} Lines</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-beige shadow-soft flex items-center gap-6 relative overflow-hidden group text-primary">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 group-hover:bg-green-100 transition-colors" />
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl shadow-inner relative"><CheckCircle size={28} /></div>
                    <div className="relative">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Optimal Tier</p>
                        <p className="text-3xl font-heading font-bold text-primary italic">{products.filter(p => p.stock >= 10).length} Lines</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-large border border-neutral-beige overflow-hidden">
                <div className="p-8 border-b border-neutral-beige bg-neutral-beige/5 flex items-center justify-between">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-secondary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Interrogate SKU database..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 bg-white border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 w-full shadow-inner transition-all text-sm font-bold"
                        />
                    </div>
                </div>
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
                            {filteredProducts.map((product) => {
                                const currentStock = localStocks[product._id] ?? product.stock;
                                const hasChanged = currentStock !== product.stock;

                                return (
                                    <tr key={product._id} className={`hover:bg-neutral-cream/20 transition-all duration-300 group ${hasChanged ? 'bg-secondary/5' : ''}`}>
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
                                                    className="w-10 h-10 rounded-xl border border-neutral-200 hover:bg-white hover:shadow-lg transition-all flex items-center justify-center text-primary font-bold shadow-sm active:scale-90 bg-neutral-50"
                                                    onClick={() => handleLocalStockChange(product._id, currentStock - 1)}
                                                >
                                                    -
                                                </button>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={currentStock}
                                                        onChange={(e) => handleLocalStockChange(product._id, e.target.value)}
                                                        className={`w-20 text-center border-2 rounded-xl py-2 font-heading font-bold text-primary text-lg focus:outline-none transition-all ${hasChanged ? 'border-secondary bg-white' : 'border-neutral-100 bg-neutral-50/50'}`}
                                                    />
                                                </div>
                                                <button
                                                    className="w-10 h-10 rounded-xl border border-neutral-200 hover:bg-white hover:shadow-lg transition-all flex items-center justify-center text-primary font-bold shadow-sm active:scale-90 bg-neutral-50"
                                                    onClick={() => handleLocalStockChange(product._id, currentStock + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center">
                                            <span className={`
                                            inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm
                                            ${currentStock === 0 ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                            ${currentStock < 10 && currentStock > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                                            ${currentStock >= 10 ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                        `}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${currentStock === 0 ? 'bg-red-500' : (currentStock < 10 ? 'bg-orange-500' : 'bg-green-500')}`} />
                                                {currentStock === 0 ? 'Inert' : (currentStock < 10 ? 'Unstable' : 'Certified')}
                                            </span>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                {hasChanged && (
                                                    <button
                                                        onClick={() => handleSaveStock(product._id)}
                                                        disabled={isUpdating}
                                                        className="p-3 bg-secondary/20 text-primary rounded-xl hover:bg-secondary transition-all shadow-sm"
                                                        title="Save Individual Change"
                                                    >
                                                        <Save size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => confirmDelete(product._id)}
                                                    className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                                                    title="Decommission Asset"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-large max-w-md w-full mx-4 animate-scaleIn border border-neutral-cream relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                        <h3 className="text-2xl font-heading font-bold text-primary mb-3 italic">Decommission Asset?</h3>
                        <p className="text-neutral-gray mb-8 leading-relaxed font-medium">This action will permanently purge the item from the central inventory and storefront. This operation is irreversible.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-4 border border-neutral-200 text-neutral-400 font-bold rounded-2xl hover:bg-neutral-50 transition-colors uppercase tracking-widest text-[10px]"
                            >
                                Abort
                            </button>
                            <button
                                onClick={executeDelete}
                                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-shadow shadow-lg shadow-red-200 active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Confirm Purge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
