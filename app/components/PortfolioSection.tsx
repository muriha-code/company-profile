"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faChartLine,
  faExternalLinkAlt,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getWhatsAppUrl, WHATSAPP_PHONE } from "./Navbar";

// Definisi interface data portofolio
export interface PortfolioItem {
  id: string;
  category: string;
  categorySlug: string;
  title: string;
  client: string;
  description: string;
  image: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  badgeColor: {
    bg: string;
    text: string;
    border: string;
  };
}

// Data portofolio terstruktur secara modular
export const portfolioData: PortfolioItem[] = [
  {
    id: "fintech-restructuring",
    category: "Financial Strategy",
    categorySlug: "financial",
    title: "FinTech Scaleup Financial Restructuring",
    client: "PayPulse Solutions",
    description:
      "Optimalisasi alokasi modal dan pemodelan proyeksi keuangan terpadu untuk persiapan pendanaan Seri B skala regional.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    metric: "+240%",
    metricLabel: "Pertumbuhan Revenue YoY",
    tags: ["Financial Audit", "Capital Raising", "Cost Efficiency"],
    badgeColor: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  },
  {
    id: "supply-chain-audit",
    category: "Operations",
    categorySlug: "operations",
    title: "Supply Chain & Regional Logistics Audit",
    client: "LogiGlobal Tech",
    description: "Transformasi alur kerja pergudangan dan otomatisasi rute distribusi logistik antar-pulau.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    metric: "35%",
    metricLabel: "Pengurangan Biaya Operasional",
    tags: ["Logistics Optimization", "SOP Re-engineering", "Automation"],
    badgeColor: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
  },
  {
    id: "retail-expansion",
    category: "Market Expansion",
    categorySlug: "expansion",
    title: "Omnichannel Regional Retail Expansion",
    client: "OmniStore Retail",
    description:
      "Riset pasar komprehensif dan strategi eksekusi penetrasi gerai fisik di 12 kota strategis secara serentak.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    metric: "12 Kota",
    metricLabel: "Cabang Baru Berhasil Dioperasikan",
    tags: ["Market Feasibility", "Site Selection", "Go-To-Market"],
    badgeColor: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  },
  {
    id: "digital-transformation",
    category: "Digital Transformation",
    categorySlug: "digital",
    title: "Enterprise ERP & Workflow Integration",
    client: "Nusantara Manufacturing Group",
    description:
      "Migrasi sistem warisan ke platform ERP terintegrasi berbasis data analitik real-time untuk 3 pabrik utama.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    metric: "4.2x",
    metricLabel: "Kecepatan Pengolahan Data ERP",
    tags: ["Digital Roadmap", "ERP Integration", "Data Analytics"],
    badgeColor: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
  },
  {
    id: "leadership-culture",
    category: "Leadership & Team",
    categorySlug: "leadership",
    title: "Executive Leadership Alignment & Culture",
    client: "AeroTech Holdings",
    description:
      "Penyelarasan kembali struktur manajerial senior dan pembentukan sistem evaluasi kinerja berbasis OKR modern.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    metric: "92%",
    metricLabel: "Skor Retensi Talenta Kunci",
    tags: ["Executive Coaching", "OKR Framework", "Culture Transformation"],
    badgeColor: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
  },
  {
    id: "corporate-strategy",
    category: "Financial Strategy",
    categorySlug: "financial",
    title: "Healthcare Provider Turnaround Strategy",
    client: "Medica Health Systems",
    description:
      "Restrukturisasi portofolio produk medis dan optimalisasi unit bisnis untuk meningkatkan profit marjin.",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    metric: "+180 Bps",
    metricLabel: "Peningkatan EBITDA Margin",
    tags: ["Business Turnaround", "Portfolio Audit", "Growth Strategy"],
    badgeColor: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
  },
];

// Daftar kategori untuk tab filter
const categories = [
  { label: "Semua Studi Kasus", slug: "all" },
  { label: "Financial Strategy", slug: "financial" },
  { label: "Operations", slug: "operations" },
  { label: "Market Expansion", slug: "expansion" },
  { label: "Digital & Leadership", slug: "other" },
];

