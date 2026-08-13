"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
} from "@fortawesome/free-solid-svg-icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // If on login page, return login page without admin wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading indicator for auth check
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
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
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            G
          </div>
          <span className="font-bold text-base tracking-tight">GrowthLine CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white focus:outline-none"
        >
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col justify-between transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-slate-800 hidden md:flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-white text-base shadow-md shadow-blue-500/20">
              GL
            </div>
            <div>
              <h2 className="font-bold text-base leading-snug tracking-wide">GrowthLine</h2>
              <p className="text-xs text-slate-400 font-medium">Admin Content System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="truncate mr-2">
              <p className="text-xs font-bold text-white truncate">{user.email}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari Admin"
              className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
