"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
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
            alert(data.message || "Registration successful!");
            router.push("/login");
        } else {
            alert(data.error || "Something went wrong.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Create Account ✨
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Create a password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none rounded-lg p-3"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-semibold py-3 rounded-lg transition-all duration-300 ${loading
                                ? "bg-pink-300 cursor-not-allowed"
                                : "bg-pink-600 hover:bg-pink-700 shadow-md"
                            }`}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <span
                        onClick={() => router.push("/login")}
                        className="text-pink-600 hover:underline cursor-pointer font-medium"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
