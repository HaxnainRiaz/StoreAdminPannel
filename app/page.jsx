"use client";

import { useAdmin } from "@/context/AdminContext";
import StatsCard from "@/components/admin/StatsCard";
import { Package, ShoppingBag, AlertTriangle, Activity, MousePointer2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import RevenueProgressChart from "@/components/admin/RevenueProgressChart";

export default function AdminDashboard() {
    const { stats, orders, products, loading } = useAdmin();

    // Derived logic
    const lowStockProducts = products.filter(p => p.stock < 10).slice(0, 4);
    const recentOrders = orders.slice(0, 5);
    const avgOrderValue = stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders) : 0;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#0a4019] font-heading font-medium animate-pulse">Synchronizing Store Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-[#0a4019] mb-2 flex items-center gap-3">
                        Estate Overview
                        <TrendingUp className="text-[#d3d3d3]" size={28} />
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-700 text-[10px] font-bold uppercase tracking-wider">Live Database Sync</span>
                        </div>
                        <p className="text-[#6B6B6B] text-xs font-medium">Luminelle Management Suite • <span className="text-[#0a4019] font-bold">2.4.0-PRO</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="https://skin-care-store-tau.vercel.app/" // Link to the customer storefront
                        target="_blank"
                        className="flex items-center gap-2 bg-[#0a4019] text-[#d3d3d3] px-5 py-3 rounded-2xl hover:bg-[#051712] transition-all shadow-lg shadow-[#0a4019]/20 font-bold text-xs uppercase tracking-widest active:scale-95"
                    >
                        <MousePointer2 size={14} />
                        View Live Store
                    </a>
                    <div className="bg-white px-5 py-3 rounded-2xl border border-[#F5F3F0] shadow-[0_4px_20px_rgba(11,47,38,0.08)] flex items-center gap-3">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Master Node</span>
                        <div className="w-2 h-2 rounded-full bg-[#d3d3d3] shadow-glow shadow-[#d3d3d3]" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Gross Revenue"
                    value={formatPrice(stats.totalRevenue || 0)}
                    trend={stats.trends?.revenue || 15.4}
                    icon={<Activity size={20} className="text-[#d3d3d3]" />}
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders || 0}
                    trend={stats.trends?.orders || 12.8}
                    icon={<ShoppingBag size={20} className="text-[#d3d3d3]" />}
                />
                <StatsCard
                    title="Avg. Order Value"
                    value={formatPrice(avgOrderValue)}
                    trend={stats.trends?.aov || 2.1}
                    icon={<TrendingUp size={20} className="text-[#d3d3d3]" />}
                />
                <StatsCard
                    title="Customer Base"
                    value={stats.totalCustomers || 0}
                    trend={stats.trends?.customers || 24.5}
                    icon={<Package size={20} className="text-[#d3d3d3]" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders (Main Column) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d3d3d3]/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-[#0a4019] italic">Latest Transactions</h2>
                                <p className="text-xs text-neutral-400 mt-1 font-medium">Real-time order processing stream</p>
                            </div>
                            <Link href="/orders" className="text-xs font-bold text-[#B8A68A] hover:text-[#0a4019] transition-all uppercase tracking-widest bg-[#d3d3d3]/10 px-4 py-2 rounded-full">
                                View Full Log
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] uppercase text-neutral-400 font-bold tracking-[0.2em] border-b border-[#F5F3F0]">
                                    <tr>
                                        <th className="pb-4">Order Ref</th>
                                        <th className="pb-4">Client</th>
                                        <th className="pb-4">Amount</th>
                                        <th className="pb-4 text-right">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F5F3F0]/50">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <tr key={order._id} className="group hover:bg-[#FDFCFB]/50 transition-colors">
                                                <td className="py-5 font-mono text-[11px] text-[#0a4019]">{order._id.substring(18).toUpperCase()}</td>
                                                <td className="py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[#0a4019]">{order.customerName || order.shippingAddress?.fullName || order.user?.name || "Guest Customer"}</span>
                                                        <span className="text-[10px] text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 font-bold text-[#0a4019]">{formatPrice(order.totalAmount)}</td>
                                                <td className="py-5 text-right">
                                                    <span className={`
                                                        inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border
                                                        ${order.orderStatus === 'pending' ? 'bg-neutral-100 text-neutral-600 border-neutral-300' : ''}
                                                        ${order.orderStatus === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                                        ${order.orderStatus === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                                        ${order.orderStatus === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
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
                        <div className="bg-[#0a4019] p-8 rounded-[2rem] text-[#d3d3d3] relative overflow-hidden group">
                            <Package className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-[#d3d3d3]/10 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-xl font-heading font-bold mb-2">Inventory Control</h3>
                            <p className="text-[#d3d3d3]/60 text-xs mb-6 max-w-[200px]">Stock levels are currently healthy across 92% of lines.</p>
                            <Link href="/inventory" className="inline-block bg-[#d3d3d3] text-[#0a4019] px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
                                Open Vault
                            </Link>
                        </div>
                        <div className="bg-[#d3d3d3] p-8 rounded-[2rem] text-[#0a4019] relative overflow-hidden group">
                            <Activity className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-[#0a4019]/10 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-xl font-heading font-bold mb-2">Active Campaigns</h3>
                            <p className="text-[#0a4019]/60 text-xs mb-6 max-w-[200px]">3 active discount codes currently in circulation.</p>
                            <Link href="/discounts" className="inline-block bg-[#0a4019] text-[#d3d3d3] px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#051712] transition-colors">
                                Manage Offers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Side Stack */}
                <div className="space-y-8">
                    {/* Critical Alerts */}
                    <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] p-8 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-heading font-bold text-[#0a4019]">Priority Stock</h2>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Restock Required</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.map(product => (
                                    <div key={product._id} className="flex items-center justify-between p-4 border border-[#F5F3F0] rounded-2xl hover:bg-[#FDFCFB]/50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-neutral-100 rounded-xl overflow-hidden relative border border-[#F5F3F0]/50">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-[#0a4019] line-clamp-1">{product.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{product.stock} Units</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={`/inventory`} className="p-2 text-neutral-300 hover:text-[#0a4019] transition-colors">
                                            <Package size={16} />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Package className="text-green-500" size={20} />
                                    </div>
                                    <p className="text-[#6B6B6B] text-xs font-medium">Full inventory healthy.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Efficiency Widget */}
                    <div className="bg-[#F5F3F0]/10 p-8 rounded-[2rem] border border-[#F5F3F0]/30 shadow-inner">
                        <h3 className="text-sm font-bold text-[#0a4019] uppercase tracking-[0.2em] mb-6 text-center">Efficiency Score</h3>
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-200" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 * (1 - 0.94)} className="text-[#d3d3d3]" />
                                </svg>
                                <span className="absolute text-2xl font-heading font-bold text-[#0a4019]">94%</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-neutral-400 text-center leading-relaxed font-medium">Your order processing time is <span className="text-[#0a4019] font-bold">12% faster</span> than the industry benchmark for boutique skincare.</p>
                    </div>
                </div>
            </div>

            {/* Revenue Progress Chart */}
            <RevenueProgressChart />
        </div>
    );
}
