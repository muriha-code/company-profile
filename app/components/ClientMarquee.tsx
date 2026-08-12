"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";

export interface ClientLogo {
  id: string;
  name: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  cloudinary?: boolean;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  {
    id: "bri",
    name: "Bank BRI",
    src: "logo-bank-bri_f1l1hj",
    alt: "Bank BRI Logo",
    width: 180,
    height: 60,
    cloudinary: true,
  },
  {
    id: "bsi",
    name: "Bank BSI",
    src: "logo-bank-bsi_ijlkis",
    alt: "Bank BSI Logo",
    width: 180,
    height: 60,
    cloudinary: true,
  },
  {
    id: "garuda",
    name: "Garuda Indonesia",
    src: "logo-garuda-indonesia_e3hxu2",
    alt: "Garuda Indonesia Logo",
    width: 200,
    height: 60,
    cloudinary: true,
  },
  {
    id: "indomaret",
    name: "Indomaret",
    src: "logo-indomaret_xtpzia",
    alt: "Indomaret Logo",
    width: 170,
    height: 60,
    cloudinary: true,
  },
  {
    id: "telkom",
    name: "Telkom Indonesia",
    src: "telkom_rp81p4",
    alt: "Telkom Indonesia Logo",
    width: 170,
    height: 60,
    cloudinary: true,
  },
  {
    id: "unilever",
    name: "Unilever Indonesia",
    src: "unilever-indonesia_g9vubu",
    alt: "Unilever Indonesia Logo",
    width: 170,
    height: 60,
    cloudinary: true,
  },
  {
    id: "posindo",
    name: "Pos Indonesia",
    src: "posindo_bq88n2",
    alt: "Pos Indonesia Logo",
    width: 170,
    height: 60,
    cloudinary: true,
  },
  {
    id: "shopee",
    name: "Shopee",
    src: "shopeee_tnp5tx",
    alt: "Shopee Logo",
    width: 160,
    height: 60,
    cloudinary: true,
  },
  {
    id: "lega-hero",
    name: "Lega Hero",
    src: "lega_hero_tklonp",
    alt: "Lega Hero Logo",
    width: 170,
    height: 60,
    cloudinary: true,
  },
];
export default function ClientMarquee() {
  // Duplikasi array logo untuk infinite marquee
  const marqueeLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

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

                {/* Jika logo berasal dari Cloudinary */}
                {logo.cloudinary ? (
                  <CldImage
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width || 170}
                    height={logo.height || 60}
                    className="max-h-9 sm:max-h-13 lg:max-h-16 w-auto object-contain mix-blend-multiply contrast-125 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer"
                  />
                ) : (
                  /* Jika masih menggunakan gambar lokal */
                  <Image
                    src={logo.src}
                    alt={logo.alt}
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

