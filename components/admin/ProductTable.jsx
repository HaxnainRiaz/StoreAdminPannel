"use client";

import { Edit, Trash2, Globe, EyeOff, FileText, MoreVertical } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import AdminTable from "./AdminTable";

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
                <div className="bg-[#0a4019] text-white px-6 py-3 rounded-xl flex items-center justify-between animate-fadeIn">
                    <span className="text-sm font-medium">{selectedProducts.length} products selected</span>
                    <div className="flex gap-4">
                        <button className="text-sm hover:underline font-bold">Bulk Publish</button>
                        <button className="text-sm hover:underline font-bold text-red-300">Bulk Delete</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] overflow-hidden">
                <AdminTable
                    rowClassName={(product) => selectedProducts.includes(product._id) ? 'bg-[#d3d3d3]/5' : ''}
                    columns={[
                        {
                            key: 'select',
                            label: (
                                <input
                                    type="checkbox"
                                    onChange={toggleSelectAll}
                                    checked={selectedProducts.length === products.length && products.length > 0}
                                    className="w-4 h-4 rounded border-neutral-300 text-[#0a4019] focus:ring-[#0a4019] cursor-pointer"
                                />
                            ),
                            className: "w-10 px-6 py-5",
                            sortable: false,
                            hideOnMobile: true,
                            render: (product) => (
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(product._id)}
                                    onChange={() => toggleSelect(product._id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 rounded border-neutral-300 text-[#0a4019] focus:ring-[#0a4019] cursor-pointer"
                                />
                            )
                        },
                        {
                            key: 'title',
                            label: 'Product',
                            className: "px-6 py-5",
                            render: (product) => (
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-[#F5F3F0]/50 shadow-sm">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={product.images[0] || "https://placehold.co/400x400?text=Product"}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-heading font-bold text-[#0a4019]">{product.title}</p>
                                        <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">SKU-{product._id.toString().substring(0, 6)}</p>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: 'category',
                            label: 'Category',
                            className: "px-6 py-5",
                            hideOnMobile: true,
                            render: (product) => (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">
                                    {product.category?.title || "No Category"}
                                </span>
                            )
                        },
                        {
                            key: 'price',
                            label: 'Price',
                            className: "px-6 py-5",
                            render: (product) => (
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#0a4019]">
                                        {formatPrice(product.salePrice ?? product.price)}
                                    </span>
                                    {product.salePrice && (
                                        <span className="text-[10px] text-neutral-400 line-through">{formatPrice(product.price)}</span>
                                    )}
                                </div>
                            )
                        },
                        {
                            key: 'stock',
                            label: 'Stock',
                            className: "px-6 py-5",
                            render: (product) => (
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${product.stock < 5 ? 'text-red-500' : 'text-neutral-700'}`}>
                                        {product.stock}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase">Units</span>
                                </div>
                            )
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            className: "px-6 py-5",
                            render: (product) => (
                                <span
                                    className={`
                                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border
                                        ${getStatusStyles(product.status)}
                                    `}
                                >
                                    {getStatusIcon(product.status)}
                                    {product.status}
                                </span>
                            )
                        },
                        {
                            key: 'actions',
                            label: 'Actions',
                            align: 'right',
                            className: "px-6 py-5",
                            render: (product) => (
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="p-2 text-neutral-400 hover:text-[#0a4019] hover:bg-[#F5F3F0] rounded-xl transition-all"
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
                                    <button className="p-2 text-neutral-400 hover:text-[#0a4019] rounded-xl transition-all">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            )
                        }
                    ]}
                    data={products}
                    emptyMessage="No products found in the catalog."
                />
            </div>
        </div>
    );
};

export default ProductTable;
