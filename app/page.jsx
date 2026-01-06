"use client";

import { useAdmin } from "@/context/AdminContext";
import StatsCard from "@/components/admin/StatsCard";
import { Package, ShoppingBag, AlertTriangle, Activity, MousePointer2, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const { stats, orders, products, loading } = useAdmin();

    // Derived logic
    const lowStockProducts = products.filter(p => p.stock < 10).slice(0, 4);
    const recentOrders = orders.slice(0, 5);
    const avgOrderValue = stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : 0;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-primary font-heading font-medium animate-pulse">Synchronizing Store Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-primary mb-2 flex items-center gap-3">
                        Estate Overview
                        <TrendingUp className="text-secondary" size={28} />
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-700 text-[10px] font-bold uppercase tracking-wider">Live Database Sync</span>
                        </div>
                        <p className="text-neutral-gray text-xs font-medium">Luminelle Management Suite • <span className="text-primary font-bold">2.4.0-PRO</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="https://skin-care-store-pi.vercel.app" // Link to the customer storefront
                        target="_blank"
                        className="flex items-center gap-2 bg-primary text-secondary px-5 py-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-widest active:scale-95"
                    >
                        <MousePointer2 size={14} />
                        View Live Store
                    </a>
                    <div className="bg-white px-5 py-3 rounded-2xl border border-neutral-beige shadow-soft flex items-center gap-3">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Master Node</span>
                        <div className="w-2 h-2 rounded-full bg-secondary shadow-glow shadow-secondary" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Gross Revenue"
                    value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
                    trend={15.4}
                    icon={<Activity size={20} className="text-secondary" />}
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders || 0}
                    trend={12.8}
                    icon={<ShoppingBag size={20} className="text-secondary" />}
                />
                <StatsCard
                    title="Avg. Order Value"
                    value={`$${avgOrderValue}`}
                    trend={-2.1}
                    icon={<TrendingUp size={20} className="text-secondary" />}
                />
                <StatsCard
                    title="Customer Base"
                    value={stats.totalCustomers || 0}
                    trend={24.5}
                    icon={<Package size={20} className="text-secondary" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders (Main Column) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-soft border border-neutral-beige p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-primary italic">Latest Transactions</h2>
                                <p className="text-xs text-neutral-400 mt-1 font-medium">Real-time order processing stream</p>
                            </div>
                            <Link href="/orders" className="text-xs font-bold text-secondary-dark hover:text-primary transition-all uppercase tracking-widest bg-secondary/10 px-4 py-2 rounded-full">
                                View Full Log
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] uppercase text-neutral-400 font-bold tracking-[0.2em] border-b border-neutral-beige">
                                    <tr>
                                        <th className="pb-4">Order Ref</th>
                                        <th className="pb-4">Client</th>
                                        <th className="pb-4">Amount</th>
                                        <th className="pb-4 text-right">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-beige/50">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <tr key={order._id} className="group hover:bg-neutral-cream/50 transition-colors">
                                                <td className="py-5 font-mono text-[11px] text-primary">{order._id.substring(18).toUpperCase()}</td>
                                                <td className="py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-primary">{order.customerName || order.shippingAddress?.fullName || order.user?.name || "Guest Customer"}</span>
                                                        <span className="text-[10px] text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 font-bold text-primary">${order.totalAmount.toFixed(2)}</td>
                                                <td className="py-5 text-right">
                                                    <span className={`
                                                        inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border
                                                        ${order.orderStatus === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                                        ${order.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                                        ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                                        ${order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                                    `}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-10 text-center text-neutral-300 italic text-sm">Waiting for first orders...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Launch Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-primary p-8 rounded-[2rem] text-secondary relative overflow-hidden group">
                            <Package className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-secondary/10 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-xl font-heading font-bold mb-2">Inventory Control</h3>
                            <p className="text-secondary/60 text-xs mb-6 max-w-[200px]">Stock levels are currently healthy across 92% of lines.</p>
                            <Link href="/inventory" className="inline-block bg-secondary text-primary px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
                                Open Vault
                            </Link>
                        </div>
                        <div className="bg-secondary p-8 rounded-[2rem] text-primary relative overflow-hidden group">
                            <Activity className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-primary/10 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-xl font-heading font-bold mb-2">Active Campaigns</h3>
                            <p className="text-primary/60 text-xs mb-6 max-w-[200px]">3 active discount codes currently in circulation.</p>
                            <Link href="/discounts" className="inline-block bg-primary text-secondary px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-colors">
                                Manage Offers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Side Stack */}
                <div className="space-y-8">
                    {/* Critical Alerts */}
                    <div className="bg-white rounded-[2rem] shadow-soft border border-neutral-beige p-8 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-heading font-bold text-primary">Priority Stock</h2>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Restock Required</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.map(product => (
                                    <div key={product._id} className="flex items-center justify-between p-4 border border-neutral-beige rounded-2xl hover:bg-neutral-cream/50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-neutral-100 rounded-xl overflow-hidden relative border border-neutral-beige/50">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-primary line-clamp-1">{product.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{product.stock} Units</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={`/inventory`} className="p-2 text-neutral-300 hover:text-primary transition-colors">
                                            <Package size={16} />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Package className="text-green-500" size={20} />
                                    </div>
                                    <p className="text-neutral-gray text-xs font-medium">Full inventory healthy.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Efficiency Widget */}
                    <div className="bg-neutral-beige/10 p-8 rounded-[2rem] border border-neutral-beige/30 shadow-inner">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-6 text-center">Efficiency Score</h3>
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-200" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 * (1 - 0.94)} className="text-secondary" />
                                </svg>
                                <span className="absolute text-2xl font-heading font-bold text-primary">94%</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-neutral-400 text-center leading-relaxed font-medium">Your order processing time is <span className="text-primary font-bold">12% faster</span> than the industry benchmark for boutique skincare.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
