"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, Eye, EyeOff, TreeDeciduous } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("admin@luminelle.com");
    const [password, setPassword] = useState("admin123");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-cream flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary text-secondary mb-4 shadow-xl">
                        <TreeDeciduous size={32} />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-primary tracking-widest uppercase">Luminelle</h1>
                    <p className="text-secondary-dark font-medium tracking-[0.2em] uppercase text-xs mt-2">Administrative Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-neutral-beige relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-beige rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    placeholder="admin@luminelle.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-beige rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98] mt-4"
                        >
                            Sign Into Dashboard
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-neutral-beige text-center">
                        <p className="text-xs text-neutral-400 font-medium">Demo Access Only</p>
                        <div className="mt-2 text-[10px] text-neutral-400 flex justify-center gap-4">
                            <span>Email: <b className="text-primary-light">admin@luminelle.com</b></span>
                            <span>Pass: <b className="text-primary-light">admin123</b></span>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-xs text-neutral-400">© 2026 Luminelle Organics. Secure Environment.</p>
                </div>
            </div>
        </div>
    );
}
