"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCoins,
  faGears,
  faUserGroup,
  faCheck,
  faArrowRight,
  faLightbulb,
  faExclamationTriangle,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm">
            <FontAwesomeIcon icon={faLightbulb} className="w-3.5 h-3.5 text-blue-600" />
            <span>Layanan Utama Kami</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-1 mb-6">
            Solusi Komprehensif Dari <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Business Strategy Hingga Leadership & Team
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Kami menghadirkan rangkaian konsultasi terpadu untuk mengeksekusi transformasi bisnis secara menyeluruh — mulai dari arah strategis, kesehatan finansial, efisiensi operasional, hingga kesiapan kepemimpinan tim.
          </p>
        </div>

        {/* Grid Layanan (4 Card Layout) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="w-14 h-14 rounded-xl bg-slate-200" />
                  <div className="w-20 h-6 rounded-md bg-slate-100" />
                </div>
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-100 rounded-md w-full" />
                <div className="h-4 bg-slate-100 rounded-md w-5/6" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {paginatedServices.map((service) => (
                <div
                  key={service.id}
                  className={`group bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 transition-all duration-300 shadow-sm hover:shadow-xl ${service.colorScheme.borderHover} flex flex-col justify-between relative overflow-hidden`}
                >
                  {/* Subtle Card Background Glow on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.colorScheme.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />

                  <div className="relative z-10">
                    {/* Header Card: Icon Wrapper & Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-14 h-14 rounded-xl ${service.colorScheme.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}
                      >
                        <FontAwesomeIcon
                          icon={service.icon}
                          className={`w-7 h-7 ${service.colorScheme.iconColor} transition-colors duration-300`}
                        />
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${service.colorScheme.badgeBg}`}
                      >
                        {service.badgeText}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mb-4 tracking-wide uppercase">
                      {service.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="border-t border-slate-100 pt-5 mb-6">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Cakupan Layanan Utama
                      </div>
                      <ul className="space-y-2.5">
                        {service.features.map((feature, fIdx) => (
                          <li
                            key={fIdx}
                            className="text-xs text-slate-700 font-medium flex items-start space-x-2"
                          >
                            <div
                              className={`w-4 h-4 rounded-full ${service.colorScheme.bulletColor} flex items-center justify-center flex-shrink-0 mt-0.5`}
                            >
                              <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />
                            </div>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="relative z-10 pt-4 border-t border-slate-100">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 group/btn py-1"
                    >
                      <span>Konsultasikan Layanan</span>
                      <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover/btn:translate-x-1">
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                      </div>
                    </a>
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
