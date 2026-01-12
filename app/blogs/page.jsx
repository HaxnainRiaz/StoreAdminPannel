"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { SearchBar, Button, Dropdown, Input } from "@/components/ui";
import { Plus, X, Save, ArrowLeft, Trash2, Upload, Image as ImageIcon, Link as LinkIcon, Search, Calendar, User, Clock, Eye } from "lucide-react";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ],
};

const quillFormats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'indent',
    'align',
    'link', 'image'
];

export default function BlogsPage() {
    const { blogs, addBlog, updateBlog, deleteBlog } = useAdmin();
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const emptyBlog = {
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1200",
        author: "Luminelle Editorial",
        readTime: "5 min read",
        category: "Skincare",
        status: "published",
        isFeatured: false
    };

    const handleEdit = (blog) => {
        setCurrentBlog({ ...blog });
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentBlog({ ...emptyBlog });
        setIsEditing(true);
    };

    const confirmDelete = (id) => {
        setBlogToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (blogToDelete) {
            await deleteBlog(blogToDelete);
            setBlogToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError("");

        let finalSlug = currentBlog.slug;
        if (!finalSlug && currentBlog.title) {
            finalSlug = currentBlog.title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const blogData = {
            ...currentBlog,
            slug: finalSlug
        };

        let res;
        if (currentBlog._id) {
            res = await updateBlog(currentBlog._id, blogData);
        } else {
            res = await addBlog(blogData);
        }

        if (res?.success) {
            setIsEditing(false);
            setCurrentBlog(null);
        } else {
            setSaveError(res?.message || "Failed to save blog. Please check all fields.");
        }
        setIsSaving(false);
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {!isEditing && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-[#0a4019]">Editorial Blogs</h1>
                        <p className="text-[#6B6B6B]">Share skincare wisdom with your community</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <SearchBar
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                        <Button
                            onClick={handleAddNew}
                            icon={Plus}
                        >
                            Write Article
                        </Button>
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] p-8 animate-fadeIn max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#F5F3F0]">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-[#0a4019]" />
                            </button>
                            <h2 className="text-2xl font-heading font-bold text-[#0a4019]">
                                {currentBlog._id ? "Edit Article" : "Compose New Narrative"}
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Input
                                label="Article Title *"
                                value={currentBlog.title}
                                onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                                required
                                placeholder="E.g. The Science of Hydration"
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#0a4019] uppercase tracking-wider text-[10px]">Excerpt (Short Summary) *</label>
                                <textarea
                                    value={currentBlog.excerpt}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                                    className="w-full px-6 py-4 bg-white border border-[#F5F3F0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d3d3d3]/30 focus:border-[#d3d3d3] transition-all duration-300 shadow-sm text-sm"
                                    rows={3}
                                    required
                                    placeholder="A brief teaser to pull readers in..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-[#0a4019] uppercase tracking-wider text-[10px]">Main Narrative Content *</label>
                                <div className="quill-premium-wrapper">
                                    <ReactQuill
                                        theme="snow"
                                        value={currentBlog.content}
                                        onChange={(content) => setCurrentBlog({ ...currentBlog, content })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Begin your narrative here..."
                                        className="bg-white rounded-2xl overflow-hidden border border-[#F5F3F0] shadow-sm"
                                    />
                                </div>
                                <style jsx global>{`
                                    .quill-premium-wrapper .ql-toolbar.ql-snow {
                                        border: none;
                                        border-bottom: 1px solid #F5F3F0;
                                        background: #fafaf9;
                                        padding: 12px;
                                        border-radius: 1rem 1rem 0 0;
                                    }
                                    .quill-premium-wrapper .ql-container.ql-snow {
                                        border: none;
                                        min-height: 400px;
                                        font-family: inherit;
                                        font-size: 0.875rem;
                                    }
                                    .quill-premium-wrapper .ql-editor {
                                        padding: 24px;
                                        min-height: 400px;
                                        color: #0a4019;
                                        line-height: 1.8;
                                    }
                                    .quill-premium-wrapper .ql-editor.ql-blank::before {
                                        color: #A3A3A3;
                                        font-style: italic;
                                        left: 24px;
                                    }
                                    .quill-premium-wrapper .ql-snow .ql-stroke {
                                        stroke: #0a4019;
                                    }
                                    .quill-premium-wrapper .ql-snow .ql-fill {
                                        fill: #0a4019;
                                    }
                                    .quill-premium-wrapper .ql-snow .ql-picker {
                                        color: #0a4019;
                                        font-weight: 600;
                                    }
                                `}</style>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#F5F3F0]/20 p-6 rounded-2xl border border-[#F5F3F0] space-y-4">
                                <label className="block text-sm font-bold text-[#0a4019] uppercase tracking-wider text-[10px]">Article Cover Image</label>
                                <div className="aspect-video rounded-xl overflow-hidden bg-white border border-[#F5F3F0] relative group">
                                    <img src={currentBlog.image} alt="Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label htmlFor="blog-image-upload" className="cursor-pointer bg-white text-[#0a4019] px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Upload size={12} /> Replace
                                        </label>
                                        <input
                                            type="file"
                                            id="blog-image-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setCurrentBlog({ ...currentBlog, image: reader.result });
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <Input
                                    label="Image URL"
                                    value={currentBlog.image}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, image: e.target.value })}
                                    className="h-10 text-[10px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <Input
                                    label="Slug (URL)"
                                    value={currentBlog.slug}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })}
                                    placeholder="auto-generated-if-empty"
                                />
                                <Dropdown
                                    label="Collection Category"
                                    value={currentBlog.category}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                                    options={[
                                        { value: "Skincare", label: "Skincare" },
                                        { value: "Routines", label: "Routines" },
                                        { value: "Ingredients", label: "Ingredients" },
                                        { value: "Lifestyle", label: "Lifestyle" }
                                    ]}
                                />
                                <Input
                                    label="Author Signature"
                                    value={currentBlog.author}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, author: e.target.value })}
                                />
                                <Input
                                    label="Reading Context (Time)"
                                    value={currentBlog.readTime}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, readTime: e.target.value })}
                                    placeholder="E.g. 5 min read"
                                />
                                <Dropdown
                                    label="Visibility Status"
                                    value={currentBlog.status}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, status: e.target.value })}
                                    options={[
                                        { value: "published", label: "Published (Visible)" },
                                        { value: "draft", label: "Draft (Hidden)" }
                                    ]}
                                />
                            </div>

                            <div className="bg-[#F5F3F0]/10 p-6 rounded-2xl border border-[#F5F3F0]/30 flex items-center justify-between">
                                <label className="text-sm font-bold text-[#0a4019] uppercase tracking-wider text-[10px]">Featured Article</label>
                                <button
                                    type="button"
                                    onClick={() => setCurrentBlog({ ...currentBlog, isFeatured: !currentBlog.isFeatured })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${currentBlog.isFeatured ? 'bg-[#d3d3d3]' : 'bg-neutral-300'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${currentBlog.isFeatured ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button type="submit" disabled={isSaving} className="w-full" icon={isSaving ? null : Save}>
                                    {isSaving ? "Saving..." : "Save Article"}
                                </Button>
                                <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="w-full">
                                    Discard Article
                                </Button>
                            </div>

                            {/* Admin - View Comments */}
                            {currentBlog._id && currentBlog.comments && currentBlog.comments.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-[#F5F3F0] space-y-4">
                                    <div className="flex items-center gap-2 text-[#0a4019]">
                                        <LinkIcon size={14} className="rotate-45" />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Community Narratives ({currentBlog.comments.length})</h4>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                        {currentBlog.comments.map((c, i) => (
                                            <div key={i} className="p-4 bg-[#F5F3F0]/20 rounded-xl border border-[#F5F3F0] space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-[#0a4019]">{c.name}</span>
                                                    <span className="text-[8px] text-neutral-400">{format(new Date(c.createdAt), "MMM d")}</span>
                                                </div>
                                                <p className="text-[10px] text-[#6B6B6B] italic">"{c.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogs.length === 0 ? (
                        <div className="col-span-full text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-[#F5F3F0]">
                            <Search className="mx-auto text-neutral-300 mb-4" size={48} />
                            <p className="text-[#6B6B6B] font-heading italic">No narratives found in the archives.</p>
                        </div>
                    ) : (
                        filteredBlogs.map((blog) => (
                            <div key={blog._id} className="bg-white rounded-[2rem] overflow-hidden border border-[#F5F3F0] hover:shadow-xl transition-all duration-500 group">
                                <div className="aspect-video relative overflow-hidden">
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                                        <p className="text-[9px] font-bold text-[#0a4019] uppercase tracking-widest">{blog.category}</p>
                                    </div>
                                    {blog.isFeatured && (
                                        <div className="absolute top-4 right-4 bg-[#d3d3d3] text-[#0a4019] px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-sm">
                                            <Star size={10} fill="currentColor" />
                                            <p className="text-[9px] font-bold uppercase tracking-widest">Featured</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {format(new Date(blog.createdAt), "MMM d, yyyy")}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {blog.readTime}</span>
                                    </div>
                                    <h3 className="text-lg font-heading font-bold text-[#0a4019] mb-2 line-clamp-1 group-hover:text-[#d3d3d3] transition-colors">{blog.title}</h3>
                                    <p className="text-xs text-[#6B6B6B] line-clamp-2 italic mb-6">{blog.excerpt}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-[#F5F3F0]">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#d3d3d3]/20 flex items-center justify-center">
                                                <User size={12} className="text-[#0a4019]" />
                                            </div>
                                            <span className="text-[10px] font-bold text-[#0a4019]">{blog.author}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(blog)} className="p-2 hover:bg-[#d3d3d3]/20 text-[#0a4019] rounded-xl transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => confirmDelete(blog._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a4019]/20 backdrop-blur-md">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full mx-4 border border-[#FDFCFB]">
                        <h3 className="text-2xl font-heading font-bold text-[#0a4019] mb-3">Retract Narrative?</h3>
                        <p className="text-[#6B6B6B] mb-8 font-medium">This article will be permanently removed from the editorial archives. This action is irreversible.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 border border-neutral-200 text-neutral-400 font-bold rounded-2xl hover:bg-neutral-50 transition-colors uppercase tracking-widest text-[10px]">Back to Archives</button>
                            <button onClick={executeDelete} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-shadow uppercase tracking-widest text-[10px]">Permanently Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Star({ size, fill }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={fill || "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
