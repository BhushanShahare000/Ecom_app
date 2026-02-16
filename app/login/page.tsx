"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("registered")) {
            setShowSuccess(true);
            // Hide after 5 seconds
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (res?.ok) {
            router.push("/products");
        } else {
            router.push("/register"); // redirect to register if invalid
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-gray-950 p-6 transition-colors duration-500 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 dark:shadow-none p-8 md:p-12 border border-gray-100 dark:border-gray-800 transition-all relative z-10">
                <div className="text-center space-y-2 mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight transition-colors">
                        Welcome <span className="text-blue-600 dark:text-blue-400">Back</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Please enter your credentials to continue</p>

                    {showSuccess && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-2xl flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                            <CheckCircle2 className="w-5 h-5 transition-transform duration-700 group-hover:scale-110" />
                            <span className="text-xs font-bold tracking-tight">Account Created Successfully!</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 transition-colors">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-gray-800 rounded-2xl p-4 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 transition-colors">Secret Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-gray-800 rounded-2xl p-4 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium"
                        />
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-200 dark:border-gray-800 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 transition-colors">Remember Me</span>
                        </label>
                        <Link href="/register" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Forgot Password?</Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-bold py-7 rounded-2xl transition-all duration-300 border-none text-base shadow-xl active:scale-95 ${loading
                            ? "bg-blue-300 dark:bg-blue-900/50 cursor-not-allowed shadow-none"
                            : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 shadow-blue-200 dark:shadow-none"
                            }`}
                    >
                        {loading ? "Verifying..." : "Login to Account"}
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
                        New to our platform?{" "}
                        <span
                            onClick={() => router.push("/register")}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-bold transition-colors ml-1"
                        >
                            Create an Account
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