const ITEMS_PER_PAGE = 3;

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter items berdasarkan tab terpilih
  const filteredItems = portfolioData.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "other") {
      return item.categorySlug === "digital" || item.categorySlug === "leadership";
    }
    return item.categorySlug === activeCategory;
  });

  // Hitung item & halaman untuk pagination (3 item per halaman)
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1); // Reset ke halaman 1 setiap ganti filter
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const portfolioGrid = document.getElementById("portfolio-grid");
      if (portfolioGrid) {
        portfolioGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleConsultation = (projectTitle: string) => {
    const message = `Halo GrowthLine Consulting, saya tertarik mendiskusikan studi kasus: "${projectTitle}". Bisakah kita me-review kebutuhan bisnis serupa?`;
    const url = getWhatsAppUrl(WHATSAPP_PHONE, message);
    window.open(url, "_blank");
  };

  return (
    <section
      id="portfolio"
      className="scroll-mt-20 py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm">
            <FontAwesomeIcon icon={faBriefcase} className="w-3.5 h-3.5 text-blue-600" />
            <span>Portofolio & Rekam Jejak</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Studi Kasus Transformatif & <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Hasil Nyata Keberhasilan Klien
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Pelajari bagaimana eksekusi strategi terukur dan pendampingan intensif GrowthLine mendorong dampak nyata pada efisiensi operasional dan pertumbuhan pendapatan bisnis.
          </p>

          {/* Filter Tabs Interaktif */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.slug
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid Layout: 1 col (Mobile), 2 cols (Tablet), 3 cols (Desktop) */}
        <div id="portfolio-grid" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Image Container dengan next/image fill & object-cover */}
                <div className="relative w-full h-52 sm:h-56 bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Dark Overlay Subtle Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                  {/* Kapsul Tag / Badge Kategori (Pill / rounded-full) */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${item.badgeColor.bg} ${item.badgeColor.text} ${item.badgeColor.border}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Klien Tag di atas Overlay */}
                  <div className="absolute bottom-3 left-4 z-10 text-white/90 text-xs font-semibold tracking-wide flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span>{item.client}</span>
                  </div>
                </div>

                {/* Konten Kartu */}
                <div className="p-6 sm:p-7">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">
                    {item.description}
                  </p>

                  {/* List Sub-Tags (Kapsul Kecil) */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metric Card Footer & CTA Action */}
              <div className="px-6 sm:px-7 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div>
                  <div className="text-2xl font-extrabold text-blue-600 tracking-tight flex items-center space-x-1">
                    <span>{item.metric}</span>
                    <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 text-blue-500 text-opacity-80" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase">
                    {item.metricLabel}
                  </div>
                </div>

                <button
                  onClick={() => handleConsultation(item.title)}
                  aria-label={`Konsultasi studi kasus ${item.title}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors duration-200 cursor-pointer group/link py-2 px-3 rounded-lg hover:bg-blue-50"
                >
                  <span>Detail</span>
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Kontrol Pagination (3 item per halaman) */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm font-medium text-slate-500 text-center sm:text-left">
            Menampilkan{" "}
            <span className="font-bold text-slate-900">
              {filteredItems.length > 0 ? indexOfFirstItem + 1 : 0} -{" "}
              {Math.min(indexOfLastItem, filteredItems.length)}
            </span>{" "}
            dari <span className="font-bold text-slate-900">{filteredItems.length}</span> studi kasus
          </div>

          <div className="flex items-center space-x-2">
            {/* Tombol Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60 opacity-70"
                  : "bg-white text-slate-700 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 shadow-sm hover:shadow"
              }`}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
              <span>Sebelumnya</span>
            </button>

            {/* Angka Halaman Pagination */}
            <div className="flex items-center space-x-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105 font-extrabold"
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Tombol Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                currentPage === totalPages
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60 opacity-70"
                  : "bg-white text-slate-700 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 shadow-sm hover:shadow"
              }`}
            >
              <span>Selanjutnya</span>
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
