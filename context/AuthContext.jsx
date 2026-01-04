"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem("luminelle_admin_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Simple mock authentication
        if (email === "admin@luminelle.com" && password === "admin123") {
            const adminUser = {
                name: "Hasnain",
                role: "super-admin",
                email: "admin@luminelle.com",
                avatar: "https://ui-avatars.com/api/?name=Hasnain&background=0B2F26&color=fff"
            };
            setUser(adminUser);
            localStorage.setItem("luminelle_admin_user", JSON.stringify(adminUser));
            router.push("/");
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("luminelle_admin_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== "/login") {
            router.push("/login");
        }
    }, [user, loading, router, pathname]);

    if (loading || (!user && pathname !== "/login")) {
        return (
            <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return children;
};
