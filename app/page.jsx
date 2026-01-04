"use client";

import { useAdmin } from "@/context/AdminContext";
import StatsCard from "@/components/admin/StatsCard";
import { Package, ShoppingBag, AlertTriangle, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const { stats, orders, products, auditLogs } = useAdmin();

    // Filter items
    const lowStockProducts = products.filter(p => p.stock < 20);
    const recentOrders = orders.slice(0, 5);
    const recentLogs = auditLogs.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Dashboard</h1>
                    <p className="text-neutral-gray mt-1">Welcome back, Admin</p>
                </div>
                <div className="text-sm text-neutral-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    trend={12.5}
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.orders}
                    trend={8.2}
                />
                <StatsCard
                    title="Avg. Order Value"
                    value={`$${stats.avgOrderValue}`}
                    trend={-2.4}
                />
                <StatsCard
                    title="Total Visitors"
                    value={stats.visitors.toLocaleString()}
                    trend={15.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-neutral-beige p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-heading font-bold text-primary">Recent Orders</h2>
                        <Link href="/orders" className="text-sm text-secondary-dark hover:text-primary transition-colors">
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-beige/30 text-xs uppercase text-neutral-gray tracking-wider">
                                <tr>
                                    <th className="p-4 rounded-l-lg">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4 rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-beige">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-cream transition-colors">
                                        <td className="p-4 font-medium text-primary">{order.id}</td>
                                        <td className="p-4">{order.customer}</td>
                                        <td className="p-4">${order.total.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`
                        px-3 py-1 rounded-full text-xs font-medium border
                        ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                        ${order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      `}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column Stack */}
                <div className="space-y-8">
                    {/* Low Stock Alerts */}
                    <div className="bg-white rounded-2xl shadow-soft border border-neutral-beige p-6">
                        <div className="flex items-center gap-2 mb-6 text-accent-warning">
                            <AlertTriangle size={20} className="text-orange-500" />
                            <h2 className="text-xl font-heading font-bold text-primary">Low Stock Alerts</h2>
                        </div>

                        <div className="space-y-4">
                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-3 border border-neutral-beige rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-neutral-100 rounded-md overflow-hidden relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-primary line-clamp-1">{product.name}</p>
                                                <p className="text-xs text-red-500 font-medium">{product.stock === 0 ? 'Out of Stock' : `${product.stock} remaining`}</p>
                                            </div>
                                        </div>
                                        <Link href={`/inventory`} className="p-2 text-neutral-400 hover:text-primary transition-colors">
                                            <Package size={16} />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-neutral-gray text-sm italic">All products are well stocked.</p>
                            )}
                            <Link href="/inventory" className="block text-center mt-4 text-sm text-primary font-medium hover:underline">
                                Manage Inventory
                            </Link>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-white rounded-2xl shadow-soft border border-neutral-beige p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity size={20} className="text-primary" />
                            <h2 className="text-xl font-heading font-bold text-primary">Live Activity</h2>
                        </div>
                        <div className="space-y-6">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="flex gap-4 relative">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-secondary shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-primary">{log.action}</p>
                                        <p className="text-xs text-neutral-500 mt-1">{log.details}</p>
                                        <p className="text-[10px] text-neutral-400 mt-1">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • by {log.admin}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
