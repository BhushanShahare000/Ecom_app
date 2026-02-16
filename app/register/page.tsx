"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Check } from "lucide-react";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            router.push("/login?registered=true");
        } else {
            alert(data.error || "Something went wrong.");
        }
    }

    const roles = [
        { id: "USER", label: "Customer", icon: User, desc: "Standard shopping access" },
        { id: "ADMIN", label: "Administrator", icon: Shield, desc: "Catalog & inventory control" }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-gray-950 p-6 transition-colors duration-500 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-400/10 dark:bg-pink-600/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-pink-900/5 dark:shadow-none p-8 md:p-12 border border-gray-100 dark:border-gray-800 transition-all relative z-10">
                <div className="text-center space-y-2 mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight transition-colors">
                        Join the <span className="text-pink-600 dark:text-pink-400">Club</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Create your unique account today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div className="space-y-3 mb-4">
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Membership Tier</label>
                        <div className="grid grid-cols-2 gap-4">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const isSelected = form.role === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setForm({ ...form, role: role.id })}
                                        className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 group ${isSelected
                                                ? "border-pink-500 bg-pink-50/50 dark:bg-pink-900/10"
                                                : "border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-500 ${isSelected ? "bg-pink-600 text-white scale-110" : "bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:scale-105"
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs font-bold ${isSelected ? "text-pink-600 dark:text-pink-400" : "text-gray-500 dark:text-gray-400"}`}>
                                            {role.label}
                                        </span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            {role.desc}
                                        </span>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-pink-600 text-white p-1 rounded-full animate-in zoom-in duration-300">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 transition-colors">Display Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Your name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full border-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-900/30 focus:bg-white dark:focus:bg-gray-800 rounded-2xl p-4 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 transition-colors">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full border-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-900/30 focus:bg-white dark:focus:bg-gray-800 rounded-2xl p-4 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 transition-colors">Choose Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full border-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-900/30 focus:bg-white dark:focus:bg-gray-800 rounded-2xl p-4 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-bold py-7 rounded-2xl transition-all duration-300 border-none text-base shadow-xl active:scale-95 ${loading
                            ? "bg-pink-300 dark:bg-pink-900/50 cursor-not-allowed shadow-none"
                            : "bg-pink-600 dark:bg-pink-500 hover:bg-pink-700 dark:hover:bg-pink-600 shadow-pink-200 dark:shadow-none"
                            }`}
                    >
                        {loading ? "Creating..." : `Sign up as ${form.role === 'ADMIN' ? 'Admin' : 'Customer'}`}
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
                        Already have an account?{" "}
                        <span
                            onClick={() => router.push("/login")}
                            className="text-pink-600 dark:text-pink-400 hover:underline cursor-pointer font-bold transition-colors ml-1"
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
