"use client";

import { Edit, Trash2, Globe, EyeOff, FileText, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ProductTable = ({ products, onEdit, onDelete }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(products.map(p => p._id));
        } else {
            setSelectedProducts([]);
        }
    };

    const toggleSelect = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(sid => sid !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Published': return 'bg-green-50 text-green-700 border-green-200';
            case 'Draft': return 'bg-neutral-100 text-neutral-600 border-neutral-200';
            case 'Hidden': return 'bg-gray-100 text-gray-500 border-gray-200';
            case 'Low Stock': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Out of Stock': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-neutral-50 text-neutral-500 border-neutral-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Published': return <Globe size={12} />;
            case 'Hidden': return <EyeOff size={12} />;
            case 'Draft': return <FileText size={12} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-4">
            {selectedProducts.length > 0 && (
                <div className="bg-primary text-white px-6 py-3 rounded-xl flex items-center justify-between animate-fadeIn">
                    <span className="text-sm font-medium">{selectedProducts.length} products selected</span>
                    <div className="flex gap-4">
                        <button className="text-sm hover:underline font-bold">Bulk Publish</button>
                        <button className="text-sm hover:underline font-bold text-red-300">Bulk Delete</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto bg-white rounded-2xl shadow-soft border border-neutral-beige">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-neutral-beige/30 text-neutral-gray uppercase text-[10px] tracking-[0.15em] border-b border-neutral-beige">
                        <tr>
                            <th className="px-6 py-5 w-10">
                                <input
                                    type="checkbox"
                                    onChange={toggleSelectAll}
                                    checked={selectedProducts.length === products.length && products.length > 0}
                                    className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                                />
                            </th>
                            <th className="px-6 py-5 font-bold">Product</th>
                            <th className="px-6 py-5 font-bold">Category</th>
                            <th className="px-6 py-5 font-bold">Price</th>
                            <th className="px-6 py-5 font-bold">Stock</th>
                            <th className="px-6 py-5 font-bold">Status</th>
                            <th className="px-6 py-5 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-beige">
                        {products.map((product) => (
                            <tr key={product._id} className={`group hover:bg-neutral-cream transition-all duration-300 ${selectedProducts.includes(product._id) ? 'bg-secondary/5' : ''}`}>
                                <td className="px-6 py-5">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product._id)}
                                        onChange={() => toggleSelect(product._id)}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                                    />
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-beige/50 group-hover:shadow-md transition-shadow">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-heading font-bold text-primary group-hover:text-secondary-dark transition-colors">{product.title}</p>
                                            <p className="text-xs text-neutral-gray mt-0.5 font-medium">SKU-{product._id.toString().substring(0, 6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">
                                        {product.category?.name || "No Category"}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-primary">
                                            ${product.salePrice ?? product.price}
                                        </span>
                                        {product.salePrice && (
                                            <span className="text-[10px] text-neutral-400 line-through">${product.price}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold ${product.stock < 5 ? 'text-red-500' : 'text-neutral-700'}`}>
                                            {product.stock}
                                        </span>
                                        <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase">Units</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span
                                        className={`
                                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border
                                            ${getStatusStyles(product.status)}
                                        `}
                                    >
                                        {getStatusIcon(product.status)}
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2 text-neutral-400 hover:text-primary hover:bg-neutral-beige rounded-xl transition-all"
                                            title="Edit Product"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(product._id)}
                                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete Product"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="p-2 text-neutral-400 hover:text-primary rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;
