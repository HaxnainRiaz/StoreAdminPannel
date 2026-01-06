"use client";

import { useAdmin } from "@/context/AdminContext";
import { Star, MessageSquare, Check, X, Send, User, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function ReviewsPage() {
    const { reviews, updateReview, loading } = useAdmin();
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    const handleSaveStatus = async (id, status, reply = null) => {
        const updateData = { status };
        if (reply !== null) updateData.adminReply = reply;

        const success = await updateReview(id, updateData);
        if (success) {
            setReplyingTo(null);
            setReplyText("");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Filtering Communiqués...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div>
                <h1 className="text-4xl font-heading font-bold text-primary italic">Feedback Stream</h1>
                <p className="text-neutral-gray text-sm font-medium mt-1">Moderate customer sentiments and curate brand reputation</p>
            </div>

            <div className="space-y-8">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-neutral-beige hover:shadow-large transition-all duration-500 group">
                            <div className="flex flex-col lg:flex-row gap-10">

                                {/* Review Info */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={`${i < review.rating ? "text-secondary fill-secondary" : "text-neutral-200"}`}
                                                />
                                            ))}
                                            <span className="text-[10px] font-bold text-primary ml-1">{review.rating}.0</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-white border border-neutral-beige px-3 py-1 rounded-lg">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-heading font-bold text-2xl text-primary italic mb-2">{review.title}</h3>
                                        <p className="text-neutral-gray text-base leading-relaxed font-medium italic">&ldquo;{review.comment}&rdquo;</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-neutral-beige/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                                                <User size={12} className="text-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{review.user?.name || "Verified Client"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                <ShoppingBag size={12} className="text-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Acquisition: {review.product?.title || "Limited Release"}</span>
                                        </div>
                                    </div>

                                    {review.adminReply && (
                                        <div className="mt-8 p-6 bg-neutral-cream/30 rounded-[2rem] border border-secondary/20 relative shadow-inner">
                                            <div className="absolute -top-3 left-6 px-4 py-1 bg-primary text-[9px] font-bold text-secondary tracking-[0.2em] uppercase rounded-full shadow-sm">
                                                Creator Response
                                            </div>
                                            <p className="text-sm text-primary font-bold italic leading-relaxed">{review.adminReply}</p>
                                        </div>
                                    )}

                                    {replyingTo === review._id && (
                                        <div className="mt-8 space-y-4 animate-slideDown bg-neutral-50 p-6 rounded-[2rem] border border-neutral-beige">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Craft a personalized response from the Luminelle concierge..."
                                                className="w-full p-6 text-sm border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:outline-none min-h-[120px] bg-white font-medium text-primary shadow-soft"
                                            />
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => setReplyingTo(null)}
                                                    className="px-6 py-3 text-[10px] font-bold text-neutral-400 hover:text-primary transition-colors uppercase tracking-widest"
                                                >
                                                    Discard
                                                </button>
                                                <button
                                                    onClick={() => handleSaveStatus(review._id, review.status, replyText)}
                                                    disabled={!replyText.trim()}
                                                    className="flex items-center gap-2 bg-primary text-secondary px-8 py-3 rounded-xl hover:bg-primary-dark transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-primary/10 active:scale-95"
                                                >
                                                    <Send size={14} />
                                                    Transmit Reply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Status & Actions */}
                                <div className="flex lg:flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-neutral-beige pt-8 lg:pt-0 lg:pl-10 lg:min-w-[220px] gap-6">
                                    <div className={`
                                        flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border shadow-sm transition-all duration-500
                                        ${review.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : ''}
                                        ${review.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : ''}
                                        ${review.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : ''}
                                    `}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${review.status === 'approved' ? 'bg-green-500' : (review.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500')}`} />
                                        {review.status}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {review.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleSaveStatus(review._id, 'approved')}
                                                    className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-green-100"
                                                    title="Approve for Storefront"
                                                >
                                                    <Check size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleSaveStatus(review._id, 'rejected')}
                                                    className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-red-100"
                                                    title="Reject Feedback"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </>
                                        )}
                                        {!review.adminReply && replyingTo !== review._id && (
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(review._id);
                                                    setReplyText("");
                                                }}
                                                className="w-12 h-12 bg-neutral-50 text-neutral-400 hover:bg-primary hover:text-secondary rounded-2xl transition-all shadow-sm flex items-center justify-center border border-neutral-100"
                                                title="Initiate Dialogue"
                                            >
                                                <MessageSquare size={20} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="text-[9px] text-neutral-300 font-bold uppercase tracking-[0.2em] mt-2 italic">
                                        Review Node: {review._id.substring(18).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-neutral-beige shadow-soft">
                        <div className="w-20 h-20 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="text-neutral-200" size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary italic">Atmospheric Silence</h3>
                        <p className="text-neutral-gray max-w-sm mx-auto mt-2 font-medium">No customer feedback detected in the current transmission cycle.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
