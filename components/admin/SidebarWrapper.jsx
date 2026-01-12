"use client";

import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function SidebarWrapper({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#6B6B6B] font-body font-sans">
            <Sidebar />
            <main className="transition-all duration-300 md:ml-64 min-h-screen p-6 md:p-10">
                <div className="max-w-7xl mx-auto animate-fadeIn">
                    {children}
                </div>
            </main>
        </div>
    );
}
