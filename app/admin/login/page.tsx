"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
  faArrowRight,
  faShieldHalved,
  faExclamationCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const GROWTHLINE_LOGO_URL =
  "https://res.cloudinary.com/jbzy4h0h/image/upload/v1786596061/Growthline_Icon_imbcxp.png";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

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
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* 1. Ambient Background Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-slate-50 to-slate-100 pointer-events-none z-0" />

      {/* Decorative Subtle Radial Accent Blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 2. Subtle Dot Grid Background Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="login-dot-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="#3b82f6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#login-dot-grid)" />
      </svg>

      {/* 3. Abstract GrowthLine Analytics SVG Vector Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Top-Left Abstract Rising Growth Line */}
        <g className="opacity-75">
          <path
            d="M -30,220 L 70,220 L 130,160 L 220,160 L 280,100 L 380,100 L 460,40"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity="0.4"
          />
          <path
            d="M -30,200 L 80,200 L 140,140 L 210,140 L 270,80 L 360,80"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.35"
          />
          {/* Data Node Dots */}
          <circle cx="80" cy="200" r="3.5" fill="#2563eb" fillOpacity="0.6" />
          <circle cx="140" cy="140" r="3.5" fill="#2563eb" fillOpacity="0.6" />
          <circle cx="210" cy="140" r="3.5" fill="#2563eb" fillOpacity="0.6" />
          <circle cx="270" cy="80" r="4.5" fill="#3b82f6" fillOpacity="0.8" />
          <circle cx="270" cy="80" r="8" fill="#3b82f6" fillOpacity="0.2" className="animate-pulse motion-reduce:animate-none" />
          <circle cx="360" cy="80" r="3.5" fill="#2563eb" fillOpacity="0.6" />
        </g>

        {/* Top-Right Abstract Rising Growth Line */}
        <g className="opacity-75">
          <path
            d="M 820,240 L 890,240 L 960,160 L 1040,160 L 1110,70 L 1230,70"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.35"
          />
          {/* Data Node Dots */}
          <circle cx="890" cy="240" r="3.5" fill="#4f46e5" fillOpacity="0.6" />
          <circle cx="960" cy="160" r="3.5" fill="#4f46e5" fillOpacity="0.6" />
          <circle cx="1040" cy="160" r="3.5" fill="#4f46e5" fillOpacity="0.6" />
          <circle cx="1110" cy="70" r="4.5" fill="#6366f1" fillOpacity="0.8" />
          <circle cx="1110" cy="70" r="8" fill="#6366f1" fillOpacity="0.2" className="animate-pulse motion-reduce:animate-none" />
        </g>

        {/* Bottom-Left Abstract Rising Growth Line */}
        <g className="opacity-75">
          <path
            d="M -40,740 L 60,740 L 120,670 L 230,670 L 310,590 L 410,590"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.35"
          />
          {/* Data Node Dots */}
          <circle cx="60" cy="740" r="3.5" fill="#3b82f6" fillOpacity="0.6" />
          <circle cx="120" cy="670" r="3.5" fill="#3b82f6" fillOpacity="0.6" />
          <circle cx="230" cy="670" r="3.5" fill="#3b82f6" fillOpacity="0.6" />
          <circle cx="310" cy="590" r="4.5" fill="#2563eb" fillOpacity="0.8" />
          <circle cx="310" cy="590" r="8" fill="#2563eb" fillOpacity="0.2" className="animate-pulse motion-reduce:animate-none" />
        </g>

        {/* Bottom-Right Abstract Rising Growth Line */}
        <g className="opacity-75">
          <path
            d="M 840,760 L 910,760 L 980,680 L 1070,680 L 1150,600 L 1240,600"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.35"
          />
          <path
            d="M 860,780 L 930,780 L 1000,700 L 1090,700 L 1170,620 L 1250,620"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity="0.3"
          />
          {/* Data Node Dots */}
          <circle cx="910" cy="760" r="3.5" fill="#2563eb" fillOpacity="0.6" />
          <circle cx="980" cy="680" r="3.5" fill="#2563eb" fillOpacity="0.6" />
          <circle cx="1070" cy="680" r="3.5" fill="#2563eb" fillOpacity="0.6" />
          <circle cx="1150" cy="600" r="4.5" fill="#3b82f6" fillOpacity="0.8" />
          <circle cx="1150" cy="600" r="8" fill="#3b82f6" fillOpacity="0.2" className="animate-pulse motion-reduce:animate-none" />
        </g>
      </svg>

      {/* 4. Login Container Card (UNTOUCHED / PRESERVED EXACTLY) */}
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 relative z-10 space-y-6">
        
        {/* Brand & Heading */}
        <div className="text-center space-y-3">
          {/* Logo & Brand Name */}
          <div className="inline-flex items-center justify-center space-x-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center shadow-md shadow-slate-900/10 shrink-0">
              {!imageError ? (
                <Image
                  src={GROWTHLINE_LOGO_URL}
                  alt="GrowthLine Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="font-extrabold text-white text-sm">GL</span>
              )}
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              GrowthLine
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              CMS
            </span>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Sign in to continue to your dashboard.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-medium text-rose-700 flex items-center space-x-3 animate-fadeIn">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="w-4 h-4 text-rose-600 shrink-0"
            />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Email
            </label>

            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 focus:outline-none transition cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>

          {/* Submit CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Security Badge & Copyright */}
        <div className="pt-3 text-center space-y-1.5 border-t border-slate-100">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400">
            <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 text-slate-400" />
            <span>Secure access to GrowthLine CMS</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            © 2026 GrowthLine Consulting. All rights reserved.
          </p>
        </div>

      </div>
    </main>
  );
}