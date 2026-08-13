"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (typeof window !== "undefined") {
                sessionStorage.setItem("justLoggedIn", "true");
            }
            router.replace("/admin");
        } catch (error: any) {
            console.error("Login error:", error);

            switch (error.code) {
                case "auth/invalid-credential":
                    setError("Email atau password salah.");
                    break;

                case "auth/invalid-email":
                    setError("Format email tidak valid.");
                    break;

                case "auth/too-many-requests":
                    setError(
                        "Terlalu banyak percobaan login. Silakan coba lagi nanti."
                    );
                    break;

                default:
                    setError("Login gagal. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">
                            GrowthLine CMS
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Login untuk mengakses dashboard admin
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                autoComplete="email"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                required
                                autoComplete="current-password"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Memproses..." : "Login"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        GrowthLine Consulting — Admin CMS
                    </p>
                </div>
            </div>
        </main>
    );
}