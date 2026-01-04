"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import ProductTable from "@/components/admin/ProductTable";
import { Plus, Search, X, Save, ArrowLeft } from "lucide-react";

export default function ProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const emptyProduct = {
        name: "",
        slug: "",
        price: "",
        salePrice: "",
        stock: "",
        category: "Face",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200",
        ingredients: [],
        concerns: [],
        status: "Published",
        metaTitle: "",
        metaDescription: ""
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
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

    const executeDelete = () => {
        if (productToDelete) {
            deleteProduct(productToDelete);
            setProductToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Auto-generate slug if empty
        let finalSlug = currentProduct.slug;
        if (!finalSlug && currentProduct.name) {
            finalSlug = currentProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        // Status logic
        const stockVal = Number(currentProduct.stock);
        let status = currentProduct.status;
        if (stockVal === 0) status = "Out of Stock";
        else if (stockVal < 5) status = "Low Stock";

        const productData = {
            ...currentProduct,
            slug: finalSlug,
            stock: stockVal,
            status
        };

        if (currentProduct.id) {
            updateProduct(currentProduct.id, productData);
        } else {
            addProduct(productData);
        }
        setIsEditing(false);
        setCurrentProduct(null);
    };

    // Filter logic
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {!isEditing && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-primary">Products</h1>
                        <p className="text-neutral-gray">Manage your catalog</p>
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
                <div className="bg-white rounded-2xl shadow-soft border border-neutral-beige p-8 animate-fadeIn">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-beige">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-primary" />
                            </button>
                            <h2 className="text-2xl font-heading font-bold text-primary">
                                {currentProduct.id ? "Edit Product" : "New Product"}
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-gray mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={currentProduct.name}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-gray mb-1">Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={currentProduct.slug}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, slug: e.target.value })}
                                        placeholder="auto-generated-if-empty"
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-neutral-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-gray mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-gray mb-1">Sale Price ($)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.salePrice || ""}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, salePrice: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-gray mb-1">Category</label>
                                    <select
                                        value={currentProduct.category}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                    >
                                        <option value="Face">Face</option>
                                        <option value="Eyes">Eyes</option>
                                        <option value="Available Sets">Available Sets</option>
                                        <option value="Body">Body</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-gray mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={currentProduct.stock}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-gray mb-1">Ingredients (comma separated)</label>
                                    <textarea
                                        rows={3}
                                        value={currentProduct.ingredients?.join(", ") || ""}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, ingredients: e.target.value.split(",").map(i => i.trim()) })}
                                        className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* SEO Section */}
                            <div className="pt-6 border-t border-neutral-beige">
                                <h3 className="text-lg font-heading font-bold text-primary mb-4">SEO Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-gray mb-1">Meta Title</label>
                                        <input
                                            type="text"
                                            value={currentProduct.metaTitle}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, metaTitle: e.target.value })}
                                            className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-gray mb-1">Meta Description</label>
                                        <textarea
                                            rows={2}
                                            value={currentProduct.metaDescription}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, metaDescription: e.target.value })}
                                            className="w-full px-4 py-3 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Media & Actions */}
                        <div className="space-y-6">
                            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-beige/50">
                                <label className="block text-sm font-medium text-neutral-gray mb-3">Product Image</label>
                                <div className="aspect-square w-full rounded-lg overflow-hidden bg-white border border-neutral-beige mb-4 relative group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={currentProduct.image} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                                        Preview
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={currentProduct.image}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                                />
                            </div>

                            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-beige/50">
                                <label className="block text-sm font-medium text-neutral-gray mb-3">Status</label>
                                <select
                                    value={currentProduct.status}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Hidden">Hidden</option>
                                </select>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-full px-6 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-white transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="animate-fadeIn">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-beige">
                            <p className="text-neutral-400">No products found matching &quot;{searchTerm}&quot;</p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-large max-w-sm w-full mx-4 animate-scaleIn">
                        <h3 className="text-xl font-heading font-bold text-primary mb-2">Delete Product?</h3>
                        <p className="text-neutral-gray mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-neutral-gray hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
