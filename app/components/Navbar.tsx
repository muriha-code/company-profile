"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// ============================================================================
// KONFIGURASI WHATSAPP & NAVIGASI (Dapat diubah sesuai kebutuhan)
// ============================================================================
export const WHATSAPP_PHONE = "6281234567890"; // Nomor HP dalam format internasional (tanpa + atau spasi)
export const WHATSAPP_DEFAULT_MESSAGE =
  "Halo GrowthLine Consulting, saya ingin berkonsultasi mengenai layanan bisnis Anda. Mohon informasi selengkapnya.";

interface NavItem {
  label: string;
  targetId: string;
}

// Daftar menu navigasi aktif (Menu yang tidak terpakai dapat dihapus dari array ini)
const navItems: NavItem[] = [
  { label: "Beranda", targetId: "home" },
  { label: "Tentang Kami", targetId: "about" },
  { label: "Layanan", targetId: "services" },
  { label: "Portofolio", targetId: "portfolio" },
];

/**
 * Helper function untuk menghasilkan URL WhatsApp API yang aman dengan encodeURIComponent
 */
export const getWhatsAppUrl = (phone: string, message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Menangani deteksi scroll untuk bayangan header & highlight menu aktif secara akurat
  useEffect(() => {
    const handleScroll = () => {
      // 1. Efek bayangan header saat di-scroll
      setIsScrolled(window.scrollY > 20);

      // 2. Deteksi section yang sedang aktif di viewport
      const scrollPosition = window.scrollY + 180; // Offset navbar height
      const sectionIds = navItems.map((item) => item.targetId);

      // Jika scroll berada di paling bawah halaman, aktifkan menu terakhir ("portfolio")
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        setActiveSection("portfolio");
        return;
      }

      // Melakukan iterasi dari section paling bawah ke paling atas
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    // Panggil saat pertama kali dimuat
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler untuk menu internal
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setActiveSection(targetId);
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const whatsappLink = getWhatsAppUrl(WHATSAPP_PHONE, WHATSAPP_DEFAULT_MESSAGE);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-gray-900 shadow-md border-b border-gray-200 py-3"
          : "bg-transparent text-white py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, "home")}
          className="flex items-center space-x-2.5 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            GL
          </div>
          <span
            className={`font-extrabold text-xl tracking-tight transition-colors duration-300 ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
          >
            GrowthLine{" "}
            <span
              className={isScrolled ? "text-blue-600 font-semibold" : "text-blue-300 font-semibold"}
            >
              Consulting
            </span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.targetId;
            return (
              <a
                key={item.targetId}
                href={`#${item.targetId}`}
                onClick={(e) => scrollToSection(e, item.targetId)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isScrolled
                    ? isActive
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    : isActive
                      ? "text-white bg-white/20 font-semibold"
                      : "text-gray-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* WhatsApp CTA Button (Desktop) */}
        <div className="hidden md:flex items-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-emerald-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-95"
            aria-label="Hubungi Kami melalui WhatsApp"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-emerald-100" />
            <span>Hubungi Kami</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-xl transition-colors focus:outline-none ${
            isScrolled
              ? "text-gray-900 hover:bg-gray-100"
              : "text-white hover:bg-white/10"
          }`}
          aria-label="Toggle Menu Navigasi"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-900 border-b border-gray-200 px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive = activeSection === item.targetId;
            return (
              <a
                key={item.targetId}
                href={`#${item.targetId}`}
                onClick={(e) => scrollToSection(e, item.targetId)}
                className={`block px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          
          {/* WhatsApp CTA Button (Mobile) */}
          <div className="pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-base font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 text-emerald-100" />
              <span>Hubungi Kami via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}