"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faArrowRight,
  faLightbulb,
  faExclamationTriangle,
  faRedo,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { getWhatsAppUrl, WHATSAPP_PHONE, WHATSAPP_DEFAULT_MESSAGE } from "./Navbar";
import { getServicesFromFirestore } from "@/lib/services/servicesService";
import Pagination from "@/app/admin/components/Pagination";

const ITEMS_PER_PAGE = 4;

// Interface definisi data layanan
export interface ServiceItem {
  id: string;
  icon: IconDefinition;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  badgeText: string;
  image?: string;
  imagePublicId?: string;
  slug?: string;
  folder?: string;
  colorScheme: {
    iconBg: string;
    iconColor: string;
    borderHover: string;
    badgeBg: string;
    badgeText: string;
    bulletColor: string;
    glowBg: string;
  };
}

export default function ServicesSection() {
  const whatsappUrl = getWhatsAppUrl(WHATSAPP_PHONE, WHATSAPP_DEFAULT_MESSAGE);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServicesFromFirestore();
      setServices(data);
    } catch (err) {
      console.error("Gagal memuat layanan dari Firestore:", err);
      setError("Gagal memuat data layanan dari Firestore. Silakan periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Handle ESC key and body scroll lock when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedService(null);
      }
    };

    if (selectedService) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedService]);

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE) || 1;
  const paginatedServices = services.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section
      id="services"
      className="scroll-mt-20 py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 relative overflow-hidden border-y border-slate-200/60"
    >
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Solusi Komprehensif Dari <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Business Strategy Hingga Leadership & Team
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Kami menghadirkan rangkaian konsultasi terpadu untuk mengeksekusi transformasi bisnis secara menyeluruh — mulai dari arah strategis, kesehatan finansial, efisiensi operasional, hingga kesiapan kepemimpinan tim.
          </p>
        </div>

        {/* Grid Layanan (Responsive Grid Layout) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 animate-pulse space-y-4 flex flex-col justify-between h-56"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-md w-full" />
                  <div className="h-4 bg-slate-100 rounded-md w-5/6" />
                </div>
                <div className="h-5 bg-slate-200 rounded-md w-1/2 pt-2 border-t border-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center p-8 bg-rose-50/80 border border-rose-200/80 rounded-2xl space-y-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-slate-800 text-sm font-medium">{error}</p>
            <button
              onClick={loadServices}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
            >
              <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
              <span>Coba Lagi</span>
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-8 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-slate-600 text-sm font-medium">Belum ada layanan yang tersedia.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedServices.map((service) => (
                <div
                  key={service.id}
                  className={`group bg-white rounded-2xl p-6 border border-slate-200/80 transition-all duration-300 shadow-sm hover:shadow-xl ${service.colorScheme?.borderHover || "hover:border-blue-500/50"} flex flex-col justify-between relative overflow-hidden`}
                >
                  {/* Subtle Card Background Glow on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.colorScheme?.glowBg || "from-blue-500/5 to-indigo-500/5"} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    {service.icon && (
                      <div className="mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${service.colorScheme?.iconBg || "bg-blue-50 group-hover:bg-blue-600"} ${service.colorScheme?.iconColor || "text-blue-600 group-hover:text-white"}`}
                        >
                          <FontAwesomeIcon icon={service.icon} className="w-5 h-5" />
                        </div>
                      </div>
                    )}

                    {/* Judul Layanan */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {service.title}
                    </h3>

                    {/* Deskripsi Ringkas (Maksimal 2-3 baris) */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                      {service.description}
                    </p>

                    {/* Tombol Pemicu Modal: Lihat Detail Cakupan */}
                    <div className="pt-4 border-t border-slate-100 mt-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className="w-full inline-flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 group/btn py-1 cursor-pointer"
                      >
                        <span>Lihat Detail Cakupan</span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover/btn:translate-x-1">
                          <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={services.length}
              itemsPerPage={ITEMS_PER_PAGE}
              itemLabel="layanan"
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        )}

        {/* Modal / Dialog Popup (Progressive Disclosure) */}
        {selectedService && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-service-title"
            aria-describedby="modal-service-desc"
            onClick={() => setSelectedService(null)}
          >
            {/* Modal Box */}
            <div
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col p-6 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative pb-3 border-b border-slate-100 shrink-0">
                {/* Tombol Close (✕) */}
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  aria-label="Tutup modal detail layanan"
                  className="absolute top-0 right-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
                </button>

                {/* Sub-heading / Tagline */}
                {selectedService.subtitle && (
                  <span className="inline-block text-xs font-semibold tracking-wider text-blue-600 uppercase mb-1">
                    {selectedService.subtitle}
                  </span>
                )}

                {/* Judul Layanan Lengkap */}
                <h3
                  id="modal-service-title"
                  className="text-2xl font-bold text-slate-900 pr-8 tracking-tight"
                >
                  {selectedService.title}
                </h3>
              </div>

              {/* Modal Body (Scrollable with overflow-y-auto) */}
              <div className="py-4 overflow-y-auto space-y-4 flex-1 pr-1">
                {/* Deskripsi Lengkap Layanan */}
                <div>
                  <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                    Deskripsi Layanan
                  </h4>
                  <p
                    id="modal-service-desc"
                    className="text-sm leading-relaxed text-slate-600"
                  >
                    {selectedService.description}
                  </p>
                </div>

                {/* Cakupan Layanan Utama (Checklist Hijau) */}
                {selectedService.features && selectedService.features.length > 0 && (
                  <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
                    <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2.5">
                      Cakupan Layanan Utama
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedService.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-xs font-medium text-slate-700 flex items-start space-x-2 bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-xs"
                        >
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5 text-[10px]" />
                          </div>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer (Action CTA Button) */}
              <div className="shrink-0 pt-3 mt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="py-2 px-4 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-center"
                >
                  Tutup
                </button>
                <a
                  href={getWhatsAppUrl(
                    WHATSAPP_PHONE,
                    `Halo Growthline, saya tertarik untuk berkonsultasi mengenai layanan: ${selectedService.title}. Mohon informasi selengkapnya.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 py-2 px-4 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Konsultasikan Layanan</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner CTA */}
        <div className="mt-14 sm:mt-16 lg:mt-20 bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <span className="text-blue-400 font-semibold text-xs sm:text-sm uppercase tracking-widest">
                Pendekatan Holistik
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 mb-3 text-white">
                Siap Mengakselerasi Pertumbuhan Bisnis Anda?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Kombinasikan strategi bisnis yang tajam dengan eksekusi kepemimpinan tim yang solid. Tim konsultan senior kami siap mendampingi perjalanan bisnis Anda.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex-shrink-0"
            >
              <span>Jadwalkan Konsultasi Gratis</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
