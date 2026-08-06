"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCoins,
  faGears,
  faUserGroup,
  faCheck,
  faArrowRight,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { getWhatsAppUrl, WHATSAPP_PHONE, WHATSAPP_DEFAULT_MESSAGE } from "./Navbar";


// Interface definisi data layanan
export interface ServiceItem {
  id: string;
  icon: IconDefinition;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  badgeText: string;
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

// Data Layanan dari Business Strategy hingga Leadership & Team
const servicesData: ServiceItem[] = [
  {
    id: "business-strategy",
    icon: faChartLine,
    title: "Business Strategy",
    subtitle: "Perencanaan & Penetrasian Pasar",
    description:
      "Perencanaan strategis terarah berbasis analisis pasar komprehensif untuk mendorong pertumbuhan jangka panjang dan keunggulan kompetitif.",
    features: [
      "Market Expansion & Penetrasi Pasar",
      "Strategic Roadmap & Milestone",
      "Competitive Analysis & Benchmarking",
      "Digital Business Model Transformation",
    ],
    badgeText: "Strategi Utama",
    colorScheme: {
      iconBg: "bg-blue-50 group-hover:bg-blue-600",
      iconColor: "text-blue-600 group-hover:text-white",
      borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      badgeText: "text-blue-700",
      bulletColor: "text-blue-600 bg-blue-100",
      glowBg: "from-blue-500/10 to-indigo-500/5",
    },
  },
  {
    id: "financial-optimization",
    icon: faCoins,
    title: "Financial Optimization",
    subtitle: "Manajemen Arus Kas & Profitabilitas",
    description:
      "Restrukturisasi dan optimalisasi arus kas untuk meminimalkan risiko keuangan serta memaksimalkan margin keuntungan bisnis Anda.",
    features: [
      "Cash Flow Management & Liquidity",
      "Cost Reduction & Operational Budgeting",
      "Financial Forecasting & Risk Audit",
      "Capital Structure Optimization",
    ],
    badgeText: "Keuangan & Efisiensi",
    colorScheme: {
      iconBg: "bg-emerald-50 group-hover:bg-emerald-600",
      iconColor: "text-emerald-600 group-hover:text-white",
      borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: "text-emerald-700",
      bulletColor: "text-emerald-600 bg-emerald-100",
      glowBg: "from-emerald-500/10 to-teal-500/5",
    },
  },
  {
    id: "operational-excellence",
    icon: faGears,
    title: "Operational Excellence",
    subtitle: "Otomatisasi & Efisiensi Alur Kerja",
    description:
      "Peningkatan efisiensi operasional dan otomatisasi alur kerja guna memangkas redundansi serta meningkatkan produktivitas tim.",
    features: [
      "Process Automation & Workflow Re-engineering",
      "Supply Chain Audit & Logistics Optimization",
      "KPI & Balanced Scorecard Framework",
      "Quality Assurance & Standard Operating Procedures (SOP)",
    ],
    badgeText: "Sistem & Operasional",
    colorScheme: {
      iconBg: "bg-amber-50 group-hover:bg-amber-600",
      iconColor: "text-amber-600 group-hover:text-white",
      borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      badgeText: "text-amber-800",
      bulletColor: "text-amber-600 bg-amber-100",
      glowBg: "from-amber-500/10 to-orange-500/5",
    },
  },
  {
    id: "leadership-team",
    icon: faUserGroup,
    title: "Leadership & Team",
    subtitle: "Pengembangan SDM & Kepemimpinan",
    description:
      "Pengembangan kapabilitas kepemimpinan dan budaya kerja performa tinggi untuk mempercepat eksekusi rencana strategis.",
    features: [
      "Talent Alignment & Organizational Structure",
      "Executive Coaching & Leadership Mentorship",
      "Performance Review & Culture Building",
      "Change Management & Employee Engagement",
    ],
    badgeText: "SDM & Budaya Kerja",
    colorScheme: {
      iconBg: "bg-purple-50 group-hover:bg-purple-600",
      iconColor: "text-purple-600 group-hover:text-white",
      borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      badgeText: "text-purple-700",
      bulletColor: "text-purple-600 bg-purple-100",
      glowBg: "from-purple-500/10 to-pink-500/5",
    },
  },
];

export default function ServicesSection() {
  const whatsappUrl = getWhatsAppUrl(WHATSAPP_PHONE, WHATSAPP_DEFAULT_MESSAGE);


  return (
    <section
      id="services"
      className="scroll-mt-20 py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 relative overflow-hidden border-y border-slate-200/60"
    >
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={`group bg-white rounded-2xl p-7 border border-slate-200/80 transition-all duration-300 shadow-sm hover:shadow-xl ${service.colorScheme.borderHover} flex flex-col justify-between relative overflow-hidden`}
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

        {/* Bottom Banner CTA */}
        <div className="mt-16 sm:mt-20 bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
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
