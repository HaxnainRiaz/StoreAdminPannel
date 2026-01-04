"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, Package, Truck, CheckCircle, Printer, XCircle, Clock, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
    const { orders, updateOrderStatus, loading } = useAdmin();
    const [filter, setFilter] = useState("All");
    const [expandedOrder, setExpandedOrder] = useState(null);

    const filteredOrders = filter === "All"
        ? orders
        : orders.filter(o => o.status === filter.toLowerCase());

    const toggleExpand = (id) => {
        if (expandedOrder === id) setExpandedOrder(null);
        else setExpandedOrder(id);
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "processing": return <Clock size={16} />;
            case "confirmed": return <Package size={16} />;
            case "shipped": return <Truck size={16} />;
            case "delivered": return <CheckCircle size={16} />;
            case "cancelled": return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case "processing": return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
            case "shipped": return "bg-purple-50 text-purple-700 border-purple-200";
            case "delivered": return "bg-green-50 text-green-700 border-green-200";
            case "cancelled": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-neutral-50 text-neutral-500 border-neutral-200";
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-heading font-bold animate-pulse">Loading Manifest...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary">Order Management</h1>
                    <p className="text-neutral-gray text-sm font-medium mt-1">Real-time fulfillment and logistics tracking</p>
                </div>

                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-neutral-beige shadow-soft">
                    <Filter size={18} className="text-secondary" />
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mr-2">Filter Status:</span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-primary font-bold text-xs cursor-pointer uppercase tracking-wider"
                    >
                        <option value="All">All Operations</option>
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className={`bg-white rounded-[2rem] border border-neutral-beige shadow-soft overflow-hidden transition-all duration-500 group ${expandedOrder === order._id ? 'ring-2 ring-secondary/20 scale-[1.01]' : 'hover:scale-[1.005]'}`}
                        >
                            {/* Header Row */}
                            <div
                                className={`p-8 cursor-pointer transition-colors flex items-center justify-between ${expandedOrder === order._id ? 'bg-neutral-cream/30' : 'hover:bg-neutral-cream/20'}`}
                                onClick={() => toggleExpand(order._id)}
                            >
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 w-full items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">ID Ref</span>
                                        <span className="font-mono text-xs font-bold text-primary">#{order._id.substring(18).toUpperCase()}</span>
                                    </div>
                                    <div className="hidden lg:flex flex-col">
                                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Client Title</span>
                                        <span className="text-sm font-bold text-primary truncate">{order.user?.name || "Guest Checkout"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Valuation</span>
                                        <span className="text-sm font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="hidden lg:flex flex-col">
                                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Dispatch Date</span>
                                        <span className="text-sm font-medium text-neutral-gray">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className={`
                                            flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300
                                            ${getStatusStyles(order.status)}
                                        `}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                        <div className={`p-2 rounded-full transition-all duration-300 ${expandedOrder === order._id ? 'bg-secondary text-primary' : 'text-neutral-300 group-hover:text-primary'}`}>
                                            {expandedOrder === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order._id && (
                                <div className="px-8 pb-8 pt-4 border-t border-neutral-beige/50 bg-neutral-cream/10 animate-slideDown">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="h-[1px] flex-1 bg-neutral-beige/50 mr-4" />
                                        <button className="flex items-center gap-2 text-[10px] font-bold text-secondary-dark hover:text-primary transition-all uppercase tracking-widest bg-white border border-neutral-beige px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md">
                                            <Printer size={14} />
                                            Export Manifest
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        <div className="bg-white p-6 rounded-2xl border border-neutral-beige/50 shadow-inner">
                                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4 pb-2 border-b border-neutral-beige">Line Items</h4>
                                            <ul className="space-y-4">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-4 text-xs">
                                                        <div className="w-12 h-12 rounded-lg bg-neutral-50 overflow-hidden shrink-0 border border-neutral-beige/30">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={item.product?.images?.[0] || "https://placehold.co/100x100?text=Item"}
                                                                alt="Product"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-primary">{item.product?.title || "Product Removed"}</p>
                                                            <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-6 pt-6 border-t-2 border-dashed border-neutral-beige flex justify-between items-end">
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Valuation</span>
                                                <span className="text-2xl font-heading font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="bg-white p-6 rounded-2xl border border-neutral-beige/50">
                                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Logistics Target</h4>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-primary">{order.user?.name || "Private Customer"}</p>
                                                    <p className="text-xs text-neutral-gray font-medium">{order.user?.email || "No email active"}</p>
                                                    <div className="pt-2 mt-2 border-t border-neutral-100 italic text-[11px] text-neutral-400 leading-relaxed">
                                                        {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                                                        {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
                                                        PH: {order.shippingAddress?.phone}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white p-6 rounded-2xl border border-neutral-beige/50">
                                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Internal Intelligence</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-[11px] font-medium">
                                                        <span className="text-neutral-400">Method:</span>
                                                        <span className="text-primary font-bold">{order.paymentMethod}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[11px] font-medium">
                                                        <span className="text-neutral-400">Status:</span>
                                                        <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{order.paymentStatus.toUpperCase()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[11px] font-medium pt-2">
                                                        <span className="text-neutral-400">Tracking:</span>
                                                        <span className="text-secondary-dark hover:underline cursor-pointer">{order.trackingNumber || "GENERATE #"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10 shadow-inner">
                                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">Operations Control</h4>
                                            <div className="flex flex-col gap-3">
                                                {["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => updateOrderStatus(order._id, s.toLowerCase())}
                                                        disabled={order.status === s.toLowerCase()}
                                                        className={`
                                                            w-full py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 shadow-sm
                                                            ${order.status === s.toLowerCase()
                                                                ? 'bg-primary text-secondary border-primary shadow-primary/20 cursor-default'
                                                                : 'bg-white text-neutral-400 border-neutral-200 hover:border-secondary hover:text-secondary hover:shadow-md active:scale-[0.98]'
                                                            }
                                                        `}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-neutral-beige shadow-soft">
                        <div className="w-20 h-20 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-neutral-200" size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary">Zero Transactions Found</h3>
                        <p className="text-neutral-gray max-w-sm mx-auto mt-2 font-medium">Secure your first sale to begin populating the logistics stream.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
