"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faChartLine,
  faExternalLinkAlt,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faDownload,
  faCheckCircle,
  faBuilding,
  faClock,
  faFolderOpen,
  faLayerGroup,
  faSpinner,
  faExclamationTriangle,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { getWhatsAppUrl, WHATSAPP_PHONE } from "./Navbar";
import { getPortfoliosFromFirestore } from "@/lib/services/portfolioService";
import { CldImage } from "next-cloudinary";

// Definisi interface data portofolio terperinci
export interface PortfolioItem {
  id: string;
  category: string;
  categorySlug: string;
  title: string;
  client: string;
  description: string;
  fullDescription?: string;
  outcomes?: string[];
  deliverables?: string[];
  timeline?: string;
  documentUrl?: string;
  image: string;
  metric?: string;
  metricLabel?: string;
  tags?: string[];
  badgeColor?: {
    bg?: string;
    text?: string;
    border?: string;
  };
}

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
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Load data portofolio dari Cloud Firestore secara otomatis
  const loadPortfolios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPortfoliosFromFirestore();
      setItems(data);
    } catch (err) {
      console.error("Gagal mengambil data portofolio dari Firestore:", err);
      setError("Gagal memuat data portofolio dari Firestore. Silakan periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  // Mengunci scroll halaman utama saat modal terbuka (Body scroll lock)
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // Listener tombol Escape keyboard untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter items berdasarkan tab terpilih
  const filteredItems = items.filter((item) => {
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
      className="scroll-mt-20 py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden"
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
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${activeCategory === cat.slug
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
        <div id="portfolio-grid" className="scroll-mt-24">
          {loading ? (
            /* Skeleton Loading Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between animate-pulse"
                >
                  <div>
                    <div className="w-full h-52 sm:h-56 bg-slate-200" />
                    <div className="p-6 sm:p-7 space-y-3">
                      <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                      <div className="h-4 bg-slate-100 rounded-md w-full" />
                      <div className="h-4 bg-slate-100 rounded-md w-5/6" />
                    </div>
                  </div>
                  <div className="px-6 sm:px-7 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                    <div className="h-8 bg-slate-200 rounded-xl w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error Fallback UI */
            <div className="max-w-md mx-auto text-center p-8 bg-rose-50/80 border border-rose-200/80 rounded-2xl space-y-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-slate-800 text-sm font-medium">{error}</p>
              <button
                onClick={loadPortfolios}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
                <span>Coba Lagi</span>
              </button>
            </div>
          ) : currentItems.length === 0 ? (
            /* Empty State */
            <div className="max-w-md mx-auto text-center p-8 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <FontAwesomeIcon icon={faBriefcase} className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-slate-600 text-sm font-medium">
                Belum ada studi kasus yang tersedia untuk kategori ini.
              </p>
            </div>
          ) : (
            /* Active Item Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                      {/* Kapsul Tag / Badge Kategori */}
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${item.badgeColor?.bg || "bg-blue-50"} ${item.badgeColor?.text || "text-blue-700"} ${item.badgeColor?.border || "border-blue-200"}`}
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

                    {/* Konten Kartu (Title & Description saja) */}
                    <div className="p-6 sm:p-7">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Action - Buka Modal Pop-up */}
                  <div className="px-6 sm:px-7 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end mt-auto">
                    <button
                      onClick={() => setSelectedProject(item)}
                      aria-label={`Lihat detail studi kasus ${item.title}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 hover:text-white transition-all duration-200 cursor-pointer py-2 px-4 rounded-xl bg-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 shadow-sm hover:shadow-md"
                    >
                      <span>Lihat Detail</span>
                      <FontAwesomeIcon
                        icon={faExternalLinkAlt}
                        className="w-3 h-3 transition-transform duration-200"
                      />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
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
              className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${currentPage === 1
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
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${currentPage === pageNum
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
              className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${currentPage === totalPages
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

      {/* ==================================================================== */}
      {/* MODAL POP-UP DETAIL PORTOFOLIO (INTERACTIVE MODAL)                  */}
      {/* ==================================================================== */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/80 backdrop-blur-sm transition-all duration-300 animate-fadeIn"
          onClick={() => setSelectedProject(null)} // Klik backdrop luar untuk menutup
        >
          {/* Modal Container Box */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-200/80 animate-scaleUp"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup popup
          >
            {/* 1. BAGIAN ATAS: Gambar Utama Proyek (Compact Height: h-40 sm:h-48 lg:h-52) */}
            <div className="relative w-full h-40 sm:h-48 lg:h-52 bg-slate-900 flex-shrink-0">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1000px"
                className="object-cover object-center"
              />
              {/* Gradient Overlay Gelap di bawah Gambar */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Badge Kategori di atas Gambar */}
              <div className="absolute top-4 left-5 z-10 flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-md ${selectedProject.badgeColor?.bg || "bg-blue-50"} ${selectedProject.badgeColor?.text || "text-blue-700"} ${selectedProject.badgeColor?.border || "border-blue-200"}`}
                >
                  {selectedProject.category}
                </span>
              </div>

              {/* Tombol Close (X) di Pojok Kanan Atas */}
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Tutup Modal Detail"
                className="absolute top-4 right-5 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg border border-white/20 hover:scale-110"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-white" />
              </button>

              {/* Title Overlay di Bagian Bawah Gambar */}
              <div className="absolute bottom-4 left-5 right-5 z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            {/* 2. BAGIAN BAWAH: Grid 2 Kolom Berfokus pada Konten Informasi */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-13rem)] grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* KOLOM KIRI (Sidebar Info Klien & Action - 1 Kolom) */}
              <div className="space-y-4 lg:col-span-1">
                {/* Card Informasi Klien Utama */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <FontAwesomeIcon icon={faLayerGroup} className="w-3.5 h-3.5 text-blue-600" />
                    <span>Informasi Proyek</span>
                  </h4>

                  {/* Info Klien */}
                  <div className="space-y-1 pt-1">
                    <div className="text-xs text-slate-500 font-medium flex items-center space-x-1.5">
                      <FontAwesomeIcon icon={faBuilding} className="w-3 h-3 text-slate-400" />
                      <span>Klien Utama</span>
                    </div>
                    <div className="text-base font-bold text-slate-900">{selectedProject.client}</div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2.5">

                  {/* Tombol Konsultasi WhatsApp */}
                  <button
                    onClick={() => handleConsultation(selectedProject.title)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    <span>Konsultasi Projek Ini</span>
                  </button>
                </div>
              </div>

              {/* KOLOM KANAN (Konten Deskripsi, Outcomes & Deliverables - 2 Kolom) */}
              <div className="space-y-6 lg:col-span-2">
                {/* Deskripsi Lengkap Proyek */}
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-2 uppercase tracking-wide flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Latar Belakang & Deskripsi Studi Kasus</span>
                  </h4>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                    {selectedProject.fullDescription || selectedProject.description}
                  </p>
                </div>

                {/* Daftar Outcomes / Hasil Utama (Bullet Points) */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-900 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-emerald-600" />
                    <span>Dampak Bisnis & Hasil Utama (Outcomes)</span>
                  </h4>
                  <ul className="space-y-2">
                    {(selectedProject.outcomes || []).map((outcome, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-slate-800 text-xs sm:text-sm leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Daftar Deliverables & Output (Bullet Points) */}
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <h4 className="text-sm font-bold text-blue-900 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4 text-blue-600" />
                    <span>Deliverables & Output Strategis</span>
                  </h4>
                  <ul className="space-y-2">
                    {(selectedProject.deliverables || []).map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-slate-800 text-xs sm:text-sm leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
