"use client";

import { useAdmin } from "@/context/AdminContext";
import { Star, MessageSquare, Check, X, Send } from "lucide-react";
import { useState } from "react";

export default function ReviewsPage() {
    const { reviews, approveReview, rejectReview, replyToReview } = useAdmin();
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    const handleReply = (id) => {
        replyToReview(id, replyText);
        setReplyingTo(null);
        setReplyText("");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-primary">Reviews</h1>
                <p className="text-neutral-gray">Moderate customer feedback and engage with shoppers</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-beige hover:shadow-medium transition-all duration-300">
                        <div className="flex flex-col md:flex-row gap-6">

                            {/* Review Info */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={`${i < review.rating ? "text-accent-warning fill-accent-warning" : "text-neutral-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-neutral-400">{review.date}</span>
                                </div>

                                <h3 className="font-heading font-bold text-lg text-primary">{review.title}</h3>
                                <p className="text-neutral-gray text-sm leading-relaxed">&ldquo;{review.content}&rdquo;</p>

                                <div className="flex items-center gap-2 pt-2 text-xs">
                                    <span className="font-bold text-primary">{review.customer}</span>
                                    <span className="text-neutral-300">•</span>
                                    <span className="text-neutral-500">Purchased: {review.product}</span>
                                </div>

                                {review.reply && (
                                    <div className="mt-4 p-4 bg-neutral-cream rounded-xl border border-secondary/20 relative">
                                        <div className="absolute -top-2 left-4 px-2 bg-neutral-cream text-[10px] font-bold text-secondary-dark tracking-widest uppercase">
                                            Store Response
                                        </div>
                                        <p className="text-sm text-primary font-medium">{review.reply}</p>
                                    </div>
                                )}

                                {replyingTo === review.id && (
                                    <div className="mt-4 space-y-3 animate-fadeIn">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your response..."
                                            className="w-full p-4 text-sm border border-neutral-beige rounded-xl focus:ring-2 focus:ring-primary focus:outline-none min-h-[100px]"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setReplyingTo(null)}
                                                className="px-4 py-2 text-sm text-neutral-500 hover:text-primary transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleReply(review.id)}
                                                disabled={!replyText.trim()}
                                                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm disabled:opacity-50"
                                            >
                                                <Send size={14} />
                                                Send Reply
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status & Actions */}
                            <div className="flex md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-neutral-beige pt-4 md:pt-0 md:pl-6 gap-4 min-w-[150px]">
                                <span className={`
                                    px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                                    ${review.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                    ${review.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                    ${review.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                `}>
                                    {review.status}
                                </span>

                                <div className="flex items-center gap-2">
                                    {review.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() => approveReview(review.id)}
                                                className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={20} />
                                            </button>
                                            <button
                                                onClick={() => rejectReview(review.id)}
                                                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                                                title="Reject"
                                            >
                                                <X size={20} />
                                            </button>
                                        </>
                                    )}
                                    {!review.reply && replyingTo !== review.id && (
                                        <button
                                            onClick={() => {
                                                setReplyingTo(review.id);
                                                setReplyText("");
                                            }}
                                            className="p-2 text-neutral-400 hover:text-primary hover:bg-neutral-beige rounded-full transition-colors"
                                            title="Reply"
                                        >
                                            <MessageSquare size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-neutral-beige">
                        <p className="text-neutral-400 text-lg">No reviews to moderate.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
