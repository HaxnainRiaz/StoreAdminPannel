"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Star,
    Settings,
    LogOut,
    Menu,
    X,
    Users,
    TicketPercent,
    LifeBuoy,
    ClipboardList,
    Box,
    Layers
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const navItems = [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        { label: "Products", href: "/products", icon: Package },
        { label: "Categories", href: "/categories", icon: Layers },
        { label: "Orders", href: "/orders", icon: ShoppingBag },
        { label: "Inventory", href: "/inventory", icon: Box },
        { label: "User Accounts", href: "/customers", icon: Users },
        { label: "Reviews", href: "/reviews", icon: Star },
        { label: "Discounts", href: "/discounts", icon: TicketPercent },
        { label: "Support", href: "/support", icon: LifeBuoy },
        { label: "CMS", href: "/cms", icon: Settings },
        { label: "Audit Logs", href: "/audit", icon: ClipboardList },
    ];

    const isActive = (path) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 right-4 z-50 p-3 bg-primary text-white rounded-2xl shadow-xl border border-white/20"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <aside
                className={`
                    fixed top-0 left-0 z-40 h-screen w-64
                    bg-primary-dark text-neutral-cream
                    transition-all duration-300 ease-in-out
                    border-r border-primary/20
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="flex flex-col h-full p-6">
                    <Link href="/" className="mb-10 block group">
                        <div className="text-center">
                            <h1 className="font-heading text-2xl tracking-[0.2em] uppercase text-white group-hover:text-secondary transition-colors">Luminelle</h1>
                            <div className="h-px w-12 bg-secondary/50 mx-auto mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            <p className="text-[10px] text-secondary tracking-[0.3em] uppercase mt-2 font-bold opacity-70">Admin Core</p>
                        </div>
                    </Link>

                    <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
                                    ${isActive(item.href)
                                        ? "bg-secondary text-primary font-bold shadow-[0_4px_15_rgba(209,191,163,0.35)] scale-[1.02]"
                                        : "text-neutral-beige/70 hover:bg-white/5 hover:text-white"
                                    }
                                `}
                            >
                                <item.icon size={18} className={`${isActive(item.href) ? "text-primary" : "text-secondary/50 group-hover:text-secondary group-hover:scale-110"} transition-all`} />
                                <span className="text-sm tracking-wide">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-white/10 mt-6 pb-2">
                        <div className="flex items-center gap-3 px-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-primary font-bold text-sm shadow-inner overflow-hidden border border-white/20">
                                <img src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name || "Admin"}</p>
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-80">{user?.role || "Manager"}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-neutral-beige/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                        >
                            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-sm font-bold tracking-wide">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-primary/60 backdrop-blur-md animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
