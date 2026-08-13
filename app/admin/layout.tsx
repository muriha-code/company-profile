"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faGears,
  faBuilding,
  faImage,
  faChartPie,
  faSignOutAlt,
  faSpinner,
  faBars,
  faTimes,
  faCheckCircle,
  faExclamationTriangle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const GROWTHLINE_LOGO_URL =
  "https://res.cloudinary.com/jbzy4h0h/image/upload/v1786596061/Growthline_Icon_imbcxp.png";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Desktop Collapsed State
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mobile Drawer State
  const [mobileOpen, setMobileOpen] = useState(false);

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const isLoginPage = pathname === "/admin/login";

  // Load collapsed preference from localStorage safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_sidebar_collapsed");
      if (saved === "true") {
        setIsCollapsed(true);
      }
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser && !isLoginPage) {
        router.replace("/admin/login");
      } else if (currentUser && isLoginPage) {
        router.replace("/admin");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isLoginPage, router]);

  // Check login success flag on mount / route change
  useEffect(() => {
    if (user && pathname === "/admin" && typeof window !== "undefined") {
      const justLoggedIn = sessionStorage.getItem("justLoggedIn");
      if (justLoggedIn === "true") {
        sessionStorage.removeItem("justLoggedIn");
        showToast("Login berhasil! Selamat datang di Dashboard Admin.", "success");
      }
    }
  }, [user, pathname]);

  // Listen for Escape key to close logout modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLogoutModalOpen && !isLoggingOut) {
        setIsLogoutModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLogoutModalOpen, isLoggingOut]);

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      setIsLogoutModalOpen(false);
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Gagal melakukan logout. Silakan coba lagi.", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // If on login page, return login page without admin wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading indicator for auth check
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">Memeriksa otentikasi admin...</p>
      </div>
    );
  }

  // If user is not authenticated and not on login page, prevent flash of layout
  if (!user) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: faChartPie },
    { label: "Portofolio", href: "/admin/portfolios", icon: faFolderOpen },
    { label: "Layanan", href: "/admin/services", icon: faGears },
    { label: "Logo Klien", href: "/admin/logos", icon: faBuilding },
    { label: "Hero Section", href: "/admin/hero", icon: faImage },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-slate-100 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-xl text-white text-xs sm:text-sm font-bold flex items-center space-x-3 transition-all duration-300 ${
            toastType === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          <FontAwesomeIcon
            icon={toastType === "success" ? faCheckCircle : faExclamationTriangle}
            className="w-5 h-5"
          />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between z-30 shadow-md shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
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
              <span className="font-extrabold text-white text-xs">G</span>
            )}
          </div>
          <span className="font-bold text-base tracking-tight">GrowthLine CMS</span>
        </div>
        <button
          type="button"
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
        >
          <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/60 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Navigation (Fixed Viewport Height) */}
      <aside
        className={`bg-slate-900 text-white flex flex-col justify-between z-40 transition-all duration-300 shrink-0 ${
          /* Mobile Drawer Positioning */
          mobileOpen
            ? "fixed inset-y-0 left-0 z-50 w-64 translate-x-0"
            : "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full md:relative md:translate-x-0"
        } ${
          /* Desktop Width Control */
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <div>
          {/* Header & Hamburger Toggle */}
          <div className={`p-4 sm:p-5 border-b border-slate-800 flex items-center ${isCollapsed ? "md:justify-center" : "justify-between"}`}>
            {/* Logo & Branding (Hidden on Desktop when Collapsed) */}
            <div className={`flex items-center space-x-3 overflow-hidden ${isCollapsed ? "md:hidden" : ""}`}>
              <div className="relative w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                {!imageError ? (
                  <Image
                    src={GROWTHLINE_LOGO_URL}
                    alt="GrowthLine Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="font-extrabold text-white text-base">GL</span>
                )}
              </div>
              <div className="truncate">
                <h2 className="font-bold text-base leading-snug tracking-wide truncate">GrowthLine</h2>
                <p className="text-[11px] text-slate-400 font-medium truncate">Admin Panel</p>
              </div>
            </div>

            {/* Desktop Hamburger Toggle Button */}
            <button
              type="button"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              onClick={toggleCollapse}
              title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
              className="hidden md:flex p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer shrink-0"
            >
              <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  } ${isCollapsed ? "md:justify-center md:px-0" : ""}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate hidden md:inline">{item.label}</span>}
                  <span className="truncate md:hidden">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile & Logout */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/50">
          <div className={`flex items-center ${isCollapsed ? "md:justify-center md:flex-col md:space-y-3" : "justify-between"}`}>
            {!isCollapsed && (
              <div className="truncate mr-2 hidden md:block">
                <p className="text-xs font-bold text-white truncate">{user.email}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Admin</p>
              </div>
            )}
            <div className="truncate mr-2 md:hidden">
              <p className="text-xs font-bold text-white truncate">{user.email}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Admin</p>
            </div>
            {isCollapsed && (
              <div className="hidden md:block text-center" title={user.email || "Admin"}>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400 mx-auto">
                  {user.email ? user.email.charAt(0).toUpperCase() : "A"}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleOpenLogoutModal}
              title="Keluar dari Admin"
              className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shrink-0"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Scrollable Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6 text-center overflow-hidden">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <FontAwesomeIcon icon={faQuestionCircle} className="w-7 h-7" />
            </div>

            {/* Title & Message */}
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900">
                Apakah Anda yakin ingin keluar?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Anda akan keluar dari Dashboard Admin.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-bold transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                    <span>Keluar...</span>
                  </>
                ) : (
                  <span>Iya</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
