"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { getClientLogosFromFirestore } from "@/lib/services/logoService";

export interface ClientLogo {
  id: string;
  name: string;
  src: string;
  alt: string;
  publicId?: string;
  slug?: string;
  folder?: string;
  width?: number;
  height?: number;
  cloudinary?: boolean;
  active?: boolean;
  order?: number;
}

export default function ClientMarquee() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogos() {
      try {
        setLoading(true);
        const data = await getClientLogosFromFirestore();
        // Filter only active logos if active field is specified
        const activeLogos = data.filter((l) => l.active !== false);
        setLogos(activeLogos);
      } catch (err) {
        console.error("Gagal memuat logo klien dari Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogos();
  }, []);

  if (loading || logos.length === 0) {
    return null; // Silent placeholder or blank while marquee loads
  }

  // Duplicate array for infinite seamless scrolling
  const marqueeLogos = [...logos, ...logos];

  return (
    <section className="w-full bg-white pt-8 sm:pt-10 lg:pt-12 pb-4 sm:pb-6 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm lg:text-base font-semibold text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto tracking-wide">
          Dipercaya oleh lebih dari 50+ perusahaan dari Sektor Swasta, BUMN, dan Lembaga di Indonesia
        </p>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-24 lg:w-36 z-10 bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none" />

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-24 lg:w-36 z-10 bg-gradient-to-l from-white via-white/85 to-transparent pointer-events-none" />

          {/* Infinite Marquee */}
          <div className="flex w-max items-center gap-8 sm:gap-14 lg:gap-20 animate-marquee">
            {marqueeLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex items-center justify-center h-14 sm:h-18 lg:h-22 px-2 sm:px-4 transition-all duration-300 group"
              >
                {logo.cloudinary ? (
                  <CldImage
                    src={logo.src}
                    alt={logo.alt || logo.name}
                    width={logo.width || 170}
                    height={logo.height || 60}
                    className="max-h-9 sm:max-h-13 lg:max-h-16 w-auto object-contain mix-blend-multiply contrast-125 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer"
                  />
                ) : (
                  <Image
                    src={logo.src}
                    alt={logo.alt || logo.name}
                    width={logo.width || 170}
                    height={logo.height || 60}
                    className="max-h-9 sm:max-h-13 lg:max-h-16 w-auto object-contain mix-blend-multiply contrast-125 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
