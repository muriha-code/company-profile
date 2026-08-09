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
    src: "/logos/logo-bank-bri.png",
    alt: "Bank BRI Logo",
    width: 180,
    height: 60,
  },
  {
    id: "bsi",
    name: "Bank BSI",
    src: "/logos/logo-bank-bsi.png",
    alt: "Bank BSI Logo",
    width: 180,
    height: 60,
  },
  {
    id: "garuda",
    name: "Garuda Indonesia",
    src: "/logos/logo-garuda-indonesia.png",
    alt: "Garuda Indonesia Logo",
    width: 200,
    height: 60,
  },
  {
    id: "indomaret",
    name: "Indomaret",
    src: "/logos/logo-indomaret.png",
    alt: "Indomaret Logo",
    width: 170,
    height: 60,
  },
  {
    id: "telkom",
    name: "Telkom Indonesia",
    src: "/logos/telkom.png",
    alt: "Telkom Indonesia Logo",
    width: 170,
    height: 60,
  },
  {
    id: "unilever",
    name: "Unilever Indonesia",
    src: "/logos/unilever-indonesia.png",
    alt: "Unilever Indonesia Logo",
    width: 170,
    height: 60,
  },
  {
    id: "posindo",
    name: "Pos Indonesia",
    src: "/logos/posindo.png",
    alt: "Pos Indonesia Logo",
    width: 170,
    height: 60,
  },
  {
    id: "shopee",
    name: "Shopee",
    src: "/logos/shopeee.png",
    alt: "Shopee Logo",
    width: 160,
    height: 60,
  },
  {
    id: "lega-hero",
    name: "Lega Hero",
    src: "/logos/lega_hero.png",
    alt: "Lega Hero Logo",
    width: 170,
    height: 60,
  },
];

export default function ClientMarquee() {
  // Duplikasi array logo untuk menghasilkan pergerakan infinite loop tanpa celah (seamless)
  const marqueeLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="w-full bg-white pt-10 sm:pt-12 lg:pt-14 pb-4 sm:pb-6 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm sm:text-base font-semibold text-slate-600 mb-8 sm:mb-10 max-w-3xl mx-auto tracking-wide">
          Dipercaya oleh lebih dari 50+ perusahaan dari Sektor Swasta, BUMN, dan Lembaga di Indonesia
        </p>

        {/* Marquee Wrapper dengan Gradient Masking Putih (Fade In/Out) */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Left Side Blur Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-40 z-10 bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none" />

          {/* Right Side Blur Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-40 z-10 bg-gradient-to-l from-white via-white/85 to-transparent pointer-events-none" />

          {/* Infinite Animated Track dengan Logo yang Diperbesar */}
          <div className="flex w-max items-center gap-12 sm:gap-16 lg:gap-20 animate-marquee">
            {marqueeLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex items-center justify-center h-16 sm:h-20 lg:h-24 px-4 transition-all duration-300 group"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 170}
                  height={logo.height || 60}
                  className="max-h-11 sm:max-h-14 lg:max-h-16 w-auto object-contain mix-blend-multiply contrast-125 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

