"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import ProductTable from "@/components/admin/ProductTable";
import { Plus, Search, X, Save, ArrowLeft } from "lucide-react";

export default function ProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct, categories } = useAdmin();
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const emptyProduct = {
        title: "",
        slug: "",
        description: "",
        howToUse: "",
        price: "",
        salePrice: "",
        stock: "",
        category: "",
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"],
        ingredients: [],
        visibilityStatus: "published",
        isBestseller: false,
        seo: {
            metaTitle: "",
            metaDescription: ""
        }
    };

    const handleEdit = (product) => {
        // Ensure nested objects exist to avoid crashes
        const productForEditing = {
            ...product,
            seo: product.seo || { metaTitle: "", metaDescription: "" }
        };
        setCurrentProduct(productForEditing);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentProduct({ ...emptyProduct });
        setIsEditing(true);
    };

    const confirmDelete = (id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (productToDelete) {
            await deleteProduct(productToDelete);
            setProductToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError("");

        // Auto-generate slug if empty
        let finalSlug = currentProduct.slug;
        if (!finalSlug && currentProduct.title) {
            finalSlug = currentProduct.title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const productData = {
            ...currentProduct,
            slug: finalSlug,
            price: Number(currentProduct.price),
            salePrice: currentProduct.salePrice ? Number(currentProduct.salePrice) : null,
            stock: Number(currentProduct.stock),
            // Ensure description is a string
            description: currentProduct.description || "No description provided."
        };

        let success = false;
        if (currentProduct._id) {
            success = await updateProduct(currentProduct._id, productData);
        } else {
            success = await addProduct(productData);
        }

        if (success) {
            setIsEditing(false);
            setCurrentProduct(null);
        } else {
            setSaveError("Failed to save product. Please ensure all required fields (Title, Description, Price, Stock) are filled and Category is selected.");
        }
        setIsSaving(false);
    };

    // Filter logic
    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.name && p.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {!isEditing && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-primary">Products</h1>
                        <p className="text-neutral-gray">Manage your catalog dynamically</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-neutral-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
                            />
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <Plus size={18} />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="bg-white rounded-2xl shadow-soft border border-neutral-beige p-8 animate-fadeIn max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-beige">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-primary" />
                            </button>
                            <h2 className="text-2xl font-heading font-bold text-primary">
                                {currentProduct._id ? "Edit Product" : "New Product"}
                            </h2>
                        </div>
                    </div>

                    {saveError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                            {saveError}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Product Title *</label>
                                    <input
                                        type="text"
                                        value={currentProduct.title}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Description *</label>
                                    <textarea
                                        rows={4}
                                        value={currentProduct.description}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                        required
                                        placeholder="Write a compelling description for your skincare product..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">How To Use</label>
                                    <textarea
                                        rows={2}
                                        value={currentProduct.howToUse}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, howToUse: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                        placeholder="Application instructions..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={currentProduct.slug}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, slug: e.target.value })}
                                        placeholder="auto-generated-if-empty"
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50 text-neutral-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Category *</label>
                                    <select
                                        value={currentProduct.category}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                        {/* Fallback if no categories in DB yet */}
                                        {categories.length === 0 && (
                                            <>
                                                <option value="Face">Face</option>
                                                <option value="Eyes">Eyes</option>
                                                <option value="Body">Body</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Price ($) *</label>
                                    <input
                                        type="number"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Sale Price ($)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.salePrice || ""}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, salePrice: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Stock Quantity *</label>
                                    <input
                                        type="number"
                                        value={currentProduct.stock}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Ingredients (comma separated)</label>
                                    <textarea
                                        rows={1}
                                        value={currentProduct.ingredients?.join(", ") || ""}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, ingredients: e.target.value.split(",").map(i => i.trim()) })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                    />
                                </div>
                            </div>

                            {/* SEO Section */}
                            <div className="pt-6 border-t border-neutral-beige">
                                <h3 className="text-lg font-heading font-bold text-primary mb-4 flex items-center gap-2">
                                    SEO Configuration
                                    <span className="text-[10px] font-normal text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">Google Search Optimization</span>
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Meta Title</label>
                                        <input
                                            type="text"
                                            value={currentProduct.seo?.metaTitle}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, seo: { ...currentProduct.seo, metaTitle: e.target.value } })}
                                            className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">Meta Description</label>
                                        <textarea
                                            rows={2}
                                            value={currentProduct.seo?.metaDescription}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, seo: { ...currentProduct.seo, metaDescription: e.target.value } })}
                                            className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-neutral-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Media & Actions */}
                        <div className="space-y-6">
                            <div className="bg-neutral-beige/10 p-6 rounded-2xl border border-neutral-beige/30 shadow-inner">
                                <label className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider text-[10px]">Product Media</label>
                                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-neutral-beige mb-4 relative group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={currentProduct.images[0]} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                        LIVE PREVIEW
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Paste Image URL here..."
                                    value={currentProduct.images[0]}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, images: [e.target.value] })}
                                    className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none text-xs bg-white shadow-soft"
                                />
                                <p className="text-[10px] text-neutral-400 mt-2 text-center">Use high-quality [1:1] aspect ratio urls</p>
                            </div>

                            <div className="bg-neutral-beige/10 p-6 rounded-2xl border border-neutral-beige/30">
                                <label className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider text-[10px]">Store Visibility</label>
                                <select
                                    value={currentProduct.visibilityStatus}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, visibilityStatus: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-beige rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none bg-white font-bold text-xs"
                                >
                                    <option value="published">Published (Visible)</option>
                                    <option value="draft">Draft (Internal)</option>
                                    <option value="hidden">Archived (Deleted)</option>
                                </select>
                            </div>

                            <div className="bg-neutral-beige/10 p-6 rounded-2xl border border-neutral-beige/30 flex items-center justify-between">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider text-[10px]">Bestseller Badge</label>
                                <button
                                    type="button"
                                    onClick={() => setCurrentProduct({ ...currentProduct, isBestseller: !currentProduct.isBestseller })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${currentProduct.isBestseller ? 'bg-secondary' : 'bg-neutral-300'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${currentProduct.isBestseller ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>

                            <div className="pt-4 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full flex justify-center items-center gap-2 bg-primary text-secondary px-6 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95"
                                >
                                    {isSaving ? (
                                        <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span className="uppercase tracking-widest text-xs">{currentProduct._id ? "Update Database" : "Launch Product"}</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-full px-6 py-4 border border-neutral-300 rounded-2xl font-bold text-neutral-500 hover:bg-neutral-100 transition-all text-xs uppercase tracking-widest"
                                >
                                    Discard Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="animate-fadeIn">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-neutral-beige shadow-soft">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-cream mb-4">
                                <Search className="text-neutral-300" size={32} />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-primary">No items found</h3>
                            <p className="text-neutral-gray max-w-xs mx-auto mt-2">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                        </div>
                    ) : (
                        <ProductTable
                            products={filteredProducts}
                            onEdit={handleEdit}
                            onDelete={confirmDelete}
                        />
                    )}
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-large max-w-md w-full mx-4 animate-scaleIn border border-neutral-cream relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                        <h3 className="text-2xl font-heading font-bold text-primary mb-3">Permanent Deletion?</h3>
                        <p className="text-neutral-gray mb-8 leading-relaxed font-medium">This action will permanently remove the product from the core database and user storefront. This cannot be undone.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-4 border border-neutral-200 text-neutral-400 font-bold rounded-2xl hover:bg-neutral-50 transition-colors uppercase tracking-widest text-[10px]"
                            >
                                Safe Exit
                            </button>
                            <button
                                onClick={executeDelete}
                                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-shadow shadow-lg shadow-red-200 active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
