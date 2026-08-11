"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// ============================================================================
// KONFIGURASI WHATSAPP & NAVIGASI (Dapat diubah sesuai kebutuhan)
// ============================================================================
export const WHATSAPP_PHONE = "6281234567890"; // Nomor HP dalam format internasional
export const WHATSAPP_DEFAULT_MESSAGE =
  "Halo GrowthLine Consulting, saya ingin berkonsultasi mengenai layanan bisnis Anda. Mohon informasi selengkapnya.";

interface NavItem {
  label: string;
  targetId: string;
}

const navItems: NavItem[] = [
  { label: "Beranda", targetId: "home" },
  { label: "Tentang Kami", targetId: "about" },
  { label: "Layanan", targetId: "services" },
  { label: "Portofolio", targetId: "portfolio" },
];

export const getWhatsAppUrl = (phone: string, message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 180;
      const sectionIds = navItems.map((item) => item.targetId);

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        setActiveSection("portfolio");
        return;
      }

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

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white text-gray-900 shadow-md border-b border-gray-200 py-2.5 sm:py-3"
        : "bg-transparent text-white py-4 sm:py-5 border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={(e) => scrollToSection(e, "home")}
          className="relative block h-10 w-44 sm:h-12 sm:w-56 group focus:outline-none"
        >
          <Image
            src={isScrolled ? "/logos/growthline-dark.png" : "/logos/growthline-light.png"}
            alt="GrowthLine Consulting Logo"
            fill
            sizes="(max-width: 640px) 176px, 224px"
            className="object-contain object-left origin-left transition-all duration-300"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.targetId;
            return (
              <a
                key={item.targetId}
                href={`#${item.targetId}`}
                onClick={(e) => scrollToSection(e, item.targetId)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${isScrolled
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
          className={`md:hidden p-2 rounded-xl transition-colors focus:outline-none ${isScrolled
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
                className={`block px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive
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