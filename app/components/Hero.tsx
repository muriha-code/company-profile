"use client";

import Image from "next/image";
import { getWhatsAppUrl, WHATSAPP_PHONE, WHATSAPP_DEFAULT_MESSAGE } from "./Navbar";

export default function Hero() {
  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[calc(100vh-80px)] lg:min-h-screen flex items-center justify-center pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28 scroll-mt-20 overflow-hidden bg-slate-950"
    >
      {/* 1. LAYER 0: Background Image (next/image dengan fill & object-cover) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="GrowthLine Consulting Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* 2. LAYER 10: Dark Gradient Overlay untuk kontras tinggi */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/60 backdrop-blur-[1px]" />

      {/* 3. LAYER 20: Content Utama Full Screen Focus */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Heading Utama (Dominan, Bold & Standout) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Your Partner in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Business Growth
            </span>
          </h1>

          {/* Deskripsi (Luas & Mudah Dibaca) */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-8 sm:mb-10 leading-relaxed font-normal">
            GrowthLine Consulting membantu bisnis Anda berkembang secara terukur dan berkelanjutan dengan strategi terarah berbasis data serta eksekusi yang presisi.
          </p>

          {/* Tombol CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Tombol Utama Oranye */}
            <button
              onClick={() => scrollToSection("services")}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-200 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-base"
            >
              Our Services
            </button>

            {/* Tombol Sekunder WhatsApp CTA */}
            <a
              href={getWhatsAppUrl(WHATSAPP_PHONE, WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-500/50 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all duration-200 text-center cursor-pointer backdrop-blur-sm text-base"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}





