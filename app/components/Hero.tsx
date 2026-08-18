"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { getHeroFromFirestore } from "@/lib/services/heroService";

export default function Hero() {
  const [heroBg, setHeroBg] = useState<string>("hero-bg_evwycr");
  const [isCloudinary, setIsCloudinary] = useState<boolean>(true);

  useEffect(() => {
    async function loadHero() {
      try {
        const data = await getHeroFromFirestore();
        if (data && data.src) {
          setHeroBg(data.src);
          setIsCloudinary(data.cloudinary !== undefined ? data.cloudinary : true);
        }
      } catch (err) {
        console.error("Gagal memuat latar Hero dari Firestore:", err);
      }
    }
    loadHero();
  }, []);

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[60vh] lg:min-h-[420px] flex flex-col justify-center pt-24 sm:pt-28 pb-10 sm:pb-12 overflow-hidden bg-slate-950"
    >
      {/* 1. LAYER 0: Background Image */}
      <div className="absolute inset-0 z-0">
        {isCloudinary ? (
          <CldImage
            src={heroBg}
            alt="GrowthLine Consulting Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <Image
            src={heroBg}
            alt="GrowthLine Consulting Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
      </div>

      {/* 2. LAYER 10: Overlay Gelap */}
      <div className="absolute inset-0 z-10 bg-slate-950/70 backdrop-blur-[0.5px]" />

      {/* 3. LAYER 20: Konten Terstruktur */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 w-full flex flex-col items-start text-left">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-snug max-w-4xl">
          Your Partner in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Business Growth
          </span>
        </h1>

        {/* Deskripsi */}
        <p className="text-sm sm:text-base text-slate-200 mt-3 sm:mt-4 max-w-2xl leading-relaxed font-normal">
          GrowthLine Consulting membantu bisnis Anda berkembang secara terukur dan berkelanjutan dengan strategi terarah berbasis data serta eksekusi yang presisi.
        </p>

        {/* Tombol CTA */}
        <div className="mt-5 sm:mt-6 flex justify-start">
          <button
            onClick={() => scrollToSection("services")}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 cursor-pointer"
          >
            Our Services
          </button>
        </div>
      </div>
    </section>
  );
}