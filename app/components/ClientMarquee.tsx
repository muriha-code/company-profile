"use client";

import Image from "next/image";

export interface ClientLogo {
  id: string;
  name: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  {
    id: "bri",
    name: "Bank BRI",
    src: "/logos/logo-bank-bri.webp",
    alt: "Bank BRI Logo",
    width: 140,
    height: 45,
  },
  {
    id: "bsi",
    name: "Bank BSI",
    src: "/logos/logo-bank-bsi.webp",
    alt: "Bank BSI Logo",
    width: 140,
    height: 45,
  },
  {
    id: "garuda",
    name: "Garuda Indonesia",
    src: "/logos/logo-garuda-indonesia.png",
    alt: "Garuda Indonesia Logo",
    width: 150,
    height: 45,
  },
  {
    id: "indomaret",
    name: "Indomaret",
    src: "/logos/logo-indomaret.webp",
    alt: "Indomaret Logo",
    width: 130,
    height: 45,
  },
  {
    id: "telkom",
    name: "Telkom Indonesia",
    src: "/logos/telkom.png",
    alt: "Telkom Indonesia Logo",
    width: 130,
    height: 45,
  },
  {
    id: "unilever",
    name: "Unilever Indonesia",
    src: "/logos/unilever-indonesia.png",
    alt: "Unilever Indonesia Logo",
    width: 130,
    height: 45,
  },
  {
    id: "posindo",
    name: "Pos Indonesia",
    src: "/logos/posindo.png",
    alt: "Pos Indonesia Logo",
    width: 130,
    height: 45,
  },
  {
    id: "shopee",
    name: "Shopee",
    src: "/logos/shopeee.png",
    alt: "Shopee Logo",
    width: 120,
    height: 45,
  },
  {
    id: "lega-hero",
    name: "Lega Hero",
    src: "/logos/lega hero.png",
    alt: "Lega Hero Logo",
    width: 130,
    height: 45,
  },
];

export default function ClientMarquee() {
  // Duplikasi array logo untuk menghasilkan pergerakan infinite loop tanpa celah (seamless)
  const marqueeLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="w-full bg-white py-10 sm:py-12 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm sm:text-base font-medium text-slate-600 mb-8 sm:mb-10 max-w-3xl mx-auto">
          Dipercaya oleh lebih dari 100+ perusahaan dari Sektor Swasta, BUMN, dan Lembaga di Indonesia
        </p>

        {/* Marquee Wrapper dengan Gradient Masking Putih (Fade In/Out) */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Left Side Blur Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 z-10 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />

          {/* Right Side Blur Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 z-10 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

          {/* Infinite Animated Track */}
          <div className="flex w-max items-center gap-12 sm:gap-16 lg:gap-20 animate-marquee">
            {marqueeLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex items-center justify-center h-12 px-2 transition-all duration-300 group"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 140}
                  height={logo.height || 45}
                  className="max-h-8 sm:max-h-11 w-auto object-contain mix-blend-multiply grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

