"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Tag, Layers, X, Save, ArrowLeft } from "lucide-react";

export default function CategoriesPage() {
    const { categories, addCategory, loading, refreshData } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newCat, setNewCat] = useState({ title: "", description: "", slug: "" });

    const filteredCategories = categories.filter(c =>
        (c.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (e) => {
        e.preventDefault();
        const slug = newCat.slug || newCat.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const success = await addCategory({ ...newCat, slug });
        if (success) {
            setIsAdding(false);
            setNewCat({ title: "", description: "", slug: "" });
            refreshData();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Organizing Collections...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary italic">Collections</h1>
                    <p className="text-neutral-gray text-sm font-medium mt-1">Curate your product taxonomy and hierarchy</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-secondary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find collection..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border border-neutral-beige rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/10 w-48 md:w-64 shadow-sm transition-all text-xs font-bold"
                        />
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-primary text-secondary px-6 py-3 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-widest active:scale-95"
                    >
                        <Plus size={16} />
                        New Tier
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                        <div key={category._id} className="bg-white p-8 rounded-[2rem] border border-neutral-beige shadow-soft hover:shadow-large transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-cream/50 rounded-full -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors" />

                            <div className="flex items-start justify-between mb-6 relative">
                                <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary shadow-inner">
                                    <Layers size={24} />
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 text-neutral-300 hover:text-primary transition-colors"><Edit2 size={16} /></button>
                                    <button className="p-2 text-neutral-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <h3 className="text-xl font-heading font-bold text-primary mb-2 italic">{category.title}</h3>
                            <p className="text-xs text-neutral-gray leading-relaxed line-clamp-2 mb-6 font-medium">
                                {category.description || "No description assigned to this collection tier."}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-neutral-beige/50">
                                <div className="flex items-center gap-2">
                                    <Tag size={12} className="text-secondary" />
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">slug: {category.slug}</span>
                                </div>
                                <span className="text-[10px] font-bold text-primary bg-secondary/20 px-3 py-1 rounded-full border border-secondary/10">
                                    ACTIVE
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-neutral-beige/5 rounded-[3rem] border-2 border-dashed border-neutral-beige">
                        <Layers className="mx-auto text-neutral-200 mb-4" size={48} />
                        <h3 className="text-xl font-heading font-bold text-primary">No Collections Found</h3>
                        <p className="text-neutral-gray text-xs mt-2 font-medium">Begin by creating your first product category.</p>
                    </div>
                )}
            </div>

            {/* Addition Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/30 backdrop-blur-xl animate-fadeIn">
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-large max-w-lg w-full mx-4 animate-scaleIn border border-white">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-primary italic">New Collection</h3>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Expanding the Taxonomy</p>
                            </div>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-300">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 ml-1">Collection Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={newCat.title}
                                    onChange={(e) => setNewCat({ ...newCat, title: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-cream/20 border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/20 font-bold text-primary placeholder:text-neutral-300"
                                    placeholder="e.g. Rare Elixirs"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 ml-1">Slug (URL Route)</label>
                                <input
                                    type="text"
                                    value={newCat.slug}
                                    onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-cream/10 border border-neutral-beige rounded-2xl focus:outline-none font-mono text-xs text-neutral-400"
                                    placeholder="rare-elixirs"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 ml-1">Curator Notes</label>
                                <textarea
                                    value={newCat.description}
                                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-cream/20 border border-neutral-beige rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/20 font-medium text-primary text-sm min-h-[100px]"
                                    placeholder="Describe the essence of this collection..."
                                />
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-4 text-neutral-400 font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-50 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-primary text-secondary font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
                                >
                                    Save Collection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
