"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, Package, Trash2, Plus, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
    const { products, updateProduct, deleteProduct } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStockUpdate = (id, newStock) => {
        const stockVal = parseInt(newStock) || 0;
        let status = "Published";
        if (stockVal === 0) status = "Out of Stock";
        else if (stockVal < 5) status = "Low Stock";

        updateProduct(id, { stock: stockVal, status });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Inventory Control</h1>
                    <p className="text-neutral-gray">Manage real-time stock levels and availability</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(setSearchTerm(e.target.value))}
                            className="pl-10 pr-4 py-2 bg-white border border-neutral-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-64 shadow-sm"
                        />
                    </div>
                    <Link
                        href="/products"
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-all shadow-md font-medium text-sm"
                    >
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Inventory Alerts Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-2xl border border-neutral-beige shadow-soft flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Stock Critical</p>
                        <p className="text-xl font-bold text-primary">{products.filter(p => p.stock === 0).length} Items</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-beige shadow-soft flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><ArrowLeftRight size={24} /></div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Low Inventory</p>
                        <p className="text-xl font-bold text-primary">{products.filter(p => p.stock > 0 && p.stock < 10).length} Items</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-beige shadow-soft flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24} /></div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Healthy Level</p>
                        <p className="text-xl font-bold text-primary">{products.filter(p => p.stock >= 10).length} Items</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-soft border border-neutral-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-beige/20 text-[10px] uppercase text-neutral-gray tracking-[0.2em] font-bold border-b border-neutral-beige">
                            <tr>
                                <th className="p-6">Product Item</th>
                                <th className="p-6">Registry ID</th>
                                <th className="p-6 text-center">In Stock Units</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-beige">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-neutral-cream/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-neutral-100 rounded-xl overflow-hidden relative border border-neutral-beige shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary font-heading leading-none mb-1">{product.name}</p>
                                                <p className="text-xs text-neutral-400 font-medium">{product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-xs font-mono text-neutral-400 font-medium">SKU-{product.id + 1000}</span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className="w-10 h-10 rounded-xl border border-neutral-200 hover:bg-white hover:shadow-md transition-all flex items-center justify-center text-primary font-bold active:scale-90"
                                                onClick={() => handleStockUpdate(product.id, Number(product.stock) - 1)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={product.stock}
                                                onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                                                className="w-20 text-center border-none bg-neutral-50 rounded-xl py-2 font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                            />
                                            <button
                                                className="w-10 h-10 rounded-xl border border-neutral-200 hover:bg-white hover:shadow-md transition-all flex items-center justify-center text-primary font-bold active:scale-90"
                                                onClick={() => handleStockUpdate(product.id, Number(product.stock) + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`
                                            flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border
                                            ${product.stock === 0 ? 'bg-red-50 text-red-700 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}
                                            ${product.stock < 10 && product.stock > 0 ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : ''}
                                            ${product.stock >= 10 ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                        `}>
                                            {product.stock === 0 ? <AlertTriangle size={14} /> : (product.stock < 10 ? <AlertTriangle size={14} /> : <CheckCircle size={14} />)}
                                            {product.stock === 0 ? 'Out of Stock' : (product.stock < 10 ? 'Low Stock' : 'Optimal')}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="p-2.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Remove Product"
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
