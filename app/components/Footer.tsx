"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Self-contained SVG Icon Components (No external dependencies required)
function PhoneIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );
}

function MailIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function ArrowUpIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
    );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
        </svg>
    );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <footer className="bg-gradient-to-br from-sky-800 via-sky-900 to-blue-950 text-white relative">
            {/* Container Utama 4 Kolom (Desktop 4 Kolom, Mobile Responsive 1 Kolom) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

                    {/* KOLOM 1: Logo Merek "Levner", Deskripsi, & Sosmed */}
                    <div className="space-y-5">
                        <Link
                            href="/"
                            onClick={(e) => scrollToSection(e, "home")}
                            className="relative block h-16 w-72 group focus:outline-none"
                        >
                            <Image
                                src="/logos/growthline-light.png"
                                alt="GrowthLine Consulting Logo"
                                fill
                                sizes="288px"
                                className="object-contain object-left"
                                priority
                            />
                        </Link>

                        <p className="text-sky-100/90 text-sm leading-relaxed font-normal">
                            Mitra strategis terpercaya dalam konsultasi bisnis, manajemen kepatuhan, serta transformasi keberlanjutan untuk akselerasi bisnis Anda.
                        </p>

                        {/* Ikon Media Sosial (Lingkaran Putih Ikon Gelap) */}
                        <div className="flex items-center space-x-3 pt-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-full bg-white text-sky-900 flex items-center justify-center shadow hover:bg-sky-100 hover:scale-105 transition-all duration-200"
                            >
                                <FacebookIcon className="w-4 h-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="w-9 h-9 rounded-full bg-white text-sky-900 flex items-center justify-center shadow hover:bg-sky-100 hover:scale-105 transition-all duration-200"
                            >
                                <LinkedinIcon className="w-4 h-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full bg-white text-sky-900 flex items-center justify-center shadow hover:bg-sky-100 hover:scale-105 transition-all duration-200"
                            >
                                <InstagramIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* KOLOM 2: Navigation */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-5 border-b border-sky-700/60 pb-2 inline-block">
                            NAVIGATION
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#home"
                                    onClick={(e) => scrollToSection(e, "home")}
                                    className="text-sky-100/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    Beranda
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    onClick={(e) => scrollToSection(e, "about")}
                                    className="text-sky-100/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={(e) => scrollToSection(e, "services")}
                                    className="text-sky-100/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    Layanan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#portfolio"
                                    onClick={(e) => scrollToSection(e, "portfolio")}
                                    className="text-sky-100/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    Portofolio
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* KOLOM 3: Product Family */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-5 border-b border-sky-700/60 pb-2 inline-block">
                            PRODUCT FAMILY
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#services"
                                    onClick={(e) => scrollToSection(e, "services")}
                                    className="text-sky-100/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    Management Compliance Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={(e) => scrollToSection(e, "services")}
                                    className="text-sky-100/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    Business Management & Strategy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={(e) => scrollToSection(e, "services")}
                                    className="text-sky-100/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    Sustainability Environmental Management
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={(e) => scrollToSection(e, "services")}
                                    className="text-sky-100/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    Design & Engineering Services
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* KOLOM 4: Contact */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-5 border-b border-sky-700/60 pb-2 inline-block">
                            CONTACT
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start space-x-3">
                                <PhoneIcon className="w-5 h-5 text-sky-300 flex-shrink-0 mt-0.5" />
                                <a
                                    href="tel:+628111133421"
                                    className="text-sky-100/90 hover:text-white transition-colors"
                                >
                                    +62 811 1133 421
                                </a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MailIcon className="w-5 h-5 text-sky-300 flex-shrink-0 mt-0.5" />
                                <a
                                    href="mailto:admin@growthline.com"
                                    className="text-sky-100/90 hover:text-white transition-colors"
                                >
                                    admin@growthline.com
                                </a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPinIcon className="w-5 h-5 text-sky-300 flex-shrink-0 mt-0.5" />
                                <span className="text-sky-100/90 leading-relaxed">
                                    Jl. Jendral Sudirman No. 45, Jakarta Selatan, DKI Jakarta 12190, Indonesia
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Garis Pemisah (Border Divider) & Hak Cipta + Tombol Scroll-to-Top */}
            <div className="border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="hidden sm:block w-10" />

                    {/* Hak Cipta Tepat di Tengah */}
                    <p className="text-xs sm:text-sm text-sky-200/90 text-center font-medium">
                        © 2026 GrowthLine Consulting. All rights reserved.
                    </p>

                    {/* Tombol Scroll-to-Top Oranye di Sudut Kanan Bawah */}
                    <button
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                        className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-orange-500/40 transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                    >
                        <ArrowUpIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}