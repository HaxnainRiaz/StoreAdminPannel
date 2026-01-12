"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { SearchBar, Button, Input } from "@/components/ui";
import { Plus, Edit2, Trash2, Tag, Layers, X, Save, ArrowLeft } from "lucide-react";

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
                <div className="w-10 h-10 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#0a4019] font-heading font-bold animate-pulse">Organizing Collections...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-[#0a4019] italic">Collections</h1>
                    <p className="text-[#6B6B6B] text-sm font-medium mt-1">Curate your product taxonomy and hierarchy</p>
                </div>

                <div className="flex items-center gap-4">
                    <SearchBar
                        placeholder="Find collection..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48 md:w-64"
                    />
                    <Button
                        onClick={() => setIsAdding(true)}
                        icon={Plus}
                    >
                        New Tier
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                        <div key={category._id} className="bg-white p-8 rounded-[2rem] border border-[#F5F3F0] shadow-[0_4px_20px_rgba(11,47,38,0.08)] hover:shadow-[0_16px_60px_rgba(11,47,38,0.15)] transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FDFCFB]/50 rounded-full -mr-12 -mt-12 group-hover:bg-[#d3d3d3]/10 transition-colors" />

                            <div className="flex items-start justify-between mb-6 relative">
                                <div className="w-14 h-14 rounded-2xl bg-[#d3d3d3]/20 flex items-center justify-center text-[#0a4019] shadow-inner">
                                    <Layers size={24} />
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 text-neutral-300 hover:text-[#0a4019] transition-colors"><Edit2 size={16} /></button>
                                    <button className="p-2 text-neutral-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <h3 className="text-xl font-heading font-bold text-[#0a4019] mb-2 italic">{category.title}</h3>
                            <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-2 mb-6 font-medium">
                                {category.description || "No description assigned to this collection tier."}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-[#F5F3F0]/50">
                                <div className="flex items-center gap-2">
                                    <Tag size={12} className="text-[#d3d3d3]" />
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">slug: {category.slug}</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#0a4019] bg-[#d3d3d3]/20 px-3 py-1 rounded-full border border-[#d3d3d3]/10">
                                    ACTIVE
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-[#F5F3F0]/5 rounded-[3rem] border-2 border-dashed border-[#F5F3F0]">
                        <Layers className="mx-auto text-neutral-200 mb-4" size={48} />
                        <h3 className="text-xl font-heading font-bold text-[#0a4019]">No Collections Found</h3>
                        <p className="text-[#6B6B6B] text-xs mt-2 font-medium">Begin by creating your first product category.</p>
                    </div>
                )}
            </div>

            {/* Addition Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a4019]/30 backdrop-blur-xl animate-fadeIn">
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_16px_60px_rgba(11,47,38,0.15)] max-w-lg w-full mx-4 animate-scaleIn border border-white">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-[#0a4019] italic">New Collection</h3>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Expanding the Taxonomy</p>
                            </div>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-300">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <Input
                                    label="Collection Title *"
                                    required
                                    value={newCat.title}
                                    onChange={(e) => setNewCat({ ...newCat, title: e.target.value })}
                                    placeholder="e.g. Rare Elixirs"
                                />

                                <Input
                                    label="Slug (URL Route)"
                                    value={newCat.slug}
                                    onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                                    placeholder="rare-elixirs"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-[#0a4019] uppercase tracking-[0.2em] mb-2 ml-1">Curator Notes</label>
                                <textarea
                                    value={newCat.description}
                                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-white border border-[#F5F3F0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d3d3d3]/30 focus:border-[#d3d3d3] transition-all duration-300 shadow-sm hover:shadow-md font-medium text-[#0a4019] text-sm min-h-[100px]"
                                    placeholder="Describe the essence of this collection..."
                                />
                            </div>

                            <div className="pt-6 flex gap-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    variant="ghost"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Save Collection
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
