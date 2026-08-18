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
    <section className="w-full bg-white pt-4 pb-5 sm:pb-6 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-3 sm:gap-4">
        <p className="text-center text-xs sm:text-sm font-semibold text-slate-600 max-w-3xl tracking-wide">
          Dipercaya oleh lebih dari 50+ perusahaan dari Sektor Swasta, BUMN, dan Lembaga di Indonesia
        </p>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden py-1">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-24 lg:w-36 z-10 bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none" />

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-24 lg:w-36 z-10 bg-gradient-to-l from-white via-white/85 to-transparent pointer-events-none" />

          {/* Infinite Marquee */}
          <div className="flex w-max items-center gap-8 sm:gap-12 lg:gap-16 animate-marquee">
            {marqueeLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex items-center justify-center h-12 sm:h-14 lg:h-16 px-2 sm:px-4 transition-all duration-300 group"
              >
                {logo.cloudinary ? (
                  <CldImage
                    src={logo.src}
                    alt={logo.alt || logo.name}
                    width={logo.width || 160}
                    height={logo.height || 50}
                    className="max-h-8 sm:max-h-10 lg:max-h-12 w-auto object-contain mix-blend-multiply contrast-125 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer"
                  />
                ) : (
                  <Image
                    src={logo.src}
                    alt={logo.alt || logo.name}
                    width={logo.width || 160}
                    height={logo.height || 50}
                    className="max-h-8 sm:max-h-10 lg:max-h-12 w-auto object-contain mix-blend-multiply contrast-125 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer"
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
