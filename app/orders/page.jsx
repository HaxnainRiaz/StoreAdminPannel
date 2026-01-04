"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, Package, Truck, CheckCircle, Printer } from "lucide-react";

export default function OrdersPage() {
    const { orders, updateOrderStatus } = useAdmin();
    const [filter, setFilter] = useState("All");
    const [expandedOrder, setExpandedOrder] = useState(null);

    const filteredOrders = filter === "All"
        ? orders
        : orders.filter(o => o.status === filter);

    const toggleExpand = (id) => {
        if (expandedOrder === id) setExpandedOrder(null);
        else setExpandedOrder(id);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Pending": return <Package size={18} />;
            case "Shipped": return <Truck size={18} />;
            case "Delivered": return <CheckCircle size={18} />;
            default: return <Package size={18} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Orders</h1>
                    <p className="text-neutral-gray">Manage and track customer orders</p>
                </div>

                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-neutral-beige shadow-sm">
                    <Filter size={18} className="text-neutral-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-neutral-gray cursor-pointer"
                    >
                        <option value="All">All Orders</option>
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl border border-neutral-beige shadow-sm overflow-hidden transition-all duration-300"
                        >
                            {/* Header Row */}
                            <div
                                className="p-6 cursor-pointer hover:bg-neutral-cream transition-colors flex items-center justify-between"
                                onClick={() => toggleExpand(order.id)}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full items-center">
                                    <div>
                                        <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Order ID</span>
                                        <span className="font-heading font-bold text-primary">{order.id}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Customer</span>
                                        <span className="text-neutral-gray">{order.customer}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Total</span>
                                        <span className="font-medium text-primary">${order.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className={`
                         flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                         ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                         ${order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                         ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      `}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                        {expandedOrder === order.id ? <ChevronUp size={20} className="text-neutral-400" /> : <ChevronDown size={20} className="text-neutral-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order.id && (
                                <div className="px-6 pb-6 pt-2 border-t border-neutral-beige/50 bg-neutral-50/50">
                                    <div className="flex justify-end mb-4">
                                        <button className="flex items-center gap-2 text-sm text-secondary-dark hover:text-primary transition-colors">
                                            <Printer size={16} />
                                            Print Invoice
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-sm font-bold text-primary mb-3">Order Items</h4>
                                            <ul className="space-y-2">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="flex items-center justify-between text-sm text-neutral-gray border-b border-neutral-200 pb-2 last:border-0">
                                                        <span>{item}</span>
                                                        <span>1x</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center">
                                                <span className="font-bold text-primary">Total Paid</span>
                                                <span className="font-bold text-xl text-primary">${order.total.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-bold text-primary mb-2">Shipping Address</h4>
                                                    <p className="text-sm text-neutral-gray">{order.customer}</p>
                                                    <p className="text-sm text-neutral-gray">{order.email}</p>
                                                    <p className="text-sm text-neutral-gray">{order.shippingAddress || "Address not provided"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-primary mb-2">Billing Address</h4>
                                                    <p className="text-sm text-neutral-gray">{order.billingAddress || "Same as shipping"}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-primary mb-2">Update Status</h4>
                                                <div className="flex gap-2 flex-wrap">
                                                    {["Pending", "Shipped", "Delivered", "Cancelled"].map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => updateOrderStatus(order.id, s)}
                                                            disabled={order.status === s}
                                                            className={`
                                 px-3 py-1 rounded-md text-sm border transition-colors
                                 ${order.status === s
                                                                    ? 'bg-primary text-white border-primary'
                                                                    : 'bg-white text-neutral-gray border-neutral-300 hover:border-primary hover:text-primary'}
                               `}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-neutral-beige">
                        <p className="text-neutral-400 text-lg">No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
