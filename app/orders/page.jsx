"use client";

import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { Button, Dropdown } from "@/components/ui";
import { Filter, ChevronDown, ChevronUp, Package, Truck, CheckCircle, Printer, XCircle, Clock, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
    const { orders, updateOrderStatus, loading } = useAdmin();
    const [filter, setFilter] = useState("All");
    const [expandedOrder, setExpandedOrder] = useState(null);

    const statusHierarchy = {
        'pending': 1,
        'processing': 2,
        'confirmed': 3,
        'shipped': 4,
        'delivered': 5,
        'cancelled': 0
    };

    const isTransitionAllowed = (currentStatus, targetStatus) => {
        if (targetStatus === 'cancelled') return currentStatus !== 'delivered';
        const currentRank = statusHierarchy[currentStatus] || 0;
        const targetRank = statusHierarchy[targetStatus] || 0;
        return targetRank > currentRank;
    };

    const handlePrint = (order) => {
        const printWindow = window.open('', '_blank');
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product?.title || 'Product'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Order Transcript - #${order._id.substring(18).toUpperCase()}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; color: #0a4019; padding: 40px; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0a4019; padding-bottom: 20px; }
                        .section { margin-top: 30px; }
                        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background: #FDFCFB; padding: 10px; text-align: left; border-bottom: 1px solid #0a4019; font-size: 12px; text-transform: uppercase; }
                        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #6B6B6B; border-top: 1px solid #eee; padding-top: 20px; }
                        .total-row { font-weight: bold; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <h1 style="margin: 0; font-family: serif;">LUMINELLE</h1>
                            <p style="margin: 5px 0;">Premium Skincare Excellence</p>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="margin: 0;">OFFICIAL TRANSCRIPT</h2>
                            <p style="margin: 5px 0;">Ref Code: #${order._id.substring(18).toUpperCase()}</p>
                            <p style="margin: 5px 0;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div class="grid section">
                        <div>
                            <h4 style="text-transform: uppercase; font-size: 10px; color: #6B6B6B; margin-bottom: 10px;">Customer Profile</h4>
                            <p><strong>${order.shippingAddress?.fullName}</strong></p>
                            <p>${order.user?.email || 'Guest Transaction'}</p>
                            <p>PH: ${order.shippingAddress?.phone}</p>
                        </div>
                        <div>
                            <h4 style="text-transform: uppercase; font-size: 10px; color: #6B6B6B; margin-bottom: 10px;">Logistics Target</h4>
                            <p>${order.shippingAddress?.street}</p>
                            <p>${order.shippingAddress?.city}, ${order.shippingAddress?.state}</p>
                            <p>${order.shippingAddress?.postalCode}, ${order.shippingAddress?.country || 'Pakistan'}</p>
                        </div>
                    </div>

                    <div class="section">
                        <h4>ITEMIZED MANIFEST</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th style="text-align: center;">Qty</th>
                                    <th style="text-align: right;">Unit Price</th>
                                    <th style="text-align: right;">Line Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style="text-align: right; padding: 20px 10px;"><strong>VALUATION TOTAL</strong></td>
                                    <td style="text-align: right; padding: 20px 10px;" class="total-row">${formatPrice(order.totalAmount)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div class="section">
                        <div class="grid">
                            <div>
                                <h4 style="text-transform: uppercase; font-size: 10px; color: #6B6B6B;">Operational Intelligence</h4>
                                <p>Payment Method: ${order.paymentMethod || 'COD'}</p>
                                <p>Payment Status: ${order.paymentStatus?.toUpperCase()}</p>
                                <p>Order Status: ${order.orderStatus?.toUpperCase()}</p>
                            </div>
                            <div style="text-align: right; border: 1px solid #0a4019; padding: 15px; border-radius: 10px;">
                                <p style="font-size: 10px; margin: 0;">Authorized Signature</p>
                                <div style="height: 40px;"></div>
                                <p style="font-size: 12px; margin: 0; font-weight: bold;">Luminelle Operations Desk</p>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>This is a computer-generated official record for order #${order._id}.</p>
                        <p>&copy; ${new Date().getFullYear()} Luminelle Skincare. All Rights Reserved.</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const filteredOrders = filter === "All"
        ? orders
        : orders.filter(o => o.orderStatus?.toLowerCase() === filter.toLowerCase());

    const toggleExpand = (id) => {
        if (expandedOrder === id) setExpandedOrder(null);
        else setExpandedOrder(id);
    };

    const getStatusIcon = (status) => {
        if (!status) return <Clock size={16} />;
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
        if (!status) return "bg-neutral-50 text-neutral-500 border-neutral-200";
        switch (status.toLowerCase()) {
            case "pending": return "bg-neutral-100 text-neutral-600 border-neutral-300";
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
                <div className="w-10 h-10 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#0a4019] font-heading font-bold animate-pulse">Loading Manifest...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-[#0a4019] italic">Order Logistics</h1>
                    <p className="text-[#6B6B6B] text-sm font-medium mt-1">Real-time fulfillment and logistics tracking</p>
                </div>

                <div className="flex items-center gap-3 bg-white px-6 py-2 rounded-2xl border border-[#F5F3F0] shadow-[0_4px_20px_rgba(11,47,38,0.08)]">
                    <Filter size={18} className="text-[#d3d3d3]" />
                    <Dropdown
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder={null}
                        options={[
                            { value: "All", label: "All Operations" },
                            { value: "Pending", label: "Pending" },
                            { value: "Processing", label: "Processing" },
                            { value: "Confirmed", label: "Confirmed" },
                            { value: "Shipped", label: "Shipped" },
                            { value: "Delivered", label: "Delivered" },
                            { value: "Cancelled", label: "Cancelled" }
                        ]}
                        className="border-none shadow-none"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className={`bg-white rounded-[2rem] border border-[#F5F3F0] shadow-[0_4px_20px_rgba(11,47,38,0.08)] overflow-hidden transition-all duration-500 group ${expandedOrder === order._id ? 'ring-2 ring-[#d3d3d3]/20 scale-[1.01]' : 'hover:scale-[1.005]'}`}
                        >
                            {/* Header Row */}
                            <div
                                className={`p-8 cursor-pointer transition-colors flex items-center justify-between ${expandedOrder === order._id ? 'bg-[#FDFCFB]/30' : 'hover:bg-[#FDFCFB]/20'}`}
                                onClick={() => toggleExpand(order._id)}
                            >
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 w-full items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Node Ref</span>
                                        <span className="font-mono text-xs font-bold text-[#0a4019]">#{order._id.substring(18).toUpperCase()}</span>
                                    </div>
                                    <div className="hidden lg:flex flex-col">
                                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Target Client</span>
                                        <span className="text-sm font-bold text-[#0a4019] truncate">{order.shippingAddress?.fullName || order.user?.name || "Guest Checkout"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Valuation</span>
                                        <span className="text-sm font-bold text-[#0a4019]">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                    <div className="hidden lg:flex flex-col">
                                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Deployment Date</span>
                                        <span className="text-sm font-medium text-[#6B6B6B]">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className={`
                                            flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300
                                            ${getStatusStyles(order.orderStatus)}
                                        `}>
                                            {getStatusIcon(order.orderStatus)}
                                            {order.orderStatus}
                                        </div>
                                        <div className={`p-2 rounded-full transition-all duration-300 ${expandedOrder === order._id ? 'bg-[#d3d3d3] text-[#0a4019]' : 'text-neutral-300 group-hover:text-[#0a4019]'}`}>
                                            {expandedOrder === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order._id && (
                                <div className="px-8 pb-8 pt-4 border-t border-[#F5F3F0]/50 bg-[#FDFCFB]/10 animate-slideDown">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="h-[1px] flex-1 bg-[#F5F3F0]/50 mr-4" />
                                        <Button
                                            onClick={() => handlePrint(order)}
                                            variant="outline"
                                            icon={Printer}
                                        >
                                            Print Transcript
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        <div className="bg-white p-6 rounded-2xl border border-[#F5F3F0]/50 shadow-inner">
                                            <h4 className="text-[10px] font-bold text-[#0a4019] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#F5F3F0]">Line Items</h4>
                                            <ul className="space-y-4">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-4 text-xs">
                                                        <div className="w-12 h-12 rounded-lg bg-neutral-50 overflow-hidden shrink-0 border border-[#F5F3F0]/30">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={item.product?.images?.[0] || "https://placehold.co/100x100?text=Item"}
                                                                alt="Product"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-[#0a4019]">{item.product?.title || "Product Removed"}</p>
                                                            <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span className="font-bold text-[#0a4019]">{formatPrice(item.price)}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-6 pt-6 border-t-2 border-dashed border-[#F5F3F0] flex justify-between items-end">
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Valuation</span>
                                                <span className="text-2xl font-heading font-bold text-[#0a4019]">{formatPrice(order.totalAmount)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="bg-white p-6 rounded-2xl border border-[#F5F3F0]/50">
                                                <h4 className="text-[10px] font-bold text-[#0a4019] uppercase tracking-[0.2em] mb-4">Logistics Target</h4>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-[#0a4019]">{order.shippingAddress?.fullName || order.user?.name || "Guest Customer"}</p>
                                                    <p className="text-xs text-[#6B6B6B] font-medium">{order.user?.email || "No email active"}</p>
                                                    <div className="pt-2 mt-2 border-t border-neutral-100 italic text-[11px] text-neutral-400 leading-relaxed">
                                                        {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                                                        {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                                                        PH: {order.shippingAddress?.phone}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white p-6 rounded-2xl border border-[#F5F3F0]/50">
                                                <h4 className="text-[10px] font-bold text-[#0a4019] uppercase tracking-[0.2em] mb-4">Internal Intelligence</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-[11px] font-medium">
                                                        <span className="text-neutral-400">Method:</span>
                                                        <span className="text-[#0a4019] font-bold uppercase">{order.paymentMethod || 'COD'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[11px] font-medium">
                                                        <span className="text-neutral-400">Status:</span>
                                                        <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{order.paymentStatus?.toUpperCase()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[11px] font-medium pt-2">
                                                        <span className="text-neutral-400">Tracking:</span>
                                                        <span className="text-[#B8A68A] hover:underline cursor-pointer">{order.trackingNumber || "GENERATE #"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#d3d3d3]/5 p-8 rounded-2xl border border-[#d3d3d3]/10 shadow-inner">
                                            <h4 className="text-[10px] font-bold text-[#0a4019] uppercase tracking-[0.2em] mb-6">Operations Control</h4>
                                            <div className="flex flex-col gap-3">
                                                {["Pending", "Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(s => {
                                                    const sLower = s.toLowerCase();
                                                    const isCurrent = order.orderStatus === sLower;
                                                    const isAllowed = isTransitionAllowed(order.orderStatus, sLower);

                                                    return (
                                                        <button
                                                            key={s}
                                                            onClick={() => isAllowed && !isCurrent && updateOrderStatus(order._id, sLower)}
                                                            disabled={isCurrent || !isAllowed}
                                                            className={`
                                                                w-full py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 shadow-sm
                                                                ${isCurrent
                                                                    ? 'bg-[#0a4019] text-[#d3d3d3] border-[#0a4019] shadow-[#0a4019]/20 cursor-default'
                                                                    : !isAllowed
                                                                        ? 'bg-neutral-50 text-neutral-200 border-neutral-100 cursor-not-allowed opacity-50'
                                                                        : 'bg-white text-neutral-400 border-neutral-200 hover:border-[#d3d3d3] hover:text-[#d3d3d3] hover:shadow-md active:scale-[0.98]'
                                                                }
                                                            `}
                                                        >
                                                            {s}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-[#F5F3F0] shadow-[0_4px_20px_rgba(11,47,38,0.08)]">
                        <div className="w-20 h-20 bg-[#FDFCFB] rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-neutral-200" size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-[#0a4019] italic">Zero Transactions Found</h3>
                        <p className="text-[#6B6B6B] max-w-sm mx-auto mt-2 font-medium">Secure your first sale to begin populating the logistics stream.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

